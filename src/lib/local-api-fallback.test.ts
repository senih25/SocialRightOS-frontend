import assert from "node:assert/strict";
import test from "node:test";
import type { EligibilityCheckResponse, IncomeEvaluationResponse } from "./types.ts";
import {
  buildLocalApiPayload,
  normalizeEligibilityCheckRequest,
} from "./local-api-fallback.ts";

const invalidEligibilityPayloads: Array<[string, unknown]> = [
  ["null", null],
  ["string", "not-an-object"],
  ["array", []],
  ["empty object", {}],
  ["missing benefit code", { facts: {} }],
  ["null benefit code", { benefit_code: null, facts: {} }],
  ["unsupported benefit code", { benefit_code: "TR_UNKNOWN", facts: {} }],
  ["missing facts", { benefit_code: "TR_GSS" }],
  ["null facts", { benefit_code: "TR_GSS", facts: null }],
  ["array facts", { benefit_code: "TR_GSS", facts: [] }],
  ["nested fact object", { benefit_code: "TR_GSS", facts: { household_size: {} } }],
  ["nested fact array", { benefit_code: "TR_GSS", facts: { household_size: [] } }],
  ["primitive context", { benefit_code: "TR_GSS", facts: {}, context: "bad" }],
  ["wrong context field type", { benefit_code: "TR_GSS", facts: {}, context: { request_id: 7 } }],
  ["unsupported jurisdiction", { benefit_code: "TR_GSS", facts: {}, context: { jurisdiction: "US" } }],
  ["non-finite fact", { benefit_code: "TR_GSS", facts: { household_size: Infinity } }],
];

test("eligibility normalization rejects malformed root and nested payloads", () => {
  for (const [name, payload] of invalidEligibilityPayloads) {
    assert.equal(normalizeEligibilityCheckRequest(payload), null, name);
    const result = buildLocalApiPayload(["v1", "eligibility-check"], payload);
    assert.deepEqual(
      result,
      {
        message: "Uygunluk değerlendirme isteği geçerli değil.",
        error: "invalid_request",
        status: 400,
        correlation_id: "",
      },
      name,
    );
  }
});

test("eligibility normalization ignores unknown root fields and preserves valid scalar facts", () => {
  const facts = Object.fromEntries(
    Array.from({ length: 1_000 }, (_, index) => [`synthetic_extra_${index}`, index]),
  );
  const normalized = normalizeEligibilityCheckRequest({
    benefit_code: "TR_GSS",
    facts: {
      ...facts,
      gross_household_income: 12000,
      household_size: 3,
      has_social_security: false,
      has_active_insurance: false,
      is_covered_as_dependent: false,
    },
    unknown_root: "ignored",
  });

  assert.ok(normalized);
  assert.equal(normalized.benefit_code, "TR_GSS");
  assert.equal("unknown_root" in normalized, false);
  assert.equal((normalized.facts as Record<string, unknown>).synthetic_extra_999, 999);
});

test("local fallback resolves GSS requests", () => {
  const result = buildLocalApiPayload(["v1", "eligibility-check"], {
    benefit_code: "TR_GSS",
    facts: {
      gross_household_income: 12000,
      household_size: 3,
      has_social_security: false,
      has_active_insurance: false,
      is_covered_as_dependent: false,
    },
  });

  assert.ok(result);
  const typed = result as EligibilityCheckResponse;
  assert.equal(typed.status, "ELIGIBLE");
  assert.equal(typed.benefit_id, "TR_GSS");
  const firstReason = typed.reasons[0];
  assert.ok(firstReason);
  assert.match(firstReason!.code, /income_/i);
});

test("local fallback resolves old age requests", () => {
  const result = buildLocalApiPayload(["v1", "eligibility-check"], {
    benefit_code: "TR_OLD_AGE_PENSION",
    facts: {
      age: 67,
      self_monthly_income: 4000,
      has_spouse: false,
      has_social_security: false,
      receives_pension: false,
    },
  });

  assert.ok(result);
  const typed = result as EligibilityCheckResponse;
  assert.equal(typed.status, "ELIGIBLE");
  assert.equal(typed.benefit_id, "TR_OLD_AGE_PENSION");
});

test("local fallback resolves income tests", () => {
  const result = buildLocalApiPayload(["evaluate", "income"], {
    household_size: 4,
    total_income: 24000,
  });

  assert.ok(result);
  const typed = result as IncomeEvaluationResponse;
  assert.equal(typed.status, "ELIGIBLE");
  assert.equal(typed.per_capita_income, 6000);
  assert.equal(typed.threshold, 6667);
});
