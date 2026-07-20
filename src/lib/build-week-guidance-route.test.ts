import assert from "node:assert/strict";
import test from "node:test";
import {
  handleBuildWeekGuidanceRequest,
  type BuildWeekGuidanceService,
} from "./build-week-guidance-route.ts";

const endpoint = "http://localhost/api/build-week/rights-guidance";
const validBody = {
  scenario: "GSS_SYNTHETIC_ELIGIBLE" as const,
  clientNonce: "018f47a2-4d6c-7b8e-9f01-23456789abcd",
};

function jsonRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function successfulService(overrides: Record<string, unknown> = {}): BuildWeekGuidanceService {
  return {
    async generate() {
      return {
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
        ...overrides,
      } as never;
    },
  };
}

async function assertUnavailable(response: Response, status: number): Promise<void> {
  assert.equal(response.status, status);
  assert.deepEqual(await response.json(), {
    overallStatus: "UNAVAILABLE",
    reasonExplanations: [],
    nextStepExplanations: [],
  });
  assert.equal(response.headers.get("cache-control"), "no-store, max-age=0");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
}

test("disabled route rejects before parsing or invoking dependencies", async () => {
  let callCount = 0;
  const service: BuildWeekGuidanceService = {
    async generate() {
      callCount += 1;
      throw new Error("must not run");
    },
  };
  const request = new Request(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "not-json",
  });
  await assertUnavailable(
    await handleBuildWeekGuidanceRequest(request, { enabled: false, service }),
    503,
  );
  assert.equal(callCount, 0);
});

test("accepts only the exact synthetic scenario and UUID fields", async () => {
  const captured: unknown[] = [];
  const service: BuildWeekGuidanceService = {
    async generate(request) {
      captured.push(request);
      return successfulService().generate(request);
    },
  };
  const response = await handleBuildWeekGuidanceRequest(jsonRequest(validBody), {
    enabled: true,
    service,
  });
  assert.equal(response.status, 200);
  assert.deepEqual(captured, [validBody]);
  assert.equal(JSON.stringify(await response.json()).includes("clientNonce"), false);

  const invalidBodies = [
    { ...validBody, status: "ELIGIBLE" },
    { ...validBody, scenario: "OLD_AGE_REAL" },
    { ...validBody, clientNonce: "person@example.com" },
    { scenario: validBody.scenario },
  ];
  for (const body of invalidBodies) {
    await assertUnavailable(
      await handleBuildWeekGuidanceRequest(jsonRequest(body), { enabled: true, service }),
      400,
    );
  }
  assert.equal(captured.length, 1);
});

test("malformed JSON is a safe client error", async () => {
  const response = await handleBuildWeekGuidanceRequest(
    new Request(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{",
    }),
    { enabled: true, service: successfulService() },
  );
  await assertUnavailable(response, 400);
});

test("rejects non-JSON and oversized bodies without invoking the service", async () => {
  let callCount = 0;
  const service: BuildWeekGuidanceService = {
    async generate() {
      callCount += 1;
      return successfulService().generate(validBody);
    },
  };
  await assertUnavailable(
    await handleBuildWeekGuidanceRequest(
      new Request(endpoint, { method: "POST", body: "x" }),
      { enabled: true, service },
    ),
    415,
  );
  await assertUnavailable(
    await handleBuildWeekGuidanceRequest(
      new Request(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json-malformed" },
        body: JSON.stringify(validBody),
      }),
      { enabled: true, service },
    ),
    415,
  );
  await assertUnavailable(
    await handleBuildWeekGuidanceRequest(
      jsonRequest(validBody, { "Content-Length": "1025" }),
      { enabled: true, service },
    ),
    413,
  );
  await assertUnavailable(
    await handleBuildWeekGuidanceRequest(
      new Request(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...validBody, padding: "x".repeat(1_024) }),
      }),
      { enabled: true, service },
    ),
    413,
  );
  assert.equal(callCount, 0);
});

test("provider failures fail closed and response additions are removed", async () => {
  const failing: BuildWeekGuidanceService = {
    async generate() {
      throw new Error("secret provider and database detail");
    },
  };
  const unsafe = successfulService({
    sourcePayload: { token: "secret" },
  });
  await assertUnavailable(
    await handleBuildWeekGuidanceRequest(jsonRequest(validBody), {
      enabled: true,
      service: failing,
    }),
    503,
  );
  const unsafeResponse = await handleBuildWeekGuidanceRequest(jsonRequest(validBody), {
    enabled: true,
    service: unsafe,
  });
  assert.equal(unsafeResponse.status, 200);
  const serialized = await unsafeResponse.text();
  assert.equal(serialized.includes("sourcePayload"), false);
  assert.equal(serialized.includes("secret"), false);
});

test("unexpected evidence identifiers cannot cross the route boundary", async () => {
  const response = await handleBuildWeekGuidanceRequest(jsonRequest(validBody), {
    enabled: true,
    service: successfulService({
      reasonExplanations: [
        { evidenceId: "UNKNOWN", plainLanguageText: "Injected content" },
      ],
    }),
  });
  await assertUnavailable(response, 503);
});
