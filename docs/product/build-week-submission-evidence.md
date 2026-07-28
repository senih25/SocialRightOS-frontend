# OpenAI Build Week - Submission Evidence

## Purpose

This record separates verified implementation and deployment evidence from owner actions
that still require manual confirmation. It must not be treated as a submission receipt.

```text
EVIDENCE_RECORDED_AT=2026-07-20
COMPETITION_PRODUCT=SocialRightOS
TRACK=Apps for Your Life
PRIMARY_DEMO=GSS preliminary assessment
PUBLIC_REPOSITORY=https://github.com/senih25/SocialRightOS-frontend
PUBLIC_DEMO=https://social-right-os-frontend.vercel.app/gss-gelir-testi
```

## Competition-period provenance

The broader product and deterministic assessment flows existed before Build Week. The
competition extension begins after `1cee954469bb9bf1c452271510c9f1a80afcc2b0`.

```text
COMPETITION_BASE_SHA=1cee954469bb9bf1c452271510c9f1a80afcc2b0
FIRST_EXTENSION_COMMIT=b615476e9beacf217e3c12a856403d16e4ece264
FINAL_IMPLEMENTATION_SHA=fd473bced8ddbe4cc6080648ae26542b82bcc284
IMPLEMENTATION_COMMIT_COUNT=16
IMPLEMENTATION_PR=https://github.com/senih25/SocialRightOS-frontend/pull/30
IMPLEMENTATION_CI_URL=https://github.com/senih25/SocialRightOS-frontend/actions/runs/29723388175/job/88290974279
IMPLEMENTATION_CI=PASS
FINAL_SUBMISSION_SHA=PENDING_PHASE_8_MERGE
PRIMARY_CODEX_SESSION_ID=NEEDS_USER_ACTION
```

The exact implementation diff is reproducible with:

```bash
git diff --stat 1cee954469bb9bf1c452271510c9f1a80afcc2b0..fd473bced8ddbe4cc6080648ae26542b82bcc284
git diff --name-only 1cee954469bb9bf1c452271510c9f1a80afcc2b0..fd473bced8ddbe4cc6080648ae26542b82bcc284
```

## Authority and data boundary

```text
DETERMINISTIC_ASSESSMENT_AUTHORITY=UNCHANGED
MODEL_ELIGIBILITY_AUTHORITY=NO
MODEL_INPUT=ALLOWLISTED_SYNTHETIC_EVIDENCE_ONLY
RAW_FORM_ANSWERS_TO_MODEL=NO
DECISION_ID_TO_MODEL=NO
VALIDATION_CARRIER_TO_MODEL=NO
EXACT_EVIDENCE_ID_COVERAGE=ENFORCED
SEMANTIC_FIDELITY_GUARD=ENFORCED
PROVIDER_INPUT_DEEP_FREEZE=ENFORCED
FAIL_CLOSED_OUTPUT=UNAVAILABLE
REAL_USER_DATA_COUNT=0
```

GPT-5.6 may restate the selected reason and next-step evidence. It cannot create, reverse
or strengthen an eligibility decision. The application rejects missing, extra, unknown
or duplicate evidence IDs and rejects known decision reversals, guarantees and certainty
escalations.

## Verified quality evidence

```text
NODE_VERSION_CI=22.x
TESTS=276/276_PASS
LINT=PASS
TYPECHECK=PASS
PRODUCTION_BUILD=PASS
SECRET_SCAN=PASS
DIFF_CHECK=PASS
PRODUCTION_AUDIT_VULNERABILITY_COUNT=0
RELEASE_BLOCKING_FINDING_COUNT=0
```

PR 30 passed the repository test workflow and Vercel preview checks before its verified
head was merged into `main`.

## Runtime and cost controls

```text
POSTGRES_RUNTIME=NEON_FREE
RUNTIME_ROLE=socialright_runtime
DIRECT_TABLE_ACCESS=DENIED
ATOMIC_BUDGET_GUARD=PASS
HARD_SPEND_LIMIT_USD=5.00
MAXIMUM_SINGLE_REQUEST_RESERVATION_USD=0.01
PUBLIC_EDGE_RATE_LIMIT=10_REQUESTS_PER_600_SECONDS_PER_IP
LIVE_SYNTHETIC_GPT_CALL_COUNT=1
VERIFIED_COMMITTED_COST_USD=0.000850
OPEN_BUDGET_RESERVATION_USD=0
SECRET_EXPOSURE_COUNT=0
```

The database stores only request-control hashes, leases, timestamps and aggregate budget
state. The live provider key and HMAC secret are server-side sensitive environment
variables and are not present in the repository or client bundle.

## Deployment and judge access

```text
VERCEL_PROJECT=social-right-os-frontend
DEPLOYMENT_ID=dpl_G1FE5GMrW7MLaYAR2SzKX6ce5gYS
DEPLOYMENT_CREATED_AT=2026-07-20T08:49:07Z
DEPLOYMENT_STATE=READY
PUBLIC_ALIAS=https://social-right-os-frontend.vercel.app
JUDGE_ACCESS=PASS
SYNTHETIC_DEMO_ONLY=YES
CUSTOM_DOMAIN_CHANGE_COUNT=0
DNS_CHANGE_COUNT=0
BILLING_CHANGE_COUNT=0
UNEXPECTED_DEPLOYMENT_COUNT=0
```

Immediately before the single CLI deployment, clean local `main` and `origin/main` both
resolved to `fd473bced8ddbe4cc6080648ae26542b82bcc284`. The deployment is `READY`, the
public alias points to it, and anonymous route checks pass. Vercel did not attach Git
metadata to this CLI-created deployment, so the provider-side source SHA remains an
explicit evidence limitation:

```text
LOCAL_DEPLOYMENT_SOURCE_SHA=VERIFIED_CURRENT
VERCEL_GIT_SOURCE_SHA=NEEDS_VERIFICATION
FINAL_DEPLOYMENT_SHA_MATCH=NEEDS_PROVIDER_METADATA_OR_GIT_TRIGGERED_REDEPLOYMENT
```

No additional deployment is authorized by this document.

## Judge walkthrough

1. Open <https://social-right-os-frontend.vercel.app/gss-gelir-testi>.
2. Enter fabricated values only and complete the preliminary assessment.
3. Select **Sentetik açıklamayı oluştur** once.
4. Verify that the result remains application-owned and the model explanation is shown in
   the separate evidence-bound panel.
5. Verify the explicit non-official-decision disclaimer.

Expected fail-closed behavior: malformed, unavailable, over-budget, repeated or unsafe
requests return a generic unavailable state without provider detail, raw response or
validation-carrier exposure.

## Remaining owner and submission gates

These items cannot be inferred or completed from repository access:

```text
RULES_RECHECKED_BEFORE_SUBMISSION=NEEDS_FINAL_MANUAL_VERIFICATION
ENTRANT_ELIGIBILITY=NEEDS_OWNER_CONFIRMATION
AGE_OF_MAJORITY=NEEDS_OWNER_CONFIRMATION
CONFLICTS_OF_INTEREST=NEEDS_OWNER_CONFIRMATION
LICENSE_EVALUATION_PERMISSION=NEEDS_OWNER_CONFIRMATION
PRIMARY_CODEX_SESSION_ID=NEEDS_USER_ACTION
PUBLIC_YOUTUBE_VIDEO=NOT_CREATED
DEVPOST_SUBMISSION=NOT_CREATED
DEVPOST_SUBMISSION_RECEIPT=NOT_RECORDED
```

The repository remains under its existing All Rights Reserved notice. This evidence file
does not modify that license or grant additional rights.

## Non-claims

```text
OFFICIAL_ELIGIBILITY_DECISION=NO
ALL_HALLUCINATIONS_DETECTED=NO
ALL_SEMANTIC_VIOLATIONS_DETECTED=NO
LEGAL_OR_REGULATORY_COMPLIANCE_GUARANTEE=NO
MEASURED_POPULATION_SCALE_IMPACT=NO
GENERIC_CONTROL_PLANE_IMPLEMENTED=NO
```
