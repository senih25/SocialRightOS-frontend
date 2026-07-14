import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const blogRoot = join(process.cwd(), "src", "app", "blog");

const blogPages = readdirSync(blogRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join(blogRoot, entry.name, "page.tsx"))
  .filter((path) => existsSync(path));

test("audited blog inventory contains nine pages", () => {
  assert.equal(blogPages.length, 9);
});

test("unverified blog pages remain excluded from indexing", () => {
  for (const path of blogPages) {
    const content = readFileSync(path, "utf8");

    assert.match(content, /robots:\s*\{/);
    assert.match(content, /index:\s*false/);
    assert.match(content, /follow:\s*false/);
  }
});

test("blog pages contain no placeholder DOI records", () => {
  for (const path of blogPages) {
    const content = readFileSync(path, "utf8");

    assert.doesNotMatch(content, /10\.xxxx/i);
    assert.doesNotMatch(content, /doi\.org\/10\.xxxx/i);
  }
});

test("unverified pages do not claim scholarly status", () => {
  for (const path of blogPages) {
    const content = readFileSync(path, "utf8");

    assert.doesNotMatch(content, /ScholarlyArticle/);
    assert.doesNotMatch(content, /Akademik Analiz/);
    assert.doesNotMatch(
      content,
      /Akademik Kaynakça ve Mevzuat/,
    );
    assert.match(content, /"@type": "Article"/);
  }
});
