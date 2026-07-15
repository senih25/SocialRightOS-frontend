import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const manifestPath = join(
  process.cwd(),
  "docs",
  "content-trust",
  "p1-source-research-batches.json",
);

const queuePath = join(
  process.cwd(),
  "docs",
  "content-trust",
  "blog-source-verification-priority-queue.json",
);

const manifest = JSON.parse(
  readFileSync(manifestPath, "utf8"),
);

const queue = JSON.parse(
  readFileSync(queuePath, "utf8"),
);

test("manifest covers all P1 records exactly once", () => {
  const expectedIds = queue.records
    .filter(
      (record: { priority?: string }) =>
        record.priority === "P1",
    )
    .map(
      (record: { id: string }) => record.id,
    )
    .sort();

  const actualIds = manifest.batches
    .flatMap(
      (batch: {
        records: Array<{ source_id: string }>;
      }) => batch.records,
    )
    .map(
      (record: { source_id: string }) =>
        record.source_id,
    )
    .sort();

  assert.equal(expectedIds.length, 15);
  assert.deepEqual(actualIds, expectedIds);
  assert.equal(
    new Set(actualIds).size,
    actualIds.length,
  );
});

test("manifest contains five institution-oriented batches", () => {
  assert.equal(manifest.batches.length, 5);

  const counts = manifest.batches.map(
    (batch: { record_count: number }) =>
      batch.record_count,
  );

  assert.deepEqual(counts, [6, 6, 1, 1, 1]);
});

test("research preparation does not pre-decide records", () => {
  for (const batch of manifest.batches) {
    for (const record of batch.records) {
      assert.equal(record.decision, "PENDING");
      assert.equal(
        record.verification_status,
        "NOT_STARTED",
      );

      assert.equal(
        record.research_result.recommended_decision,
        null,
      );

      assert.equal(
        record.research_result.verified_url,
        null,
      );
    }
  }
});

test("every batch requires official primary domains", () => {
  for (const batch of manifest.batches) {
    assert.ok(batch.required_domains.length > 0);

    for (const domain of batch.required_domains) {
      assert.match(
        domain,
        /^[a-z0-9.-]+\.gov\.tr$/,
      );
    }
  }
});
