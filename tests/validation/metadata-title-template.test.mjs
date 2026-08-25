import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const rootLayout = readFileSync("src/app/layout.tsx", "utf8");
const startPage = readFileSync("src/app/start/page.tsx", "utf8");
const birthGrantPage = readFileSync(
  "src/app/dogum-yardimi-uygunluk-testi/page.tsx",
  "utf8",
);

test("root layout owns the D-SHR title suffix", () => {
  assert.ok(
    rootLayout.includes('template: "%s | D-SHR"'),
    "root metadata must remain the single owner of the D-SHR title suffix",
  );
});

test("start page does not duplicate the root title suffix", () => {
  assert.ok(
    startPage.includes('title: "Evde bakım maaşı başlangıcı"'),
    "start page must expose the unsuffixed route title",
  );
  assert.equal(
    startPage.includes('title: "Evde bakım maaşı başlangıcı | D-SHR"'),
    false,
    "start page must not embed the root D-SHR suffix",
  );
});

test("birth grant page does not duplicate the root title suffix", () => {
  const unsuffixedTitleMatches = birthGrantPage.match(
    /title: "Doğum yardımı ön değerlendirme"/g,
  );

  assert.equal(
    unsuffixedTitleMatches?.length,
    2,
    "birth grant metadata and Open Graph title must both use the unsuffixed route title",
  );
  assert.equal(
    birthGrantPage.includes('title: "Doğum yardımı ön değerlendirme | D-SHR"'),
    false,
    "birth grant page must not embed the root D-SHR suffix",
  );
});
