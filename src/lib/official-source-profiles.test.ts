import assert from "node:assert/strict";
import test from "node:test";
import {
  OFFICIAL_SOURCE_PROFILES,
  type OfficialSourceProfileKey,
} from "./official-source-profiles.ts";

const expectedKeys: OfficialSourceProfileKey[] = ["home-care", "old-age", "birth-grant"];

test("critical-route official source profiles stay complete and ministry-scoped", () => {
  assert.deepEqual(Object.keys(OFFICIAL_SOURCE_PROFILES).sort(), [...expectedKeys].sort());

  for (const key of expectedKeys) {
    const profile = OFFICIAL_SOURCE_PROFILES[key];

    assert.match(profile.updatedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(profile.verifiedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(profile.sources.length >= 2);

    for (const source of profile.sources) {
      const url = new URL(source.url);

      assert.equal(url.protocol, "https:");
      assert.equal(url.hostname, "www.aile.gov.tr");
      assert.ok(source.title.length > 0);
      assert.ok(source.role.length > 0);
      assert.doesNotMatch(source.title, /Uygulama Talimatı/i);
    }
  }
});
