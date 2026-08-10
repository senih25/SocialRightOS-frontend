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
  assert.match(source, /No diagnosis, treatment recommendation, risk score, or autonomous clinical decision is produced/);
  assert.match(source, /human review/i);
});

test("MedTrace pilot does not claim clinical validation or real patient use", () => {
  const forbiddenClaims = [
    /clinically validated/i,
    /clinical validation passed/i,
    /real patient data is used/i,
    /diagnosis generated/i,
    /autonomous clinical decision/i,
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
  ];

  for (const marker of forbiddenPrivateMarkers) {
    assert.doesNotMatch(source, marker);
  }
});

test("MedTrace pilot ships its dedicated responsive visual surface", () => {
  assert.match(css, /\.workspace/);
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /\.verification/);
});
