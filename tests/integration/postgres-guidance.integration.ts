import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { Pool } from "pg";
import {
  PostgresRightsGuidanceBudgetStore,
  PostgresRightsGuidanceRequestGuard,
  type RightsGuidancePostgresQuery,
} from "../../src/lib/postgres-rights-guidance-store.ts";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required for the PostgreSQL integration test");
}

const pool = new Pool({ connectionString, max: 12 });
const query: RightsGuidancePostgresQuery = async (text, values) => {
  const result = await pool.query(text, [...values]);
  return { rows: result.rows };
};

const migration = await readFile(
  new URL("../../db/migrations/001_rights_guidance_guards.sql", import.meta.url),
  "utf8",
);

async function resetState(): Promise<void> {
  await pool.query(`
    TRUNCATE TABLE
      socialright.guidance_budget_reservations,
      socialright.guidance_budget_state,
      socialright.guidance_assessment_generations,
      socialright.guidance_client_attempts,
      socialright.guidance_client_locks
  `);
}

test.before(async () => {
  await pool.query(migration);
});

test.beforeEach(resetState);

test.after(async () => {
  await resetState();
  await pool.end();
});

test("concurrent reservations cannot exceed the global hard cap", async () => {
  const store = new PostgresRightsGuidanceBudgetStore({
    query,
    calculateCostMicros: () => 1,
    hardLimitMicros: 5_000_000,
  });

  const reservations = await Promise.all(
    Array.from({ length: 10 }, () => store.reserve(1_000_000)),
  );
  const acquired = reservations.filter(
    (reservation): reservation is { reservationId: string } => reservation !== null,
  );
  assert.equal(acquired.length, 5);

  const state = await pool.query<{
    committed_micros: string;
    reserved_micros: string;
  }>(
    "SELECT committed_micros, reserved_micros FROM socialright.guidance_budget_state",
  );
  assert.deepEqual(state.rows, [{ committed_micros: "0", reserved_micros: "5000000" }]);

  await Promise.all(acquired.map((reservation) => store.release(reservation.reservationId)));
  assert.ok(await store.reserve(5_000_000));
});

test("settlement commits actual cost and caps an over-reservation result", async () => {
  const store = new PostgresRightsGuidanceBudgetStore({
    query,
    calculateCostMicros: (usage) => usage.inputTokens,
    hardLimitMicros: 1_000,
  });
  const first = await store.reserve(100);
  assert.ok(first);
  await store.settle(first.reservationId, { inputTokens: 40, outputTokens: 0 });

  const second = await store.reserve(50);
  assert.ok(second);
  await assert.rejects(
    () => store.settle(second.reservationId, { inputTokens: 60, outputTokens: 0 }),
    /exceeded its reservation/u,
  );

  const state = await pool.query<{
    committed_micros: string;
    reserved_micros: string;
  }>(
    "SELECT committed_micros, reserved_micros FROM socialright.guidance_budget_state",
  );
  assert.deepEqual(state.rows, [{ committed_micros: "90", reserved_micros: "0" }]);
});

test("a failed reservation insert rolls back its budget-state update", async () => {
  const reservationId = "00000000-0000-4000-8000-000000000001";
  const first = await pool.query<{ acquired: boolean }>(
    "SELECT socialright.reserve_guidance_budget($1::uuid, 100, 1000) AS acquired",
    [reservationId],
  );
  assert.equal(first.rows[0].acquired, true);

  await assert.rejects(() =>
    pool.query(
      "SELECT socialright.reserve_guidance_budget($1::uuid, 100, 1000) AS acquired",
      [reservationId],
    ),
  );

  const state = await pool.query<{ reserved_micros: string }>(
    "SELECT reserved_micros FROM socialright.guidance_budget_state",
  );
  assert.deepEqual(state.rows, [{ reserved_micros: "100" }]);
});

test("concurrent requests allow one generation per assessment version", async () => {
  const guards = Array.from(
    { length: 10 },
    () =>
      new PostgresRightsGuidanceRequestGuard({
        query,
        maximumAttemptsPerClient: 5,
        windowMs: 60_000,
      }),
  );
  const assessmentVersionKeyHash = "f".repeat(64);
  const leases = await Promise.all(
    guards.map((guard, index) =>
      guard.acquire({
        clientKeyHash: index.toString(16).padStart(64, "0"),
        assessmentVersionKeyHash,
      }),
    ),
  );
  const acquired = leases.filter(
    (lease): lease is { leaseId: string } => lease !== null,
  );
  assert.equal(acquired.length, 1);
  await guards[0].complete(acquired[0].leaseId);

  assert.equal(
    await guards[0].acquire({
      clientKeyHash: "e".repeat(64),
      assessmentVersionKeyHash,
    }),
    null,
  );
});

test("per-client attempt window counts failed duplicate attempts", async () => {
  const guard = new PostgresRightsGuidanceRequestGuard({
    query,
    maximumAttemptsPerClient: 2,
    windowMs: 60_000,
  });
  const clientKeyHash = "a".repeat(64);
  const first = await guard.acquire({
    clientKeyHash,
    assessmentVersionKeyHash: "1".repeat(64),
  });
  assert.ok(first);
  await guard.release(first.leaseId);

  const second = await guard.acquire({
    clientKeyHash,
    assessmentVersionKeyHash: "2".repeat(64),
  });
  assert.ok(second);
  await guard.release(second.leaseId);

  assert.equal(
    await guard.acquire({
      clientKeyHash,
      assessmentVersionKeyHash: "3".repeat(64),
    }),
    null,
  );
});

test("public role cannot execute guard functions or access guard tables", async () => {
  const privileges = await pool.query<{
    function_execute: boolean;
    table_select: boolean;
  }>(`
    SELECT
      has_function_privilege(
        'public',
        'socialright.reserve_guidance_budget(uuid,bigint,bigint)',
        'EXECUTE'
      ) AS function_execute,
      has_table_privilege(
        'public',
        'socialright.guidance_budget_state',
        'SELECT'
      ) AS table_select
  `);
  assert.deepEqual(privileges.rows, [{ function_execute: false, table_select: false }]);
});
