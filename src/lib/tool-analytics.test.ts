import test from "node:test";
import assert from "node:assert/strict";
import { createToolAnalyticsSession } from "./tool-analytics-core.ts";

test("tool analytics session tracks open only once", () => {
  const trackedEvents: unknown[] = [];
  const session = createToolAnalyticsSession("gss", (event) => trackedEvents.push(event));

  session.trackOpened();
  session.trackOpened();

  assert.deepEqual(trackedEvents, [
    {
      name: "page_view",
      tool: "gss",
      surface: "tool-page",
    },
  ]);
});

test("tool analytics session tracks assessment start only once", () => {
  const trackedEvents: unknown[] = [];
  const session = createToolAnalyticsSession("old-age", (event) => trackedEvents.push(event));

  session.trackFormStarted();
  session.trackFormStarted();
  session.trackFormSubmitted();
  session.trackFormSubmitted();

  assert.deepEqual(trackedEvents, [
    {
      name: "assessment_started",
      tool: "old-age",
      surface: "tool-page",
    },
  ]);
});

test("tool analytics session deduplicates assessment completion by decision id", () => {
  const trackedEvents: unknown[] = [];
  const session = createToolAnalyticsSession("home-care", (event) => trackedEvents.push(event));

  session.trackResultReceived("decision-1", "NEEDS_INFO");
  session.trackResultReceived("decision-1", "NEEDS_INFO");
  session.trackResultReceived("decision-2", "ELIGIBLE");

  assert.deepEqual(trackedEvents, [
    {
      name: "assessment_completed",
      tool: "home-care",
      surface: "result",
      status: "NEEDS_INFO",
    },
    {
      name: "assessment_completed",
      tool: "home-care",
      surface: "result",
      status: "ELIGIBLE",
    },
  ]);
});

test("tool analytics session emits only result primary CTA clicks", () => {
  const trackedEvents: unknown[] = [];
  const session = createToolAnalyticsSession("gss", (event) => trackedEvents.push(event));

  session.trackLinkClick("guidance", "guide", "/gss-gelir-testi/rehber");
  session.trackLinkClick("result", "primary-action", "/gss-gelir-testi/rehber");

  assert.deepEqual(trackedEvents, [
    {
      name: "result_cta_clicked",
      tool: "gss",
      surface: "result",
      target_kind: "primary-action",
      target_href: "/gss-gelir-testi/rehber",
    },
  ]);
});

test("tool analytics session exposes minimized failure events", () => {
  const trackedEvents: unknown[] = [];
  const session = createToolAnalyticsSession("gss", (event) => trackedEvents.push(event));

  session.trackValidationFailed();
  session.trackApiFailed();

  assert.deepEqual(trackedEvents, [
    { name: "assessment_validation_failed", tool: "gss", surface: "tool-page" },
    { name: "assessment_api_failed", tool: "gss", surface: "tool-page" },
  ]);
});
