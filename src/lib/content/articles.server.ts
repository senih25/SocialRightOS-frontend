import "server-only";

/**
 * Server-only entry point for the Markdown article loader.
 *
 * `import "server-only"` makes it a build error for any client component to pull
 * this module, so the filesystem code in `articles-loader.ts` can never reach the
 * browser bundle. The logic itself lives in that sibling module so it stays
 * directly testable by the Node test runner.
 */
export { loadArticles, getArticleContentDirectory } from "./articles-loader.ts";
