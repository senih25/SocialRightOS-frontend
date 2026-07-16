import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");
const privacy = read("../app/gizlilik-ve-kvkk/page.tsx");
const terms = read("../app/kullanim-kosullari/page.tsx");
const sourcePolicy = read("../app/kaynak-ve-guncellik-politikasi/page.tsx");
const legalNotice = read("../app/yasal-uyari/page.tsx");
const contact = read("../app/iletisim/page.tsx");
const layout = read("../app/layout.tsx");
const sitemap = read("../app/sitemap.ts");
const gss = read("../app/gss-gelir-testi/GssToolPageClient.tsx");
const oldAge = read("../app/65-yas-ayligi-uygunluk-testi/OldAgeToolPageClient.tsx");
const legalReview = read("../components/ui/LegalReviewNotice.tsx");
const adminStudio = read("../app/admin/studio/page.tsx");

test("legal pages have unique metadata canonical and human review markers", () => {
  const pages = [
    [privacy, "/gizlilik-ve-kvkk"],
    [terms, "/kullanim-kosullari"],
    [sourcePolicy, "/kaynak-ve-guncellik-politikasi"],
  ] as const;

  for (const [page, canonical] of pages) {
    assert.match(page, /title:/);
    assert.match(page, /description:/);
    assert.ok(page.includes(`canonical: "${canonical}"`));
    assert.match(page, /<LegalReviewNotice \/>/);
    assert.doesNotMatch(page, /dangerouslySetInnerHTML/);
  }
  assert.match(legalReview, /HUMAN_LEGAL_REVIEW_REQUIRED/);
  assert.match(legalReview, /data-legal-review="required"/);
});

test("required trust boundaries and sensitive-data warnings are visible", () => {
  const combined = [privacy, terms, sourcePolicy, legalNotice, gss, oldAge].join("\n");
  assert.match(combined, /resmî kurum değildir/);
  assert.match(combined, /kesin hak sahipliği/);
  assert.match(combined, /Nihai kararı ilgili kamu kurumu/);
  assert.match(combined, /Mevzuat.*değişebilir/i);
  for (const page of [privacy, terms, legalNotice, contact, gss, oldAge]) {
    assert.match(page, /özel nitelikli kişisel\s+veri/i);
  }
});

test("footer and sitemap include all legal routes", () => {
  for (const route of [
    "/gizlilik-ve-kvkk",
    "/kullanim-kosullari",
    "/kaynak-ve-guncellik-politikasi",
    "/yasal-uyari",
    "/iletisim",
  ]) {
    assert.ok(layout.includes(`href="${route}"`) || route === "/iletisim");
    assert.ok(sitemap.includes(`"${route}"`));
  }
});

test("external contact links use opener isolation", () => {
  assert.match(contact, /rel=\{channel\.kind === "email" \? undefined : "noopener noreferrer"\}/);
});

test("local storage remains limited to a named admin content draft", () => {
  assert.match(adminStudio, /sosyalhakrehberi-admin-draft/);
  assert.match(adminStudio, /ContentDraft/);
  assert.doesNotMatch(adminStudio, /decision_id|request_id|TC|health|diagnosis/);
});
