import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const publicStaticMetadataPages = walk("src/app")
  .filter((path) => path.endsWith("page.tsx"))
  .filter((path) => !path.includes("/admin/"))
  .map((path) => ({ path, source: readFileSync(path, "utf8") }))
  .filter(({ source }) => source.includes("export const metadata"))
  .filter(({ source }) => /alternates\s*:\s*\{[\s\S]*?canonical\s*:/.test(source))
  .filter(({ source }) => !/canonical\s*:\s*["'`]\/["'`]/.test(source))
  .filter(({ source }) => !/robots\s*:\s*\{[\s\S]*?index\s*:\s*false/.test(source));

test("canonical public routes own their social metadata instead of inheriting homepage values", () => {
  const violations = [];

  for (const { path, source } of publicStaticMetadataPages) {
    const missing = [];
    if (!/openGraph\s*:/.test(source)) missing.push("openGraph");
    if (!/twitter\s*:/.test(source)) missing.push("twitter");

    if (missing.length > 0) {
      violations.push(`${path}: missing ${missing.join(", ")}`);
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Route social metadata must not fall back to homepage values:\n${violations.join("\n")}`,
  );
});
