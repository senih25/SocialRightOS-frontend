import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const evidence = JSON.parse(
  readFileSync(
    join(
      root,
      "docs",
      "content-trust",
      "reviews",
      "p1-b01-health-ministry-evidence.json",
    ),
    "utf8",
  ),
);

const manifest = JSON.parse(
  readFileSync(
    join(
      root,
      "docs",
      "content-trust",
      "p1-source-research-batches.json",
    ),
    "utf8",
  ),
);

test("P1-B01 evidence covers all six records once", () => {
  const batch = manifest.batches.find(
    (item: { batch_id: string }) =>
      item.batch_id === "P1-B01",
  );

  assert.ok(batch);

  const expectedIds = batch.records
    .map(
      (record: { source_id: string }) =>
        record.source_id,
    )
    .sort();

  const actualIds = evidence.targets
    .flatMap(
      (target: {
        records: Array<{ source_id: string }>;
      }) => target.records,
    )
    .map(
      (record: { source_id: string }) =>
        record.source_id,
    )
    .sort();

  assert.equal(expectedIds.length, 6);
  assert.deepEqual(actualIds, expectedIds);
  assert.equal(
    new Set(actualIds).size,
    actualIds.length,
  );
});

test("P1-B01 contains three deduplicated targets", () => {
  assert.equal(evidence.targets.length, 3);

  const targetIds = evidence.targets.map(
    (target: { target_id: string }) =>
      target.target_id,
  );

  assert.deepEqual(targetIds, [
    "P1-B01-T01",
    "P1-B01-T02",
    "P1-B01-T03",
  ]);

  const recordCounts = evidence.targets.map(
    (target: {
      records: Array<unknown>;
    }) => target.records.length,
  );

  assert.deepEqual(recordCounts, [4, 1, 1]);
});

test("evidence skeleton contains no premature decision", () => {
  assert.equal(
    evidence.research_status,
    "NOT_STARTED",
  );

  assert.equal(
    evidence.decision_status,
    "PENDING",
  );

  assert.equal(
    evidence.summary.decision_count,
    0,
  );

  for (const target of evidence.targets) {
    assert.equal(
      target.research_status,
      "NOT_STARTED",
    );

    assert.equal(
      target.assessment.recommended_decision,
      null,
    );

    assert.equal(
      target.official_source_result.verified_url,
      null,
    );

    assert.deepEqual(target.search_log, []);
    assert.deepEqual(target.candidate_sources, []);
  }
});

test("only official primary domains are allowed", () => {
  assert.equal(
    evidence.secondary_sources_allowed,
    false,
  );

  assert.deepEqual(
    evidence.allowed_official_domains,
    [
      "resmigazete.gov.tr",
      "saglik.gov.tr",
    ],
  );

  assert.equal(
    evidence.research_protocol.official_domain_only,
    true,
  );

  assert.equal(
    evidence.research_protocol
      .direct_document_required_for_keep,
    true,
  );

  assert.equal(
    evidence.research_protocol
      .human_review_required_before_decision,
    true,
  );
});
