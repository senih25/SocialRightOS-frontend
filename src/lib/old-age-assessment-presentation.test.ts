import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { buildOldAgePilotPresentationViewModel } from "./old-age-assessment-presentation.ts";
import {
  getOldAgeResultPrimaryAction,
  oldAgePresentationCopyProfile,
} from "./old-age-explanations.ts";
import { buildOldAgePayload, initialOldAgeFormState } from "./old-age-form.ts";
import type { EligibilityCheckResponse, EligibilityStatus } from "./types.ts";

function response(
  overrides: Partial<EligibilityCheckResponse> = {},
): EligibilityCheckResponse {
  return {
    decision_id: "decision-old-age-1",
    request_id: "request-old-age-1",
    status: "ELIGIBLE",
    benefit_id: "TR_OLD_AGE_PENSION",
    reasons: [{ code: "age", message: "Backend reason", severity: "INFO" }],
    missing_facts: [{ key: "has_spouse", message: "Backend missing fact" }],
    rule_results: {
      age: { rule_code: "age", passed: true, message: "Backend rule" },
    },
    metadata: {
      engine_version: "engine-1",
      evaluation_mode: "deterministic",
      policy_code: "TR_OLD_AGE_PENSION",
      policy_version: "policy-1",
      jurisdiction: "TR",
      evaluation_date: "2026-07-16",
    },
    user_message: null,
    disclaimer: null,
    guidance_items: [{ title: "Guidance", url: "/65-yas-ayligi-uygunluk-testi/rehber" }],
    benefit_details: null,
    ...overrides,
  };
}

test("maps all old-age statuses without changing backend status", () => {
  const cases: Array<[EligibilityStatus, string]> = [
    ["ELIGIBLE", "POSITIVE"],
    ["NOT_ELIGIBLE", "NEGATIVE"],
    ["NEEDS_INFO", "INCOMPLETE"],
  ];

  for (const [status, outcome] of cases) {
    const model = buildOldAgePilotPresentationViewModel(response({ status }), "local-1");
    assert.equal(model.presentation.status, status);
    assert.equal(model.presentation.outcome, outcome);
    assert.ok(model.decisionView);
  }
});

test("fails closed for unsupported and malformed runtime results", () => {
  const unsupported = buildOldAgePilotPresentationViewModel(
    response({ status: "UNKNOWN" as EligibilityStatus }),
    "local-1",
  );
  const malformed = buildOldAgePilotPresentationViewModel(
    response({ reasons: null as unknown as EligibilityCheckResponse["reasons"] }),
    "local-1",
  );

  for (const model of [unsupported, malformed]) {
    assert.equal(model.presentation.outcome, "UNAVAILABLE");
    assert.equal(model.presentation.status, null);
    assert.equal(model.presentation.title, "İstek tamamlanamadı");
    assert.equal(model.decisionView, null);
  }
});

test("suppresses raw eligible and not-eligible decoration for malformed results", () => {
  const eligible = buildOldAgePilotPresentationViewModel(
    response({ status: "ELIGIBLE", reasons: null as never }),
    "local-1",
  );
  const negative = buildOldAgePilotPresentationViewModel(
    response({ status: "NOT_ELIGIBLE", missing_facts: null as never }),
    "local-1",
  );
  const page = readFileSync(
    new URL("../app/65-yas-ayligi-uygunluk-testi/OldAgeToolPageClient.tsx", import.meta.url),
    "utf8",
  );

  assert.equal(eligible.presentation.outcome, "UNAVAILABLE");
  assert.equal(negative.presentation.outcome, "UNAVAILABLE");
  assert.doesNotMatch(page, /statusTone\[result\.status\]/);
  assert.doesNotMatch(page, /statusLabelCopy\[result\.status\]/);
  assert.doesNotMatch(page, /statusBadgeCopy\[result\.status\]/);
  assert.doesNotMatch(page, /getOldAgeResultPrimaryAction\(result\.status\)/);
  assert.match(page, /const displayStatus = presentation\?\.status \?\? null/);
  assert.match(page, /!isUnavailable && decisionView/);
});

test("preserves identity, evidence separation and validity", () => {
  const model = buildOldAgePilotPresentationViewModel(response(), "local-1");

  assert.equal(model.presentation.identityState, "VERIFIED_BACKEND");
  assert.equal(model.presentation.reasons.length, 1);
  assert.equal(model.presentation.ruleCriteria.length, 1);
  assert.equal(model.presentation.missingInformation.length, 1);
  assert.equal(model.presentation.validAsOf, "2026-07-16");
  assert.equal(model.presentation.basisVersion, "policy-1");
  assert.deepEqual(model.presentation.benefitSpecificDetails, {});
});

test("keeps empty evidence sections empty", () => {
  const model = buildOldAgePilotPresentationViewModel(
    response({ reasons: [], rule_results: {}, missing_facts: [] }),
    "local-1",
  );

  assert.deepEqual(model.presentation.reasons, []);
  assert.deepEqual(model.presentation.ruleCriteria, []);
  assert.deepEqual(model.presentation.missingInformation, []);
});

test("uses only explicit trusted official channels and does not promote guidance", () => {
  const withoutTrusted = buildOldAgePilotPresentationViewModel(response(), "local-1");
  const withTrusted = buildOldAgePilotPresentationViewModel(response(), "local-1", [
    { label: "Trusted", href: "https://example.gov.tr" },
  ]);

  assert.deepEqual(withoutTrusted.presentation.officialChannels, []);
  assert.deepEqual(withoutTrusted.presentation.nextSteps, [
    { title: "Guidance", url: "/65-yas-ayligi-uygunluk-testi/rehber" },
  ]);
  assert.deepEqual(withTrusted.presentation.officialChannels, [
    { label: "Trusted", href: "https://example.gov.tr" },
  ]);
});

test("does not expose raw response or validation carrier", () => {
  const model = buildOldAgePilotPresentationViewModel(response(), "local-1");
  assert.equal("sourcePayload" in model, false);
  assert.equal("sourcePayload" in model.presentation, false);
  assert.equal("response" in model, false);
});

test("preserves existing old-age title summary disclaimer status and CTA copy", () => {
  assert.deepEqual(oldAgePresentationCopyProfile.outcomes, {
    POSITIVE: {
      title: "65 yaş aylığı için uygun görünüyorsunuz",
      summary:
        "Ön değerlendirme aracı mevcut bilgilerle olumlu bir sonuç döndürdü. Bu sonuç resmî karar yerine geçmez.",
      disclaimer: "",
    },
    NEGATIVE: {
      title: "65 yaş aylığı için uygun görünmüyorsunuz",
      summary:
        "Ön değerlendirme aracı girilen bilgilerle olumsuz bir sonuç döndürdü. Bu sonuç resmî kurum kararı yerine geçmez.",
      disclaimer: "",
    },
    INCOMPLETE: {
      title: "Daha fazla bilgi gerekli",
      summary:
        "Sistem mevcut bilgilerle güvenli bir ön karar üretemedi. Eksik alanları tamamlayıp tekrar deneyebilirsiniz.",
      disclaimer: "",
    },
    UNAVAILABLE: {
      title: "İstek tamamlanamadı",
      summary: "Değerlendirme sistemi şu anda hazır değil. Lütfen daha sonra tekrar deneyin.",
      disclaimer: "",
    },
  });
  assert.deepEqual(getOldAgeResultPrimaryAction("NEEDS_INFO"), {
    label: "Eksik bilgileri tamamla",
    href: "#form-start",
  });
  assert.deepEqual(getOldAgeResultPrimaryAction("ELIGIBLE"), {
    label: "Diğer ön değerlendirmelere dön",
    href: "/#hangi-testi-secmeliyim",
  });
});

test("preserves route endpoint payload analytics loading and API error paths", () => {
  const page = readFileSync(
    new URL("../app/65-yas-ayligi-uygunluk-testi/OldAgeToolPageClient.tsx", import.meta.url),
    "utf8",
  );
  const api = readFileSync(new URL("./api.ts", import.meta.url), "utf8");
  const analytics = readFileSync(new URL("./tool-analytics-core.ts", import.meta.url), "utf8");

  assert.match(page, /createToolAnalyticsSession\("old-age"\)/);
  assert.match(page, /trackResultReceived\(result\.decision_id, result\.status\)/);
  assert.match(page, /Değerlendiriliyor\.\.\./);
  assert.match(page, /err instanceof ApiClientError/);
  assert.match(page, /aria-live="polite"/);
  assert.match(page, /aria-label=\{presentation\.title\}/);
  assert.match(page, /data-presentation-section="reasons"/);
  assert.match(page, /data-presentation-section="rule-criteria"/);
  assert.match(page, /data-presentation-section="missing-information"/);
  assert.match(page, /presentation\.ruleCriteria\.length > 0/);
  assert.match(api, /\/api\/v1\/eligibility-check/);
  assert.match(analytics, /name: "result_received"/);
  assert.deepEqual(buildOldAgePayload(initialOldAgeFormState, "request-1"), {
    benefit_code: "TR_OLD_AGE_PENSION",
    facts: { age: null, self_monthly_income: null },
    context: { jurisdiction: "TR", request_id: "request-1" },
  });
});

test("keeps common contracts and GSS integration outside the pilot file scope", () => {
  const page = readFileSync(
    new URL("../app/65-yas-ayligi-uygunluk-testi/OldAgeToolPageClient.tsx", import.meta.url),
    "utf8",
  );
  assert.match(page, /buildOldAgePilotPresentationViewModel/);
  assert.doesNotMatch(page, /sourcePayload/);
  assert.doesNotMatch(page, /result\.guidance_items/);
});
