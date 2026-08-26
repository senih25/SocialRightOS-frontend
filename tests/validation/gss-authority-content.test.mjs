import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = readFileSync("src/app/gss-gelir-testi/page.tsx", "utf8");
const guide = readFileSync("src/app/gss-gelir-testi/GssAuthorityGuide.tsx", "utf8");

test("GSS authority guide links to primary public sources", () => {
  assert.match(
    guide,
    /https:\/\/www\.aile\.gov\.tr\/sss\/sosyal-yardimlar-genel-mudurlugu\/genel-saglik-sigortasi\//,
  );
  assert.match(guide, /https:\/\/www\.turkiye\.gov\.tr\/ashb-gelir-testi-sonucu-sorgulama/);
  assert.match(guide, /https:\/\/www\.turkiye\.gov\.tr\/sgk-gss-borc-dokumu/);
  assert.match(guide, /https:\/\/www\.csgb\.gov\.tr\/tr\/poco-pages\/asgari-ucret\//);
});

test("GSS guide preserves the strict 2026 one-third boundary", () => {
  assert.match(guide, /33\.030 TL/);
  assert.match(guide, /11\.010 TL/);
  assert.match(guide, /11\.010 TL&apos;nin altı G0; 11\.010 TL ve üzeri G1/);
});

test("GSS guide clearly limits the local tool to preliminary guidance", () => {
  assert.match(guide, /yalnız sınırlı bilgilerle bir ön/);
  assert.match(guide, /Resmî SYD gelir tespitindeki bütün/);
  assert.match(guide, /resmî uygunluk kararı/);
});

test("GSS page exposes FAQ schema and focused metadata", () => {
  assert.match(page, /GSS gelir testi: başvuru ve ön değerlendirme/);
  assert.match(page, /buildFaqJsonLd\(gssAuthorityFaq\)/);
  assert.match(page, /id="gss-faq-jsonld"/);
});
