import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const canonicalOrigin = "https://www.sosyalhakrehberi.com/";
const llmsSources = [
  "public/llms.txt",
  "src/app/llms.txt/route.ts",
];

function assertCanonicalSignals(path) {
  const content = readFileSync(path, "utf8");

  assert.ok(
    content.includes(`Canonical site: ${canonicalOrigin}`),
    `${path} canonical site must use the www host`,
  );
  assert.ok(
    content.includes(`Preferred citation URL: ${canonicalOrigin}`),
    `${path} preferred citation URL must use the www host`,
  );
  assert.ok(
    content.includes("- Website: www.sosyalhakrehberi.com"),
    `${path} related-entity website must use the www host`,
  );
  assert.equal(
    content.includes("https://sosyalhakrehberi.com/"),
    false,
    `${path} must not emit the apex origin as a canonical or citation signal`,
  );
}

test("all llms.txt sources use the canonical www host", () => {
  for (const path of llmsSources) {
    assertCanonicalSignals(path);
  }
});

test("apex requests redirect to the canonical www host without changing unrelated paths", () => {
  const config = readFileSync("next.config.ts", "utf8");
  assert.match(config, /source: "\\/:path\\*"/);
  assert.ok(config.includes('has: [{ type: "host", value: "sosyalhakrehberi.com" }]'));
  assert.ok(config.includes('destination: "https://www.sosyalhakrehberi.com/:path*"'));
  assert.ok(config.includes("permanent: true"));
});
