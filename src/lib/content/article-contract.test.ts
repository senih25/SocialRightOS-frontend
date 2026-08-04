import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  isRfc3339Date,
  isRfc3339DateTime,
  SLUG_PATTERN,
  validateArticleFrontmatter,
  type ArticleFrontmatter,
} from "./article-frontmatter.ts";
import { parseFrontmatterFile } from "./frontmatter-parse.ts";
import {
  UPSTREAM_CONTRACT,
  UPSTREAM_DATE_TIME_FIELDS,
  UPSTREAM_ENUMS,
  UPSTREAM_REQUIRED,
  canonicalize,
  semanticDigest,
  upstreamSnapshot,
} from "./upstream-contract.ts";

/**
 * Behaviour tests for the article frontmatter contract.
 *
 * The real validator is executed against object fixtures; nothing here is
 * satisfied by a regex over a source file. The ContentOps compatibility gate has
 * three layers: snapshot integrity (always), a fixture matrix DERIVED from the
 * snapshot proving no upstream rule was silently relaxed (always), and a live
 * digest comparison against the sibling repository when it is reachable.
 */

const baseArticle: ArticleFrontmatter = Object.freeze({
  title: "Evde bakım maaşı başvurusunda kaynak doğrulama notu",
  slug: "kaynak-dogrulama-notu",
  description:
    "Evde bakım maaşı başvuru koşullarına ilişkin iddiaların hangi resmî kaynaklarla doğrulandığını ve hangi durumlarda yayımlanmadığını açıklayan yöntem notu.",
  publishedAt: "2026-08-01T09:00:00.000Z",
  updatedAt: "2026-08-02T09:00:00.000Z",
  status: "draft",
  author: "Senih Bayankulu",
  reviewer: null,
  jurisdiction: "TR",
  benefitOrRight: "Evde bakım maaşı",
  contentType: "guide",
  legalStatus: "guidance",
  effectiveDate: null,
  sourceCheckedAt: "2026-08-02T09:00:00.000Z",
  primarySources: ["https://www.aile.gov.tr/ornek-duyuru"],
  secondarySources: [],
  aiAssistance: "Taslak yapay zeka desteğiyle hazırlandı, tüm iddialar insan tarafından doğrulandı.",
  disclaimer: "Bu içerik bilgilendirme amaçlıdır ve resmî bir karar veya hukuki tavsiye değildir.",
  draft: true,
  noindex: true,
  verificationState: "quarantined",
});

const article = (overrides: Partial<ArticleFrontmatter> = {}): Record<string, unknown> => ({
  ...baseArticle,
  ...overrides,
});

const publishableFixture = article({
  slug: "yayimlanabilir-ornek",
  status: "published",
  reviewer: "Senih Bayankulu",
  draft: false,
  noindex: false,
  legalStatus: "in_force",
  verificationState: "publishable",
  effectiveDate: "2026-01-01",
});

const accepts = (value: unknown) => {
  const result = validateArticleFrontmatter(value);
  assert.equal(result.success, true, `expected accept, got ${JSON.stringify("issues" in result ? result.issues : [])}`);
};

const rejects = (value: unknown, expectedPath?: string) => {
  const result = validateArticleFrontmatter(value);
  assert.equal(result.success, false, "expected rejection but value was accepted");
  if (expectedPath && !result.success) {
    const paths = result.issues.map((issue) => issue.path);
    assert.ok(paths.includes(expectedPath), `expected an issue on "${expectedPath}", got ${JSON.stringify(paths)}`);
  }
};

// ---------------------------------------------------------------- positive ---
test("valid quarantined draft is accepted", () => accepts(article()));

test("valid publishable article is accepted", () => accepts(publishableFixture));

test("valid RFC 3339 date-times with offsets are accepted", () =>
  accepts(
    article({
      publishedAt: "2026-08-01T09:00:00+03:00",
      updatedAt: "2026-08-02T09:00:00+03:00",
      sourceCheckedAt: "2026-08-02T09:00:00+03:00",
    }),
  ));

test("valid effectiveDate is accepted", () => {
  accepts(article({ effectiveDate: "2026-03-01" }));
  accepts(article({ effectiveDate: "2024-02-29" })); // real leap day
});

test("multiple distinct https sources are accepted", () =>
  accepts(
    article({
      primarySources: ["https://www.aile.gov.tr/a", "https://www.resmigazete.gov.tr/b"],
      secondarySources: ["https://ornek.gov.tr/c"],
    }),
  ));

// ---------------------------------------------------------------- negative ---
test("noindex=false without publishable verificationState is rejected", () =>
  rejects(article({ noindex: false, status: "published", draft: false, reviewer: "X Y", legalStatus: "in_force" }), "verificationState"));

test("publishable with reviewer=null is rejected", () =>
  rejects({ ...publishableFixture, reviewer: null }, "reviewer"));

test("publishable with legalStatus=unknown is rejected", () =>
  rejects({ ...publishableFixture, legalStatus: "unknown" }, "legalStatus"));

test("publishable with draft=true is rejected", () =>
  rejects({ ...publishableFixture, draft: true }, "draft"));

test("publishable with status!=published is rejected", () =>
  rejects({ ...publishableFixture, status: "review" }, "status"));

test("archived content cannot be indexable", () =>
  rejects(article({ status: "archived", draft: false, noindex: false, verificationState: "archived" }), "noindex"));

test("date-only value in a date-time field is rejected", () => {
  for (const field of UPSTREAM_DATE_TIME_FIELDS) {
    rejects(article({ [field]: "2026-08-01" } as Partial<ArticleFrontmatter>), field);
    rejects(article({ [field]: "2026-08-01 09:00:00" } as Partial<ArticleFrontmatter>), field);
    rejects(article({ [field]: "2026-08-01T09:00:00" } as Partial<ArticleFrontmatter>), field);
  }
});

test("invalid effectiveDate values are rejected", () => {
  for (const bad of ["2026-02-29", "2026-02-30", "2026-13-01", "01-01-2026", "2026-08-01T09:00:00Z", ""]) {
    rejects(article({ effectiveDate: bad }), "effectiveDate");
  }
});

test("updatedAt earlier than publishedAt is rejected", () =>
  rejects(article({ publishedAt: "2026-08-02T09:00:00.000Z", updatedAt: "2026-08-01T09:00:00.000Z" }), "updatedAt"));

test("http sources are rejected in both lists", () => {
  rejects(article({ primarySources: ["http://www.aile.gov.tr/a"] }), "primarySources");
  rejects(article({ secondarySources: ["http://ornek.gov.tr/c"] }), "secondarySources");
});

test("empty primarySources is rejected", () => rejects(article({ primarySources: [] }), "primarySources"));

test("duplicate sources are rejected", () => {
  rejects(article({ primarySources: ["https://a.gov.tr/1", "https://a.gov.tr/1"] }), "primarySources");
  rejects(article({ secondarySources: ["https://b.gov.tr/1", "https://b.gov.tr/1"] }), "secondarySources");
});

test("a URL present in both primary and secondary lists is rejected", () =>
  rejects(
    article({ primarySources: ["https://a.gov.tr/1"], secondarySources: ["https://a.gov.tr/1"] }),
    "secondarySources",
  ));

test("draft=true with noindex=false is rejected", () => rejects(article({ noindex: false }), "noindex"));

test("invalid slugs are rejected", () => {
  for (const bad of ["Buyuk-Harf", "bosluk var", "-bas-tire", "son-tire-"]) rejects(article({ slug: bad }), "slug");
  assert.equal(SLUG_PATTERN.test("gecerli-slug-2"), true);
});

test("unknown frontmatter fields are rejected", () => rejects({ ...article(), sponsored: true }, "sponsored"));

test("missing required fields are rejected", () => {
  for (const field of UPSTREAM_REQUIRED) {
    const fixture = { ...article() } as Record<string, unknown>;
    delete fixture[field];
    rejects(fixture, field);
  }
});

test("RFC 3339 helpers accept only real values", () => {
  for (const good of ["2026-08-01T09:00:00Z", "2026-08-01T09:00:00.123Z", "2026-08-01T09:00:00-05:30"])
    assert.equal(isRfc3339DateTime(good), true, `rejected valid: ${good}`);
  for (const bad of ["2026-08-01", "2026-08-01 09:00:00", "2026-08-01T09:00", "20260801T090000Z", "", null, 42, "2026-12-31T23:59:60Z"])
    assert.equal(isRfc3339DateTime(bad), false, `accepted invalid: ${JSON.stringify(bad)}`);
  assert.equal(isRfc3339Date("2026-01-01"), true);
  assert.equal(isRfc3339Date("2026-02-30"), false);
});

// ------------------------------------------------- upstream contract gate ---
test("committed snapshot matches the approved semantic digest", () => {
  assert.equal(
    semanticDigest(upstreamSnapshot),
    UPSTREAM_CONTRACT.digest,
    "The committed upstream snapshot no longer matches its approved digest. HUMAN REVIEW REQUIRED.",
  );
});

test("canonicalize sorts object keys but preserves array order", () => {
  assert.equal(JSON.stringify(canonicalize({ b: 1, a: 2 })), '{"a":2,"b":1}');
  assert.equal(JSON.stringify(canonicalize(["b", "a"])), '["b","a"]');
  assert.equal(semanticDigest({ a: 1, b: [1, 2] }), semanticDigest({ b: [1, 2], a: 1 }));
  assert.notEqual(semanticDigest({ a: [1, 2] }), semanticDigest({ a: [2, 1] }));
});

test("snapshot provenance is complete", () => {
  for (const field of ["repository", "path", "commit", "observedOn", "digest", "snapshotPath"] as const)
    assert.ok(UPSTREAM_CONTRACT[field], `missing provenance field: ${field}`);
  assert.match(UPSTREAM_CONTRACT.commit, /^[0-9a-f]{40}$/);
  assert.match(UPSTREAM_CONTRACT.digest, /^[0-9a-f]{64}$/);
});

test("site validator enforces every upstream enum without drift", () => {
  for (const [field, values] of Object.entries(UPSTREAM_ENUMS)) {
    const snapshotEnum = (upstreamSnapshot.properties as Record<string, { enum?: string[] }>)[field].enum!;
    assert.deepEqual([...values], [...snapshotEnum], `${field} enum drift`);
    rejects(article({ [field]: "__not_in_contract__" } as Partial<ArticleFrontmatter>), field);
  }
});

test("site validator enforces upstream additionalProperties:false", () => {
  assert.equal(upstreamSnapshot.additionalProperties, false);
  rejects({ ...article(), extraField: "x" }, "extraField");
});

test("site validator enforces upstream type constraints", () => {
  const wrongTypes: Record<string, unknown> = {
    title: 42,
    slug: 42,
    description: 42,
    author: 42,
    benefitOrRight: 42,
    aiAssistance: 42,
    disclaimer: 42,
    draft: "yes",
    noindex: "no",
    primarySources: "https://a.gov.tr/1",
    secondarySources: "https://a.gov.tr/1",
    publishedAt: 20260801,
    reviewer: 42,
  };
  for (const [field, value] of Object.entries(wrongTypes)) {
    rejects({ ...article(), [field]: value }, field);
  }
});

test("site validator enforces upstream minLength/maxLength bounds", () => {
  const properties = upstreamSnapshot.properties as Record<string, { minLength?: number; maxLength?: number }>;
  assert.equal(properties.title.minLength, 10);
  assert.equal(properties.title.maxLength, 160);
  assert.equal(properties.description.minLength, 50);
  assert.equal(properties.description.maxLength, 300);
  assert.equal(properties.disclaimer.minLength, 20);
  rejects(article({ title: "kısa" }), "title");
  rejects(article({ title: "a".repeat(161) }), "title");
  rejects(article({ description: "kısa açıklama" }), "description");
  rejects(article({ description: "a".repeat(301) }), "description");
  rejects(article({ disclaimer: "kısa" }), "disclaimer");
  rejects(article({ aiAssistance: "yok" }), "aiAssistance");
  rejects(article({ benefitOrRight: "a" }), "benefitOrRight");
  rejects(article({ author: "a" }), "author");
});

test("site validator enforces upstream pattern constraints", () => {
  const properties = upstreamSnapshot.properties as Record<string, { pattern?: string; items?: { pattern?: string } }>;
  assert.equal(properties.slug.pattern, "^[a-z0-9]+(?:-[a-z0-9]+)*$");
  assert.equal(properties.primarySources.items?.pattern, "^https://");
  assert.equal(properties.secondarySources.items?.pattern, "^https://");
  rejects(article({ primarySources: ["ftp://a.gov.tr/1"] }), "primarySources");
});

test("live upstream digest equals the approved digest when the sibling repo is reachable", () => {
  const candidate = join(
    process.cwd(),
    "..",
    "..",
    "socialrightlabs-contentops",
    "schemas",
    "content",
    "frontmatter-nextjs.schema.json",
  );
  if (!existsSync(candidate)) {
    // Skipped on machines without the sibling checkout; the snapshot digest gate
    // and the derived fixture matrix above still run.
    return;
  }
  const liveDigest = semanticDigest(JSON.parse(readFileSync(candidate, "utf8")));
  assert.equal(
    liveDigest,
    UPSTREAM_CONTRACT.digest,
    `UPSTREAM CONTRACT DRIFT DETECTED. live=${liveDigest} approved=${UPSTREAM_CONTRACT.digest} (approved commit ${UPSTREAM_CONTRACT.commit}). Do NOT adapt silently: review the ContentOps change, then update snapshot, digest and commit together.`,
  );
});

// ----------------------------------------------------- frontmatter parsing ---
test("frontmatter parser reads scalars, arrays and body deterministically", () => {
  const parsed = parseFrontmatterFile(
    ['---', 'title: "Bir başlık"', "draft: true", "reviewer: null", 'topics: ["a", "b"]', "sources:", "  - https://a.gov.tr/1", "---", "", "# Gövde", ""].join("\n"),
  );
  assert.equal(parsed.frontmatter.title, "Bir başlık");
  assert.equal(parsed.frontmatter.draft, true);
  assert.equal(parsed.frontmatter.reviewer, null);
  assert.deepEqual(parsed.frontmatter.topics, ["a", "b"]);
  assert.deepEqual(parsed.frontmatter.sources, ["https://a.gov.tr/1"]);
  assert.equal(parsed.body.startsWith("# Gövde"), true);
});

test("frontmatter parser rejects malformed input instead of guessing", () => {
  assert.throws(() => parseFrontmatterFile("no frontmatter here"), /must start with/);
  assert.throws(() => parseFrontmatterFile("---\ntitle: x\n"), /not closed/);
  assert.throws(() => parseFrontmatterFile("---\ntitle: a\ntitle: b\n---\n"), /Duplicate/);
});
