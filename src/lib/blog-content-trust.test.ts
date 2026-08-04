import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { LEGACY_BLOG_SLUGS } from "./content/legacy-slugs.ts";

const blogRoot = join(process.cwd(), "src", "app", "blog");

// Only STATIC route directories are audited legacy pages. Dynamic segments such
// as `[slug]` (the Markdown article route added in Stage 4) are not legacy pages:
// they render validated Markdown, own no page source of their own, and their
// content is gated by the article contract instead of this audit.
const blogPageDirectories = readdirSync(blogRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .filter((entry) => !entry.name.startsWith("[") && !entry.name.startsWith("("))
  .map((entry) => entry.name);

const blogPages = blogPageDirectories
  .map((name) => join(blogRoot, name, "page.tsx"))
  .filter((path) => existsSync(path));

test("audited blog inventory contains nine pages", () => {
  assert.equal(blogPages.length, 9);
});

test("the audited nine are exactly the reserved legacy slugs", () => {
  assert.deepEqual([...blogPageDirectories].sort(), [...LEGACY_BLOG_SLUGS].sort());
});

test("the dynamic Markdown route exists and is excluded from the legacy audit", () => {
  assert.equal(existsSync(join(blogRoot, "[slug]", "page.tsx")), true);
  assert.equal(blogPageDirectories.includes("[slug]"), false);
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
