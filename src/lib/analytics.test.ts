import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAnalyticsEnvelope,
  trackAnalyticsEvent,
  type AnalyticsEnvelope,
} from "./analytics.ts";
import { analyticsRegistry } from "./analytics-registry.ts";

test("buildAnalyticsEnvelope returns only allowed result fields", () => {
  assert.deepEqual(buildAnalyticsEnvelope({
    name: "assessment_completed",
    tool: "gss",
    surface: "result",
    status: "NEEDS_INFO",
  }), {
    event: "assessment_completed",
    tool: "gss",
    surface: "result",
    status: "NEEDS_INFO",
  });
});

test("buildAnalyticsEnvelope includes guide target information", () => {
  assert.deepEqual(buildAnalyticsEnvelope({
    name: "result_cta_clicked",
    tool: "old-age",
    surface: "result",
    target_kind: "primary-action",
    target_href: "/65-yas-ayligi-uygunluk-testi/rehber",
  }), {
    event: "result_cta_clicked",
    tool: "old-age",
    surface: "result",
    target_kind: "primary-action",
    target_href: "/65-yas-ayligi-uygunluk-testi/rehber",
  });
});

test("trackAnalyticsEvent dispatches a browser event and pushes strings to dataLayer", () => {
  const dispatchedEvents: AnalyticsEnvelope[] = [];
  const dataLayer: Array<Record<string, string>> = [];
  const originalWindow = globalThis.window;

  const fakeWindow = {
    dataLayer,
    dispatchEvent: (event: Event) => {
      const customEvent = event as CustomEvent<AnalyticsEnvelope>;
      dispatchedEvents.push(customEvent.detail);
      return true;
    },
  } as Window & { dataLayer: Array<Record<string, string>> };

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: fakeWindow,
  });

  try {
    trackAnalyticsEvent({
      name: "assessment_completed",
      tool: "home-care",
      surface: "result",
      status: "ELIGIBLE",
    });
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
  }

  assert.equal(dispatchedEvents.length, 1);
  assert.deepEqual(dispatchedEvents[0], {
    event: "assessment_completed",
    tool: "home-care",
    surface: "result",
    status: "ELIGIBLE",
  });
  assert.deepEqual(dataLayer[0], {
    event: "assessment_completed",
    tool: "home-care",
    surface: "result",
    status: "ELIGIBLE",
  });
});

test("trackAnalyticsEvent is a safe no-op on the server", () => {
  const originalWindow = globalThis.window;

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: undefined,
  });

  try {
    assert.doesNotThrow(() =>
      trackAnalyticsEvent({
        name: "assessment_started",
        tool: "gss",
        surface: "tool-page",
      }),
    );
  } finally {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: originalWindow,
    });
  }
});

test("analytics envelope drops names, contact details, answers and raw payloads", () => {
  const event = {
    name: "assessment_completed",
    tool: "gss",
    surface: "result",
    status: "ELIGIBLE",
    fullName: "Kişi Adı",
    phone: "+90 555 000 00 00",
    email: "person@example.invalid",
    answers: { income: 1 },
    payload: { raw: true },
  } as unknown as Parameters<typeof buildAnalyticsEnvelope>[0];

  assert.deepEqual(buildAnalyticsEnvelope(event), {
    event: "assessment_completed",
    tool: "gss",
    surface: "result",
    status: "ELIGIBLE",
  });
});

test("analytics strips CTA query and fragment values and rejects external targets", () => {
  assert.equal(
    buildAnalyticsEnvelope({
      name: "result_cta_clicked",
      tool: "gss",
      surface: "result",
      target_kind: "primary-action",
      target_href: "/rehber?email=person@example.invalid#private",
    }).target_href,
    "/rehber",
  );
  assert.equal(
    buildAnalyticsEnvelope({
      name: "result_cta_clicked",
      tool: "gss",
      surface: "result",
      target_kind: "primary-action",
      target_href: "https://example.invalid/private",
    }).target_href,
    "/",
  );
});

test("analytics registry contains only the controlled beta allowlist", () => {
  assert.deepEqual(
    analyticsRegistry.map((entry) => entry.event_name),
    [
      "page_view",
      "assessment_started",
      "assessment_completed",
      "assessment_validation_failed",
      "assessment_api_failed",
      "result_cta_clicked",
      "feedback_opened",
    ],
  );
  assert.equal(analyticsRegistry.every((entry) => entry.enabled), true);
});
