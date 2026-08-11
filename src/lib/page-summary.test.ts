import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { buildAccessiblePageSummary } from "./page-summary.ts";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("builds a deterministic bounded summary from page metadata", () => {
  const summary = buildAccessiblePageSummary({
    title: "  Evde   Bakım Maaşı  ",
    description: ` Başvuru ${"koşulları ".repeat(80)}`,
  });

  assert.equal(summary?.title, "Evde Bakım Maaşı");
  assert.equal(summary?.description.length, 500);
  assert.match(summary?.speechText ?? "", /^Evde Bakım Maaşı\. Başvuru koşulları/u);
});

test("fails closed when neither title nor description exists", () => {
  assert.equal(buildAccessiblePageSummary({ title: " ", description: null }), null);
});

test("founder route is removed and permanently redirected", () => {
  assert.equal(existsSync(new URL("../app/senih-bayankulu/page.tsx", import.meta.url)), false);
  assert.doesNotMatch(read("../app/sitemap.ts"), /"\/senih-bayankulu"/u);
  assert.match(read("../../next.config.ts"), /source: "\/senih-bayankulu"[\s\S]*permanent: true/u);
});

test("global layout exposes the summary control without a founder navigation link", () => {
  const layout = read("../app/layout.tsx");
  assert.match(layout, /<PageSummaryGuide \/>/u);
  assert.doesNotMatch(layout, /label: "Kurucu"/u);
  assert.doesNotMatch(layout, /founder\.profilePath/u);
});

test("brand graph declares accessibility support without a removed profile URL", () => {
  const seo = read("./seo-json.ts");
  assert.match(seo, /accessibilitySummary:/u);
  assert.match(seo, /accessModeSufficient:/u);
  assert.match(seo, /new URL\("\/#founder"/u);
  assert.doesNotMatch(seo, /founder\.profilePath/u);
});
