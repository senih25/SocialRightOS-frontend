import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pagePath = new URL("../../src/app/research/medtrace-pilot/pilot-client.tsx", import.meta.url);
const cssPath = new URL("../../src/app/research/medtrace-pilot/pilot.module.css", import.meta.url);

const source = await readFile(pagePath, "utf8");
const css = await readFile(cssPath, "utf8");

test("MedTrace pilot keeps synthetic and non-clinical boundaries visible", () => {
  assert.match(source, /Synthetic only · No real patient data/);
  assert.match(source, /Not for clinical use/);
  assert.match(source, /No diagnosis, treatment recommendation, risk score, triage, alert, or autonomous clinical decision is produced/);
  assert.match(source, /human review/i);
});

test("MedTrace pilot states the Türkiye-first international research boundary", () => {
  assert.match(source, /Türkiye is the first research context, not the architectural boundary/);
  assert.match(source, /source-independent international health-data research settings/);
});

test("MedTrace pilot states a narrow GPT-Rosalind evaluation scope", () => {
  assert.match(source, /synthetic-only research evaluation led by one researcher/);
  assert.match(source, /Biomedical evidence synthesis/);
  assert.match(source, /Longitudinal event reasoning/);
  assert.match(source, /does not request autonomous clinical deployment or patient-facing model use/);
});

test("MedTrace pilot does not claim clinical validation or real patient use", () => {
  const forbiddenClaims = [
    /clinically validated/i,
    /clinical validation passed/i,
    /we use real patient data/i,
    /real patient data is used/i,
    /diagnosis generated/i,
    /autonomous clinical decision generated/i,
  ];

  for (const claim of forbiddenClaims) {
    assert.doesNotMatch(source, claim);
  }
});

test("MedTrace pilot does not expose private repository implementation details", () => {
  const forbiddenPrivateMarkers = [
    /enabiz\.gov\.tr/i,
    /chrome\.storage\.session/i,
    /apps\/extension/i,
    /packages\/contracts/i,
    /ed25519/i,
    /key vault/i,
    /copilot-mcp/i,
    /MED-AREA-/i,
  ];

  for (const marker of forbiddenPrivateMarkers) {
    assert.doesNotMatch(source, marker);
  }
});

test("MedTrace pilot does not mirror known live-case dates", () => {
  assert.doesNotMatch(source, /10\.10\.2021|15\.10\.2021|18\.10\.2021|19\.10\.2021/);
});

test("MedTrace pilot ships its dedicated responsive visual surface", () => {
  assert.match(css, /\.workspace/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /\.verification/);
});
