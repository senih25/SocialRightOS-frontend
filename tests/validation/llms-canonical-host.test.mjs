import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const llmsPath = "public/llms.txt";
const canonicalOrigin = "https://www.sosyalhakrehberi.com/";

test("llms.txt uses the canonical www host for machine-readable site signals", () => {
  const content = readFileSync(llmsPath, "utf8");

  assert.ok(
    content.includes(`Canonical site: ${canonicalOrigin}`),
    "llms.txt canonical site must use the www host",
  );
  assert.ok(
    content.includes(`Preferred citation URL: ${canonicalOrigin}`),
    "llms.txt preferred citation URL must use the www host",
  );
  assert.ok(
    content.includes("- Website: www.sosyalhakrehberi.com"),
    "llms.txt related-entity website must use the www host",
  );
  assert.equal(
    content.includes("https://sosyalhakrehberi.com/"),
    false,
    "llms.txt must not emit the apex origin as a canonical or citation signal",
  );
});
