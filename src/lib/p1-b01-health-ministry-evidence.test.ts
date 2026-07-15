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

test("P1-B01 records completed T01 and T02 research without applying an editorial decision", () => {
  assert.equal(
    evidence.research_status,
    "IN_PROGRESS",
  );

  assert.equal(
    evidence.decision_status,
    "PENDING",
  );

  assert.equal(
    evidence.summary.completed_target_count,
    2,
  );

  assert.equal(
    evidence.summary.replacement_candidate_count,
    2,
  );

  assert.equal(
    evidence.summary.decision_count,
    0,
  );

  const t01 = evidence.targets.find(
    (target: { target_id: string }) =>
      target.target_id === "P1-B01-T01",
  );

  assert.ok(t01);

  assert.equal(t01.research_status, "COMPLETED");
  assert.equal(
    t01.official_source_result.exact_match_found,
    false,
  );
  assert.equal(
    t01.official_source_result
      .direct_primary_source_found,
    true,
  );
  assert.equal(
    t01.official_source_result
      .verified_resmi_gazete_number,
    "30692",
  );
  assert.equal(
    t01.official_source_result
      .claimed_issue_verification
      .verified_issue_date,
    "2023-10-19",
  );
  assert.equal(
    t01.official_source_result
      .claimed_issue_verification
      .verified_record_count,
    14,
  );
  assert.equal(
    t01.official_source_result
      .claimed_issue_verification
      .claimed_title_present,
    false,
  );
  assert.equal(
    t01.assessment.source_exists_as_cited,
    false,
  );
  assert.equal(
    t01.assessment.citation_is_accurate,
    false,
  );
  assert.equal(
    t01.assessment.recommended_decision,
    "REPLACE",
  );
  assert.equal(
    t01.assessment.source_supports_claims,
    null,
  );
  assert.equal(t01.search_log.length, 3);
  assert.equal(t01.candidate_sources.length, 1);

  for (const record of t01.records) {
    assert.equal(
      record.claim_support_review.status,
      "PENDING",
    );
    assert.equal(
      record.claim_support_review
        .blog_claims_reviewed,
      false,
    );
    assert.equal(
      record.claim_support_review
        .supports_blog_claim,
      null,
    );
  }

  for (const targetId of [
    "P1-B01-T03",
  ]) {
    const target = evidence.targets.find(
      (item: { target_id: string }) =>
        item.target_id === targetId,
    );

    assert.ok(target);
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
