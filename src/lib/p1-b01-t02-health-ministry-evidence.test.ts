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

const decision = JSON.parse(
  readFileSync(
    join(
      root,
      "docs",
      "content-trust",
      "reviews",
      "p1-b01-t02-final-decision.json",
    ),
    "utf8",
  ),
);

test("T02 records completed official-source research without applying an editorial decision", () => {
  assert.equal(evidence.research_status, "IN_PROGRESS");
  assert.equal(evidence.decision_status, "PENDING");
  assert.equal(evidence.summary.completed_target_count, 2);
  assert.equal(
    evidence.summary.replacement_candidate_count,
    2,
  );
  assert.equal(evidence.summary.decision_count, 0);

  const t02 = evidence.targets.find(
    (target: { target_id: string }) =>
      target.target_id === "P1-B01-T02",
  );

  assert.ok(t02);
  assert.equal(t02.research_status, "COMPLETED");
  assert.equal(
    t02.official_source_result.exact_match_found,
    false,
  );
  assert.equal(
    t02.official_source_result
      .direct_primary_source_found,
    true,
  );
  assert.equal(
    t02.official_source_result
      .verified_resmi_gazete_number,
    "30692",
  );
  assert.equal(
    t02.official_source_result
      .relevant_article,
    "12",
  );
  assert.equal(
    t02.official_source_result
      .claimed_issue_verification
      .verified_issue_date,
    "2025-12-07",
  );
  assert.equal(
    t02.official_source_result
      .claimed_issue_verification
      .verified_record_count,
    5,
  );
  assert.equal(
    t02.official_source_result
      .claimed_issue_verification
      .claimed_title_present,
    false,
  );
  assert.equal(
    t02.assessment.source_exists_as_cited,
    false,
  );
  assert.equal(
    t02.assessment.citation_is_accurate,
    false,
  );
  assert.equal(
    t02.assessment.recommended_decision,
    "REPLACE",
  );
  assert.equal(
    t02.assessment.source_supports_claims,
    null,
  );
  assert.equal(t02.search_log.length, 4);
  assert.equal(t02.candidate_sources.length, 2);

  for (const record of t02.records) {
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
});

test("T02 final decision package preserves the verified research conclusion", () => {
  assert.equal(decision.research_id, "P1-B01-T02");
  assert.equal(
    decision.verification_result
      .source_level_decision,
    "REPLACE",
  );
  assert.equal(
    decision.verification_result
      .source_exists_as_cited,
    false,
  );
  assert.equal(
    decision.replacement_sources
      .primary_normative_source
      .official_gazette_number,
    30692,
  );
  assert.equal(
    decision.replacement_sources
      .primary_normative_source
      .relevant_article,
    12,
  );
  assert.equal(
    decision.replacement_sources
      .supporting_administrative_source
      .relevant_article,
    36,
  );
  assert.equal(
    decision.replacement_sources
      .supporting_administrative_source
      .source_classification,
    "MINISTRY_ADMINISTRATIVE_DIRECTIVE_NOT_OFFICIAL_GAZETTE_COMMUNIQUE",
  );
});
