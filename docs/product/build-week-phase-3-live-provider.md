# Build Week Phase 3 — Evidence-Locked GPT-5.6 Provider

## Scope

This phase adds a server-only GPT-5.6 Luna provider, atomic cost/request guards and one
default-off synthetic competition route. It does not add UI integration, deployment, or
public AI enablement. Existing `AssessmentResult` contracts and deterministic eligibility
behavior remain unchanged.

```text
BASE_SHA=a278981fdda7456cfaf8e8c996278680f056f661
MODEL=gpt-5.6-luna
ENDPOINT=POST /v1/responses
AI_GUIDANCE_ENABLED_DEFAULT=false
PUBLIC_AI_ENABLEMENT=NO
ASSESSMENT_CONTRACT_CHANGE_COUNT=0
USER_VISIBLE_BEHAVIOR_CHANGE_COUNT=0
```

## Synthetic route boundary

`POST /api/build-week/rights-guidance` is a new isolated competition endpoint. It accepts
exactly two fields: the fixed `GSS_SYNTHETIC_ELIGIBLE` scenario and a UUID nonce. It does
not accept form answers, eligibility status, evidence text, decision identifiers, contact
details, backend payloads or validation carriers. The application constructs the approved
synthetic evidence catalog on the server.

The endpoint is inert unless `AI_GUIDANCE_ENABLED=true`. Disabled or invalid runtime
configuration is resolved before parsing the request body and before database or provider
access. Enabled operation requires PostgreSQL, a dedicated HMAC secret, explicit token
prices, a hard budget ceiling and a per-request reservation. There is no production
in-memory fallback.

The client nonce is transformed into domain-separated HMAC-SHA-256 request keys. It is
never sent to OpenAI or returned in the response. The nonce is an abuse-reduction input,
not authenticated identity; the durable global spend cap remains the authoritative cost
boundary. The only provider identifier is a pseudonymous HMAC-derived safety identifier.

Every response is `no-store` and copied through a fixed allowlist. Provider/database
exceptions, invalid bodies, unknown evidence IDs and unsafe runtime output return the same
detail-free `UNAVAILABLE` model. HTTP status codes may distinguish invalid input from
temporary unavailability, but never expose provider, database or configuration details.

An interrupted or failed provider request may still be billable. Its maximum-cost
reservation therefore remains counted against the hard ceiling instead of being released
automatically. This deliberately prefers budget safety over availability; reconciliation
is a separate operator action after usage data is verified.

```text
SYNTHETIC_ROUTE_IMPLEMENTED=YES
AI_GUIDANCE_ENABLED_DEFAULT=false
REAL_USER_DATA_ACCEPTED=NO
RAW_BACKEND_RESPONSE_ACCEPTED=NO
PRODUCTION_IN_MEMORY_FALLBACK=NO
LIVE_API_CALLS_IN_ROUTE_TESTS=0
DEPLOYMENT=NO
```

## New Build Week work versus prior work

The broader SocialRightOS frontend existed before the submission period. RightFlow
Autopilot is a separate Qwen Cloud hackathon project and remains isolated in its own public
repository. No Qwen provider, RightFlow UI, Alibaba deployment manifest, or competition
copy is imported by this phase.

New work in this phase is limited to:

- a GPT-5.6 Luna Responses API provider;
- strict JSON Schema output tied to the selected evidence IDs;
- server-only secret handling, bounded timeout and output tokens;
- a mandatory budget-guard brand at the orchestrator boundary;
- kill-switch-before-reservation and reservation-before-network ordering;
- an atomic single-process reference budget store and adversarial tests.
- an optional minimized operational-event hook with no prompt or identity fields.

Phase 3.1 additionally provides a provider-independent atomic request guard. It accepts
only HMAC-SHA-256-shaped pseudonymous client and assessment-version keys, enforces a bounded
per-client attempt window, rejects concurrent duplicate assessment generations and keeps
completed assessment versions closed to regeneration. Raw email addresses, backend
decision identifiers and assessment payloads are not valid guard keys.

The future server route must derive these keys with a dedicated server-only HMAC secret;
plain SHA-256 of an email address, IP address or backend identifier is not permitted. The
HMAC input and secret must not be recorded by the operational-event hook.

## Request minimization

Only approved evidence identifiers and their approved text are sent to the provider.
Assessment status, decision identifiers, backend payloads, validation carriers, household
members, health details, `validAsOf`, and `basisVersion` are not included in the request.

The request uses:

```text
store=false
reasoning.effort=low
text.verbosity=low
max_output_tokens=256
timeout=15000ms
```

GPT output remains advisory. The application-owned validator still enforces exact evidence
coverage, semantic polarity, prohibited certainty language, concrete-claim containment and
the two-collection response shape. Any provider, budget or validation failure returns the
existing synthetic `UNAVAILABLE` model.

Operational events are opt-in and restricted to `DISABLED`, `BUDGET_BLOCKED`, `FAILED`,
or `COMPLETED` with aggregate input/output token counts. The default hook writes nothing;
prompt content, evidence IDs, client keys, assessment keys and provider errors are excluded.

## Spend-control boundary

The accepted workspace ceiling is represented as `5_000_000` USD micros ($5). Prices are
not hard-coded because model pricing is externally maintained. Deployment must inject the
current input and output prices as integer USD micros per one million tokens and choose a
conservative per-request reservation that covers the fixed token limits.

The reference store serializes reserve, settle and release operations inside one Node.js
process. It is suitable for local evaluation and a single long-lived demo process. It is
not a globally durable budget across serverless instances or restarts. The PostgreSQL
implementation below supplies the durable alternative, but public enablement remains
blocked until it is connected to and verified on an approved isolated Neon runtime.

A driver-independent PostgreSQL adapter and migration now provide that durable service
boundary in code. All reserve, settle, release, client-window and assessment-deduplication
operations execute inside schema-owned PostgreSQL functions. This keeps atomicity in the
database and allows either a Neon HTTP query function or a conventional server-side `pg`
query function to be injected without importing database credentials into shared code.
The functions use a fixed safe `search_path`; direct table access and default public
function execution are revoked. Deployment must use a dedicated non-owner role granted
only `USAGE` on the `socialright` schema and `EXECUTE` on the six named functions. Table
permissions, schema creation, ownership and broad database privileges must not be granted.

No Neon project, database credential or production resource was created in this phase.
The migration was executed against an ephemeral local PostgreSQL 16 container bound only
to `127.0.0.1`, with no persistent volume. Six real integration tests verified concurrent
hard-cap enforcement, actual-cost settlement, transactional rollback, one-generation-per-
assessment behavior, per-client limiting and public privilege revocation. The container
was removed immediately after the run.

The repository includes a dedicated integration command, `npm run test:postgres-guidance`,
which requires an explicit server-only `DATABASE_URL`. It applies the migration and verifies
real concurrent hard-cap enforcement, settlement, rollback, assessment deduplication,
per-client limiting and default-public privilege revocation. It is intentionally excluded
from the ordinary unit suite so CI cannot silently point at an unintended database.

```text
ATOMIC_SINGLE_PROCESS_STORE=IMPLEMENTED
DUPLICATE_ASSESSMENT_GENERATION_GUARD=IMPLEMENTED
PER_CLIENT_ATTEMPT_WINDOW=IMPLEMENTED
DURABLE_MULTI_INSTANCE_STORE_CODE=IMPLEMENTED
DURABLE_MULTI_INSTANCE_STORE_RUNTIME=LOCAL_POSTGRES_VERIFIED
LOCAL_POSTGRES_TRANSACTION_TEST=6/6_PASS
NEON_RUNTIME=NEEDS_VERIFICATION
PUBLIC_ENABLEMENT=BLOCKED_BY_REMOTE_DURABLE_RUNTIME_UI_AND_RELEASE_GATES
```

## Phase 2 preflight evidence

One user-approved synthetic request was made before implementation. No user or assessment
data was sent, the response was not stored, and the secret was neither logged nor committed.

```text
LIVE_API_CALL_COUNT=1
HTTP_STATUS=200
ACTUAL_MODEL=gpt-5.6-luna
STRUCTURED_OUTPUT=PASS
EXACT_EVIDENCE_COVERAGE=PASS
INPUT_TOKENS=210
OUTPUT_TOKENS=112
TOTAL_TOKENS=322
RESPONSE_STORED=NO
```

## Next gate

1. Apply the migration to an isolated approved PostgreSQL runtime with a least-privilege role.
2. Re-run the six integration tests against that isolated runtime.
3. Run semantic-fidelity and cost-exhaustion end-to-end tests through the synthetic route.
4. Add a single GSS competition UI only after explicit approval.
5. Keep production deployment and public AI enablement as separate approvals.
