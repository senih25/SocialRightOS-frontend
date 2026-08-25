import assert from "node:assert/strict";
import test from "node:test";
import { shouldFailClosedHomeCareFallback } from "./home-care-fallback-guard.ts";

test("home-care eligibility fallback fails closed", () => {
  assert.equal(
    shouldFailClosedHomeCareFallback(
      "v1/eligibility-check",
      "POST",
      "TR_HOME_CARE_ALLOWANCE",
    ),
    true,
  );
});

test("guard does not affect other benefits or routes", () => {
  assert.equal(
    shouldFailClosedHomeCareFallback("v1/eligibility-check", "POST", "TR_GSS"),
    false,
  );
  assert.equal(
    shouldFailClosedHomeCareFallback(
      "v1/eligibility-check",
      "GET",
      "TR_HOME_CARE_ALLOWANCE",
    ),
    false,
  );
  assert.equal(
    shouldFailClosedHomeCareFallback("evaluate/income", "POST", "TR_HOME_CARE_ALLOWANCE"),
    false,
  );
});
