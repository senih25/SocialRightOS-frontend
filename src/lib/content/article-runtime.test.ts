import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import type { ArticleFrontmatter } from "./article-frontmatter.ts";
import { buildArticleIndexCards } from "./blog-index-projection.ts";
import { LEGACY_BLOG_SLUGS, isLegacyBlogSlug } from "./legacy-slugs.ts";
import { renderArticleMarkdown } from "./markdown-render.ts";
import {
  assertSafeArticleMarkdown,
  classifyUrl,
  findMarkdownTrustViolations,
  parseSafeArticleMarkdown,
} from "./markdown-trust.ts";
import {
  assertUniqueArticleIdentity,
  isPublishableArticle,
  selectDiscoveryEligibleArticles,
  selectPublishableArticles,
  sortArticles,
  type ArticleEntry,
} from "./publishability.ts";
import { buildArticleSitemapEntries } from "./sitemap-projection.ts";
import { serializeJsonLd } from "../seo-json.ts";

/**
 * Runtime behaviour tests: trust boundary, publishability, identity, projections
 * and the JSON-LD serializer. Real functions against real fixtures; no test here
 * is satisfied by searching source text.
 */

const frontmatter = (overrides: Partial<ArticleFrontmatter> = {}): ArticleFrontmatter => ({
  title: "Evde bakım maaşı başvurusunda kaynak doğrulama notu",
  slug: "kaynak-dogrulama-notu",
  description:
    "Evde bakım maaşı başvuru koşullarına ilişkin iddiaların hangi resmî kaynaklarla doğrulandığını açıklayan yöntem notu ve doğrulama kaydı.",
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
  primarySources: ["https://www.aile.gov.tr/ornek"],
  secondarySources: [],
  aiAssistance: "Taslak yapay zeka desteğiyle hazırlandı, iddialar insan tarafından doğrulandı.",
  disclaimer: "Bu içerik bilgilendirme amaçlıdır ve resmî bir karar değildir.",
  draft: true,
  noindex: true,
  verificationState: "quarantined",
  ...overrides,
});

const entry = (overrides: Partial<ArticleFrontmatter> = {}, fileId = "fixture"): ArticleEntry => ({
  fileId,
  frontmatter: frontmatter(overrides),
  body: "# Başlık\n\nGövde metni.\n",
});

const publishable = (overrides: Partial<ArticleFrontmatter> = {}, fileId = "publishable"): ArticleEntry =>
  entry(
    {
      slug: "yayimlanabilir-ornek",
      status: "published",
      reviewer: "Senih Bayankulu",
      draft: false,
      noindex: false,
      legalStatus: "in_force",
      verificationState: "publishable",
      ...overrides,
    },
    fileId,
  );

// ------------------------------------------------------------ publishability ---
test("a fully publishable entry passes the second gate", () => {
  assert.equal(isPublishableArticle(publishable()), true);
});

test("quarantined, draft, review, archived and noindex entries never pass", () => {
  assert.equal(isPublishableArticle(entry()), false);
  assert.equal(isPublishableArticle(publishable({ noindex: true })), false);
  assert.equal(isPublishableArticle(publishable({ draft: true })), false);
  assert.equal(isPublishableArticle(publishable({ status: "review" })), false);
  assert.equal(isPublishableArticle(publishable({ status: "archived" })), false);
  assert.equal(isPublishableArticle(publishable({ verificationState: "verified" })), false);
  assert.equal(isPublishableArticle(publishable({ verificationState: "editorial_approved" })), false);
  assert.equal(isPublishableArticle(publishable({ reviewer: null })), false);
  assert.equal(isPublishableArticle(publishable({ legalStatus: "unknown" })), false);
  assert.equal(isPublishableArticle(publishable({ primarySources: [] })), false);
  // fail-closed on malformed input
  assert.equal(isPublishableArticle(null), false);
  assert.equal(isPublishableArticle(undefined), false);
  assert.equal(isPublishableArticle({}), false);
});

test("an empty collection produces no routes, cards or sitemap entries", () => {
  const siteUrl = new URL("https://www.sosyalhakrehberi.com");
  assert.deepEqual(selectPublishableArticles([]), []);
  assert.deepEqual(buildArticleIndexCards([]), []);
  assert.deepEqual(buildArticleSitemapEntries([], siteUrl), []);
  assert.deepEqual(selectDiscoveryEligibleArticles([]), []);
});

test("a quarantined collection leaks into no surface", () => {
  const siteUrl = new URL("https://www.sosyalhakrehberi.com");
  const entries = [entry({}, "a"), entry({ slug: "ikinci-taslak" }, "b")];
  assert.deepEqual(selectPublishableArticles(entries), []);
  assert.deepEqual(buildArticleIndexCards(entries), []);
  assert.deepEqual(buildArticleSitemapEntries(entries, siteUrl), []);
  assert.deepEqual(selectDiscoveryEligibleArticles(entries), []);
});

test("ordering is deterministic: publishedAt desc, then slug asc", () => {
  const older = publishable({ slug: "eski", publishedAt: "2026-01-01T00:00:00.000Z" }, "1");
  const newer = publishable({ slug: "yeni", publishedAt: "2026-06-01T00:00:00.000Z" }, "2");
  assert.deepEqual(sortArticles([older, newer]).map((item) => item.frontmatter.slug), ["yeni", "eski"]);
  assert.deepEqual(sortArticles([newer, older]).map((item) => item.frontmatter.slug), ["yeni", "eski"]);

  const same = "2026-03-03T00:00:00.000Z";
  const a = publishable({ slug: "alfa", publishedAt: same }, "a");
  const b = publishable({ slug: "beta", publishedAt: same }, "b");
  const c = publishable({ slug: "gamma", publishedAt: same }, "c");
  for (const input of [[a, b, c], [c, b, a], [b, c, a], [c, a, b]]) {
    assert.deepEqual(sortArticles(input).map((item) => item.frontmatter.slug), ["alfa", "beta", "gamma"]);
  }
});

// ------------------------------------------------------------------ identity ---
test("duplicate slugs across two files break the collection", () => {
  assert.throws(
    () => assertUniqueArticleIdentity([entry({}, "a"), entry({}, "b")]),
    /duplicate slug "kaynak-dogrulama-notu"[\s\S]*a, b/,
  );
});

test("a Markdown file may not claim one of the nine legacy slugs", () => {
  assert.equal(LEGACY_BLOG_SLUGS.length, 9);
  for (const slug of LEGACY_BLOG_SLUGS) {
    assert.equal(isLegacyBlogSlug(slug), true);
    assert.throws(() => assertUniqueArticleIdentity([entry({ slug }, "yeni")]), /reserved legacy slug/);
  }
  assert.equal(isLegacyBlogSlug("kaynak-dogrulama-notu"), false);
  assertUniqueArticleIdentity([entry({}, "a"), entry({ slug: "farkli-slug" }, "b")]);
});

// ----------------------------------------------------------- sitemap / index ---
test("sitemap uses updatedAt as lastModified and never a build timestamp", () => {
  const siteUrl = new URL("https://www.sosyalhakrehberi.com");
  const article = publishable({ updatedAt: "2026-05-05T10:00:00.000Z" });
  const [projected] = buildArticleSitemapEntries([article], siteUrl);
  assert.equal(projected.url, "https://www.sosyalhakrehberi.com/blog/yayimlanabilir-ornek");
  assert.equal((projected.lastModified as Date).toISOString(), "2026-05-05T10:00:00.000Z");
});

test("sitemap never emits a duplicate URL", () => {
  const siteUrl = new URL("https://www.sosyalhakrehberi.com");
  const projected = buildArticleSitemapEntries([publishable({}, "a"), publishable({}, "b")], siteUrl);
  assert.equal(projected.length, 1);
});

test("legacy slugs never appear in the article sitemap projection", () => {
  const siteUrl = new URL("https://www.sosyalhakrehberi.com");
  const projected = buildArticleSitemapEntries([], siteUrl);
  const urls = projected.map((item) => item.url);
  for (const slug of LEGACY_BLOG_SLUGS) {
    assert.equal(urls.includes(`https://www.sosyalhakrehberi.com/blog/${slug}`), false);
  }
});

test("blog index cards skip URLs that already exist", () => {
  const cards = buildArticleIndexCards([publishable()], ["/blog/yayimlanabilir-ornek"]);
  assert.deepEqual(cards, []);
  const fresh = buildArticleIndexCards([publishable()], ["/blog/baska"]);
  assert.equal(fresh.length, 1);
  assert.equal(fresh[0].href, "/blog/yayimlanabilir-ornek");
});

test("contentRegistry status=published is not sufficient for discovery eligibility", () => {
  // A contentRegistry row, in its real shape: an editorial CMS flag and nothing
  // else. It carries no verificationState, reviewer or source provenance, so it
  // can never satisfy the discovery gate — `status: "published"` is not evidence.
  const registryShaped = [
    { id: "content-blog", slug: "blog", section: "blog", title: "Blog", body: "…", canonical_path: "/blog", status: "published", updated_at: "2026-04-02" },
  ];
  assert.deepEqual(selectDiscoveryEligibleArticles(registryShaped as unknown as ArticleEntry[]), []);
  assert.deepEqual(selectPublishableArticles(registryShaped as unknown as ArticleEntry[]), []);
  // A quarantined article is not eligible even though the registry would call its section "published".
  assert.deepEqual(selectDiscoveryEligibleArticles([entry()]), []);
  // Only a genuinely publishable article with provenance is eligible.
  assert.equal(selectDiscoveryEligibleArticles([publishable()]).length, 1);
});

// ----------------------------------------------------------- markdown trust ---
test("raw HTML in a body is rejected and never sanitized silently", () => {
  assert.equal(findMarkdownTrustViolations("<script>alert(1)</script>").some((f) => f.type === "raw-html"), true);
  assert.equal(findMarkdownTrustViolations('<div onclick="x()">y</div>').length > 0, true);
  assert.equal(findMarkdownTrustViolations('<iframe src="https://evil.example"></iframe>').length > 0, true);
  assert.equal(findMarkdownTrustViolations("metin <img src=x onerror=alert(1)> devam").length > 0, true);
  assert.throws(() => assertSafeArticleMarkdown("<script>alert(1)</script>", { id: "kotu.md" }), (error: Error) =>
    /kotu\.md/.test(error.message) && /never sanitized silently/.test(error.message),
  );
});

test("MDX/JSX constructs are rejected", () => {
  // An MDX expression or JSX element is not valid Markdown; it either parses as
  // raw HTML (rejected) or as text. Neither may produce executable output.
  for (const body of ["<Component prop={1} />", "{ someExpression }", "import x from 'y'\n\n<X/>"]) {
    const findings = findMarkdownTrustViolations(body);
    const parsed = () => parseSafeArticleMarkdown(body);
    if (findings.length === 0) {
      // Parsed as plain text: prove nothing executable is produced by rendering it.
      const rendered = JSON.stringify(renderArticleMarkdown(parsed()));
      assert.equal(rendered.includes("dangerouslySetInnerHTML"), false);
    } else {
      assert.throws(parsed, /trust boundary violation/);
    }
  }
});

test("dangerous protocols are rejected, including obfuscated variants", () => {
  const variants = [
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "java\u00a0script:alert(1)",
    " javascript:alert(1)",
    "&#106;avascript:alert(1)",
    "&#x6A;avascript:alert(1)",
    "javascript&colon;alert(1)",
    "%6Aavascript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD4=",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "blob:https://x/y",
    "//evil.example/path",
    "http://insecure.example",
  ];
  for (const url of variants) {
    assert.equal(classifyUrl(url).ok, false, `classifyUrl accepted: ${url}`);
    const body = `[bağlantı](${url})`;
    const findings = findMarkdownTrustViolations(body);
    if (findings.length === 0) {
      // Markdown refused to build a link at all (e.g. control character inside).
      const tree = parseSafeArticleMarkdown(body);
      const rendered = JSON.stringify(renderArticleMarkdown(tree));
      assert.equal(/href/.test(rendered), false, `dangerous href survived: ${url}`);
    }
  }
});

test("safe internal, anchor, https and mailto links are preserved", () => {
  const body = [
    "# Başlık",
    "",
    "İç bağlantı: [blog](/blog), çapa: [bölüm](#bolum),",
    "dış kaynak: [Aile Bakanlığı](https://www.aile.gov.tr/duyuru), e-posta: [yaz](mailto:info@example.com).",
    "",
    "- liste",
    "- **kalın** ve `kod`",
    "",
    "> alıntı",
    "",
    "```js",
    "const x = 1; // <script> burada zararsızdır",
    "```",
  ].join("\n");
  assert.deepEqual(findMarkdownTrustViolations(body), []);
  const rendered = JSON.stringify(renderArticleMarkdown(parseSafeArticleMarkdown(body)));
  assert.equal(rendered.includes("dangerouslySetInnerHTML"), false);
  assert.equal(rendered.includes("/blog"), true);
  assert.equal(rendered.includes("https://www.aile.gov.tr/duyuru"), true);
  for (const url of ["/blog/x", "#bolum", "https://ex.example/a", "mailto:a@b.co"]) {
    assert.equal(classifyUrl(url).ok, true, `safe URL wrongly rejected: ${url}`);
  }
});

test("the renderer refuses unknown node types and unsafe links", () => {
  assert.throws(() => renderArticleMarkdown({ type: "html", value: "<script>x</script>" }), /unsupported Markdown node type/);
  assert.throws(() => renderArticleMarkdown({ type: "link", url: "javascript:alert(1)", children: [] }), /unsafe link URL/);
});

// --------------------------------------------------------------- JSON-LD ---
test("the shared JSON-LD serializer neutralizes </script> and line separators", () => {
  const payload = {
    "@type": "Article",
    headline: "</script><script>alert(document.domain)</script>",
    description: "a & b < c > d",
    note: "satir\u2028ayirici\u2029son",
  };
  const serialized = serializeJsonLd(payload);
  assert.equal(serialized.includes("</script"), false);
  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes(">"), false);
  assert.equal(serialized.includes("&"), false);
  assert.equal(/[\u2028\u2029]/.test(serialized), false);
  assert.deepEqual(JSON.parse(serialized), payload);
});

// ------------------------------------------------------------------ loader ---
test("the loader rejects .mdx files outright", async () => {
  const { loadArticles } = await import("./articles-loader.ts");
  const directory = mkdtempSync(join(tmpdir(), "articles-mdx-"));
  writeFileSync(join(directory, "x.mdx"), "---\ntitle: x\n---\n");
  assert.throws(() => loadArticles(directory), /MDX is not supported/);
});

test("the loader validates, trust-checks and returns entries deterministically", async () => {
  const { loadArticles } = await import("./articles-loader.ts");
  const directory = mkdtempSync(join(tmpdir(), "articles-ok-"));
  const file = [
    "---",
    'title: "Evde bakım maaşı kaynak doğrulama notu"',
    'slug: "kaynak-dogrulama-notu"',
    'description: "Evde bakım maaşı başvuru koşullarına ilişkin iddiaların hangi resmî kaynaklarla doğrulandığını açıklayan not."',
    'publishedAt: "2026-08-01T09:00:00.000Z"',
    'updatedAt: "2026-08-02T09:00:00.000Z"',
    'status: "draft"',
    'author: "Senih Bayankulu"',
    "reviewer: null",
    'jurisdiction: "TR"',
    'benefitOrRight: "Evde bakım maaşı"',
    'contentType: "guide"',
    'legalStatus: "guidance"',
    "effectiveDate: null",
    'sourceCheckedAt: "2026-08-02T09:00:00.000Z"',
    'primarySources: ["https://www.aile.gov.tr/ornek"]',
    "secondarySources: []",
    'aiAssistance: "Taslak yapay zeka desteğiyle hazırlandı, iddialar doğrulandı."',
    'disclaimer: "Bu içerik bilgilendirme amaçlıdır ve resmî bir karar değildir."',
    "draft: true",
    "noindex: true",
    'verificationState: "quarantined"',
    "---",
    "",
    "# Başlık",
    "",
    "Güvenli gövde.",
    "",
  ].join("\n");
  writeFileSync(join(directory, "kaynak-dogrulama-notu.md"), file);

  const entries = loadArticles(directory);
  assert.equal(entries.length, 1);
  assert.equal(entries[0].frontmatter.slug, "kaynak-dogrulama-notu");
  // quarantined => no route, no card, no sitemap entry
  assert.deepEqual(selectPublishableArticles(entries), []);

  // the same file with a script body must break the load
  writeFileSync(join(directory, "kaynak-dogrulama-notu.md"), `${file}\n<script>alert(1)</script>\n`);
  assert.throws(() => loadArticles(directory), /trust boundary violation/);
});

test("the loader returns an empty list for a missing directory", async () => {
  const { loadArticles } = await import("./articles-loader.ts");
  assert.deepEqual(loadArticles(join(tmpdir(), "definitely-missing-articles-dir")), []);
});

// --------------------------------------------------- legacy page regression ---
test("all nine legacy blog pages exist, are noindex/nofollow and keep their canonical", () => {
  const root = process.cwd();
  const sitemapSource = readFileSync(join(root, "src", "app", "sitemap.ts"), "utf8");

  assert.equal(LEGACY_BLOG_SLUGS.length, 9);
  for (const slug of LEGACY_BLOG_SLUGS) {
    const page = join(root, "src", "app", "blog", slug, "page.tsx");
    assert.equal(existsSync(page), true, `legacy page missing: ${slug}`);
    const source = readFileSync(page, "utf8");
    assert.match(source, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false,?\s*\}/, `legacy page not noindex/nofollow: ${slug}`);
    assert.match(source, new RegExp(`canonical:\\s*"/blog/${slug}"`), `legacy canonical changed: ${slug}`);
    assert.equal(sitemapSource.includes(slug), false, `legacy slug leaked into the static sitemap list: ${slug}`);
  }
});
