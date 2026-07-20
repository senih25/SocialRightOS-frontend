import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  parseBuildWeekGuidanceResponse,
  requestSyntheticBuildWeekGuidance,
} from "./build-week-guidance-client.ts";

const nonce = "018f47a2-4d6c-7b8e-9f01-23456789abcd";
const validResponse = {
  overallStatus: "EXPLANATION_AVAILABLE",
  reasonExplanations: [
    {
      evidenceId: "EVIDENCE_SYNTHETIC_GSS_REASON",
      plainLanguageText: "Sentetik koşul sağlanmış görünüyor.",
    },
  ],
  nextStepExplanations: [
    {
      evidenceId: "SOURCE_SYNTHETIC_GSS_CHANNEL",
      plainLanguageText: "Sentetik kanaldan doğrulayın.",
    },
  ],
};

test("client sends only the fixed synthetic scenario and nonce", async () => {
  let capturedUrl = "";
  let capturedInit: RequestInit | undefined;
  const result = await requestSyntheticBuildWeekGuidance(nonce, async (url, init) => {
    capturedUrl = String(url);
    capturedInit = init;
    return Response.json(validResponse);
  });
  assert.equal(capturedUrl, "/api/build-week/rights-guidance");
  assert.equal(capturedInit?.method, "POST");
  assert.equal(capturedInit?.cache, "no-store");
  assert.deepEqual(JSON.parse(String(capturedInit?.body)), {
    scenario: "GSS_SYNTHETIC_ELIGIBLE",
    clientNonce: nonce,
  });
  assert.equal(String(capturedInit?.body).includes("status"), false);
  assert.equal(result.overallStatus, "EXPLANATION_AVAILABLE");
});

test("network and non-success HTTP responses fail closed", async () => {
  const networkResult = await requestSyntheticBuildWeekGuidance(nonce, async () => {
    throw new Error("secret network detail");
  });
  const httpResult = await requestSyntheticBuildWeekGuidance(
    nonce,
    async () => Response.json({ detail: "secret provider detail" }, { status: 503 }),
  );
  for (const result of [networkResult, httpResult]) {
    assert.deepEqual(result, {
      overallStatus: "UNAVAILABLE",
      reasonExplanations: [],
      nextStepExplanations: [],
    });
    assert.equal(JSON.stringify(result).includes("secret"), false);
  }
});

test("response parser rejects extra fields, unknown evidence and malformed unavailable states", () => {
  const invalid = [
    { ...validResponse, sourcePayload: { raw: true } },
    {
      ...validResponse,
      reasonExplanations: [
        { evidenceId: "UNKNOWN", plainLanguageText: "Injected" },
      ],
    },
    {
      overallStatus: "UNAVAILABLE",
      reasonExplanations: [{ evidenceId: "UNKNOWN", plainLanguageText: "Injected" }],
      nextStepExplanations: [],
    },
  ];
  for (const value of invalid) {
    assert.equal(parseBuildWeekGuidanceResponse(value).overallStatus, "UNAVAILABLE");
  }
});

test("response parser returns an isolated allowlisted model", () => {
  const parsed = parseBuildWeekGuidanceResponse(validResponse);
  assert.deepEqual(parsed, validResponse);
  assert.notEqual(parsed, validResponse);
  assert.notEqual(parsed.reasonExplanations, validResponse.reasonExplanations);
});

test("panel preserves accessibility, one-attempt behavior and GSS integration boundaries", () => {
  const panel = readFileSync(
    new URL("../components/BuildWeekGuidancePanel.tsx", import.meta.url),
    "utf8",
  );
  const page = readFileSync(
    new URL("../app/gss-gelir-testi/GssToolPageClient.tsx", import.meta.url),
    "utf8",
  );
  assert.match(panel, /aria-live="polite"/u);
  assert.match(panel, /aria-atomic="true"/u);
  assert.match(panel, /aria-busy=\{isLoading\}/u);
  assert.match(panel, /statusRef\.current\?\.focus\(\)/u);
  assert.match(panel, /disabled=\{isLoading\}/u);
  assert.match(panel, /<ul className=/u);
  assert.match(panel, /if \(state\.status !== "IDLE"\) return/u);
  assert.match(panel, /Form yanıtlarınız ve\s+ön değerlendirme sonucunuz yapay zekâ modeline gönderilmez/u);
  assert.doesNotMatch(panel, /EligibilityCheckResponse|AssessmentResult|decision_id|request_id/u);
  assert.match(page, /!isUnavailable \? <BuildWeekGuidancePanel \/> : null/u);
  assert.match(page, /checkEligibility\(buildGssPayload\(form, crypto\.randomUUID\(\)\)\)/u);
  assert.match(page, /getGssResultPrimaryAction\(displayStatus\)/u);
});
