import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const gate = readFileSync(new URL("../../docs/m2/m2.0g-release-gate.md", import.meta.url), "utf8");
const completion = readFileSync(
  new URL("../../docs/m2/m2.0g-completion-report.md", import.meta.url),
  "utf8",
);

test("release gate remains fail-closed while preview P0 is open", () => {
  assert.match(gate, /RELEASE_DECISION=NOT_READY/);
  assert.match(gate, /P0_OPEN_COUNT=1/);
  assert.match(gate, /PREVIEW_STATUS=BLOCKED_BY_DEPLOYMENT_TARGET_MISMATCH/);
  assert.match(gate, /PRODUCTION_DEPLOY_APPROVED=NO/);
  assert.doesNotMatch(gate, /RELEASE_DECISION=READY_FOR_CONTROLLED_BETA/);
});

test("security exposure counters remain zero and rollback is explicit", () => {
  for (const marker of [
    "CRITICAL_ACCESSIBILITY_COUNT=0",
    "BLOCKING_SECURITY_COUNT=0",
    "SECRET_EXPOSURE_COUNT=0",
    "RAW_BACKEND_RESPONSE_EXPOSURE_COUNT=0",
    "VALIDATION_CARRIER_EXPOSURE_COUNT=0",
    "ACTIVE_DEPLOYMENT_COUNT=0",
    "ROLLBACK_STATUS=PASS",
  ]) {
    assert.ok(gate.includes(marker));
  }
});

test("M2.2 closes the runtime P0 locally without claiming controlled beta readiness", () => {
  for (const marker of [
    "P0_RUNTIME_001=CLOSED",
    "P0_OPEN_COUNT=0",
    "M2_2_TESTS=195/195_PASS",
    "M2_2_LOCAL_PRODUCTION_RUNTIME=PASS",
    "M2_2_RUNTIME_500_COUNT=0",
    "M2_2_TYPEERROR_COUNT=0",
    "PRODUCTION_DEPLOY_COUNT_THIS_MILESTONE=0",
    "RELEASE_DECISION=READY_FOR_REDEPLOYMENT_APPROVAL",
  ]) {
    assert.ok(gate.includes(marker));
  }
  assert.doesNotMatch(gate, /RELEASE_DECISION=READY_FOR_CONTROLLED_BETA/);
});

test("completion report covers M2.0A through M2.0F exactly once", () => {
  for (const milestone of ["M2.0A", "M2.0B", "M2.0C", "M2.0D", "M2.0E", "M2.0F"]) {
    assert.equal(completion.split(`| ${milestone} |`).length - 1, 1);
  }
  assert.match(completion, /Decision: `NOT_READY`/);
});
