import assert from "node:assert/strict";

const baseUrl = (process.env.M2_2_BASE_URL ?? "http://127.0.0.1:8080").replace(/\/$/, "");
const endpoint = `${baseUrl}/api/v1/eligibility-check`;
const forbiddenFragments = [
  "TypeError",
  "at ",
  "local-api-fallback",
  "route.ts",
  "validation_carrier",
  "sourcePayload",
  "not-an-object",
  "synthetic-secret",
  "synthetic@example.invalid",
];

const negativeCases = [
  ["no-body", undefined],
  ["empty-body", ""],
  ["invalid-json", "{"],
  ["null", "null"],
  ["string", JSON.stringify("not-an-object")],
  ["array", "[]"],
  ["empty-object", "{}"],
  ["missing-eligibility-root", JSON.stringify({ eligibility: null })],
  ["null-benefit-code", JSON.stringify({ benefit_code: null, facts: {} })],
  ["missing-facts", JSON.stringify({ benefit_code: "TR_GSS" })],
  ["null-facts", JSON.stringify({ benefit_code: "TR_GSS", facts: null })],
  ["array-facts", JSON.stringify({ benefit_code: "TR_GSS", facts: [] })],
  [
    "wrong-nested-type",
    JSON.stringify({
      benefit_code: "TR_GSS",
      facts: { household_size: ["synthetic@example.invalid"] },
    }),
  ],
];

const validCases = [
  [
    "TR_GSS",
    {
      benefit_code: "TR_GSS",
      facts: {
        gross_household_income: 12000,
        household_size: 3,
        has_social_security: false,
        has_active_insurance: false,
        is_covered_as_dependent: false,
      },
    },
  ],
  [
    "TR_OLD_AGE_PENSION",
    {
      benefit_code: "TR_OLD_AGE_PENSION",
      facts: {
        age: 67,
        self_monthly_income: 4000,
        has_spouse: false,
        has_social_security: false,
        receives_pension: false,
      },
    },
  ],
  [
    "TR_GSS_OVERSIZED_STRUCTURALLY_VALID",
    {
      benefit_code: "TR_GSS",
      facts: {
        ...Object.fromEntries(
          Array.from({ length: 1_000 }, (_, index) => [`synthetic_extra_${index}`, index]),
        ),
        gross_household_income: 12000,
        household_size: 3,
        has_social_security: false,
        has_active_insurance: false,
        is_covered_as_dependent: false,
      },
      unknown_root: "ignored",
    },
  ],
];

let runtime500Count = 0;
let typeErrorCount = 0;

for (const [name, body] of negativeCases) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    ...(body === undefined ? {} : { body }),
  });
  const text = await response.text();

  runtime500Count += response.status === 500 ? 1 : 0;
  typeErrorCount += text.includes("TypeError") ? 1 : 0;
  assert.equal(response.status, 400, `${name}: expected HTTP 400, got ${response.status}`);
  assert.deepEqual(JSON.parse(text), {
    message: "Uygunluk değerlendirme isteği geçerli değil.",
    error: "invalid_request",
    status: 400,
    correlation_id: "",
  });
  for (const fragment of forbiddenFragments) {
    assert.equal(text.includes(fragment), false, `${name}: leaked ${fragment}`);
  }
}

for (const [name, payload] of validCases) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await response.json();
  assert.equal(response.status, 200, `${name}: expected HTTP 200`);
  assert.equal(body.benefit_id, payload.benefit_code);
}

for (const route of [
  "/",
  "/gss-gelir-testi",
  "/65-yas-ayligi-uygunluk-testi",
  "/gizlilik-ve-kvkk",
  "/kullanim-kosullari",
  "/yasal-uyari",
  "/kaynak-ve-guncellik-politikasi",
  "/iletisim",
]) {
  const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
  assert.ok(response.status >= 200 && response.status < 400, `${route}: HTTP ${response.status}`);
}

assert.equal(runtime500Count, 0);
assert.equal(typeErrorCount, 0);

console.log(`M2_2_HTTP_NEGATIVE_CASE_COUNT=${negativeCases.length}`);
console.log(`M2_2_HTTP_VALID_CASE_COUNT=${validCases.length}`);
console.log("M2_2_ROUTE_SMOKE_COUNT=8");
console.log(`M2_2_RUNTIME_500_COUNT=${runtime500Count}`);
console.log(`M2_2_TYPEERROR_COUNT=${typeErrorCount}`);
console.log("M2_2_LOCAL_PRODUCTION_RUNTIME=PASS");
