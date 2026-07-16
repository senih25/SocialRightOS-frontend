import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const gssPage = readFileSync(
  new URL("../app/gss-gelir-testi/GssToolPageClient.tsx", import.meta.url),
  "utf8",
);
const oldAgePage = readFileSync(
  new URL("../app/65-yas-ayligi-uygunluk-testi/OldAgeToolPageClient.tsx", import.meta.url),
  "utf8",
);
const safeErrorPanel = readFileSync(
  new URL("../components/ui/SafeErrorPanel.tsx", import.meta.url),
  "utf8",
);
const globalError = readFileSync(new URL("../app/error.tsx", import.meta.url), "utf8");
const loading = readFileSync(new URL("../app/loading.tsx", import.meta.url), "utf8");
const notFound = readFileSync(new URL("../app/not-found.tsx", import.meta.url), "utf8");
const globals = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("pilot forms prevent duplicate submissions and announce loading", () => {
  for (const page of [gssPage, oldAgePage]) {
    assert.match(page, /if \(isSubmitting\) \{\s*return;/);
    assert.match(page, /disabled=\{isSubmitting\}/);
    assert.match(page, /aria-busy=\{isSubmitting\}/);
  }
});

test("validation fields are associated with safe error descriptions", () => {
  for (const page of [gssPage, oldAgePage]) {
    assert.match(page, /aria-invalid=\{Boolean\(/);
    assert.match(page, /aria-describedby=\{/);
    assert.match(page, /findFieldError\(/);
    assert.doesNotMatch(page, /Object\.entries\(fieldErrors\)/);
  }
});

test("safe error surfaces are focusable live regions without technical output", () => {
  assert.match(safeErrorPanel, /role="alert"/);
  assert.match(safeErrorPanel, /aria-live="assertive"/);
  assert.match(safeErrorPanel, /tabIndex=\{-1\}/);
  assert.doesNotMatch(safeErrorPanel, /correlation|stack|digest/);
  assert.match(globalError, /data-global-error/);
  assert.doesNotMatch(globalError, /error\.message|error\.stack|error\.digest/);
});

test("global empty and loading states plus visible focus remain mobile-safe", () => {
  assert.match(loading, /aria-busy="true"/);
  assert.match(notFound, /href="\/"/);
  assert.match(globalError, /px-6/);
  assert.match(notFound, /px-6/);
  assert.match(globals, /\.primary-button:focus-visible/);
  assert.match(globals, /outline: 3px solid/);
});

test("pilot route endpoint payload CTA analytics and presentation contracts remain in place", () => {
  assert.match(gssPage, /buildGssPayload\(form, crypto\.randomUUID\(\)\)/);
  assert.match(oldAgePage, /buildOldAgePayload\(form, crypto\.randomUUID\(\)\)/);
  for (const page of [gssPage, oldAgePage]) {
    assert.match(page, /checkEligibility\(/);
    assert.match(page, /trackFormSubmitted\(\)/);
    assert.match(page, /trackResultReceived\(/);
    assert.match(page, /presentation\?\.outcome === "UNAVAILABLE"/);
    assert.match(page, /aria-live="polite"/);
  }
});
