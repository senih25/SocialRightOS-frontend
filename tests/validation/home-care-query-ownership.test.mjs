import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const calculatorHref = 'href="/evde-bakim-maasi/hesaplama"';
const pages = [
  "src/app/evde-bakim-maasi/page.tsx",
  "src/app/evde-bakim-maasi/sartlar/page.tsx",
  "src/app/evde-bakim-maasi/gelir-ve-hane-bilgisi/page.tsx",
];

test("home-care intent pages link directly to the calculator landing page", () => {
  for (const page of pages) {
    const source = readFileSync(page, "utf8");
    assert.ok(source.includes(calculatorHref), `${page} must link to the calculator URL`);
  }
});

test("home-care intent pages do not use the generic start route as their primary CTA", () => {
  for (const page of pages) {
    const source = readFileSync(page, "utf8");
    assert.equal(
      source.includes('href="/start" className="primary-link"'),
      false,
      `${page} must not send its primary CTA to /start`,
    );
  }
});
