# Build Week Phase 5 — Generalization Proof

## Objective

Prove that the existing evidence-bound guidance contract supports both the primary GSS
pilot and one synthetic `TR_OLD_AGE_PENSION` fixture without adding a second user
interface, runtime scenario, provider contract or eligibility decision path.

## Implemented proof

The proof exercises the same exported functions for both assessment types:

```text
buildRightsGuidanceInput
→ DeterministicRightsGuidanceMockProvider
→ generateRightsGuidanceExplanation
→ exact evidence validation
→ EXPLANATION_AVAILABLE | UNAVAILABLE
```

Both fixtures use explicit approved evidence IDs, application-owned authority copy and
synthetic text. The old-age negative fixture preserves its negative meaning. Missing
old-age evidence fails closed to `UNAVAILABLE`.

```text
PRIMARY_PILOT=GSS
SECONDARY_PILOT=TR_OLD_AGE_PENSION
SYNTHETIC_FIXTURE_COUNT=2
SECOND_FULL_UI_FLOW=NO
SECOND_RUNTIME_SCENARIO=NO
COMMON_CONTRACT_FORK_COUNT=0
ASSESSMENT_CONTRACT_CHANGE_COUNT=0
ELIGIBILITY_DECISION_PATH_CHANGE_COUNT=0
REAL_USER_DATA_COUNT=0
```

## Boundaries

- No `src/app/**` file is changed.
- No route, endpoint, payload, CTA, analytics or assessment status is changed.
- No old-age competition panel is rendered.
- No live provider, OpenAI request, database, cloud or deployment operation occurs.
- No raw backend response, validation carrier or decision identifier enters the guidance
  input.

## Verification gate

The dedicated test must prove:

1. both assessment types pass through the same input builder;
2. application-owned heading, limitations and disclaimer stay outside model input;
3. the same provider-independent pipeline preserves exact evidence coverage;
4. an incomplete old-age output fails closed;
5. no second UI or runtime scenario is introduced.

```text
TARGETED_GENERALIZATION_TESTS=5/5_PASS
TARGETED_REGRESSION_TESTS=38/38_PASS
ALL_TESTS=269/269_PASS
TYPECHECK=PASS
LINT=PASS
PRODUCTION_BUILD=PASS
SECRET_SCAN=PASS
DIFF_CHECK=PASS
UNEXPECTED_CHANGE_COUNT=0
LIVE_API_CALL_COUNT=0
PAID_API_USAGE_USD=0
```
