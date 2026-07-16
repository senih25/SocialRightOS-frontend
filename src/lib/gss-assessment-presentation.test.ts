import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  buildGssPilotPresentationViewModel,
} from "./gss-assessment-presentation.ts";
import {
  getGssResultPrimaryAction,
  gssPresentationCopyProfile,
} from "./gss-explanations.ts";
import { buildGssPayload, initialGssFormState } from "./gss-form.ts";
import type { EligibilityCheckResponse, EligibilityStatus } from "./types.ts";

function response(
  overrides: Partial<EligibilityCheckResponse> = {},
): EligibilityCheckResponse {
  return {
    decision_id: "decision-1",
    request_id: "request-1",
    status: "ELIGIBLE",
    benefit_id: "TR_GSS",
    reasons: [{ code: "income", message: "Backend reason", severity: "INFO" }],
    missing_facts: [{ key: "household_size", message: "Backend missing fact" }],
    rule_results: {
      income: { rule_code: "income", passed: true, message: "Backend rule" },
    },
    metadata: {
      engine_version: "engine-1",
      evaluation_mode: "deterministic",
      policy_code: "TR_GSS",
      policy_version: "policy-1",
      jurisdiction: "TR",
      evaluation_date: "2026-07-16",
    },
    user_message: null,
    disclaimer: null,
    guidance_items: [{ title: "Guidance", url: "/gss-gelir-testi/rehber" }],
    benefit_details: null,
    ...overrides,
  };
}

test("maps all GSS statuses without changing backend status", () => {
  const cases: Array<[EligibilityStatus, string]> = [
    ["ELIGIBLE", "POSITIVE"],
    ["NOT_ELIGIBLE", "NEGATIVE"],
    ["NEEDS_INFO", "INCOMPLETE"],
  ];

  for (const [status, outcome] of cases) {
    const model = buildGssPilotPresentationViewModel(response({ status }), "local-1");
    assert.equal(model.presentation.status, status);
    assert.equal(model.presentation.outcome, outcome);
    assert.ok(model.decisionView);
  }
});

test("fails closed for unsupported and malformed runtime results", () => {
  const unsupported = buildGssPilotPresentationViewModel(
    response({ status: "UNKNOWN" as EligibilityStatus }),
    "local-1",
  );
  const malformed = buildGssPilotPresentationViewModel(
    response({ reasons: null as unknown as EligibilityCheckResponse["reasons"] }),
    "local-1",
  );

  assert.equal(unsupported.presentation.outcome, "UNAVAILABLE");
  assert.equal(malformed.presentation.outcome, "UNAVAILABLE");
  assert.equal(unsupported.decisionView, null);
  assert.equal(unsupported.presentation.title, "İstek tamamlanamadı");
});

test("malformed eligible result suppresses raw positive UI decoration", () => {
  const model = buildGssPilotPresentationViewModel(
    response({
      status: "ELIGIBLE",
      reasons: null as unknown as EligibilityCheckResponse["reasons"],
    }),
    "local-1",
  );
  const page = readFileSync(
    new URL("../app/gss-gelir-testi/GssToolPageClient.tsx", import.meta.url),
    "utf8",
  );

  assert.equal(model.presentation.outcome, "UNAVAILABLE");
  assert.equal(model.presentation.status, null);
  assert.equal(model.presentation.title, "İstek tamamlanamadı");
  assert.equal(model.decisionView, null);
  assert.doesNotMatch(page, /statusTone\[result\.status\]/);
  assert.doesNotMatch(page, /statusLabelCopy\[result\.status\]/);
  assert.doesNotMatch(page, /statusBadgeCopy\[result\.status\]/);
  assert.doesNotMatch(page, /getGssResultPrimaryAction\(result\.status\)/);
  assert.match(page, /!isUnavailable && decisionView/);
});

test("malformed not-eligible result suppresses raw negative UI decoration", () => {
  const model = buildGssPilotPresentationViewModel(
    response({
      status: "NOT_ELIGIBLE",
      missing_facts: null as unknown as EligibilityCheckResponse["missing_facts"],
    }),
    "local-1",
  );
  const page = readFileSync(
    new URL("../app/gss-gelir-testi/GssToolPageClient.tsx", import.meta.url),
    "utf8",
  );

  assert.equal(model.presentation.outcome, "UNAVAILABLE");
  assert.equal(model.presentation.status, null);
  assert.equal(model.decisionView, null);
  assert.match(page, /const displayStatus = presentation\?\.status \?\? null/);
  assert.match(page, /aria-label=\{presentation\.title\}/);
  assert.match(page, /const primaryAction = displayStatus/);
});

test("preserves identity, evidence separation, validity and empty GSS extension", () => {
  const model = buildGssPilotPresentationViewModel(response(), "local-1");

  assert.equal(model.presentation.identityState, "VERIFIED_BACKEND");
  assert.equal(model.presentation.reasons.length, 1);
  assert.equal(model.presentation.ruleCriteria.length, 1);
  assert.equal(model.presentation.missingInformation.length, 1);
  assert.equal(model.presentation.validAsOf, "2026-07-16");
  assert.equal(model.presentation.basisVersion, "policy-1");
  assert.deepEqual(model.presentation.benefitSpecificDetails, {});
});

test("keeps empty sections empty", () => {
  const model = buildGssPilotPresentationViewModel(
    response({ reasons: [], rule_results: {}, missing_facts: [] }),
    "local-1",
  );

  assert.deepEqual(model.presentation.reasons, []);
  assert.deepEqual(model.presentation.ruleCriteria, []);
  assert.deepEqual(model.presentation.missingInformation, []);
});

test("uses only trusted official channels and never promotes guidance", () => {
  const withoutTrusted = buildGssPilotPresentationViewModel(response(), "local-1");
  const withTrusted = buildGssPilotPresentationViewModel(response(), "local-1", [
    { label: "Trusted", href: "https://example.gov.tr" },
  ]);

  assert.deepEqual(withoutTrusted.presentation.officialChannels, []);
  assert.deepEqual(withoutTrusted.presentation.nextSteps, [
    { title: "Guidance", url: "/gss-gelir-testi/rehber" },
  ]);
  assert.deepEqual(withTrusted.presentation.officialChannels, [
    { label: "Trusted", href: "https://example.gov.tr" },
  ]);
});

test("does not expose raw response or validation carrier", () => {
  const model = buildGssPilotPresentationViewModel(response(), "local-1");
  assert.equal("sourcePayload" in model, false);
  assert.equal("sourcePayload" in model.presentation, false);
  assert.equal("response" in model, false);
});

test("preserves existing GSS copy and CTA contracts", () => {
  assert.deepEqual(gssPresentationCopyProfile.outcomes, {
    POSITIVE: {
      title: "GSS gelir testi için uygun görünüyorsunuz",
      summary: "Ön değerlendirme aracı mevcut bilgilerle olumlu bir sonuç üretti.",
      disclaimer: "Bu sonuç resmî karar yerine geçmez.",
    },
    NEGATIVE: {
      title: "GSS gelir testi için uygun görünmüyorsunuz",
      summary: "Ön değerlendirme aracı girilen bilgilerle olumsuz bir ön değerlendirme üretti.",
      disclaimer: "Bu sonuç resmî kurum kararı yerine geçmez.",
    },
    INCOMPLETE: {
      title: "Karar için ek bilgi gerekli",
      summary:
        "Sistem, mevcut bilgilerle güvenli bir GSS gelir testi sonucu üretemedi. Eksik veya emin olmadığınız alanları tamamlayın.",
      disclaimer: "",
    },
    UNAVAILABLE: {
      title: "İstek tamamlanamadı",
      summary: "Değerlendirme sistemi şu anda hazır değil. Lütfen daha sonra tekrar deneyin.",
      disclaimer: "",
    },
  });
  assert.deepEqual(getGssResultPrimaryAction("NEEDS_INFO"), {
    label: "Eksik bilgileri tamamla",
    href: "#form-start",
  });
  assert.deepEqual(getGssResultPrimaryAction("ELIGIBLE"), {
    label: "Ana sayfada diğer testleri gör",
    href: "/#hangi-testi-secmeliyim",
  });
});

test("preserves route, endpoint, payload, analytics and accessible result markup", () => {
  const page = readFileSync(
    new URL("../app/gss-gelir-testi/GssToolPageClient.tsx", import.meta.url),
    "utf8",
  );
  const api = readFileSync(new URL("./api.ts", import.meta.url), "utf8");
  const analytics = readFileSync(new URL("./tool-analytics-core.ts", import.meta.url), "utf8");

  assert.match(page, /aria-live="polite"/);
  assert.match(page, /data-presentation-section="reasons"/);
  assert.match(page, /<ul[\s\S]*data-presentation-section="rule-criteria"/);
  assert.match(page, /data-presentation-section="missing-information"/);
  assert.match(page, /presentation\.ruleCriteria\.length > 0/);
  assert.match(page, /Değerlendiriliyor\.\.\./);
  assert.match(page, /<SafeErrorPanel error=\{error\} focusRef=\{errorRef\}/);
  assert.match(page, /buildAssessmentErrorViewModel\(err\)/);
  assert.match(page, /getGssResultPrimaryAction\(displayStatus\)/);
  assert.match(api, /\/api\/v1\/eligibility-check/);
  assert.match(analytics, /name: "assessment_completed"/);
  assert.deepEqual(buildGssPayload(initialGssFormState, "request-1"), {
    benefit_code: "TR_GSS",
    facts: { gross_household_income: null, household_size: null },
    context: { jurisdiction: "TR", request_id: "request-1" },
  });
});
