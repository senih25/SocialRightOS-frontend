import assert from "node:assert/strict";
import test from "node:test";
import { buildSafeErrorSignal, getRuntimeMarker, reportSafeError } from "./observability.ts";

test("runtime marker exposes only sanitized release and environment values", () => {
  assert.deepEqual(
    getRuntimeMarker({ NEXT_PUBLIC_RELEASE_SHA: "abc123", NEXT_PUBLIC_APP_ENV: "preview" }),
    { release: "abc123", environment: "preview", provider: "disabled" },
  );
  assert.deepEqual(
    getRuntimeMarker({ NEXT_PUBLIC_RELEASE_SHA: "<script>secret</script>", NODE_ENV: "odd" }),
    { release: "local", environment: "unknown", provider: "disabled" },
  );
});

test("safe error signal contains no exception, message, stack, payload or identity", () => {
  const signal = buildSafeErrorSignal("GLOBAL_RENDER_ERROR", {
    NEXT_PUBLIC_RELEASE_SHA: "release-1",
    NEXT_PUBLIC_APP_ENV: "test",
  });
  assert.deepEqual(signal, {
    code: "GLOBAL_RENDER_ERROR",
    release: "release-1",
    environment: "test",
  });
  for (const forbidden of ["error", "message", "stack", "payload", "decisionId", "requestId"]) {
    assert.equal(forbidden in signal, false);
  }
});

test("reporter is a provider-free server no-op", () => {
  const originalWindow = globalThis.window;
  Object.defineProperty(globalThis, "window", { configurable: true, value: undefined });
  try {
    assert.doesNotThrow(() => reportSafeError("ASSESSMENT_API_ERROR"));
  } finally {
    Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
  }
});
