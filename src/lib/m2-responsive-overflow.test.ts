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
const contactPage = readFileSync(new URL("../app/iletisim/page.tsx", import.meta.url), "utf8");
const globals = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const pilotPages = [gssPage, oldAgePage];
const viewportMatrix = [320, 360, 375, 390, 393, 412, 768, 1440] as const;

function horizontalOverflowPx(clientWidth: number, scrollWidth: number) {
  return Math.max(0, scrollWidth - clientWidth);
}

test("responsive detector enforces zero horizontal overflow at every required viewport", () => {
  for (const viewportWidth of viewportMatrix) {
    assert.equal(horizontalOverflowPx(viewportWidth, viewportWidth), 0);
    assert.ok(horizontalOverflowPx(viewportWidth, viewportWidth + 2) > 1);
  }
});

test("390x844 and 320x568 pilot grids use a zero-minimum mobile track", () => {
  for (const page of pilotPages) {
    assert.match(page, /grid-cols-\[minmax\(0,1fr\)\]/);
    assert.match(page, /w-full min-w-0 max-w-6xl/);
  }
});

test("pilot form, result, and source-link content cannot expand the outer grid track", () => {
  for (const page of pilotPages) {
    assert.match(page, /<section className="card-panel min-w-0">/);
    assert.match(page, /<aside className="min-w-0 space-y-6">/);
    assert.match(page, /data-presentation-outcome=/);
    assert.match(page, /secondary-link/);
  }
});

test("legal long-content routes retain wrapping card layouts", () => {
  const legalRoutes = [
    "../app/gizlilik-ve-kvkk/page.tsx",
    "../app/kullanim-kosullari/page.tsx",
    "../app/yasal-uyari/page.tsx",
    "../app/kaynak-ve-guncellik-politikasi/page.tsx",
  ];

  for (const route of legalRoutes) {
    const source = readFileSync(new URL(route, import.meta.url), "utf8");
    assert.match(source, /card-panel/);
    assert.doesNotMatch(source, /whitespace-nowrap|w-screen|100vw/);
  }

  const privacyPage = readFileSync(
    new URL("../app/gizlilik-ve-kvkk/page.tsx", import.meta.url),
    "utf8",
  );
  assert.match(privacyPage, /space-y-6 break-words/);
});

test("CTA groups remain stackable or wrappable on narrow screens", () => {
  for (const page of pilotPages) {
    assert.match(page, /flex flex-col gap-[34] sm:flex-row/);
    assert.doesNotMatch(page, /whitespace-nowrap/);
  }
});

test("contact channels and narrow section headers cannot widen the viewport", () => {
  assert.match(contactPage, /grid-cols-\[minmax\(0,1fr\)\]/);
  assert.match(contactPage, /card-panel min-w-0/);
  assert.match(contactPage, /break-words/);
  assert.match(
    globals,
    /@media \(max-width: 720px\)[\s\S]*\.section-header \{[\s\S]*flex-direction: column;[\s\S]*align-items: flex-start;/,
  );
});

test("the fix does not mask overflow or alter endpoint and analytics contracts", () => {
  for (const page of pilotPages) {
    assert.doesNotMatch(page, /overflow-x-hidden|overflow-x-clip/);
    assert.match(page, /checkEligibility\(/);
    assert.match(page, /trackFormSubmitted\(\)/);
    assert.match(page, /trackResultReceived\(/);
  }
});
