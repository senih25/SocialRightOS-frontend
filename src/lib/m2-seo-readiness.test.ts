import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

const publicRoutes = [
  ["../app/gss-gelir-testi/page.tsx", "/gss-gelir-testi", "../app/gss-gelir-testi/GssToolPageClient.tsx"],
  ["../app/65-yas-ayligi-uygunluk-testi/page.tsx", "/65-yas-ayligi-uygunluk-testi", "../app/65-yas-ayligi-uygunluk-testi/OldAgeToolPageClient.tsx"],
  ["../app/gizlilik-ve-kvkk/page.tsx", "/gizlilik-ve-kvkk", null],
  ["../app/kullanim-kosullari/page.tsx", "/kullanim-kosullari", null],
  ["../app/kaynak-ve-guncellik-politikasi/page.tsx", "/kaynak-ve-guncellik-politikasi", null],
] as const;

test("critical public routes expose unique metadata and canonicals", () => {
  const titles = new Set<string>();
  for (const [path, route, contentPath] of publicRoutes) {
    const page = read(path);
    const title = page.match(/title:\s*["`]([^"`]+)["`]/)?.[1];
    assert.ok(title, `${route} title missing`);
    assert.equal(titles.has(title), false, `${route} title duplicated`);
    titles.add(title);
    assert.match(page, /description:/);
    assert.ok(page.includes(`canonical: "${route}"`), `${route} canonical missing`);
    assert.match(contentPath ? read(contentPath) : page, /<h1/);
  }
});

test("robots and sitemap keep preview closed and admin excluded", () => {
  const robots = read("../app/robots.ts");
  const sitemap = read("../app/sitemap.ts");
  assert.match(robots, /if \(!allowIndexing\)/);
  assert.match(robots, /disallow: \["\/", "\/admin"\]/);
  assert.match(robots, /disallow: "\/admin"/);
  assert.doesNotMatch(sitemap, /"\/admin"/);
  for (const [, route] of publicRoutes) assert.ok(sitemap.includes(`"${route}"`));
});

test("global metadata contains Open Graph and Twitter cards", () => {
  const layout = read("../app/layout.tsx");
  assert.match(layout, /openGraph:/);
  assert.match(layout, /twitter:/);
  assert.match(layout, /summary_large_image/);
  assert.match(layout, /data-release=\{runtimeMarker\.release\}/);
});
