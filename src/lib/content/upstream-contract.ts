import { createHash } from "node:crypto";

import snapshot from "./upstream-contract.snapshot.json" with { type: "json" };

/**
 * Upstream ContentOps contract: provenance, approved snapshot and drift detection.
 *
 * AUTHORITY: the git-tracked file in the ContentOps repository is the source of
 * truth. `upstream-contract.snapshot.json` here is a human-approved COPY of that
 * file, committed so this repository's tests are deterministic without the
 * sibling repository being present. A snapshot is evidence of what was reviewed,
 * never an independent authority.
 *
 * DRIFT POLICY: the contract test compares the semantic digest of the live
 * upstream file (when reachable) against `UPSTREAM_CONTRACT.digest`. Any
 * difference FAILS with an explicit request for human review. The snapshot is
 * never updated automatically.
 */

/**
 * Deterministic canonicalization for hashing: object keys sorted, ARRAY ORDER
 * PRESERVED (array order is semantically meaningful in JSON Schema, e.g. `allOf`
 * and `required`).
 */
export function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => canonicalize(item));
  if (value && typeof value === "object") {
    const source = value as Record<string, unknown>;
    return Object.fromEntries(
      Object.keys(source)
        .sort()
        .map((key) => [key, canonicalize(source[key])]),
    );
  }
  return value;
}

/**
 * SHA-256 over the canonical JSON form of a parsed JSON Schema document.
 * Whitespace and key order in the source file are irrelevant; every semantic
 * change (required, properties, type, pattern, min/max, additionalProperties,
 * enum, format, description, ...) changes the digest.
 */
export function semanticDigest(parsedJson: unknown): string {
  return createHash("sha256").update(JSON.stringify(canonicalize(parsedJson)), "utf8").digest("hex");
}

export const upstreamSnapshot = snapshot;

/** Human-approved provenance of the snapshot committed alongside this file. */
export const UPSTREAM_CONTRACT = Object.freeze({
  repository: "senih25/socialrightlabs-contentops",
  path: "schemas/content/frontmatter-nextjs.schema.json",
  commit: "0fc7c6cc9e36a780634073bbfd1da1e29d682a94",
  observedOn: "2026-08-04",
  reviewedBy: "senihbayankulu",
  snapshotPath: "src/lib/content/upstream-contract.snapshot.json",
  /** semanticDigest() of the snapshot; regenerate ONLY through human review. */
  digest: "0940a438546971dd96c05df2675ebbd496afdf91fbb7dbb2fd4780d90cbcb7b7",
});

/** Field names and enums are DERIVED from the snapshot, never retyped. */
export const UPSTREAM_REQUIRED: readonly string[] = Object.freeze([...snapshot.required]);

type SchemaProperty = { enum?: readonly string[]; type?: unknown; format?: string };
const properties = snapshot.properties as Record<string, SchemaProperty>;

export const UPSTREAM_ENUMS: Readonly<Record<string, readonly string[]>> = Object.freeze(
  Object.fromEntries(
    Object.entries(properties)
      .filter(([, spec]) => Array.isArray(spec.enum))
      .map(([field, spec]) => [field, Object.freeze([...(spec.enum as string[])])]),
  ),
);

export const UPSTREAM_DATE_TIME_FIELDS: readonly string[] = Object.freeze(
  Object.entries(properties)
    .filter(([, spec]) => spec.format === "date-time")
    .map(([field]) => field),
);
