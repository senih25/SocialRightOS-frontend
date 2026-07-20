# Build Week Phase 6A — Security and Evaluation Review

## Executive summary

The competition slice was reviewed against the repository's Next.js 16, React 19 and
general browser-security boundaries. No critical or high-severity release-blocking
finding remains in the reviewed local code. Five concrete gaps were remediated in this
slice: revoked/stale evidence acceptance, JSON-LD script-closing injection resilience and
known dependency advisories, default-off UI enforcement and runtime kill-switch wiring.
Strict CSP migration and an abuse-resistant public edge rate limit remain deliberately
deferred to runtime deployment exercises.

```text
CRITICAL_FINDING_COUNT=0
HIGH_FINDING_COUNT=0
RELEASE_BLOCKING_FINDING_COUNT=0
REMEDIATED_FINDING_COUNT=5
DEFERRED_HARDENING_COUNT=2
PUBLIC_ENABLEMENT_BLOCKING_FINDING_COUNT=1
```

## Scope and evidence

Reviewed surfaces:

- evidence selection, semantic validation and provider isolation;
- public synthetic Build Week route and runtime configuration;
- GSS client response boundary;
- React/JSON-LD injection sinks adjacent to the competition pages;
- application security headers and CSP;
- production and development dependency trees;
- direct production licenses and transitive lockfile license metadata;
- CI install, test, build, diff, secret and clean-tree gates.

The review did not authenticate to a cloud runtime, change a deployment, call OpenAI or
exercise real-user data.

## Findings

### BWSEC-001 — Revoked or stale evidence could enter provider construction

- Rule ID: `NEXT-INPUT-001 / EVIDENCE-FRESHNESS`
- Severity: Medium
- Status: Remediated
- Location: `src/lib/rights-guidance.ts:17-18,211-212,279`
- Evidence: the approved catalog now carries `catalogState` and `validThrough`; input
  construction rejects a non-active catalog or a `validAsOf` date beyond its validity.
- Impact: before remediation, a structurally valid but operationally revoked or expired
  synthetic catalog could still reach the provider boundary.
- Fix: deterministic rejection occurs before provider construction, and neither catalog
  control field is copied into model input.
- Mitigation: the runtime catalog is explicitly active and bounded through 2026-07-31.
- False-positive notes: this is a synthetic competition catalog control, not a claim that
  official policy sources remain valid through that date.

### BWSEC-002 — JSON-LD serializer allowed an HTML script-closing sequence

- Rule ID: `REACT-XSS-001 / NEXT-XSS-001`
- Severity: Medium
- Status: Remediated
- Location: `src/lib/seo-json.ts:25`, `src/components/seo/json-ld.tsx:13`
- Evidence: JSON-LD is now serialized through one helper that Unicode-escapes `<`, `>`,
  `&`, U+2028 and U+2029 before the string reaches `dangerouslySetInnerHTML`.
- Impact: current call sites use application-owned data, but a future dynamic value
  containing `</script>` could otherwise terminate the data block and create an XSS sink.
- Fix: centralized serialization preserves JSON semantics while preventing script closing.
- Mitigation: React's normal rendering remains preferred for every non-JSON-LD value.
- False-positive notes: no current attacker-controlled JSON-LD source was identified; the
  fix is preventive and protects future reuse of the generic component.

### BWSEC-003 — Known transitive dependency advisories

- Rule ID: `NEXT-SUPPLY-001 / REACT-SUPPLY-001`
- Severity: Medium
- Status: Remediated
- Location: `package.json:41-44`, `package-lock.json`
- Evidence: the initial production audit reported the PostCSS advisory inherited through
  Next.js. The current Next.js release still declares PostCSS 8.4.31, so the nested
  dependency is deterministically overridden to patched 8.5.10. Safe non-forced lockfile
  updates also removed the development-only Babel, brace-expansion, js-yaml and PostCSS
  advisories.
- Impact: vulnerable build or CSS serialization tooling can expose build hosts to file-read
  or denial-of-service risk and can produce unsafe CSS output under attacker-controlled
  build inputs.
- Fix: patched transitive versions are locked and the full audit reports zero known
  vulnerabilities.
- Mitigation: CI uses `npm ci`, and future lockfile changes must rerun the full audit.
- False-positive notes: production content is repository-owned and no user-controlled CSS
  build input exists, but the vulnerable versions were removed rather than risk-accepted.

### BWSEC-004 — CSP permits inline scripts and styles

- Rule ID: `NEXT-CSP-001 / REACT-CSP-001`
- Severity: Low
- Status: Deferred hardening; not release-blocking for the local candidate
- Location: `next.config.ts:10-11`
- Evidence: `script-src` and `style-src` contain `'unsafe-inline'`; `unsafe-eval` is absent.
- Impact: an independent injection flaw would receive less CSP containment than under a
  nonce- or hash-based strict policy.
- Fix: deploy a report-only nonce/hash policy, exercise the complete judge flow, then move
  to enforcement only after violations are understood.
- Mitigation: object and framing are disabled, form/base origins are constrained, no
  arbitrary HTML renderer was found, and the only audited JSON-LD sink is escaped.
- False-positive notes: removing `'unsafe-inline'` locally without a Next.js runtime
  report would be a breakage-prone change and is intentionally not attempted here.

### BWSEC-005 — Competition UI was visible while the server feature was disabled

- Rule ID: `NEXT-SECRETS-001 / FAIL-CLOSED-UI`
- Severity: Medium
- Status: Remediated
- Location: `src/app/gss-gelir-testi/page.tsx:24-27`,
  `src/app/gss-gelir-testi/GssToolPageClient.tsx:92-95,432`
- Evidence: the server page now enables the panel only when the complete server runtime
  configuration validates; the client component defaults its prop to `false`.
- Impact: before remediation, production users could see a non-functional competition
  panel even though the API route correctly returned the disabled response.
- Fix: server-owned configuration controls rendering, while secrets remain server-only.
- Mitigation: invalid or incomplete configuration fails closed and renders no panel.
- False-positive notes: this is a visibility/control-plane issue, not secret exposure.

### BWSEC-006 — Real service wiring bypassed the tested dynamic kill switch

- Rule ID: `NEXT-DOS-001 / COST-GUARD-KILL-SWITCH`
- Severity: Medium
- Status: Remediated
- Location: `src/lib/build-week-guidance-runtime.ts:162-198`
- Evidence: the budgeted provider and request guard now share a runtime `isEnabled`
  callback; disabling it blocks database reservation and provider network work.
- Impact: before remediation, the assembled service passed a constant `true`, so the
  provider-level mid-flight kill-switch tests did not represent actual runtime wiring.
- Fix: runtime enablement is consulted before request work and again inside the budgeted
  provider before and after the provider call.
- Mitigation: all disabled paths return the application-owned `UNAVAILABLE` model.
- False-positive notes: changing a hosted environment variable may still require the
  platform's normal configuration rollout; this control does not claim an out-of-band
  infrastructure kill switch.

### BWSEC-007 — Client nonce is not an abuse-resistant client identity

- Rule ID: `NEXT-DOS-001 / PUBLIC-RATE-LIMIT-IDENTITY`
- Severity: Medium
- Status: Deferred public-enablement blocker; not a default-off merge blocker
- Location: `src/lib/build-week-guidance-runtime.ts:142-149`
- Evidence: the HMAC prevents raw nonce disclosure but the browser chooses the nonce, so
  a hostile caller can rotate UUIDs and avoid the per-nonce attempt window.
- Impact: the atomic global hard budget still prevents spend above the accepted cap, but
  an attacker could exhaust judge-demo availability within that cap.
- Fix: add an abuse-resistant edge/platform rate limit before public enablement without
  sending IP addresses or other identity data to OpenAI.
- Mitigation: feature and UI remain default-off, each normal UI session attempts once,
  and the global database budget is atomic and fail-closed.
- False-positive notes: do not describe the current nonce window as strong per-user
  authentication or identity enforcement.

## Route and data-boundary verification

The synthetic route has a 1,024-byte body cap, exact JSON content type, exact key set,
UUID nonce validation, one fixed scenario, no-store responses, response re-copying and
detail-free failure states (`src/lib/build-week-guidance-route.ts:20-25,49,59,97-128`).
It uses no cookie-authenticated state and exposes no CORS grant. The provider destination
and model are server-owned, not request-controlled.

```text
RUNTIME_INPUT_VALIDATION=PASS
REQUEST_SIZE_LIMIT=PASS
FIXED_PROVIDER_DESTINATION=PASS
EXACT_RESPONSE_ALLOWLIST=PASS
CACHE_CONTROL_NO_STORE=PASS
RAW_ERROR_EXPOSURE_COUNT=0
COOKIE_AUTH_DEPENDENCY=NO
CORS_ENABLEMENT=NO
COMPLETE_RUNTIME_UI_GATE=PASS
RUNTIME_KILL_SWITCH_WIRING=PASS
```

## Adversarial evaluation coverage

The automated suite covers:

- prompt-injection and extra input fields;
- unknown, duplicate, cross-section, missing and extra evidence IDs;
- malformed structured output and unknown output keys;
- unsupported concrete claims, certainty escalation and meaning reversal;
- official-decision and guarantee language;
- provider refusal, timeout-class network failure, HTTP failure and malformed usage;
- kill switch before reservation/network, mid-flight response suppression and unguarded
  live-provider rejection;
- concurrent budget reservations and request leases;
- provider input mutation attempts and deep-freeze isolation;
- revoked and expired evidence catalogs;
- secret, raw-response, validation-carrier and personal-data exclusions;
- GSS and old-age-pension common-contract generalization.

## Dependency and license review

Lockfile production graph:

```text
PRODUCTION_PACKAGE_RECORD_COUNT=66
MISSING_LICENSE_METADATA_COUNT=0
DIRECT_PRODUCTION_DEPENDENCY_COUNT=4
DIRECT_PRODUCTION_DEPENDENCY_LICENSE=MIT
PRODUCTION_AUDIT_VULNERABILITY_COUNT=0
FULL_AUDIT_VULNERABILITY_COUNT=0
```

Recorded lockfile licenses are MIT, Apache-2.0, ISC, BSD-3-Clause, 0BSD,
CC-BY-4.0 and LGPL-3.0-or-later combinations. LGPL records belong to optional Sharp/libvips
platform packages; the CC-BY record belongs to browser-compatibility data. Preserve the
installed-package notices and attribution material in any redistributed bundle. This is a
technical inventory, not a legal opinion.

## Local quality evidence

The complete repository pipeline was rerun after remediation:

```text
ALL_TESTS=276/276_PASS
TYPECHECK=PASS
LINT=PASS
PRODUCTION_BUILD=PASS
SECRET_SCAN=PASS
SECRET_EXPOSURE_COUNT=0
DIFF_CHECK=PASS
FULL_AUDIT_VULNERABILITY_COUNT=0
PRODUCTION_AUDIT_VULNERABILITY_COUNT=0
UNEXPECTED_CHANGE_COUNT=0
LIVE_API_CALL_COUNT=0
PAID_API_USAGE=0
```

Local execution used Node 24.14.0 because that is the available workspace runtime. The
repository contract requires Node 22.x, and the workflow is configured for Node 22;
therefore `NODE22_CI_VERIFICATION=PENDING` remains an explicit release gate rather than
being inferred from the local run.

## Remaining release gates

Phase 6A is local-only. Release-candidate status still requires:

1. a clean GitHub PR and Node 22 CI run;
2. independent review of the exact head SHA;
3. report-only/runtime CSP evidence before strict-CSP migration;
4. abuse-resistant edge/platform rate limiting before public enablement;
5. approved isolated PostgreSQL runtime verification;
6. one explicitly authorized synthetic live GPT-5.6 call and budget-settlement proof;
7. final deployment SHA, judge access and rollback verification.

No local result in this report authorizes public enablement.
