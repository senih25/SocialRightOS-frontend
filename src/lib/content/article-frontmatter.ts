/**
 * Article frontmatter contract for `content/articles/{slug}.md`.
 *
 * Upstream authority: ContentOps `schemas/content/frontmatter-nextjs.schema.json`
 * (see `upstream-contract.ts` for provenance and the drift digest). Field names
 * and enum values are DERIVED from the approved snapshot, never retyped, so a
 * copy/paste divergence is impossible.
 *
 * This module only ever makes the upstream contract STRICTER. It is pure: no
 * filesystem access, no `new Date()`, no randomness — the same input always
 * produces the same issue list, in the same order.
 *
 * Deliberately hand-written rather than schema-library based: this repository
 * has no runtime validation dependency, and adding one to validate 21 fields
 * would enlarge the supply-chain surface for no safety gain.
 */
import {
  UPSTREAM_DATE_TIME_FIELDS,
  UPSTREAM_ENUMS,
  UPSTREAM_REQUIRED,
  upstreamSnapshot,
} from "./upstream-contract.ts";

export type ArticleStatus = "draft" | "review" | "published" | "archived";
export type ArticleJurisdiction = "TR" | "EU" | "US" | "GLOBAL";
export type ArticleContentType = "analysis" | "news_brief" | "guide" | "reference";
export type ArticleLegalStatus =
  | "in_force"
  | "proposed"
  | "amended"
  | "repealed"
  | "guidance"
  | "not_applicable"
  | "unknown";
export type ArticleVerificationState =
  | "quarantined"
  | "research_required"
  | "verified"
  | "editorial_approved"
  | "publishable"
  | "archived";

export type ArticleFrontmatter = {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  status: ArticleStatus;
  author: string;
  reviewer: string | null;
  jurisdiction: ArticleJurisdiction;
  benefitOrRight: string;
  contentType: ArticleContentType;
  legalStatus: ArticleLegalStatus;
  effectiveDate: string | null;
  sourceCheckedAt: string;
  primarySources: string[];
  secondarySources: string[];
  aiAssistance: string;
  disclaimer: string;
  draft: boolean;
  noindex: boolean;
  verificationState: ArticleVerificationState;
};

export type ValidationIssue = { path: string; message: string };
export type ValidationResult =
  | { success: true; data: ArticleFrontmatter }
  | { success: false; issues: ValidationIssue[] };

/** Lowercase, hyphen-separated; no leading/trailing/double hyphen. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * RFC 3339 `date-time` — the semantics JSON Schema's `format: "date-time"` refers
 * to. Deliberately strict: a date-only value ("2026-08-01") or a space-separated
 * value ("2026-08-01 09:00:00") is not a date-time and is rejected, because an
 * unqualified date silently becomes midnight UTC and misrepresents when a source
 * was actually checked. Leap seconds (`:60`) are rejected too: JavaScript's date
 * model cannot represent them, which would make ordering comparisons undefined.
 */
export function isRfc3339DateTime(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!match) return false;
  const [, year, month, day, hour, minute, second, , offset] = match;
  const y = Number(year);
  const mo = Number(month);
  const d = Number(day);
  if (Number(hour) > 23 || Number(minute) > 59 || Number(second) > 59) return false;
  if (offset !== "Z") {
    if (Number(offset.slice(1, 3)) > 23 || Number(offset.slice(4, 6)) > 59) return false;
  }
  if (!isRealCalendarDate(y, mo, d)) return false;
  return !Number.isNaN(Date.parse(value));
}

/** RFC 3339 full-date (`YYYY-MM-DD`), used by `effectiveDate`. */
export function isRfc3339Date(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  return isRealCalendarDate(Number(match[1]), Number(match[2]), Number(match[3]));
}

function isRealCalendarDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const asUtc = new Date(Date.UTC(year, month - 1, day));
  return (
    asUtc.getUTCFullYear() === year && asUtc.getUTCMonth() === month - 1 && asUtc.getUTCDate() === day
  );
}

const hasDuplicates = (values: readonly string[]): boolean => new Set(values).size !== values.length;

type Bound = { minLength?: number; maxLength?: number; pattern?: string };
const propertyBounds = upstreamSnapshot.properties as Record<string, Bound>;
const boundOf = (field: string): Bound => propertyBounds[field] ?? {};

/**
 * Validates a parsed frontmatter object against the upstream contract plus the
 * stricter site-level rules. Never throws; returns every issue found.
 */
export function validateArticleFrontmatter(input: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];
  const fail = (path: string, message: string) => issues.push({ path, message });

  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { success: false, issues: [{ path: "", message: "frontmatter must be an object" }] };
  }
  const value = input as Record<string, unknown>;

  // --- upstream: additionalProperties = false ---
  const allowed = new Set(Object.keys(upstreamSnapshot.properties));
  for (const key of Object.keys(value)) {
    if (!allowed.has(key)) fail(key, `unknown frontmatter field "${key}" is not part of the contract`);
  }

  // --- upstream: required ---
  for (const field of UPSTREAM_REQUIRED) {
    if (!(field in value)) fail(field, `required field "${field}" is missing`);
  }

  // --- upstream: string fields with min/max bounds ---
  const stringFields = ["title", "description", "author", "benefitOrRight", "aiAssistance", "disclaimer"] as const;
  for (const field of stringFields) {
    const raw = value[field];
    if (raw === undefined) continue;
    if (typeof raw !== "string") {
      fail(field, `"${field}" must be a string`);
      continue;
    }
    const { minLength, maxLength } = boundOf(field);
    if (minLength !== undefined && raw.length < minLength) fail(field, `"${field}" must be at least ${minLength} characters`);
    if (maxLength !== undefined && raw.length > maxLength) fail(field, `"${field}" must be at most ${maxLength} characters`);
  }

  // --- upstream: slug pattern ---
  if (value.slug !== undefined) {
    if (typeof value.slug !== "string") fail("slug", "slug must be a string");
    else if (!SLUG_PATTERN.test(value.slug)) fail("slug", "slug must be lowercase-hyphenated (a-z, 0-9)");
  }

  // --- upstream: enums ---
  for (const [field, values] of Object.entries(UPSTREAM_ENUMS)) {
    const raw = value[field];
    if (raw === undefined) continue;
    if (typeof raw !== "string" || !values.includes(raw)) {
      fail(field, `"${field}" must be one of: ${values.join(", ")}`);
    }
  }

  // --- upstream: format date-time (site rule: strict RFC 3339) ---
  for (const field of UPSTREAM_DATE_TIME_FIELDS) {
    const raw = value[field];
    if (raw === undefined) continue;
    if (!isRfc3339DateTime(raw)) {
      fail(
        field,
        `"${field}" must be an RFC 3339 date-time (YYYY-MM-DDThh:mm:ss[.sss](Z|+hh:mm)); date-only or space-separated values are rejected`,
      );
    }
  }

  // --- upstream: effectiveDate is date | null ---
  if ("effectiveDate" in value) {
    const raw = value.effectiveDate;
    if (raw !== null && !isRfc3339Date(raw)) {
      fail("effectiveDate", 'effectiveDate must be null or a real "YYYY-MM-DD" date');
    }
  }

  // --- upstream: reviewer is string | null ---
  if ("reviewer" in value) {
    const raw = value.reviewer;
    if (raw !== null && (typeof raw !== "string" || raw.trim().length < 2)) {
      fail("reviewer", "reviewer must be null or a name of at least 2 characters");
    }
  }

  // --- upstream: booleans ---
  for (const field of ["draft", "noindex"] as const) {
    if (field in value && typeof value[field] !== "boolean") fail(field, `"${field}" must be a boolean`);
  }

  // --- upstream: source arrays (HTTPS-only) + site rules (non-empty, unique, disjoint) ---
  const readUrlList = (field: "primarySources" | "secondarySources"): string[] | null => {
    const raw = value[field];
    if (raw === undefined) return null;
    if (!Array.isArray(raw) || raw.some((item) => typeof item !== "string")) {
      fail(field, `"${field}" must be an array of strings`);
      return null;
    }
    const list = raw as string[];
    for (const url of list) {
      if (!url.startsWith("https://")) fail(field, `source must use https://: ${url}`);
    }
    if (hasDuplicates(list)) fail(field, `"${field}" must not contain duplicates`);
    return list;
  };
  const primary = readUrlList("primarySources");
  const secondary = readUrlList("secondarySources");
  if (primary !== null && primary.length < 1) fail("primarySources", "primarySources must not be empty");
  if (primary !== null && secondary !== null) {
    const overlap = primary.filter((url) => secondary.includes(url));
    if (overlap.length > 0) {
      fail("secondarySources", `a URL cannot be both primary and secondary: ${overlap.join(", ")}`);
    }
  }

  // Stop before cross-field rules if the shape is already wrong: reporting
  // contradictions on invalid data would only add noise.
  if (issues.length > 0) return { success: false, issues };

  const data = value as unknown as ArticleFrontmatter;

  // --- site rule: updatedAt >= publishedAt ---
  if (Date.parse(data.updatedAt) < Date.parse(data.publishedAt)) {
    fail("updatedAt", "updatedAt cannot be earlier than publishedAt");
  }

  // --- site rule: quarantine implications ---
  if (data.draft && !data.noindex) fail("noindex", "draft=true requires noindex=true");
  if ((data.status === "draft" || data.status === "review" || data.status === "archived") && !data.noindex) {
    fail("noindex", `status=${data.status} requires noindex=true`);
  }
  if (data.verificationState !== "publishable" && !data.noindex) {
    fail("noindex", `verificationState=${data.verificationState} requires noindex=true`);
  }
  if (data.verificationState === "archived" && !data.noindex) {
    fail("noindex", "archived content can never be indexable");
  }

  // --- site rule: the ONLY way to be indexable ---
  if (!data.noindex) {
    if (data.verificationState !== "publishable") fail("verificationState", "noindex=false requires verificationState=publishable");
    if (data.status !== "published") fail("status", "noindex=false requires status=published");
    if (data.draft) fail("draft", "noindex=false requires draft=false");
    if (!data.reviewer) fail("reviewer", "noindex=false requires a reviewer");
    if (data.legalStatus === "unknown") fail("legalStatus", "noindex=false requires a known legalStatus");
  }

  // --- site rule: publishable demands the full evidence set, even while noindex ---
  if (data.verificationState === "publishable") {
    if (data.status !== "published") fail("status", "verificationState=publishable requires status=published");
    if (data.draft) fail("draft", "verificationState=publishable requires draft=false");
    if (!data.reviewer) fail("reviewer", "verificationState=publishable requires a reviewer");
    if (data.legalStatus === "unknown") fail("legalStatus", "verificationState=publishable requires a known legalStatus");
  }

  if (issues.length > 0) return { success: false, issues };
  return { success: true, data };
}
