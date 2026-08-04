import type { MetadataRoute } from "next";

import { selectPublishableArticles, type ArticleEntry } from "./publishability.ts";

/**
 * Sitemap projection for Markdown articles.
 *
 * Only publishable articles are projected. The nine quarantined legacy /blog
 * pages are not in this collection at all and are not added anywhere else, so
 * they remain absent from the sitemap.
 *
 * `lastModified` comes ONLY from the validated `updatedAt` frontmatter value —
 * never from a build timestamp, `new Date()` or filesystem mtime, so rebuilding
 * cannot fabricate freshness. Entries with an unparsable date are omitted rather
 * than stamped with today.
 */
export function buildArticleSitemapEntries(
  entries: readonly ArticleEntry[],
  siteUrl: URL,
): MetadataRoute.Sitemap {
  const seen = new Set<string>();
  const projected: MetadataRoute.Sitemap = [];

  for (const entry of selectPublishableArticles(entries)) {
    const url = new URL(`/blog/${entry.frontmatter.slug}`, siteUrl).toString();
    if (seen.has(url)) continue;
    seen.add(url);

    const lastModified = new Date(entry.frontmatter.updatedAt);
    if (Number.isNaN(lastModified.getTime())) continue;

    projected.push({ url, lastModified, changeFrequency: "monthly", priority: 0.7 });
  }

  return projected;
}
