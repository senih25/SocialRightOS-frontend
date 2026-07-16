import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const evidence = read("../../docs/m2.1/m2.1-preview-evidence.md");
const smoke = read("../../docs/m2.1/m2.1-external-smoke-report.md");
const gate = read("../../docs/m2.1/m2.1-release-gate-reassessment.md");
const rollback = read("../../docs/m2/m2.0f-rollback-runbook.md");

test("production target evidence remains fail-closed and counters are not rewritten", () => {
  assert.match(evidence, /M2_1_PREVIEW_ATTEMPT_COUNT=1/);
  assert.match(evidence, /M2_1_TARGET_PREVIEW_VERIFIED=FAIL/);
  assert.match(evidence, /M2_1_PRODUCTION_TARGET_ATTEMPT_COUNT=1/);
  assert.match(evidence, /HISTORICAL_PRODUCTION_TARGET_DEPLOYMENT_ATTEMPT_COUNT_PRIOR=1/);
  assert.match(evidence, /TOTAL_PRODUCTION_TARGET_DEPLOYMENT_ATTEMPT_COUNT=2/);
});

test("external smoke is not claimed after the target gate fails", () => {
  assert.match(smoke, /EXTERNAL_SMOKE_STATUS=NOT_EXECUTED_TARGET_GATE_FAILED/);
  assert.doesNotMatch(smoke, /M2_1_DESKTOP_SMOKE=PASS/);
  assert.doesNotMatch(smoke, /M2_1_TARGET_PREVIEW_VERIFIED=PASS/);
});

test("release remains not ready while rollback leaves no active deployment", () => {
  assert.match(gate, /P0_OPEN_COUNT=1/);
  assert.match(gate, /RELEASE_DECISION=NOT_READY/);
  assert.match(rollback, /Active deployment count: 0/);
  assert.match(rollback, /Deployment URL: HTTP 404/);
});
