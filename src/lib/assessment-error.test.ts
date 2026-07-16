import assert from "node:assert/strict";
import test from "node:test";
import { ApiClientError } from "./api.ts";
import {
  buildAssessmentErrorViewModel,
  fieldErrorDescriptionId,
  findFieldError,
} from "./assessment-error.ts";

test("maps validation errors to allowlisted labels without backend messages", () => {
  const backendMessage = "internal validator rejected payload";
  const model = buildAssessmentErrorViewModel(
    new ApiClientError(backendMessage, 422, {
      details: {
        age: ["must be greater than secret threshold"],
        internal_rule_id: ["RULE-SECRET-1"],
      },
    }),
  );

  assert.equal(model.kind, "VALIDATION");
  assert.deepEqual(model.fieldErrors, [
    {
      field: "age",
      label: "Yaşınız",
      message: "Bu alan için girilen bilgiyi kontrol edin.",
      descriptionId: "assessment-error-age",
    },
  ]);
  assert.equal(JSON.stringify(model).includes(backendMessage), false);
  assert.equal(JSON.stringify(model).includes("RULE-SECRET-1"), false);
});

test("keeps API and unexpected failures separate from validation", () => {
  assert.equal(buildAssessmentErrorViewModel(new ApiClientError("raw", 503)).kind, "API");
  assert.equal(buildAssessmentErrorViewModel(new Error("raw stack detail")).kind, "UNEXPECTED");
  const unknownField = buildAssessmentErrorViewModel(
    new ApiClientError("raw", 422, { details: { internal_rule_id: ["raw"] } }),
  );
  assert.deepEqual(unknownField.fieldErrors, []);
  assert.match(unknownField.message, /Girdiğiniz bilgileri/);
});

test("builds deterministic safe description ids and field lookup", () => {
  const model = buildAssessmentErrorViewModel(
    new ApiClientError("invalid", 422, { details: { household_size: ["bad"] } }),
  );

  assert.equal(fieldErrorDescriptionId("unsafe field/name"), "assessment-error-unsafe-field-name");
  assert.equal(findFieldError(model, "householdSize", "household_size")?.label, "Hanedeki kişi sayısı");
  assert.equal(findFieldError(model, "unknown"), null);
});
