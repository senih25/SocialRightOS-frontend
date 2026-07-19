# Build Week Phase 3 — Evidence-Locked GPT-5.6 Provider

## Scope

This phase adds a server-only GPT-5.6 Luna provider and an application-side atomic
reservation boundary. It does not add a route, UI integration, deployment, or public AI
enablement. Existing `AssessmentResult` contracts and deterministic eligibility behavior
remain unchanged.

```text
BASE_SHA=a278981fdda7456cfaf8e8c996278680f056f661
MODEL=gpt-5.6-luna
ENDPOINT=POST /v1/responses
AI_GUIDANCE_ENABLED_DEFAULT=false
PUBLIC_AI_ENABLEMENT=NO
ASSESSMENT_CONTRACT_CHANGE_COUNT=0
USER_VISIBLE_BEHAVIOR_CHANGE_COUNT=0
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

## Spend-control boundary

The accepted workspace ceiling is represented as `5_000_000` USD micros ($5). Prices are
not hard-coded because model pricing is externally maintained. Deployment must inject the
current input and output prices as integer USD micros per one million tokens and choose a
conservative per-request reservation that covers the fixed token limits.

The reference store serializes reserve, settle and release operations inside one Node.js
process. It is suitable for local evaluation and a single long-lived demo process. It is
not a globally durable budget across serverless instances or restarts. Public enablement
therefore remains blocked until the same `RightsGuidanceAtomicBudgetStore` contract is
backed by a durable transactional service.

```text
ATOMIC_SINGLE_PROCESS_STORE=IMPLEMENTED
DURABLE_MULTI_INSTANCE_STORE=NOT_IMPLEMENTED
PUBLIC_ENABLEMENT=BLOCKED_BY_DURABLE_BUDGET_STORE
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

1. Back the budget interface with a durable transactional store.
2. Add one synthetic server route behind `AI_GUIDANCE_ENABLED=false` by default.
3. Run semantic-fidelity and cost-exhaustion end-to-end tests.
4. Add a single GSS pilot UI only after explicit approval.
5. Keep production deployment and public AI enablement as separate approvals.
