# OpenAI Build Week - SocialRightOS Competition Roadmap

## 1. Decision record

```text
ROADMAP_DATE=2026-07-19
COMPETITION=OpenAI Build Week
COMPETITION_PRODUCT=SocialRightOS
TRACK=Apps for Your Life
PRIMARY_DEMO=GSS preliminary assessment
SECONDARY_PROOF=TR_OLD_AGE_PENSION contract generalization
CORE_IDEA=Authority-separated, evidence-bound AI explanation
NEW_PRODUCT_PIVOT=NO
GENERIC_PLATFORM_IMPLEMENTATION=DEFERRED
```

SocialRightOS remains the only competition product. The Build Week addition is a narrow
explanation layer that converts approved evidence from a deterministic preliminary
assessment into plain-language guidance. GPT-5.6 cannot make, alter, or override the
assessment outcome.

The long-term EvidenceBound Core idea is architecture context only. It is not a second
competition brand and is not presented as an implemented multi-domain platform.

## 2. Official-rule baseline

The official rules are the source of truth and may be amended. Re-read them immediately
before final submission.

Sources:

- [OpenAI Build Week official rules](https://openai.devpost.com/rules)
- [OpenAI API supported countries](https://developers.openai.com/api/docs/supported-countries)

Verified-current rule snapshot:

| Requirement | Verified rule | SocialRightOS action |
| --- | --- | --- |
| Registration deadline | July 21, 2026 at 5:00 PM PT | Complete before July 22, 2026 at 03:00 TRT |
| Submission deadline | July 21, 2026 at 5:00 PM PT | Internal submission cutoff: July 22, 2026 at 00:30 TRT |
| Required tools | Project built with Codex and GPT-5.6 | Show both in product evidence and video |
| Existing project | Allowed only if meaningfully extended during the submission period | Clearly separate pre-existing product from post-July-13 competition work |
| Functionality | Must install/run consistently and match the video and description | Judge-accessible tested deployment required |
| Demo video | Public YouTube, with audio, under three minutes for guaranteed review | Target 2:40; show working product, Codex, and GPT-5.6 |
| Repository | Public with relevant licensing, or private and shared with both judge addresses | Select one path and verify access before submission |
| README | Explain Codex collaboration and human decisions | Add provenance and evidence section |
| Codex evidence | `/feedback` Session ID for the main project thread | Capture after core competition functionality is complete |
| Language | English or complete English translations | Submission, README competition section, video narration and test instructions in English |
| Testing access | Free and unrestricted through the judging period | Provide stable demo URL and synthetic test instructions |
| Third-party components | Authorized and license-compliant | Maintain dependency, asset, data-source and trademark inventory |
| Submission modifications | No substantive change after deadline | Freeze all submitted URLs, text and evidence before cutoff |

Turkey is currently listed as an OpenAI API-supported country. Personal eligibility,
age-of-majority status, conflicts of interest, team representation and prize/tax details
still require entrant confirmation and cannot be inferred from the repository.

The optional Devpost plugin is not required. The deadline for requesting the stated
competition credits has passed; the plan must not depend on receiving them.

## 3. Judging strategy

Stage One is pass/fail viability and required-tool fit. A mock-only implementation is not
enough: the submitted product must contain a working GPT-5.6 integration.

Stage Two uses four equally weighted criteria:

| Criterion | Proof strategy |
| --- | --- |
| Technological Implementation | Working GPT-5.6 provider, strict contracts, adversarial tests, fail-closed behavior, final CI and Codex provenance |
| Design | One coherent result-to-explanation experience, accessible states and a short comprehensible demo |
| Potential Impact | Specific citizen comprehension problem, honest unmeasured-impact statement and a controlled evaluation plan |
| Quality of the Idea | Clear separation of model capability from assessment authority |

Tie-breaking starts with the first criterion. Technical implementation evidence must be
visible and understandable, not merely described.

Jury thesis:

> SocialRightOS turns deterministic preliminary social-benefit assessments into
> plain-language, evidence-bound guidance while preventing GPT-5.6 from making or
> changing eligibility outcomes.

Claims that must not be made:

```text
OFFICIAL_ELIGIBILITY_DECISION=NO
ALL_HALLUCINATIONS_DETECTED=NO
ALL_SEMANTIC_VIOLATIONS_DETECTED=NO
LEGAL_OR_REGULATORY_COMPLIANCE_GUARANTEE=NO
MEASURED_POPULATION_SCALE_IMPACT=NO
GENERIC_CONTROL_PLANE_IMPLEMENTED=NO
```

## 4. Current verified state

```text
COMPETITION_BASE_SHA=1cee954469bb9bf1c452271510c9f1a80afcc2b0
CURRENT_SLICE_PARENT_SHA=167d47e68330e272b6bf85c80a401bdf24f93320
PHASE_4_IMPLEMENTATION_SHA=b9e349613706677c1845530c5fdef996f45d7a71
FINAL_IMPLEMENTATION_SHA=fd473bced8ddbe4cc6080648ae26542b82bcc284
IMPLEMENTATION_PR=https://github.com/senih25/SocialRightOS-frontend/pull/30
IMPLEMENTATION_CI=PASS
OFFLINE_CORE_IMPLEMENTED=YES
OFFLINE_CONTRACT_NARROWED=YES
LIVE_GPT_5_6_PROVIDER=DEPLOYED_AND_SYNTHETICALLY_VERIFIED
DURABLE_POSTGRES_GUARDS=NEON_VERIFIED
SYNTHETIC_SERVER_ROUTE=PUBLIC_FAIL_CLOSED
COMPETITION_UI=PUBLIC_SYNTHETIC_DEMO
LOCAL_TESTS=276/276_PASS
OFFLINE_GUIDANCE_TESTS=23/23_PASS
NEW_ROUTE_RUNTIME_TESTS=10/10_PASS
NEW_GSS_UI_TESTS=5/5_PASS
TYPECHECK=PASS
LINT=PASS
PRODUCTION_BUILD=PASS
UNEXPECTED_CHANGE_COUNT=0
SECRET_EXPOSURE_COUNT=0

FINAL_COMPETITION_COMMIT=PENDING_PHASE_8_MERGE
GITHUB_CI=PASS_PR_30
JUDGE_DEPLOYMENT=READY
JUDGE_ACCESS=PASS
DEPLOYMENT_ID=dpl_G1FE5GMrW7MLaYAR2SzKX6ce5gYS
DEPLOYMENT_SOURCE_SHA=LOCAL_VERIFIED_PROVIDER_METADATA_PENDING
YOUTUBE_DEMO=NOT_CREATED
DEVPOST_SUBMISSION=NOT_CREATED
PRIMARY_CODEX_SESSION_ID=NOT_CAPTURED
```

Core competition files include:

- `src/lib/rights-guidance.ts`
- `src/lib/rights-guidance.test.ts`
- `src/lib/openai-rights-guidance.ts`
- `src/lib/build-week-guidance-route.ts`
- `src/lib/build-week-guidance-runtime.ts`
- `src/app/api/build-week/rights-guidance/route.ts`
- `docs/product/build-week-rights-guidance-explanation.md`

The provider output contract has been narrowed to evidence-bound reason and next-step
collections. Application-owned copy is kept outside the model input and output. Live
provider, default-off synthetic route and competition UI are implemented locally; remote
durable runtime, deployment and public enablement remain gated.

### 4.1 Codex Desktop session continuity

Development continued in a newly authenticated Codex Desktop operator session after the
previous application sign-in became unavailable. This is an operator-session continuity
event only: it does not change the entrant, repository, product ownership, Git history,
competition scope or technical authority boundaries.

No account email, account identifier, credential, token, billing detail or authentication
artifact is stored in the repository. Repository commits, verified test output and the
final Codex session evidence remain the authoritative provenance chain.

Controls for all subsequent work:

- continue only from the verified branch and commit recorded above;
- treat the original dirty worktree as user-owned and keep competition work isolated;
- re-check GitHub, OpenAI API and deployment authentication independently before any
  external write, because Codex Desktop authentication does not prove those sessions;
- never copy secrets or browser-session material between accounts through repository
  files, chat, logs or screenshots;
- record the final primary Codex Session ID and exact commit range at submission time;
- stop on repository/SHA mismatch, unexpected worktree changes or uncertain external
  account authorization.

```text
CODEX_DESKTOP_SESSION_CONTINUITY=VERIFIED
ENTRANT_CHANGE_COUNT=0
REPOSITORY_CHANGE_COUNT=0
OWNERSHIP_CHANGE_COUNT=0
SCOPE_CHANGE_COUNT=0
CREDENTIAL_MIGRATION_VIA_REPOSITORY=NO
EXTERNAL_ACCOUNT_AUTHORIZATION=REVERIFY_BEFORE_WRITE
```

## 5. Locked product contract

### 5.1 Authority boundary

```text
DETERMINISTIC_SYSTEM:
- produces the preliminary assessment
- owns the display status and heading
- owns approved limitations and disclaimers
- owns approved evidence catalog and next-step catalog

GPT_5_6:
- receives an explicitly constructed allowlisted object
- restates one approved evidence item at a time
- cannot create an evidence identifier
- cannot change or reinterpret the assessment outcome
- cannot execute an external action
```

### 5.2 Model input

Primary control is allowlisted construction, not redaction of a raw payload.

Allowed:

```text
assessmentType
coarseDisplayStatus
approvedReasons[evidenceId, approvedText]
approvedNextSteps[evidenceId, approvedText]
validAsOf
basisVersion
```

Forbidden:

```text
raw form answers
free-text user input
names and contact details
personal identifiers
decision IDs and identity state
household-member data
income amounts
health or disability details
benefit extension payloads
raw backend response
validation carrier
rule trace
secrets, tokens or cookies
```

### 5.3 Model output

Remove the free-form summary. Use application-owned headings and limitations.

```ts
interface RightsGuidanceExplanation {
  reasonExplanations: Array<{
    evidenceId: string;
    plainLanguageText: string;
  }>;
  nextStepExplanations: Array<{
    evidenceId: string;
    plainLanguageText: string;
  }>;
}
```

### 5.4 Validation guarantees

Deterministic controls:

- exact JSON schema and key set;
- known and non-duplicated evidence IDs;
- exact selected-evidence set equality;
- output length and collection limits;
- prohibited output/action types;
- no raw carrier fields;
- provider mode and kill-switch enforcement.

Heuristic risk reduction:

- unsupported concrete-claim scan;
- certainty-language scan;
- meaning-preservation checks;
- sensitive-output scan.

The product may claim that structural and known-evidence violations are blocked. It must
not claim complete semantic-hallucination detection.

## 6. Execution roadmap

Every phase is gated. A failed gate stops progression; it does not authorize widening the
scope.

### Phase 0 - Entrant and submission preflight

Tasks:

- Join the hackathon on Devpost if not already registered.
- Confirm individual/team entrant type and authorized representative.
- Confirm age-of-majority and country eligibility.
- Confirm no sponsor/administrator conflict or disqualifying support.
- Select repository-access path:
  - public repository plus explicit evaluation/testing permission; or
  - private repository shared with `testing@devpost.com` and
    `build-week-event@openai.com`.
- Confirm the selected public assets, fonts, screenshots and music are licensed.

Gate:

```text
DEVPOST_REGISTRATION=PASS
ENTRANT_ELIGIBILITY=CONFIRMED_BY_USER
REPOSITORY_ACCESS_STRATEGY=LOCKED
THIRD_PARTY_RIGHTS_INVENTORY=PASS
```

### Phase 1 - Narrow the offline contract

Tasks:

- Remove `plainLanguageSummary` from the provider output.
- Make heading, status, limitations and disclaimer application-owned.
- Preserve only per-evidence reason and next-step restatements.
- Add tests for extra keys, cross-section evidence IDs and empty collections.
- Add tests proving assessment status and existing user behavior remain unchanged.
- Document deterministic versus heuristic validation guarantees.

Gate:

```text
FREE_FORM_SUMMARY_COUNT=0
APPLICATION_OWNED_HEADING=PASS
APPLICATION_OWNED_LIMITATIONS=PASS
ASSESSMENT_CONTRACT_CHANGE_COUNT=0
EXISTING_USER_BEHAVIOR_CHANGE_COUNT=0
LOCAL_QUALITY=PASS
```

Current implementation status:

```text
PHASE_1_IMPLEMENTATION=COMPLETED_LOCALLY
FREE_FORM_SUMMARY_COUNT=0
APPLICATION_OWNED_HEADING=PASS
APPLICATION_OWNED_LIMITATIONS=PASS
ASSESSMENT_CONTRACT_CHANGE_COUNT=0
EXISTING_USER_BEHAVIOR_CHANGE_COUNT=0
NEW_GUIDANCE_TESTS=19/19_PASS
LOCAL_QUALITY=PASS
```

### Phase 1.1 - Rights guidance hardening

The pre-live security review produced three latent boundary findings. They are closed in
the offline contract before any live model or user-facing integration is authorized:

- bidirectional positive/negative meaning reversal is rejected;
- official eligibility decisions, guarantees and elevated certainty are rejected;
- returned evidence IDs must equal the selected reason and next-step evidence sets;
- provider input is independently cloned and deeply frozen;
- validation uses a second clone that the provider cannot access;
- raw scan artifacts remain outside the repository and are covered by root ignore rules.

Gate:

```text
PHASE_1_1_HARDENING=COMPLETED_LOCALLY
SEMANTIC_FIDELITY_GUARD=PASS
EXACT_EVIDENCE_COVERAGE=PASS
PROVIDER_INPUT_ISOLATION=PASS
RAW_SCAN_ARTIFACT_POLICY=PASS
NEW_GUIDANCE_TESTS=23/23_PASS
LIVE_API_CALL_COUNT=0
PAID_API_USAGE=0
```

### Phase 2 - Live API and spend-control preflight

No key may be pasted into chat, committed, logged, returned to the browser or placed in a
public environment variable.

Required user/account confirmations:

```text
OPENAI_API_PROJECT_CREATED=YES
BILLING_ACTIVE=YES
GPT_5_6_MODEL_ALLOWED=YES
ACCEPTED_MAXIMUM_SPEND_USD=<user-approved amount>
```

Tasks:

- Use a dedicated project-scoped API key.
- Allow only the selected GPT-5.6 model; primary candidate is `gpt-5.6-luna`.
- Set conservative project rate limits and budget alerts.
- Fix maximum input and output tokens.
- Select and document an application-side atomic spend-control mechanism.
- Keep `AI_GUIDANCE_ENABLED=false` by default.
- Perform one synthetic, minimal server-side Responses API call.
- Record HTTP result, actual model, structured-output result and token usage without
  recording the key or prompt content.

Gate:

```text
SYNTHETIC_MINIMAL_API_CALL=PASS
PROJECT_SCOPED_KEY=PASS
SERVER_SIDE_SECRET_ONLY=PASS
STRUCTURED_OUTPUT=PASS
TOKEN_USAGE_RECORDED=PASS
ATOMIC_SPEND_CONTROL_DESIGN=APPROVED
```

### Phase 3 - Live provider and cost guard

Tasks:

- Implement one server-side GPT-5.6 provider behind the existing provider interface.
- Reject browser-side provider construction.
- Enforce kill switch before reservation or network access.
- Atomically reserve worst-case request cost before the call.
- Settle the reservation using actual usage after success.
- Keep uncertain failed-call reservations counted until verified operator reconciliation.
- Enforce global budget, per-client limit and one generation per assessment version.
- Log minimized operational metadata only.
- Map timeout, quota, provider, schema and validation failures to `UNAVAILABLE`.

Gate:

```text
LIVE_PROVIDER_TESTS=PASS
HARD_SPEND_CAP=PASS
CONCURRENT_RESERVATION_TEST=PASS
KILL_SWITCH_TEST=PASS
RAW_PROMPT_LOG_COUNT=0
SECRET_EXPOSURE_COUNT=0
DETERMINISTIC_ASSESSMENT_STATUS=UNCHANGED
```

Current local implementation adds the provider, atomic in-memory reference guards,
PostgreSQL-backed durable adapters/migration and a default-off synthetic-only server
route. Public enablement is still blocked until an approved remote PostgreSQL runtime,
route-level cost-exhaustion verification and release review are complete.

```text
SYNTHETIC_SERVER_ROUTE=IMPLEMENTED_LOCALLY
ROUTE_DEFAULT_STATE=OFF
ROUTE_REAL_USER_DATA_ACCEPTANCE=NO
REMOTE_DURABLE_RUNTIME=NOT_CONFIGURED
PUBLIC_ENABLEMENT=NO
```

### Phase 4 - GSS competition integration

Tasks:

- Build one approved synthetic GSS evidence catalog.
- Integrate the explanation trigger into the existing GSS result experience.
- Keep the current assessment route, endpoint, payload, CTA and analytics contract unless
  a separately reviewed change is essential to the new explanation control.
- Clearly label the explanation as preliminary guidance, not an official decision.
- Show the application-owned heading, approved limitations and evidence-linked text.
- Provide loading, success, `UNAVAILABLE`, retry-disabled and kill-switch states.
- Ensure keyboard operation, focus order, screen-reader announcement and reduced-motion
  behavior.
- Do not expose debug input, raw provider output or identifiers in the public UI.

Gate:

```text
PRIMARY_PILOT=GSS
GSS_VALID_EXPLANATION=PASS
GSS_FAIL_CLOSED=PASS
API_ERROR_SEPARATION=PASS
ACCESSIBILITY=PASS
RAW_BACKEND_RESPONSE_EXPOSURE_COUNT=0
VALIDATION_CARRIER_EXPOSURE_COUNT=0
PERSONAL_DATA_TO_MODEL_COUNT=0
```

### Phase 5 - Generalization proof

Tasks:

- Use the same contract for one synthetic old-age-pension fixture.
- Do not build a second full UI flow.
- Demonstrate through tests that the provider-independent contract accepts both assessment
  types without changing the common core.

Gate:

```text
SECONDARY_PILOT=TR_OLD_AGE_PENSION
SECOND_FULL_UI_FLOW=NO
COMMON_CONTRACT_FORK_COUNT=0
GENERALIZATION_TEST=PASS
```

Current local implementation status:

```text
PHASE_5_GENERALIZATION_PROOF=IMPLEMENTED_LOCALLY
SECONDARY_PILOT=TR_OLD_AGE_PENSION
SECOND_FULL_UI_FLOW=NO
SECOND_RUNTIME_SCENARIO=NO
COMMON_CONTRACT_FORK_COUNT=0
ASSESSMENT_CONTRACT_CHANGE_COUNT=0
LIVE_API_CALL_COUNT=0
GENERALIZATION_TESTS=5/5_PASS
LOCAL_QUALITY=PASS
```

### Phase 6 - Security, evaluation and release candidate

Adversarial suite:

- prompt-injection strings in forbidden input fields;
- unknown, duplicate and cross-section evidence IDs;
- malformed structured output;
- unsupported URLs, amounts, agencies and external actions;
- certainty and official-decision language;
- provider timeout, quota and malformed response;
- concurrent spend reservations;
- secret, PII, raw backend and validation-carrier scans;
- stale or revoked evidence fixture;
- kill switch before and during a controlled request.

Required quality gates:

```text
TYPECHECK=PASS
LINT=PASS
ALL_TESTS=PASS
PRODUCTION_BUILD=PASS
DIFF_CHECK=PASS
SECRET_SCAN=PASS
DEPENDENCY_LICENSE_REVIEW=PASS
UNEXPECTED_CHANGE_COUNT=0
```

Release process:

- Create a narrow commit and pull request.
- Wait for GitHub CI success.
- Perform an independent review focused on policy boundaries and data minimization.
- Merge only the verified head SHA.
- Re-run the complete quality pipeline on the merge SHA.
- Record final main SHA, CI URL, test count and changed-file scope.

Current local Phase 6A status:

```text
PHASE_6A_SECURITY_EVALUATION=IMPLEMENTED_LOCALLY
STALE_REVOKED_EVIDENCE_GUARD=PASS
PROVIDER_TIMEOUT_GUARD=PASS
IN_FLIGHT_KILL_SWITCH=PASS
DEFAULT_OFF_UI_GATE=PASS
JSON_LD_SCRIPT_CLOSING_GUARD=PASS
PRODUCTION_AUDIT_VULNERABILITY_COUNT=0
FULL_AUDIT_VULNERABILITY_COUNT=0
MISSING_LICENSE_METADATA_COUNT=0
RELEASE_BLOCKING_FINDING_COUNT=0
DEFERRED_CSP_HARDENING_COUNT=1
CLIENT_NONCE_SECURITY_IDENTITY=NO
PUBLIC_EDGE_RATE_LIMIT=PASS_10_REQUESTS_PER_600_SECONDS_PER_IP
PUBLIC_ENABLEMENT_BLOCKING_FINDING_COUNT=0
LOCAL_NODE_VERSION=24.14.0
REQUIRED_CI_NODE_VERSION=22.x
NODE22_CI_VERIFICATION=PASS
PUBLIC_ENABLEMENT=YES_SYNTHETIC_DEMO_ONLY
```

### Phase 7 - Judge deployment

Tasks:

- Use a dedicated competition deployment or explicitly approved existing deployment.
- Confirm source repository, branch and exact final SHA.
- Configure the server-side secret only in the approved environment.
- Keep custom-domain, DNS and unrelated production changes outside this task.
- Run synthetic GSS success and fail-closed smoke tests.
- Run desktop, mobile, keyboard, privacy and security checks.
- Confirm that judges can use the demo free of charge throughout judging.
- Document rollback and kill-switch procedure.

Gate:

```text
DEPLOYMENT_STATE=READY
DEPLOYMENT_SOURCE_SHA=<final competition SHA>
JUDGE_ACCESS=PASS
SYNTHETIC_DEMO_ONLY=YES
REAL_USER_DATA_COUNT=0
UNEXPECTED_DEPLOYMENT_COUNT=0
```

Executed Phase 7 status on 2026-07-20:

```text
DEPLOYMENT_ID=dpl_G1FE5GMrW7MLaYAR2SzKX6ce5gYS
DEPLOYMENT_STATE=READY
PUBLIC_ALIAS=https://social-right-os-frontend.vercel.app
LOCAL_DEPLOYMENT_SOURCE_SHA=fd473bced8ddbe4cc6080648ae26542b82bcc284
VERCEL_GIT_SOURCE_SHA=NEEDS_VERIFICATION
JUDGE_ACCESS=PASS
SYNTHETIC_DEMO_ONLY=YES
REAL_USER_DATA_COUNT=0
UNEXPECTED_DEPLOYMENT_COUNT=0
HARD_SPEND_LIMIT_USD=5.00
VERIFIED_COMMITTED_COST_USD=0.000850
OPEN_BUDGET_RESERVATION_USD=0
```

The deployment was created once from a clean local `main` matching `origin/main`. Because
the Vercel CLI deployment does not expose Git source metadata, provider-side SHA matching
remains a final evidence gate. See
[`build-week-submission-evidence.md`](build-week-submission-evidence.md).

### Phase 8 - Repository and submission evidence

README competition section:

- problem and target user;
- what existed before July 13, 2026;
- what was added during Build Week;
- architecture and authority boundary;
- exact GPT-5.6 role;
- exact Codex role;
- human-owned product, legal, privacy, budget and release decisions;
- local install and test commands;
- public demo instructions and synthetic fixtures;
- known limitations and non-claims;
- final SHA, CI URL and test evidence;
- licensing/evaluation permission.

Codex provenance:

```text
START_SHA
FINAL_SHA
COMMIT_RANGE
PRIMARY_CODEX_SESSION_ID
KEY_HUMAN_DECISIONS
FINAL_TEST_COUNT
FINAL_CI_URL
```

Current Phase 8 preparation status:

```text
README_COMPETITION_SECTION=IMPLEMENTED_LOCALLY
SUBMISSION_EVIDENCE_RECORD=IMPLEMENTED_LOCALLY
PUBLIC_REPOSITORY=PASS
REPOSITORY_LICENSE=ALL_RIGHTS_RESERVED
LICENSE_EVALUATION_PERMISSION=NEEDS_OWNER_CONFIRMATION
FINAL_SUBMISSION_SHA=PENDING_PHASE_8_MERGE
PRIMARY_CODEX_SESSION_ID=NEEDS_USER_ACTION
```

Run `/feedback` only after the majority of core competition functionality is complete and
associate the returned Session ID with the final evidence record.

### Phase 9 - Video production

Target duration: 2 minutes 40 seconds.

| Time | Content |
| --- | --- |
| 0:00-0:18 | Citizen comprehension problem and preliminary-assessment boundary |
| 0:18-0:38 | Synthetic GSS flow and deterministic result |
| 0:38-0:58 | Minimized model-input preview: no name, amount, raw answers or decision ID |
| 0:58-1:22 | Valid GPT-5.6 evidence-linked explanation |
| 1:22-1:48 | Unsupported mock output rejected; original result remains unchanged |
| 1:48-2:05 | Architecture diagram and deterministic/heuristic boundary |
| 2:05-2:22 | Codex Session ID, commit range and final CI/test result |
| 2:22-2:40 | Impact, limitations and closing thesis |

Video gate:

```text
LANGUAGE=ENGLISH_OR_COMPLETE_ENGLISH_TRANSLATION
AUDIO=YES
DURATION_SECONDS_LT_180=YES
PUBLIC_YOUTUBE=YES
CODEX_USAGE_VISIBLE=YES
GPT_5_6_USAGE_VISIBLE=YES
THIRD_PARTY_RIGHTS=PASS
NO_SECRET_OR_PERSONAL_DATA_VISIBLE=YES
```

### Phase 10 - Devpost submission and freeze

Submission package:

- category: Apps for Your Life;
- English title and description;
- public YouTube URL;
- repository URL and judge access;
- working demo URL and synthetic test instructions;
- primary `/feedback` Session ID;
- final SHA and CI evidence;
- screenshots without personal data or third-party rights violations.

Internal timing:

```text
FEATURE_FREEZE=2026-07-21T18:00:00+03:00
FINAL_DEPLOYMENT_FREEZE=2026-07-21T21:00:00+03:00
VIDEO_AND_TEXT_FREEZE=2026-07-21T23:00:00+03:00
INTERNAL_SUBMISSION_CUTOFF=2026-07-22T00:30:00+03:00
OFFICIAL_DEADLINE=2026-07-22T03:00:00+03:00
```

After submission, do not modify submitted materials unless Sponsor/Devpost explicitly
permits a narrow correction under the official rules.

## 7. Stop conditions

Stop and report `BLOCKED` rather than weakening safeguards when any of these occurs:

- entrant eligibility or registration cannot be confirmed;
- GPT-5.6 access or billing cannot be verified;
- maximum accepted spend remains unspecified before live integration;
- a server-side secret cannot be isolated;
- atomic spend control cannot be demonstrated for public judge access;
- deterministic outcome changes;
- raw/personal/sensitive data reaches the model;
- final CI, deployment SHA or repository access cannot be verified;
- the demo differs materially from the submitted description or video;
- a third-party asset or data source lacks permission.

## 8. Definition of done

```text
RULES_RECHECKED_BEFORE_SUBMISSION=PASS
ENTRANT_ELIGIBILITY=CONFIRMED
CODEX_USED_AND_DOCUMENTED=PASS
GPT_5_6_USED_AND_DOCUMENTED=PASS
POST_JULY_13_EXTENSION_EVIDENCE=PASS
DETERMINISTIC_AUTHORITY_BOUNDARY=PASS
DATA_MINIMIZATION=PASS
FAIL_CLOSED_DEMO=PASS
FINAL_CI=PASS
FINAL_DEPLOYMENT_SHA_MATCH=PASS
JUDGE_ACCESS=PASS
PUBLIC_VIDEO=PASS
ENGLISH_SUBMISSION_PACKAGE=PASS
PRIMARY_CODEX_SESSION_ID=RECORDED
DEVPOST_SUBMISSION_RECEIPT=RECORDED
COMPETITION_READINESS=PASS
```
