import assert from "node:assert/strict";
import test from "node:test";
import {
  createBuildWeekGuidanceService,
  deriveBuildWeekGuidanceScope,
  readBuildWeekGuidanceRuntimeConfig,
} from "./build-week-guidance-runtime.ts";
import type { RightsGuidancePostgresQuery } from "./postgres-rights-guidance-store.ts";

const enabledEnvironment = {
  AI_GUIDANCE_ENABLED: "true",
  AI_GUIDANCE_MODEL: "gpt-5.6-luna",
  OPENAI_API_KEY: "synthetic-project-key",
  DATABASE_URL: "postgresql://localhost/synthetic",
  AI_GUIDANCE_HMAC_SECRET: "synthetic-secret-with-at-least-32-characters",
  AI_GUIDANCE_HARD_LIMIT_MICROS: "5000000",
  AI_GUIDANCE_MAX_REQUEST_COST_MICROS: "10000",
  AI_GUIDANCE_INPUT_USD_MICROS_PER_MILLION_TOKENS: "1000000",
  AI_GUIDANCE_OUTPUT_USD_MICROS_PER_MILLION_TOKENS: "4000000",
  AI_GUIDANCE_MAX_ATTEMPTS_PER_CLIENT: "3",
  AI_GUIDANCE_REQUEST_WINDOW_MS: "3600000",
};

test("disabled runtime requires no credential, database or pricing values", () => {
  assert.deepEqual(readBuildWeekGuidanceRuntimeConfig({}), { enabled: false });
  assert.deepEqual(
    readBuildWeekGuidanceRuntimeConfig({ AI_GUIDANCE_ENABLED: "false" }),
    { enabled: false },
  );
});

test("enabled runtime accepts only complete bounded server configuration", () => {
  const config = readBuildWeekGuidanceRuntimeConfig(enabledEnvironment);
  assert.equal(config.enabled, true);
  if (!config.enabled) return;
  assert.equal(config.hardLimitMicros, 5_000_000);
  assert.equal(config.maximumRequestCostMicros, 10_000);
  assert.equal(JSON.stringify({ ...config, apiKey: undefined }).includes("synthetic-project-key"), false);

  const invalidEnvironments = [
    { ...enabledEnvironment, OPENAI_API_KEY: "" },
    { ...enabledEnvironment, DATABASE_URL: "https://example.com" },
    { ...enabledEnvironment, AI_GUIDANCE_MODEL: "other-model" },
    { ...enabledEnvironment, AI_GUIDANCE_HMAC_SECRET: "short" },
    { ...enabledEnvironment, AI_GUIDANCE_MAX_REQUEST_COST_MICROS: "5000001" },
    { ...enabledEnvironment, AI_GUIDANCE_MAX_ATTEMPTS_PER_CLIENT: "0" },
  ];
  for (const environment of invalidEnvironments) {
    assert.throws(
      () => readBuildWeekGuidanceRuntimeConfig(environment),
      /Invalid guidance configuration/u,
    );
  }
});

test("HMAC scopes are deterministic, separated and contain no raw nonce", () => {
  const request = {
    scenario: "GSS_SYNTHETIC_ELIGIBLE" as const,
    clientNonce: "018f47a2-4d6c-7b8e-9f01-23456789abcd",
  };
  const first = deriveBuildWeekGuidanceScope(
    request,
    enabledEnvironment.AI_GUIDANCE_HMAC_SECRET,
  );
  const second = deriveBuildWeekGuidanceScope(
    request,
    enabledEnvironment.AI_GUIDANCE_HMAC_SECRET,
  );
  assert.deepEqual(first, second);
  assert.match(first.clientKeyHash, /^[a-f0-9]{64}$/u);
  assert.match(first.assessmentVersionKeyHash, /^[a-f0-9]{64}$/u);
  assert.notEqual(first.clientKeyHash, first.assessmentVersionKeyHash);
  assert.equal(JSON.stringify(first).includes(request.clientNonce), false);
  assert.match(first.safetyIdentifier, /^rg_[a-f0-9]{32}$/u);
});

test("assembled service sends only the fixed synthetic evidence catalog", async () => {
  const config = readBuildWeekGuidanceRuntimeConfig(enabledEnvironment);
  assert.equal(config.enabled, true);
  if (!config.enabled) return;
  const queries: string[] = [];
  const query: RightsGuidancePostgresQuery = async <Row extends Record<string, unknown>>(
    text: string,
  ): Promise<{ rows: Row[] }> => {
    queries.push(text);
    const row = text.includes("acquire_guidance_request")
      ? { acquired: true }
      : text.includes("reserve_guidance_budget")
        ? { acquired: true }
        : text.includes("settle_guidance_budget")
          ? { found: true, exceeded_reservation: false }
          : { completed: true };
    return { rows: [row as unknown as Row] };
  };
  let providerRequest = "";
  const service = createBuildWeekGuidanceService(config, query, {
    fetchImplementation: async (_url, init) => {
      providerRequest = String(init?.body);
      return Response.json({
        status: "completed",
        model: "gpt-5.6-luna",
        output: [
          {
            type: "message",
            content: [
              {
                type: "output_text",
                text: JSON.stringify({
                  reasonExplanations: [
                    {
                      evidenceId: "EVIDENCE_SYNTHETIC_GSS_REASON",
                      plainLanguageText: "Sentetik senaryoda ön koşul sağlanmış görünüyor.",
                    },
                  ],
                  nextStepExplanations: [
                    {
                      evidenceId: "SOURCE_SYNTHETIC_GSS_CHANNEL",
                      plainLanguageText: "Güncel adımı sentetik resmî kanal kaydından doğrulayın.",
                    },
                  ],
                }),
              },
            ],
          },
        ],
        usage: { input_tokens: 100, output_tokens: 50 },
      });
    },
  });
  const request = {
    scenario: "GSS_SYNTHETIC_ELIGIBLE" as const,
    clientNonce: "018f47a2-4d6c-7b8e-9f01-23456789abcd",
  };
  const result = await service.generate(request);
  assert.equal(result.overallStatus, "EXPLANATION_AVAILABLE");
  assert.equal(queries.length, 4);
  assert.equal(providerRequest.includes(request.clientNonce), false);
  assert.equal(providerRequest.includes("coarseDisplayStatus"), false);
  assert.equal(providerRequest.includes("validAsOf"), false);
  assert.equal(providerRequest.includes("basisVersion"), false);
  assert.equal(providerRequest.includes("EVIDENCE_SYNTHETIC_GSS_REASON"), true);
  assert.equal(providerRequest.includes("SOURCE_SYNTHETIC_GSS_CHANNEL"), true);
});
