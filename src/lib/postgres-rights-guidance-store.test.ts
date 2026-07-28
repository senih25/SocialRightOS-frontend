import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  PostgresRightsGuidanceBudgetStore,
  PostgresRightsGuidanceRequestGuard,
  type RightsGuidancePostgresQuery,
} from "./postgres-rights-guidance-store.ts";

type CapturedQuery = { text: string; values: readonly unknown[] };

function buildScriptedQuery(
  scriptedRows: Array<Array<Record<string, unknown>>>,
  captured: CapturedQuery[],
): RightsGuidancePostgresQuery {
  return async <Row extends Record<string, unknown>>(
    text: string,
    values: readonly unknown[],
  ) => {
    captured.push({ text, values });
    return { rows: (scriptedRows.shift() ?? []) as Row[] };
  };
}

test("budget adapter uses parameterized atomic functions for its full lifecycle", async () => {
  const captured: CapturedQuery[] = [];
  const store = new PostgresRightsGuidanceBudgetStore({
    query: buildScriptedQuery(
      [[{ acquired: true }], [{ found: true, exceeded_reservation: false }], [{ released: false }]],
      captured,
    ),
    calculateCostMicros: () => 56,
    hardLimitMicros: 5_000_000,
  });

  const reservation = await store.reserve(1_000);
  assert.ok(reservation);
  await store.settle(reservation.reservationId, { inputTokens: 210, outputTokens: 112 });
  await store.release(reservation.reservationId);

  assert.match(captured[0].text, /reserve_guidance_budget\(\$1::uuid/u);
  assert.deepEqual(captured[0].values.slice(1), [1_000, 5_000_000]);
  assert.match(captured[1].text, /settle_guidance_budget\(\$1::uuid/u);
  assert.deepEqual(captured[1].values, [reservation.reservationId, 56]);
  assert.match(captured[2].text, /release_guidance_budget\(\$1::uuid/u);
  assert.equal(captured.every((query) => !query.text.includes(reservation.reservationId)), true);
});

test("budget adapter fails closed for denial, unknown reservations and cost overflow", async () => {
  const deniedStore = new PostgresRightsGuidanceBudgetStore({
    query: buildScriptedQuery([[{ acquired: false }]], []),
    calculateCostMicros: () => 1,
    hardLimitMicros: 100,
  });
  assert.equal(await deniedStore.reserve(100), null);

  const unknownStore = new PostgresRightsGuidanceBudgetStore({
    query: buildScriptedQuery([[{ found: false, exceeded_reservation: false }]], []),
    calculateCostMicros: () => 1,
    hardLimitMicros: 100,
  });
  await assert.rejects(
    () => unknownStore.settle("00000000-0000-4000-8000-000000000001", {
      inputTokens: 1,
      outputTokens: 1,
    }),
    /Unknown budget reservation/u,
  );

  const exceededStore = new PostgresRightsGuidanceBudgetStore({
    query: buildScriptedQuery([[{ found: true, exceeded_reservation: true }]], []),
    calculateCostMicros: () => 101,
    hardLimitMicros: 100,
  });
  await assert.rejects(
    () => exceededStore.settle("00000000-0000-4000-8000-000000000002", {
      inputTokens: 1,
      outputTokens: 1,
    }),
    /exceeded its reservation/u,
  );
});

test("request guard rejects raw identifiers before database access", async () => {
  let queryCount = 0;
  const query: RightsGuidancePostgresQuery = async () => {
    queryCount += 1;
    return { rows: [] };
  };
  const guard = new PostgresRightsGuidanceRequestGuard({
    query,
    maximumAttemptsPerClient: 3,
    windowMs: 60_000,
  });

  assert.equal(
    await guard.acquire({
      clientKeyHash: "person@example.com",
      assessmentVersionKeyHash: "a".repeat(64),
    }),
    null,
  );
  assert.equal(queryCount, 0);
});

test("request guard uses separate parameterized acquire, complete and release functions", async () => {
  const captured: CapturedQuery[] = [];
  const guard = new PostgresRightsGuidanceRequestGuard({
    query: buildScriptedQuery(
      [[{ acquired: true }], [{ completed: true }], [{ released: true }]],
      captured,
    ),
    maximumAttemptsPerClient: 3,
    windowMs: 60_000,
  });
  const scope = {
    clientKeyHash: "a".repeat(64),
    assessmentVersionKeyHash: "b".repeat(64),
  };

  const lease = await guard.acquire(scope);
  assert.ok(lease);
  await guard.complete(lease.leaseId);
  await guard.release(lease.leaseId);

  assert.match(captured[0].text, /acquire_guidance_request\(\$1::uuid/u);
  assert.deepEqual(captured[0].values.slice(2), [
    scope.clientKeyHash,
    scope.assessmentVersionKeyHash,
    3,
    60_000,
  ]);
  assert.match(captured[1].text, /complete_guidance_request\(\$1::uuid/u);
  assert.match(captured[2].text, /release_guidance_request\(\$1::uuid/u);
  assert.equal(captured.every((query) => !query.text.includes(scope.clientKeyHash)), true);
});

test("migration keeps atomic logic server-side and avoids dynamic SQL", async () => {
  const migration = await readFile(
    new URL("../../db/migrations/001_rights_guidance_guards.sql", import.meta.url),
    "utf8",
  );

  for (const functionName of [
    "reserve_guidance_budget",
    "settle_guidance_budget",
    "release_guidance_budget",
    "acquire_guidance_request",
    "complete_guidance_request",
    "release_guidance_request",
  ]) {
    assert.equal(migration.includes(`FUNCTION socialright.${functionName}`), true);
  }
  assert.equal((migration.match(/SECURITY DEFINER/gu) ?? []).length, 6);
  assert.equal((migration.match(/SET search_path = pg_catalog, socialright/gu) ?? []).length, 6);
  assert.equal((migration.match(/REVOKE EXECUTE ON FUNCTION/gu) ?? []).length, 6);
  assert.equal(migration.includes("REVOKE ALL ON ALL TABLES IN SCHEMA socialright FROM PUBLIC"), true);
  assert.equal(/^\s*EXECUTE\s+/gmu.test(migration), false);
  assert.equal(migration.includes("ON CONFLICT (assessment_version_key_hash) DO NOTHING"), true);
  assert.equal(migration.includes("FOR UPDATE"), true);
  assert.equal(migration.trim().startsWith("BEGIN;"), true);
  assert.equal(migration.trim().endsWith("COMMIT;"), true);
});
