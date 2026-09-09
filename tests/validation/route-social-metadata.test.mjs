import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const rootLayout = readFileSync("src/app/layout.tsx", "utf8");

function extractObject(source, key) {
  const start = source.indexOf(`${key}: {`);
  assert.notEqual(start, -1, `${key} metadata must exist`);

  let depth = 0;
  let opened = false;
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (character === "{") {
      depth += 1;
      opened = true;
    } else if (character === "}") {
      depth -= 1;
      if (opened && depth === 0) {
        return source.slice(start, index + 1);
      }
    }
  }

  assert.fail(`Could not parse ${key} metadata object`);
}

const rootOpenGraph = extractObject(rootLayout, "openGraph");
const rootTwitter = extractObject(rootLayout, "twitter");

test("root layout exposes only route-safe shared Open Graph metadata", () => {
  assert.match(rootOpenGraph, /type:\s*"website"/);
  assert.match(rootOpenGraph, /locale:\s*"tr_TR"/);
  assert.match(rootOpenGraph, /siteName:\s*"Dijital Sosyal Hak Rehberi"/);

  assert.equal(/\btitle\s*:/.test(rootOpenGraph), false, "route title must not leak from root Open Graph");
  assert.equal(
    /\bdescription\s*:/.test(rootOpenGraph),
    false,
    "route description must not leak from root Open Graph",
  );
  assert.equal(/\burl\s*:/.test(rootOpenGraph), false, "homepage URL must not leak into child Open Graph");
});

test("root layout exposes only the route-safe shared Twitter card contract", () => {
  assert.match(rootTwitter, /card:\s*"summary_large_image"/);
  assert.equal(/\btitle\s*:/.test(rootTwitter), false, "route title must not leak from root Twitter metadata");
  assert.equal(
    /\bdescription\s*:/.test(rootTwitter),
    false,
    "route description must not leak from root Twitter metadata",
  );
});

test("route-sensitive social metadata is not owned by the root layout", () => {
  assert.equal(rootLayout.includes("url: siteUrl"), false);
  assert.equal(
    rootLayout.includes('openGraph: {\n    title: "Dijital Sosyal Hak Rehberi"'),
    false,
  );
  assert.equal(
    rootLayout.includes('twitter: {\n    card: "summary_large_image",\n    title:'),
    false,
  );
});
