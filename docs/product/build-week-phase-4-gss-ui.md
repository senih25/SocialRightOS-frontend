# Build Week Phase 4 — Synthetic GSS Explanation UI

## Scope

This local slice adds one post-result competition panel to the existing GSS tool. It uses
the default-off synthetic guidance endpoint and does not pass the eligibility response,
form answers, status, decision identifier, request identifier, or validation carrier into
the new client boundary.

The existing GSS assessment route, canonical eligibility endpoint, request payload, result
presentation, CTA destinations, analytics events and status copy remain unchanged. The
panel is not rendered when the existing presentation mapper fails closed.

```text
PRIMARY_PILOT=GSS
SYNTHETIC_UI_IMPLEMENTED=YES
EXISTING_ASSESSMENT_CONTRACT_CHANGE_COUNT=0
CANONICAL_ENDPOINT_CHANGE_COUNT=0
ELIGIBILITY_PAYLOAD_CHANGE_COUNT=0
EXISTING_CTA_CHANGE_COUNT=0
EXISTING_ANALYTICS_CHANGE_COUNT=0
REAL_USER_DATA_TO_GUIDANCE_ROUTE_COUNT=0
```

## Interaction states

The panel has four explicit states:

1. `IDLE`: explains the authority and data-minimization boundary.
2. `LOADING`: keeps the trigger in the document, disables duplicate activation and
   announces progress.
3. `AVAILABLE`: renders one allowlisted reason and one allowlisted next step as semantic
   lists, followed by an application-owned non-decision disclaimer.
4. `UNAVAILABLE`: preserves the deterministic assessment result, exposes no technical
   detail and disables retry for the current mounted result.

The client parser independently enforces exact response keys, evidence IDs, collection
sizes and text limits. Network, HTTP, JSON and shape failures all collapse to the same
synthetic `UNAVAILABLE` model. Terminal state receives programmatic focus and is also
announced through a polite atomic live region.

## Visual verification

This is a narrow extension of the existing GSS result design system, not a page redesign;
no new generated image or visual asset is required. Browser verification covered the full
synthetic interaction in the existing page.

```text
DESKTOP_VIEWPORT=1440x900_PASS
MOBILE_VIEWPORT=390x844_PASS
MOBILE_OVERFLOW_PX=0
STICKY_HEADER_SCROLL_OCCLUSION=FIXED_WITH_SCROLL_MARGIN
IDLE_STATE_VISUAL=PASS
UNAVAILABLE_STATE_VISUAL=PASS
KEYBOARD_TRIGGER=PASS
ARIA_LIVE=POLITE_ATOMIC
SEMANTIC_LISTS=PASS
TEMPORARY_QA_ARTIFACTS_TRACKED=0
```

The only browser console error observed in development was the repository's CSP blocking
React development-mode `eval()` diagnostics. The production build does not use that
development behavior.

## Quality gates

```text
TARGETED_TESTS=21/21_PASS
ALL_TESTS=264/264_PASS
NEW_GSS_UI_TESTS=5/5_PASS
TYPECHECK=PASS
LINT=PASS
PRODUCTION_BUILD=PASS
SECRET_SCAN=PASS
DIFF_CHECK=PASS
UNEXPECTED_CHANGE_COUNT=0
```

## Cost and release boundary

The route remained disabled during browser verification. Every synthetic panel request
returned detail-free `503 / UNAVAILABLE`; no OpenAI request or paid operation occurred.

```text
LIVE_OPENAI_API_CALL_COUNT=0
PAID_API_USAGE_USD=0
REMOTE_DATABASE_CHANGE_COUNT=0
CLOUD_CHANGE_COUNT=0
DEPLOYMENT_COUNT=0
PUBLIC_ENABLEMENT=NO
```

Next gate: verify the database migration on an approved isolated remote PostgreSQL runtime,
then run one explicitly approved end-to-end synthetic success/failure budget test before
any public deployment.
