import assert from "node:assert/strict";
import test from "node:test";
import {
  buildTokenUsageCostCalculator,
  InMemoryRightsGuidanceAtomicBudgetStore,
} from "./rights-guidance-budget.ts";

test("calculates token cost in integer USD micros without rounding down", () => {
  const calculate = buildTokenUsageCostCalculator({
    inputMicrosPerMillionTokens: 50_000,
    outputMicrosPerMillionTokens: 400_000,
  });

  assert.equal(calculate({ inputTokens: 210, outputTokens: 112 }), 56);
  assert.equal(calculate({ inputTokens: 1, outputTokens: 0 }), 1);
  assert.throws(() => calculate({ inputTokens: -1, outputTokens: 0 }));
});

test("serializes concurrent reservations against one hard limit", async () => {
  const store = new InMemoryRightsGuidanceAtomicBudgetStore(1_000, () => 400);
  const reservations = await Promise.all([store.reserve(600), store.reserve(600)]);

  assert.equal(reservations.filter(Boolean).length, 1);
  assert.deepEqual(await store.snapshot(), {
    hardLimitMicros: 1_000,
    committedMicros: 0,
    reservedMicros: 600,
  });
});

test("settles actual usage and releases unused reservation capacity", async () => {
  const store = new InMemoryRightsGuidanceAtomicBudgetStore(1_000, () => 240);
  const reservation = await store.reserve(600);
  assert.ok(reservation);

  await store.settle(reservation.reservationId, { inputTokens: 10, outputTokens: 5 });

  assert.deepEqual(await store.snapshot(), {
    hardLimitMicros: 1_000,
    committedMicros: 240,
    reservedMicros: 0,
  });
  assert.ok(await store.reserve(600));
});

test("release is idempotent and returns reserved capacity", async () => {
  const store = new InMemoryRightsGuidanceAtomicBudgetStore(500, () => 100);
  const reservation = await store.reserve(500);
  assert.ok(reservation);

  await store.release(reservation.reservationId);
  await store.release(reservation.reservationId);

  assert.deepEqual(await store.snapshot(), {
    hardLimitMicros: 500,
    committedMicros: 0,
    reservedMicros: 0,
  });
});

test("fails closed when actual cost exceeds its reservation", async () => {
  const store = new InMemoryRightsGuidanceAtomicBudgetStore(500, () => 501);
  const reservation = await store.reserve(500);
  assert.ok(reservation);

  await assert.rejects(() =>
    store.settle(reservation.reservationId, { inputTokens: 1, outputTokens: 1 }),
  );
  assert.deepEqual(await store.snapshot(), {
    hardLimitMicros: 500,
    committedMicros: 500,
    reservedMicros: 0,
  });
  assert.equal(await store.reserve(1), null);
});
