import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { validateArticleFrontmatter } from "./article-frontmatter.ts";
import { parseFrontmatterFile } from "./frontmatter-parse.ts";
import { assertSafeArticleMarkdown } from "./markdown-trust.ts";
import { assertUniqueArticleIdentity, type ArticleEntry } from "./publishability.ts";

/**
 * Markdown article loader (pure logic).
 *
 * This module holds the loading logic and is directly testable. The application
 * must import it through `articles.server.ts`, which adds the `server-only`
 * guard so filesystem code can never reach the browser bundle.
 *
 * Fail-closed by design: a file that does not validate, or that violates the
 * Markdown trust boundary, or that collides with another article or a legacy
 * slug, throws and breaks the build. Nothing is skipped silently, because a
 * silently skipped article is an article whose absence nobody notices.
 *
 * Only `.md` is loaded. `.mdx` is out of scope on purpose: MDX bodies are
 * executable JavaScript, and content that arrives from an automated pipeline
 * must not be able to execute. Enabling MDX later requires its own security
 * decision (see docs/content-architecture.md).
 *
 * No date, mtime or build timestamp is ever read: publication dates come only
 * from validated frontmatter.
 */

const CONTENT_DIRECTORY = join(process.cwd(), "content", "articles");

export function getArticleContentDirectory(): string {
  return CONTENT_DIRECTORY;
}

/** Reads, validates and trust-checks every article. Throws on any violation. */
export function loadArticles(directory: string = CONTENT_DIRECTORY): ArticleEntry[] {
  if (!existsSync(directory)) return [];

  const fileNames = readdirSync(directory)
    .filter((name) => !name.startsWith("."))
    .sort();

  const rejectedMdx = fileNames.filter((name) => name.toLowerCase().endsWith(".mdx"));
  if (rejectedMdx.length > 0) {
    throw new Error(
      `MDX is not supported in the article layer: ${rejectedMdx.join(", ")}. ` +
        "Article bodies must be plain Markdown so they cannot execute code.",
    );
  }

  const markdownFiles = fileNames.filter((name) => name.toLowerCase().endsWith(".md"));
  const unknownFiles = fileNames.filter((name) => !name.toLowerCase().endsWith(".md"));
  if (unknownFiles.length > 0) {
    throw new Error(`Unexpected non-Markdown files in content/articles: ${unknownFiles.join(", ")}`);
  }

  const entries: ArticleEntry[] = markdownFiles.map((fileName) => {
    const fileId = fileName.replace(/\.md$/i, "");
    const raw = readFileSync(join(directory, fileName), "utf8");
    const parsed = parseFrontmatterFile(raw);

    const result = validateArticleFrontmatter(parsed.frontmatter);
    if (!result.success) {
      const detail = result.issues.map((issue) => `  - ${issue.path || "(root)"}: ${issue.message}`).join("\n");
      throw new Error(`Invalid article frontmatter in "${fileName}":\n${detail}`);
    }

    // The body is untrusted until proven safe; this throws on any violation.
    assertSafeArticleMarkdown(parsed.body, { id: fileName });

    return { fileId, frontmatter: result.data, body: parsed.body };
  });

  // Collection-level gate over EVERY entry, including quarantined ones: a
  // colliding or reserved slug must break the build before anyone approves it.
  assertUniqueArticleIdentity(entries);

  return entries;
}
