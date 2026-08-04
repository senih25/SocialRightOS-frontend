import { selectPublishableArticles, type ArticleEntry } from "./publishability.ts";

/**
 * Blog index projection for Markdown articles.
 *
 * The existing legacy cards (built from `contentRegistry`) are unchanged; this
 * only produces ADDITIONAL cards, and only for publishable Markdown articles.
 *
 * `contentRegistry.status === "published"` is an editorial CMS flag. It is NOT
 * evidence of source verification or indexability and is never used to decide
 * whether a Markdown article may be listed — hence this function does not read
 * the registry at all. `existingHrefs` is passed in only so the same URL cannot
 * be rendered twice.
 */
export type BlogIndexCard = {
  href: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
};

export function buildArticleIndexCards(
  entries: readonly ArticleEntry[],
  existingHrefs: readonly string[] = [],
): BlogIndexCard[] {
  const taken = new Set(existingHrefs);
  const cards: BlogIndexCard[] = [];

  for (const entry of selectPublishableArticles(entries)) {
    const href = `/blog/${entry.frontmatter.slug}`;
    if (taken.has(href)) continue;
    taken.add(href);
    cards.push({
      href,
      title: entry.frontmatter.title,
      description: entry.frontmatter.description,
      publishedAt: entry.frontmatter.publishedAt,
      updatedAt: entry.frontmatter.updatedAt,
    });
  }

  return cards;
}
