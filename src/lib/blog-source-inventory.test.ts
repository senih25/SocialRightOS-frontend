import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type SourceRecord = {
  id: string;
  blog_slug: string;
  file: string;
  displayed_number: number;
  reference: string;
  current_url: string | null;
  flags: string[];
  decision: "PENDING" | "KEEP" | "REPLACE" | "REMOVE";
  recommended_action: string;
};

type Inventory = {
  schema_version: string;
  scope: {
    blog_page_count: number;
    source_record_count: number;
    production_status: string;
  };
  records: SourceRecord[];
};

const inventoryPath = join(
  process.cwd(),
  "docs",
  "content-trust",
  "blog-source-verification-inventory.json",
);

const inventory = JSON.parse(
  readFileSync(inventoryPath, "utf8"),
) as Inventory;

test("inventory covers all quarantined blog sources", () => {
  assert.equal(inventory.scope.blog_page_count, 9);
  assert.equal(inventory.scope.source_record_count, 36);
  assert.equal(inventory.records.length, 36);
});

test("all source identifiers are unique", () => {
  const ids = inventory.records.map((record) => record.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("all records remain pending until primary-source review", () => {
  for (const record of inventory.records) {
    assert.equal(record.decision, "PENDING");
    assert.ok(record.reference.length > 0);
    assert.ok(record.recommended_action.length > 0);
  }
});

test("each blog contains exactly four inventory records", () => {
  const counts = new Map<string, number>();

  for (const record of inventory.records) {
    counts.set(
      record.blog_slug,
      (counts.get(record.blog_slug) ?? 0) + 1,
    );
  }

  assert.equal(counts.size, 9);

  for (const count of counts.values()) {
    assert.equal(count, 4);
  }
});
