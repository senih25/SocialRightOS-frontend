/**
 * Markdown trust boundary for `content/articles/*.md`.
 *
 * The article body is untrusted input: it arrives through an automated pipeline
 * and is only human-approved later. A `<script>` block or a `javascript:` link
 * must never reach the public HTML, and it must never be silently stripped
 * either — silent sanitization hides a pipeline defect and leaves the author
 * believing their text shipped intact.
 *
 * Design:
 * - AST-based, not regex-based: the body is parsed to MDAST with
 *   `mdast-util-from-markdown`, pinned as a DIRECT dependency. Nothing here
 *   relies on a package being present by accident as a transitive dependency.
 * - Allowlist, not denylist: only the node types below may appear. Anything
 *   unknown — including `html` (raw HTML), `mdxjsEsm`, `mdxFlowExpression`,
 *   `mdxJsxFlowElement` — is a violation.
 * - Fail loudly: violations raise an error that breaks the test/build.
 * - Deterministic: same input, same findings, same order. No I/O, no dates.
 */
import { fromMarkdown } from "mdast-util-from-markdown";

export type TrustFinding = { type: string; detail: string };

/** Node types an article body may contain. Anything else is rejected. */
const ALLOWED_NODE_TYPES = new Set([
  "root",
  "paragraph",
  "heading",
  "text",
  "strong",
  "emphasis",
  "delete",
  "inlineCode",
  "code",
  "blockquote",
  "list",
  "listItem",
  "link",
  "linkReference",
  "definition",
  "thematicBreak",
  "break",
]);

/** Protocols that must never appear in an article link or image. */
const FORBIDDEN_PROTOCOLS = new Set(["javascript", "data", "vbscript", "file", "blob"]);

/** Explicitly allowed protocols for absolute URLs. `http:` is a downgrade and is rejected. */
const ALLOWED_PROTOCOLS = new Set(["https", "mailto"]);

/**
 * Normalizes a URL for protocol inspection, defeating the usual obfuscations:
 * HTML entities (`&#106;`, `&#x6A;`, `&colon;`), percent-encoding, embedded
 * whitespace/control characters (NUL, tab, newline, U+2028/U+2029, other Unicode
 * spaces) and case variation.
 */
export function normalizeUrlForProtocolCheck(raw: unknown): string {
  let value = String(raw ?? "");

  value = value
    .replace(/&#x([0-9a-f]+);?/gi, (_, hex: string) => safeFromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);?/g, (_, dec: string) => safeFromCodePoint(Number.parseInt(dec, 10)))
    .replace(/&colon;?/gi, ":")
    .replace(/&Tab;?/gi, "\t")
    .replace(/&NewLine;?/gi, "\n");

  try {
    value = decodeURIComponent(value);
  } catch {
    /* keep the partially decoded value */
  }

  value = value.replace(
    /[\u0000-\u0020\u007f-\u00a0\u1680\u2000-\u200f\u2028\u2029\u202f\u205f\u3000\ufeff]/g,
    "",
  );

  return value.toLowerCase();
}

function safeFromCodePoint(code: number): string {
  if (!Number.isFinite(code) || code < 0 || code > 0x10ffff) return "";
  try {
    return String.fromCodePoint(code);
  } catch {
    return "";
  }
}

/** Extracts the scheme of an absolute URL, or null for relative/anchor URLs. */
export function protocolOf(normalized: string): string | null {
  const match = /^([a-z][a-z0-9+.-]*):/.exec(normalized);
  return match ? match[1] : null;
}

export type UrlVerdict = { ok: true } | { ok: false; reason: string };

/**
 * Allowed: site-relative paths (`/blog/x`), anchors (`#bolum`), relative paths,
 * `https:` and `mailto:`. Everything else is rejected, including `http:` and
 * protocol-relative `//host` (which hides the destination scheme).
 */
export function classifyUrl(rawUrl: unknown): UrlVerdict {
  const normalized = normalizeUrlForProtocolCheck(rawUrl);
  if (normalized === "") return { ok: false, reason: "empty URL" };

  const protocol = protocolOf(normalized);
  if (protocol === null) {
    if (normalized.startsWith("//")) return { ok: false, reason: "protocol-relative URL" };
    return { ok: true };
  }
  if (FORBIDDEN_PROTOCOLS.has(protocol)) return { ok: false, reason: `forbidden protocol "${protocol}:"` };
  if (!ALLOWED_PROTOCOLS.has(protocol)) return { ok: false, reason: `disallowed protocol "${protocol}:"` };
  return { ok: true };
}

type MdastNode = { type: string; url?: unknown; value?: unknown; children?: MdastNode[] };

function collectFindings(tree: MdastNode): TrustFinding[] {
  const findings: TrustFinding[] = [];

  const visit = (node: MdastNode) => {
    if (!node || typeof node !== "object") return;

    if (node.type === "html") {
      const snippet = String(node.value ?? "").replace(/\s+/g, " ").slice(0, 120);
      findings.push({ type: "raw-html", detail: snippet });
    } else if (node.type === "image" || node.type === "imageReference") {
      // Images are not part of the MVP content model; an image would also be an
      // untrusted remote reference on a page about people's benefits.
      findings.push({ type: "disallowed-node", detail: `"${node.type}" is not allowed in article bodies` });
    } else if (!ALLOWED_NODE_TYPES.has(node.type)) {
      findings.push({ type: "disallowed-node", detail: `"${node.type}" is not an allowed Markdown node type` });
    }

    if (node.type === "link" || node.type === "definition") {
      const verdict = classifyUrl(node.url);
      if (!verdict.ok) findings.push({ type: "unsafe-link-url", detail: `${String(node.url)} — ${verdict.reason}` });
    }

    for (const child of node.children ?? []) visit(child);
  };

  visit(tree);
  return findings;
}

/** Parses an article body and returns every trust-boundary finding. Does not throw. */
export function findMarkdownTrustViolations(body: string): TrustFinding[] {
  const tree = fromMarkdown(String(body ?? "")) as unknown as MdastNode;
  return collectFindings(tree);
}

/** Throws when an article body contains raw HTML, a disallowed node or an unsafe URL. */
export function assertSafeArticleMarkdown(body: string, context: { id?: string } = {}): void {
  const findings = findMarkdownTrustViolations(body);
  if (findings.length === 0) return;
  const where = context.id ? ` in article "${context.id}"` : "";
  const detail = findings.map((finding) => `  - [${finding.type}] ${finding.detail}`).join("\n");
  throw new Error(
    `Markdown trust boundary violation${where}. Content is never sanitized silently; fix the source file.\n${detail}`,
  );
}

/** Parses a body to MDAST after asserting it is safe. Used by the renderer. */
export function parseSafeArticleMarkdown(body: string, context: { id?: string } = {}): MdastNode {
  assertSafeArticleMarkdown(body, context);
  return fromMarkdown(String(body ?? "")) as unknown as MdastNode;
}

export type { MdastNode };
