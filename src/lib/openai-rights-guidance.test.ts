import assert from "node:assert/strict";
import test from "node:test";
import {
  BudgetedRightsGuidanceLiveProvider,
  OpenAIRightsGuidanceProvider,
} from "./openai-rights-guidance.ts";
import {
  buildRightsGuidanceInput,
  generateRightsGuidanceExplanation,
  type RightsGuidanceApprovedCatalog,
  type RightsGuidanceAtomicBudgetStore,
  type RightsGuidanceProvider,
} from "./rights-guidance.ts";

const catalog: RightsGuidanceApprovedCatalog = {
  assessmentType: "GSS_PRELIMINARY_GUIDANCE",
  reasons: [
    {
      evidenceId: "EVIDENCE_SYNTHETIC_REASON",
      approvedText: "Sentetik koşul sağlanmış görünüyor.",
    },
  ],
  nextSteps: [
    {
      evidenceId: "SOURCE_SYNTHETIC_CHANNEL",
      approvedText: "Güncel adımı sentetik resmî kanaldan doğrulayın.",
    },
  ],
  limitations: ["Sentetik sınırlama."],
};

const input = buildRightsGuidanceInput(
  {
    assessmentType: "GSS_PRELIMINARY_GUIDANCE",
    coarseDisplayStatus: "CONDITION_APPEARS_SATISFIED",
    reasonEvidenceIds: ["EVIDENCE_SYNTHETIC_REASON"],
    nextStepEvidenceIds: ["SOURCE_SYNTHETIC_CHANNEL"],
    validAsOf: "2026-07-20",
    basisVersion: "synthetic-v1",
  },
  catalog,
);

const validOutput = {
  reasonExplanations: [
    {
      evidenceId: "EVIDENCE_SYNTHETIC_REASON",
      plainLanguageText: "Sentetik koşul sağlanmış görünüyor.",
    },
  ],
  nextStepExplanations: [
    {
      evidenceId: "SOURCE_SYNTHETIC_CHANNEL",
      plainLanguageText: "Güncel adımı sentetik resmî kanaldan doğrulayın.",
    },
  ],
};

function responsePayload(overrides: Record<string, unknown> = {}) {
  return {
    status: "completed",
    model: "gpt-5.6-luna",
    output: [
      {
        type: "message",
        content: [{ type: "output_text", text: JSON.stringify(validOutput) }],
      },
    ],
    usage: { input_tokens: 210, output_tokens: 112 },
    ...overrides,
  };
}

test("sends only minimized evidence through a bounded server-side Responses request", async () => {
  let capturedUrl = "";
  let capturedInit: RequestInit | undefined;
  const provider = new OpenAIRightsGuidanceProvider("synthetic-project-key", {
    safetyIdentifier: "synthetic_actor_01",
    fetchImplementation: async (url, init) => {
      capturedUrl = String(url);
      capturedInit = init;
      return Response.json(responsePayload());
    },
  });

  const result = await provider.generate(input);
  const request = JSON.parse(String(capturedInit?.body)) as Record<string, unknown>;
  const serializedRequest = JSON.stringify(request);

  assert.equal(capturedUrl, "https://api.openai.com/v1/responses");
  assert.equal(capturedInit?.method, "POST");
  assert.equal(JSON.stringify(provider).includes("synthetic-project-key"), false);
  assert.equal(request.model, "gpt-5.6-luna");
  assert.equal(request.store, false);
  assert.equal(request.max_output_tokens, 256);
  assert.deepEqual(request.reasoning, { effort: "low" });
  assert.equal(request.safety_identifier, "synthetic_actor_01");
  assert.equal(serializedRequest.includes("coarseDisplayStatus"), false);
  assert.equal(serializedRequest.includes("validAsOf"), false);
  assert.equal(serializedRequest.includes("basisVersion"), false);
  assert.equal(serializedRequest.includes("decisionId"), false);
  assert.deepEqual(result, {
    output: validOutput,
    usage: { inputTokens: 210, outputTokens: 112 },
  });

  const format = (request.text as { format: Record<string, unknown> }).format;
  assert.equal(format.type, "json_schema");
  assert.equal(format.strict, true);
  const schema = format.schema as {
    properties: {
      reasonExplanations: { minItems: number; maxItems: number; items: { properties: { evidenceId: { enum: string[] } } } };
      nextStepExplanations: { minItems: number; maxItems: number; items: { properties: { evidenceId: { enum: string[] } } } };
    };
  };
  assert.deepEqual(
    schema.properties.reasonExplanations.items.properties.evidenceId.enum,
    ["EVIDENCE_SYNTHETIC_REASON"],
  );
  assert.deepEqual(
    schema.properties.nextStepExplanations.items.properties.evidenceId.enum,
    ["SOURCE_SYNTHETIC_CHANNEL"],
  );
});

test("rejects HTTP failures, refusals, model drift and malformed usage", async () => {
  const cases = [
    () => new Response(null, { status: 429 }),
    () => Response.json(responsePayload({
      output: [{ type: "message", content: [{ type: "refusal", refusal: "No" }] }],
    })),
    () => Response.json(responsePayload({ model: "unexpected-model" })),
    () => Response.json(responsePayload({ usage: { input_tokens: -1, output_tokens: 1 } })),
  ];

  for (const buildResponse of cases) {
    const provider = new OpenAIRightsGuidanceProvider("synthetic-project-key", {
      fetchImplementation: async () => buildResponse(),
    });
    await assert.rejects(() => provider.generate(input), /OpenAI guidance unavailable/u);
  }
});

test("kill switch blocks reservation and network access", async () => {
  let reserveCount = 0;
  let delegateCount = 0;
  const store: RightsGuidanceAtomicBudgetStore = {
    async reserve() {
      reserveCount += 1;
      return { reservationId: "synthetic-reservation" };
    },
    async settle() {},
    async release() {},
  };
  const delegate: RightsGuidanceProvider = {
    mode: "LIVE",
    async generate() {
      delegateCount += 1;
      return { output: validOutput, usage: { inputTokens: 1, outputTokens: 1 } };
    },
  };
  const provider = new BudgetedRightsGuidanceLiveProvider(
    delegate,
    store,
    100,
    () => false,
  );

  const result = await generateRightsGuidanceExplanation(input, provider, { enabled: true });
  assert.equal(result.overallStatus, "UNAVAILABLE");
  assert.equal(reserveCount, 0);
  assert.equal(delegateCount, 0);
});

test("budget denial prevents the live provider call", async () => {
  let delegateCount = 0;
  const store: RightsGuidanceAtomicBudgetStore = {
    async reserve() { return null; },
    async settle() {},
    async release() {},
  };
  const delegate: RightsGuidanceProvider = {
    mode: "LIVE",
    async generate() {
      delegateCount += 1;
      return { output: validOutput, usage: { inputTokens: 1, outputTokens: 1 } };
    },
  };
  const provider = new BudgetedRightsGuidanceLiveProvider(
    delegate,
    store,
    100,
    () => true,
  );

  const result = await generateRightsGuidanceExplanation(input, provider, { enabled: true });
  assert.equal(result.overallStatus, "UNAVAILABLE");
  assert.equal(delegateCount, 0);
});

test("reserves before the live call and settles only validated token usage", async () => {
  const order: string[] = [];
  const store: RightsGuidanceAtomicBudgetStore = {
    async reserve(maximumCostMicros) {
      order.push(`reserve:${maximumCostMicros}`);
      return { reservationId: "synthetic-reservation" };
    },
    async settle(reservationId, usage) {
      order.push(`settle:${reservationId}:${usage.inputTokens}:${usage.outputTokens}`);
    },
    async release() { order.push("release"); },
  };
  const delegate: RightsGuidanceProvider = {
    mode: "LIVE",
    async generate() {
      order.push("network");
      return { output: validOutput, usage: { inputTokens: 210, outputTokens: 112 } };
    },
  };
  const provider = new BudgetedRightsGuidanceLiveProvider(
    delegate,
    store,
    1_000,
    () => true,
  );

  const result = await generateRightsGuidanceExplanation(input, provider, { enabled: true });
  assert.equal(result.overallStatus, "EXPLANATION_AVAILABLE");
  assert.deepEqual(order, [
    "reserve:1000",
    "network",
    "settle:synthetic-reservation:210:112",
  ]);
});

test("releases a reservation after provider failure without exposing details", async () => {
  let releaseCount = 0;
  const store: RightsGuidanceAtomicBudgetStore = {
    async reserve() { return { reservationId: "synthetic-reservation" }; },
    async settle() {},
    async release() { releaseCount += 1; },
  };
  const delegate: RightsGuidanceProvider = {
    mode: "LIVE",
    async generate() { throw new Error("secret provider detail"); },
  };
  const provider = new BudgetedRightsGuidanceLiveProvider(
    delegate,
    store,
    100,
    () => true,
  );

  const result = await generateRightsGuidanceExplanation(input, provider, { enabled: true });
  assert.equal(result.overallStatus, "UNAVAILABLE");
  assert.equal(releaseCount, 1);
  assert.equal(JSON.stringify(result).includes("secret provider detail"), false);
});
