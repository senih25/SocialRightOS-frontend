/**
 * Deterministic frontmatter parser for a STRICT, EXPLICIT YAML SUBSET.
 *
 * This is not a YAML parser and does not pretend to be one. A machine-generated
 * 21-field header needs a tiny, auditable grammar; YAML's wider feature set
 * (anchors, merge keys, custom tags, implicit typing surprises, multi-line
 * scalars) would be attack and ambiguity surface for no benefit. Anything the
 * grammar below does not cover is a hard error — never a guess.
 *
 * SUPPORTED GRAMMAR
 * -----------------
 * Document:  `---` on its own first line, key/value lines, `---` on its own line,
 *            then the Markdown body.
 * Comments:  a line whose first non-space character is `#`.
 * Keys:      `key: value` at column 0. Indented lines are only legal as block
 *            sequence items. Duplicate keys are rejected.
 * Values:
 *   - Double-quoted string: full JSON string semantics, validated by JSON.parse.
 *     Escapes are exactly JSON's (`\" \\ \/ \b \f \n \r \t \uXXXX`); anything
 *     else (e.g. `\q`, `\x41`) is rejected. Must be terminated, and nothing may
 *     follow the closing quote.
 *   - `true` / `false` / `null` / `~`
 *   - Plain (unquoted) scalar: any text with no quote character in it. URLs keep
 *     their `:` and `//` untouched because plain scalars are taken verbatim.
 *   - Inline array: `[a, b]` — items are parsed with the same scalar rules and
 *     split ONLY on commas outside quotes. An unterminated quote anywhere in the
 *     array is rejected.
 *   - Block sequence: an empty value followed by indented `- item` lines.
 *
 * NOT SUPPORTED (rejected with an explicit error)
 * -----------------------------------------------
 *   - Single-quoted scalars. YAML's `''` escaping is a second, subtly different
 *     quoting dialect; supporting it would double the parser's escape surface for
 *     no gain, since the writer of these files (the ContentOps adapter) emits
 *     double quotes. This is a deliberate, tested decision.
 *   - Nested mappings, multi-line scalars (`|`, `>`), anchors, aliases, tags,
 *     flow mappings (`{}`), and multi-document streams.
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
      const items: unknown[] = [];
      index += 1;
      while (index < headerLines.length && /^\s+-\s*/.test(headerLines[index])) {
        items.push(parseScalar(headerLines[index].replace(/^\s+-\s*/, "").trim(), key));
        index += 1;
      }
      frontmatter[key] = items;
      continue;
    }

    if (rest.startsWith("[")) {
      frontmatter[key] = parseInlineArray(rest, key);
      index += 1;
      continue;
    }

    frontmatter[key] = parseScalar(rest, key);
    index += 1;
  }

  return { frontmatter, body };
}

/**
 * Scans a double-quoted token starting at `start`, honouring backslash escapes.
 * Returns the index just past the closing quote, or -1 when unterminated.
 */
function scanQuoted(input: string, start: number): number {
  const quote = input[start];
  let index = start + 1;
  while (index < input.length) {
    const char = input[index];
    if (char === "\\") {
      // Skip the escaped character; JSON.parse validates whether it is legal.
      index += 2;
      continue;
    }
    if (char === quote) return index + 1;
    index += 1;
  }
  return -1;
}

function parseInlineArray(raw: string, key: string): unknown[] {
  if (!raw.endsWith("]")) throw new Error(`Unterminated inline array for "${key}": ${raw}`);
  const inner = raw.slice(1, -1).trim();
  if (inner === "") return [];
  return splitTopLevel(inner, key).map((item) => parseScalar(item.trim(), key));
}

/**
 * Splits on commas that are OUTSIDE quoted tokens. An unterminated quote is a
 * hard error rather than a "rest of the line is one value" guess — that guess is
 * exactly how `["https://a, "https://b"]` used to slip through.
 */
function splitTopLevel(input: string, key: string): string[] {
  const parts: string[] = [];
  let current = "";
  let index = 0;

  while (index < input.length) {
    const char = input[index];
    if (char === '"' || char === "'") {
      const end = scanQuoted(input, index);
      if (end === -1) {
        throw new Error(`Unterminated ${char === '"' ? "double" : "single"} quote inside the array value for "${key}"`);
      }
      current += input.slice(index, end);
      index = end;
      continue;
    }
    if (char === ",") {
      parts.push(current);
      current = "";
      index += 1;
      continue;
    }
    current += char;
    index += 1;
  }

  parts.push(current);
  return parts;
}

function parseScalar(raw: string, key: string): unknown {
  if (raw === "") return "";

  if (raw.startsWith("'")) {
    throw new Error(
      `Single-quoted scalars are not supported (key "${key}"). Use a double-quoted string: ${raw}`,
    );
  }

  if (raw.startsWith('"')) {
    const end = scanQuoted(raw, 0);
    if (end === -1) throw new Error(`Unterminated double quote in the value for "${key}": ${raw}`);
    if (end !== raw.length) {
      throw new Error(`Unexpected characters after the closing quote for "${key}": ${raw.slice(end)}`);
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      if (typeof parsed !== "string") throw new Error("not a string");
      return parsed;
    } catch {
      // JSON.parse rejects unsupported escapes such as \q or \x41.
      throw new Error(
        `Invalid quoted string for "${key}" (only JSON string escapes are supported: \\" \\\\ \\/ \\b \\f \\n \\r \\t \\uXXXX): ${raw}`,
      );
    }
  }

  // Plain scalar: a quote character here means the author meant to quote and the
  // value is malformed (e.g. a stray closing quote from a broken array item).
  if (raw.includes('"') || raw.includes("'")) {
    throw new Error(`Unexpected quote character in the unquoted value for "${key}": ${raw}`);
  }

  if (raw === "true") return true;
  if (raw === "false") return false;
  if (raw === "null" || raw === "~") return null;
  return raw;
}
