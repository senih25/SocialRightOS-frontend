/**
 * Minimal, deterministic YAML-subset frontmatter parser.
 *
 * Only the shapes the article contract actually uses are supported: quoted and
 * unquoted scalars, booleans, `null`, and single-line or block string arrays.
 * Anything else is a parse error rather than a guess.
 *
 * A full YAML parser is deliberately NOT used: YAML's wider feature set (anchors,
 * merge keys, custom tags, implicit typing surprises) is unnecessary attack and
 * ambiguity surface for a machine-generated 21-field header, and it would add a
 * dependency for no safety gain.
 *
 * Pure: no filesystem access, no dates, no randomness.
 */

export type ParsedFile = { frontmatter: Record<string, unknown>; body: string };

const FRONTMATTER_DELIMITER = "---";

export function parseFrontmatterFile(raw: string): ParsedFile {
  const text = String(raw ?? "").replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const lines = text.split("\n");

  if (lines[0]?.trim() !== FRONTMATTER_DELIMITER) {
    throw new Error("Article file must start with a `---` frontmatter block");
  }
  const closingIndex = lines.findIndex((line, index) => index > 0 && line.trim() === FRONTMATTER_DELIMITER);
  if (closingIndex === -1) throw new Error("Article frontmatter block is not closed with `---`");

  const headerLines = lines.slice(1, closingIndex);
  const body = lines.slice(closingIndex + 1).join("\n").replace(/^\n+/, "");

  const frontmatter: Record<string, unknown> = {};
  let index = 0;
  while (index < headerLines.length) {
    const line = headerLines[index];
    if (line.trim() === "" || line.trimStart().startsWith("#")) {
      index += 1;
      continue;
    }
    if (/^\s/.test(line)) throw new Error(`Unexpected indentation in frontmatter: ${line}`);

    const separator = line.indexOf(":");
    if (separator === -1) throw new Error(`Malformed frontmatter line (missing ":"): ${line}`);

    const key = line.slice(0, separator).trim();
    if (key === "") throw new Error(`Malformed frontmatter line (empty key): ${line}`);
    if (key in frontmatter) throw new Error(`Duplicate frontmatter key "${key}"`);
    const rest = line.slice(separator + 1).trim();

    if (rest === "") {
      // Block sequence: subsequent "  - value" lines.
      const items: unknown[] = [];
      index += 1;
      while (index < headerLines.length && /^\s+-\s*/.test(headerLines[index])) {
        items.push(parseScalar(headerLines[index].replace(/^\s+-\s*/, "").trim()));
        index += 1;
      }
      frontmatter[key] = items;
      continue;
    }

    if (rest.startsWith("[")) {
      frontmatter[key] = parseInlineArray(rest);
      index += 1;
      continue;
    }

    frontmatter[key] = parseScalar(rest);
    index += 1;
  }

  return { frontmatter, body };
}

function parseInlineArray(raw: string): unknown[] {
  if (!raw.endsWith("]")) throw new Error(`Unterminated inline array in frontmatter: ${raw}`);
  const inner = raw.slice(1, -1).trim();
  if (inner === "") return [];
  return splitTopLevel(inner).map((item) => parseScalar(item.trim()));
}

/** Splits on commas that are not inside quotes. */
function splitTopLevel(input: string): string[] {
  const parts: string[] = [];
  let current = "";
  let quote: string | null = null;
  for (const char of input) {
    if (quote) {
      if (char === quote) quote = null;
      current += char;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if (char === ",") {
      parts.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  parts.push(current);
  return parts;
}

function parseScalar(raw: string): unknown {
  if (raw === "") return "";
  if ((raw.startsWith('"') && raw.endsWith('"') && raw.length > 1) || (raw.startsWith("'") && raw.endsWith("'") && raw.length > 1)) {
    const inner = raw.slice(1, -1);
    return raw.startsWith('"') ? inner.replace(/\\"/g, '"').replace(/\\\\/g, "\\") : inner;
  }
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (raw === "null" || raw === "~") return null;
  return raw;
}
