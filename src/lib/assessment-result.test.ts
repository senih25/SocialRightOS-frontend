import test from "node:test";
import assert from "node:assert/strict";
import {
  adaptEligibilityResponse,
  adaptLegacyHomeCareResult,
} from "./assessment-result.ts";
import type { EligibilityCheckResponse } from "./types.ts";

function buildResponse(
  overrides: Partial<EligibilityCheckResponse> = {},
): EligibilityCheckResponse {
  return {
    decision_id: "backend-decision-1",
    request_id: "request-1",
    status: "NEEDS_INFO",
    benefit_id: "TR_GSS",
    reasons: [
      {
        code: "GSS_REASON",
        message: "GSS reason",
        severity: "WARNING",
      },
    ],
    missing_facts: [
      {
        key: "household_size",
        message: "Household size is required",
        priority: 1,
        fact_group: "income",
      },
    ],
    rule_results: {
      income: {
        rule_code: "GSS_INCOME",
        passed: false,
        value: 15000,
        threshold: 10000,
        message: "Income rule did not pass",
        input_mode: "USER_INPUT",
      },
    },
    metadata: {
      engine_version: "engine-1",
      evaluation_mode: "deterministic",
      policy_code: "TR_GSS",
      policy_version: "2026.1",
      jurisdiction: "TR",
      evaluation_date: "2026-07-16",
      policy_effective_from: "2026-01-01",
      policy_source_effective_date: "2026-01-01",
      policy_snapshot_hash: "snapshot-1",
    },
    user_message: "More information is required",
    disclaimer: "Pre-assessment only",
    guidance_items: [{ title: "Guide", url: "/guide" }],
    benefit_details: null,
    ...overrides,
  };
}

test("keeps local evaluation id separate from backend decision id", () => {
  const carrier = adaptEligibilityResponse(buildResponse(), "local-evaluation-1");

  assert.equal(carrier.result.identity.localEvaluationId, "local-evaluation-1");
  assert.equal(carrier.result.identity.backendDecisionId, "backend-decision-1");
  assert.equal(carrier.result.identity.requestId, "request-1");
});

test("keeps reasons, rule criteria and missing information in separate collections", () => {
  const { result } = adaptEligibilityResponse(buildResponse(), "local-evaluation-1");

  assert.equal(result.reasons.length, 1);
  assert.equal(result.reasons[0]?.origin, "BACKEND_REASON");
  assert.equal(result.ruleCriteria.length, 1);
  assert.equal(result.ruleCriteria[0]?.origin, "BACKEND_RULE_RESULT");
  assert.equal(result.missingInformation.length, 1);
  assert.equal(result.missingInformation[0]?.origin, "BACKEND_MISSING_FACT");
});

test("normalizes array rule results without merging them into reasons", () => {
  const response = buildResponse({
    rule_results: [
      {
        rule_code: "RULE_1",
        passed: true,
        message: "Rule passed",
      },
    ],
  });
  const { result } = adaptEligibilityResponse(response, "local-evaluation-1");

  assert.equal(result.ruleCriteria[0]?.code, "RULE_1");
  assert.equal(result.reasons[0]?.code, "GSS_REASON");
});

test("keeps the complete backend response only in the ephemeral validation carrier", () => {
  const response = buildResponse();
  const carrier = adaptEligibilityResponse(response, "local-evaluation-1");

  assert.equal(carrier.sourcePayload, response);
  assert.equal("sourcePayload" in carrier.result, false);
  assert.equal("legacy" in carrier.result, false);
});

test("preserves birth grant benefit details in the typed extension", () => {
  const response = buildResponse({
    benefit_id: "TR_BIRTH_GRANT",
    benefit_details: {
      child_order: 2,
      payment_type: "MONTHLY",
      payment_amount: 1500,
      total_estimated_amount: 18000,
      remaining_months: 12,
      calculation_profile: "SECOND_CHILD",
    },
  });
  const { result } = adaptEligibilityResponse(response, "local-evaluation-1");

  assert.deepEqual(result.extension, {
    benefitDetails: response.benefit_details,
  });
});

test("rejects unsupported backend benefit codes instead of silently widening the contract", () => {
  const response = buildResponse({ benefit_id: "UNKNOWN_BENEFIT" });

  assert.throws(
    () => adaptEligibilityResponse(response, "local-evaluation-1"),
    /Unsupported eligibility benefit code/,
  );
});

test("adapts legacy home care output without inventing a backend decision id", () => {
  const legacy = {
    status: "NOT_ELIGIBLE" as const,
    reasons: ["Income threshold exceeded"],
  };
  const carrier = adaptLegacyHomeCareResult(legacy, {
    localEvaluationId: "local-home-care-1",
    perCapitaIncome: 12000,
    incomeLimit: 11334,
    incomeLimitYear: 2025,
  });

  assert.equal(carrier.result.identity.localEvaluationId, "local-home-care-1");
  assert.equal(carrier.result.identity.backendDecisionId, null);
  assert.equal(carrier.result.reasons[0]?.origin, "LOCAL_REASON");
  assert.equal(carrier.result.ruleCriteria.length, 0);
  assert.equal(carrier.result.missingInformation.length, 0);
  assert.equal(carrier.result.extension.incomeLimit, 11334);
  assert.equal(carrier.sourcePayload, legacy);
});
