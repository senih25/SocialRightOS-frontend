import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const openGraphImage = readFileSync("src/app/opengraph-image.tsx", "utf8");
const twitterImage = readFileSync("src/app/twitter-image.tsx", "utf8");
const renderer = readFileSync("src/lib/social-share-image.tsx", "utf8");

for (const [label, source] of [
  ["Open Graph", openGraphImage],
  ["Twitter", twitterImage],
]) {
  test(`${label} share image exports the 1200x630 PNG contract`, () => {
    assert.match(source, /width:\s*1200/);
    assert.match(source, /height:\s*630/);
    assert.ok(source.includes('contentType = "image/png"'));
    assert.ok(source.includes("export const alt ="));
    assert.ok(source.includes("renderSocialShareImage()"));
  });
}

test("shared renderer preserves the D-SHR social identity and scope boundary", () => {
  assert.ok(renderer.includes("Sosyal Hak Rehberi"));
  assert.ok(renderer.includes("by SocialRightLabs"));
  assert.ok(renderer.includes("Resmî karar vermez"));
  assert.ok(renderer.includes('background: "#FDFBF7"'));
  assert.ok(renderer.includes('background: "#0D9488"'));
});
