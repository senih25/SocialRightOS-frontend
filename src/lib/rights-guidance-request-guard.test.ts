import assert from "node:assert/strict";
import test from "node:test";
import {
  generateRequestGuardedRightsGuidanceExplanation,
  InMemoryRightsGuidanceAtomicRequestGuard,
  type RightsGuidanceAtomicRequestGuard,
} from "./rights-guidance-request-guard.ts";
import {
  buildRightsGuidanceInput,
  DeterministicRightsGuidanceMockProvider,
  type RightsGuidanceApprovedCatalog,
  type RightsGuidanceProvider,
} from "./rights-guidance.ts";

const CLIENT_A = "a".repeat(64);
const CLIENT_B = "b".repeat(64);
const ASSESSMENT_1 = "1".repeat(64);
const ASSESSMENT_2 = "2".repeat(64);
const ASSESSMENT_3 = "3".repeat(64);

const catalog: RightsGuidanceApprovedCatalog = {
  assessmentType: "GSS_PRELIMINARY_GUIDANCE",
  reasons: [{ evidenceId: "EVIDENCE_SYNTHETIC", approvedText: "Sentetik koşul." }],
  nextSteps: [],
  limitations: ["Sentetik sınırlama."],
};

const input = buildRightsGuidanceInput(
  {
    assessmentType: "GSS_PRELIMINARY_GUIDANCE",
    coarseDisplayStatus: "CONDITION_APPEARS_SATISFIED",
    reasonEvidenceIds: ["EVIDENCE_SYNTHETIC"],
    nextStepEvidenceIds: [],
    validAsOf: "2026-07-20",
    basisVersion: "synthetic-v1",
  },
  catalog,
);

test("atomically permits only one concurrent lease per assessment version", async () => {
  const guard = new InMemoryRightsGuidanceAtomicRequestGuard({
    maximumAttemptsPerClient: 5,
    windowMs: 60_000,
    now: () => 1_000,
  });

  const leases = await Promise.all([
    guard.acquire({ clientKeyHash: CLIENT_A, assessmentVersionKeyHash: ASSESSMENT_1 }),
    guard.acquire({ clientKeyHash: CLIENT_B, assessmentVersionKeyHash: ASSESSMENT_1 }),
  ]);

  assert.equal(leases.filter(Boolean).length, 1);
});

test("completed assessment versions cannot generate twice", async () => {
  const guard = new InMemoryRightsGuidanceAtomicRequestGuard({
    maximumAttemptsPerClient: 5,
    windowMs: 60_000,
    now: () => 1_000,
  });
  const lease = await guard.acquire({
    clientKeyHash: CLIENT_A,
    assessmentVersionKeyHash: ASSESSMENT_1,
  });
  assert.ok(lease);
  await guard.complete(lease.leaseId);

  assert.equal(
    await guard.acquire({
      clientKeyHash: CLIENT_A,
      assessmentVersionKeyHash: ASSESSMENT_1,
    }),
    null,
  );
});

test("limits client attempts inside the window and permits a later attempt", async () => {
  let now = 1_000;
  const guard = new InMemoryRightsGuidanceAtomicRequestGuard({
    maximumAttemptsPerClient: 2,
    windowMs: 100,
    now: () => now,
  });
  const first = await guard.acquire({
    clientKeyHash: CLIENT_A,
    assessmentVersionKeyHash: ASSESSMENT_1,
  });
  assert.ok(first);
  await guard.release(first.leaseId);
  const second = await guard.acquire({
    clientKeyHash: CLIENT_A,
    assessmentVersionKeyHash: ASSESSMENT_2,
  });
  assert.ok(second);
  await guard.release(second.leaseId);

  assert.equal(
    await guard.acquire({
      clientKeyHash: CLIENT_A,
      assessmentVersionKeyHash: ASSESSMENT_3,
    }),
    null,
  );
  now = 1_101;
  assert.ok(
    await guard.acquire({
      clientKeyHash: CLIENT_A,
      assessmentVersionKeyHash: ASSESSMENT_3,
    }),
  );
});

test("rejects raw or malformed identifiers without creating a lease", async () => {
  const guard = new InMemoryRightsGuidanceAtomicRequestGuard({
    maximumAttemptsPerClient: 2,
    windowMs: 100,
  });

  assert.equal(
    await guard.acquire({
      clientKeyHash: "user@example.com",
      assessmentVersionKeyHash: ASSESSMENT_1,
    }),
    null,
  );
  assert.equal(
    await guard.acquire({
      clientKeyHash: CLIENT_A,
      assessmentVersionKeyHash: "backend-decision-id",
    }),
    null,
  );
});

test("disabled guidance bypasses request state and provider work", async () => {
  let acquireCount = 0;
  let providerCount = 0;
  const requestGuard: RightsGuidanceAtomicRequestGuard = {
    async acquire() {
      acquireCount += 1;
      return { leaseId: "synthetic-lease" };
    },
    async complete() {},
    async release() {},
  };
  const provider: RightsGuidanceProvider = {
    mode: "MOCK",
    async generate() {
      providerCount += 1;
      return { output: {}, usage: { inputTokens: 0, outputTokens: 0 } };
    },
  };

  const result = await generateRequestGuardedRightsGuidanceExplanation(input, provider, {
    enabled: false,
    scope: { clientKeyHash: CLIENT_A, assessmentVersionKeyHash: ASSESSMENT_1 },
    requestGuard,
  });

  assert.equal(result.overallStatus, "UNAVAILABLE");
  assert.equal(acquireCount, 0);
  assert.equal(providerCount, 0);
});

test("successful validated guidance completes the lease", async () => {
  const events: string[] = [];
  const requestGuard: RightsGuidanceAtomicRequestGuard = {
    async acquire() {
      events.push("acquire");
      return { leaseId: "synthetic-lease" };
    },
    async complete(leaseId) {
      events.push(`complete:${leaseId}`);
    },
    async release() {
      events.push("release");
    },
  };

  const result = await generateRequestGuardedRightsGuidanceExplanation(
    input,
    new DeterministicRightsGuidanceMockProvider(),
    {
      enabled: true,
      scope: { clientKeyHash: CLIENT_A, assessmentVersionKeyHash: ASSESSMENT_1 },
      requestGuard,
    },
  );

  assert.equal(result.overallStatus, "EXPLANATION_AVAILABLE");
  assert.deepEqual(events, ["acquire", "complete:synthetic-lease"]);
});

test("provider or validation failure releases the lease and remains fail-closed", async () => {
  const events: string[] = [];
  const requestGuard: RightsGuidanceAtomicRequestGuard = {
    async acquire() {
      events.push("acquire");
      return { leaseId: "synthetic-lease" };
    },
    async complete() {
      events.push("complete");
    },
    async release(leaseId) {
      events.push(`release:${leaseId}`);
    },
  };
  const malformedProvider: RightsGuidanceProvider = {
    mode: "MOCK",
    async generate() {
      return { output: { raw: "private-provider-detail" }, usage: { inputTokens: 1, outputTokens: 1 } };
    },
  };

  const result = await generateRequestGuardedRightsGuidanceExplanation(
    input,
    malformedProvider,
    {
      enabled: true,
      scope: { clientKeyHash: CLIENT_A, assessmentVersionKeyHash: ASSESSMENT_1 },
      requestGuard,
    },
  );

  assert.deepEqual(result, {
    overallStatus: "UNAVAILABLE",
    reasonExplanations: [],
    nextStepExplanations: [],
  });
  assert.equal(JSON.stringify(result).includes("private-provider-detail"), false);
  assert.deepEqual(events, ["acquire", "release:synthetic-lease"]);
});
