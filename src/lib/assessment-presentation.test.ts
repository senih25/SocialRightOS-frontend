import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAssessmentPresentationModel,
  type AssessmentPresentationCopyProfile,
} from "./assessment-presentation.ts";
import type { AssessmentResult } from "./assessment-result.ts";

const syntheticProfile: AssessmentPresentationCopyProfile = {
  outcomes: {
    POSITIVE: { title: "Synthetic positive", summary: "Positive summary", disclaimer: "Synthetic disclaimer" },
    NEGATIVE: { title: "Synthetic negative", summary: "Negative summary", disclaimer: "Synthetic disclaimer" },
    INCOMPLETE: { title: "Synthetic incomplete", summary: "Incomplete summary", disclaimer: "Synthetic disclaimer" },
    UNAVAILABLE: { title: "Synthetic unavailable", summary: "Unavailable summary", disclaimer: "Safe fallback" },
  },
  documentChecklist: [{ label: "Synthetic document", description: "Test-only item" }],
};

function buildResult(
  overrides: Partial<AssessmentResult<"TR_GSS">> = {},
): AssessmentResult<"TR_GSS"> {
  return {
    schemaVersion: "1.0",
    identity: {
      localEvaluationId: "local-1",
      backendDecisionId: "backend-1",
      requestId: "request-1",
    },
    benefitCode: "TR_GSS",
    status: "ELIGIBLE",
    source: "BACKEND_ELIGIBILITY_API",
    summary: { message: "Raw summary", disclaimer: "Raw disclaimer" },
    reasons: [
      { origin: "BACKEND_REASON", code: "R1", message: "Reason one", severity: "INFO" },
      { origin: "BACKEND_REASON", code: "R2", message: "Reason two", severity: "WARNING" },
    ],
    ruleCriteria: [
      { origin: "BACKEND_RULE_RESULT", code: "C1", passed: true, message: "Criterion one" },
      { origin: "BACKEND_RULE_RESULT", code: "C2", passed: false, message: "Criterion two" },
    ],
    missingInformation: [
      { origin: "BACKEND_MISSING_FACT", key: "M1", message: "Missing one" },
      { origin: "BACKEND_MISSING_FACT", key: "M2", message: "Missing two" },
    ],
    guidance: [{ title: "Guidance only", url: "/synthetic-guide" }],
    validity: {
      evaluatedAt: "2026-07-16",
      engineVersion: "engine-1",
      policyCode: "TR_GSS",
      policyVersion: "policy-1",
      policyEffectiveFrom: null,
      policySourceEffectiveDate: null,
      policySnapshotHash: null,
    },
    extension: {},
    ...overrides,
  };
}

test("maps backend statuses to separate presentation outcomes", () => {
  const cases = [
    ["ELIGIBLE", "POSITIVE"],
    ["NOT_ELIGIBLE", "NEGATIVE"],
    ["NEEDS_INFO", "INCOMPLETE"],
  ] as const;

  for (const [status, outcome] of cases) {
    const model = buildAssessmentPresentationModel(buildResult({ status }), syntheticProfile);
    assert.equal(model.status, status);
    assert.equal(model.outcome, outcome);
  }
});

test("fails closed for an unsupported runtime status", () => {
  const invalid = buildResult({ status: "UNKNOWN" as AssessmentResult["status"] });
  const model = buildAssessmentPresentationModel(invalid, syntheticProfile);

  assert.equal(model.outcome, "UNAVAILABLE");
  assert.equal(model.status, null);
  assert.equal(model.title, "Synthetic unavailable");
});

test("fails closed without leaking mapper failure details", () => {
  const malformed = buildResult({ reasons: null as unknown as AssessmentResult["reasons"] });
  const model = buildAssessmentPresentationModel(malformed, syntheticProfile);

  assert.equal(model.outcome, "UNAVAILABLE");
  assert.equal(model.summary, "Unavailable summary");
  assert.equal(JSON.stringify(model).includes("map"), false);
});

test("distinguishes verified, missing backend and local legacy identities", () => {
  assert.equal(buildAssessmentPresentationModel(buildResult(), syntheticProfile).identityState, "VERIFIED_BACKEND");
  assert.equal(
    buildAssessmentPresentationModel(
      buildResult({ identity: { localEvaluationId: "local-1", backendDecisionId: " ", requestId: "request-1" } }),
      syntheticProfile,
    ).identityState,
    "MISSING_BACKEND_DECISION",
  );

  const legacy: AssessmentResult<"TR_HOME_CARE_ALLOWANCE"> = {
    ...buildResult(),
    benefitCode: "TR_HOME_CARE_ALLOWANCE",
    source: "LOCAL_LEGACY_EVALUATOR",
    identity: { localEvaluationId: "local-home", backendDecisionId: null, requestId: null },
    extension: { incomeLimit: 11334, incomeLimitYear: 2025 },
  };
  const model = buildAssessmentPresentationModel(legacy, syntheticProfile);
  assert.equal(model.identityState, "LOCAL_LEGACY");
  assert.deepEqual(model.benefitSpecificDetails, { incomeLimit: 11334, incomeLimitYear: 2025 });
});

test("keeps evidence collections separate and deterministic", () => {
  const model = buildAssessmentPresentationModel(buildResult(), syntheticProfile);

  assert.deepEqual(model.reasons.map((item) => item.code), ["R1", "R2"]);
  assert.deepEqual(model.ruleCriteria.map((item) => item.code), ["C1", "C2"]);
  assert.deepEqual(model.missingInformation.map((item) => item.key), ["M1", "M2"]);
});

test("preserves empty and partial rule collections", () => {
  assert.deepEqual(
    buildAssessmentPresentationModel(buildResult({ ruleCriteria: [] }), syntheticProfile).ruleCriteria,
    [],
  );
  assert.deepEqual(
    buildAssessmentPresentationModel(
      buildResult({ ruleCriteria: [buildResult().ruleCriteria[0]!] }),
      syntheticProfile,
    ).ruleCriteria.map((item) => item.code),
    ["C1"],
  );
});

test("does not promote guidance links to official channels", () => {
  const model = buildAssessmentPresentationModel(buildResult(), syntheticProfile);

  assert.deepEqual(model.nextSteps, [{ title: "Guidance only", url: "/synthetic-guide" }]);
  assert.deepEqual(model.officialChannels, []);
});

test("uses only explicit trusted channels and checklist input", () => {
  const model = buildAssessmentPresentationModel(buildResult(), syntheticProfile, [
    { label: "Synthetic official channel", href: "https://example.gov.tr/apply" },
  ]);

  assert.deepEqual(model.officialChannels, [
    { label: "Synthetic official channel", href: "https://example.gov.tr/apply" },
  ]);
  assert.deepEqual(model.documentChecklist, [
    { label: "Synthetic document", description: "Test-only item" },
  ]);
});

test("prefers policy version and falls back to engine version", () => {
  assert.equal(buildAssessmentPresentationModel(buildResult(), syntheticProfile).basisVersion, "policy-1");
  const model = buildAssessmentPresentationModel(
    buildResult({ validity: { ...buildResult().validity, policyVersion: null } }),
    syntheticProfile,
  );
  assert.equal(model.basisVersion, "engine-1");
  assert.equal(model.validAsOf, "2026-07-16");
});

test("preserves typed birth grant details", () => {
  const birthGrant: AssessmentResult<"TR_BIRTH_GRANT"> = {
    ...buildResult(),
    benefitCode: "TR_BIRTH_GRANT",
    extension: {
      benefitDetails: {
        child_order: 2,
        payment_type: "MONTHLY",
        payment_amount: 1500,
        remaining_months: 12,
      },
    },
  };
  const model = buildAssessmentPresentationModel(birthGrant, syntheticProfile);
  assert.deepEqual(model.benefitSpecificDetails, birthGrant.extension);
});

test("does not expose raw response or validation carrier fields", () => {
  const model = buildAssessmentPresentationModel(buildResult(), syntheticProfile);
  assert.equal("sourcePayload" in model, false);
  assert.equal("response" in model, false);
  assert.equal("carrier" in model, false);
});

test("uses synthetic profile copy instead of tool-specific copy", () => {
  const model = buildAssessmentPresentationModel(buildResult(), syntheticProfile);
  assert.equal(model.title, "Synthetic positive");
  assert.equal(model.summary, "Positive summary");
  assert.equal(model.disclaimer, "Synthetic disclaimer");
});
