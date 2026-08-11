import assert from "node:assert/strict";
import test from "node:test";
import { buildBrandGraphJsonLd, serializeJsonLd } from "./seo-json.ts";

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

test("brand graph publishes truthful site accessibility metadata", () => {
  const graph = buildBrandGraphJsonLd({
    siteUrl: new URL("https://example.test"),
    founder: {
      name: "Test Founder",
      role: "Founder",
      summary: "Test summary",
    },
    organization: {
      name: "Test Organization",
      description: "Test organization description",
      profilePath: "/organization",
    },
    product: {
      name: "Test Product",
      fullName: "Test Product Full Name",
      description: "Test product description",
    },
    socialProfiles: {
      linkedin: "https://www.linkedin.com/in/example/",
    },
  });

  const nodes = graph["@graph"];
  const founder = nodes.find((node) => node["@type"] === "Person");
  const website = nodes.find((node) => node["@type"] === "WebSite");

  assert.equal(founder?.["@id"], "https://example.test/#founder");
  assert.equal("url" in (founder ?? {}), false);
  assert.deepEqual(website?.accessMode, ["textual", "visual"]);
  assert.deepEqual(website?.accessModeSufficient, [
    { "@type": "ItemList", itemListElement: ["textual"] },
  ]);
  assert.match(website?.accessibilitySummary ?? "", /kısa bir metin özeti/u);
});
