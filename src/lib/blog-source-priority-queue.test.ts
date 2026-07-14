import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type QueueRecord = {
  id: string;
  blog_slug: string;
  displayed_number: number;
  flags: string[];
  risk_score: number;
  priority: "P0" | "P1" | "P2" | "P3";
  decision: "PENDING";
  verification_status: "NOT_STARTED";
  review_requirements: string[];
};

type PriorityQueue = {
  schema_version: string;
  scope: {
    source_record_count: number;
    decision_state: string;
    verification_state: string;
  };
  records: QueueRecord[];
};

const queuePath = join(
  process.cwd(),
  "docs",
  "content-trust",
  "blog-source-verification-priority-queue.json",
);

const queue = JSON.parse(
  readFileSync(queuePath, "utf8"),
) as PriorityQueue;

test("priority queue covers all 36 source records", () => {
  assert.equal(queue.scope.source_record_count, 36);
  assert.equal(queue.records.length, 36);
});

test("priority queue contains unique source identifiers", () => {
  const ids = queue.records.map((record) => record.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("all decisions and verification states remain untouched", () => {
  for (const record of queue.records) {
    assert.equal(record.decision, "PENDING");
    assert.equal(record.verification_status, "NOT_STARTED");
  }
});

test("draft or speculative records always receive P0", () => {
  const draftRecords = queue.records.filter((record) =>
    record.flags.includes("DRAFT_OR_SPECULATIVE"),
  );

  assert.ok(draftRecords.length > 0);

  for (const record of draftRecords) {
    assert.equal(record.priority, "P0");
  }
});

test("queue is sorted from highest to lowest risk", () => {
  for (let index = 1; index < queue.records.length; index += 1) {
    assert.ok(
      queue.records[index - 1].risk_score >=
        queue.records[index].risk_score,
    );
  }
});

test("every record has actionable review requirements", () => {
  for (const record of queue.records) {
    assert.ok(record.review_requirements.length >= 3);
  }
});
