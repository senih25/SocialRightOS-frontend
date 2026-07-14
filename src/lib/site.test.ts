import test from "node:test";
import assert from "node:assert/strict";
import {
  getCanonicalPublicSiteUrl,
  getSiteUrl,
  isProductionSite,
} from "./site.ts";

test("isProductionSite returns true for the canonical www hostname", () => {
  assert.equal(
    isProductionSite(new URL("https://www.sosyalhakrehberi.com")),
    true,
  );
});

test("isProductionSite returns true for the bare public hostname", () => {
  assert.equal(
    isProductionSite(new URL("https://sosyalhakrehberi.com")),
    true,
  );
});

test("isProductionSite returns false for localhost", () => {
  assert.equal(isProductionSite(new URL("http://localhost:3000")), false);
});

test("isProductionSite returns false for Cloud Run staging", () => {
  assert.equal(
    isProductionSite(
      new URL(
        "https://socialrightos-web-staging-oi5mbdh6lq-ew.a.run.app",
      ),
    ),
    false,
  );
});

test("getSiteUrl prefers NEXT_PUBLIC_SITE_URL when present", () => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;

  process.env.NEXT_PUBLIC_SITE_URL =
    "https://www.sosyalhakrehberi.com/some/path?x=1";

  try {
    assert.equal(
      getSiteUrl().toString(),
      "https://www.sosyalhakrehberi.com/",
    );
  } finally {
    if (previous === undefined) {
      delete process.env.NEXT_PUBLIC_SITE_URL;
    } else {
      process.env.NEXT_PUBLIC_SITE_URL = previous;
    }
  }
});

test("getCanonicalPublicSiteUrl returns the www production origin", () => {
  assert.equal(
    getCanonicalPublicSiteUrl().toString(),
    "https://www.sosyalhakrehberi.com/",
  );
});
