import assert from "node:assert/strict";
import test from "node:test";
import { serializeJsonLd } from "./seo-json.ts";

test("serializes JSON-LD without allowing a script-closing sequence", () => {
  const payload = {
    name: "</script><script>alert('xss')</script>",
    description: "A&B > C\u2028D\u2029E",
  };
  const serialized = serializeJsonLd(payload);

  assert.equal(serialized.includes("<"), false);
  assert.equal(serialized.includes(">"), false);
  assert.equal(serialized.includes("&"), false);
  assert.equal(serialized.includes("\u2028"), false);
  assert.equal(serialized.includes("\u2029"), false);
  assert.deepEqual(JSON.parse(serialized), payload);
});

test("serializes non-JSON values as a safe null literal", () => {
  assert.equal(serializeJsonLd(undefined), "null");
});
