/**
 * Pure publishability and identity rules for Markdown articles.
 *
 * Everything here is fail-closed: anything that is not explicitly publishable is
 * excluded, including malformed input. A missing field never defaults to "safe
 * to publish". No I/O, no `new Date()`, no randomness — the same entries always
 * produce the same routes in the same order, on every machine and every build.
 */
import type { ArticleFrontmatter } from "./article-frontmatter.ts";
import { LEGACY_BLOG_SLUGS } from "./legacy-slugs.ts";

export type ArticleEntry = {
  /** Source file name without extension. The file is NOT the URL authority. */
  fileId: string;
  frontmatter: ArticleFrontmatter;
  body: string;
};

/**
 * An article may be rendered publicly only when ALL of these hold:
 *   verificationState === 'publishable'
 *   status === 'published'
 *   draft === false
 *   noindex === false
 *   reviewer is a non-empty string
 *   legalStatus !== 'unknown'
 *   primarySources is non-empty
 *
 * The redundancy with the schema is deliberate: this is the second, independent
 * gate required by the route, so a schema regression alone cannot publish
 * anything.
 */
export function isPublishableArticle(entry: unknown): boolean {
  const frontmatter = (entry as ArticleEntry | undefined)?.frontmatter;
  if (!frontmatter || typeof frontmatter !== "object") return false;
  const data = frontmatter as Partial<ArticleFrontmatter>;
  return (
    data.verificationState === "publishable" &&
    data.status === "published" &&
    data.draft === false &&
    data.noindex === false &&
    typeof data.reviewer === "string" &&
    data.reviewer.trim().length >= 2 &&
    typeof data.legalStatus === "string" &&
    data.legalStatus !== "unknown" &&
    Array.isArray(data.primarySources) &&
    data.primarySources.length > 0
  );
}

/** Deterministic order: publishedAt descending, ties broken by slug ascending. */
export function sortArticles<T extends ArticleEntry>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => {
    const aTime = Date.parse(a.frontmatter.publishedAt);
    const bTime = Date.parse(b.frontmatter.publishedAt);
    const aValid = !Number.isNaN(aTime);
    const bValid = !Number.isNaN(bTime);
    if (aValid && bValid && aTime !== bTime) return bTime - aTime;
    if (aValid !== bValid) return aValid ? -1 : 1;
    const aSlug = a.frontmatter.slug;
    const bSlug = b.frontmatter.slug;
    return aSlug < bSlug ? -1 : aSlug > bSlug ? 1 : 0;
  });
}

/** Filter + order. The only selector the route and sitemap should need. */
export function selectPublishableArticles<T extends ArticleEntry>(entries: readonly T[]): T[] {
  return sortArticles((entries ?? []).filter((entry) => isPublishableArticle(entry)));
}

/**
 * Collection-level identity invariant.
 *
 * Two files may not claim the same slug (which would silently overwrite a route
 * and lose an article), and no Markdown file may claim one of the nine legacy
 * blog slugs — Next.js static-route precedence is not relied upon as the only
 * defence, because a precedence change would silently shadow a legacy page.
 *
 * Deterministic: collisions are reported sorted.
 */
export function assertUniqueArticleIdentity(entries: readonly ArticleEntry[]): void {
  const bySlug = new Map<string, string[]>();
  const problems: string[] = [];

  for (const entry of entries ?? []) {
    const slug = entry?.frontmatter?.slug;
    if (typeof slug !== "string") continue;
    if (!bySlug.has(slug)) bySlug.set(slug, []);
    bySlug.get(slug)!.push(entry.fileId ?? "<unknown file>");
  }

  for (const [slug, files] of [...bySlug.entries()].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))) {
    if (files.length > 1) {
      problems.push(`  - duplicate slug "${slug}" claimed by: ${[...files].sort().join(", ")}`);
    }
    if (LEGACY_BLOG_SLUGS.includes(slug)) {
      problems.push(
        `  - reserved legacy slug "${slug}" claimed by: ${[...files].sort().join(", ")} — the nine existing /blog pages own these URLs`,
      );
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Article identity collision. Each article must own a unique, non-legacy slug; an overwrite would silently drop content or shadow an existing page.\n${problems.join("\n")}`,
    );
  }
}

/**
 * NO DISCOVERY SELECTOR EXISTS AT THIS STAGE — deliberately.
 *
 * ContentOps `schemas/discovery/discovery-index-document.schema.json` requires a
 * complete `publication_provenance` (`content_id`, `merged_pr_url`,
 * `published_at`), a `content_hash` and `primary_source_ids` before any record
 * may enter a discovery index. None of that data exists yet: it is produced by
 * the Stage 5 human approval record, the Stage 6 verified source events and the
 * Stage 7 draft-PR merge. An `ArticleEntry` alone can never satisfy it.
 *
 * A selector that took `ArticleEntry` and ignored those fields would be a false
 * gate — it would report "eligible" for records that a real discovery index must
 * reject. A selector that always returned an empty list would be dead code that
 * invites the same mistake later. Both were rejected; the function was removed.
 *
 * When discovery is built (after Stages 5–7), its input must be a distinct,
 * fully typed record carrying real publication provenance, and every mandatory
 * provenance field must be validated with a single missing field rejecting the
 * record. Never synthesize a content_hash, content_id or PR URL.
 */
