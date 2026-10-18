# G-08 — RightFlow shared-code provenance and license boundary

**Audit date:** 18 October 2026. **Sources:** Git tree blob identifiers from `senih25/SocialRightOS-frontend` and `senih25/RightFlow-Autopilot` at their respective default branches. **This document changes no code or license.**

## Legally distinct products

- **SocialRightOS-frontend:** This repository's `LICENSE` is **All Rights Reserved**. Source, content, art and software cannot be redistributed under an open-source license solely because they are publicly visible.
- **RightFlow-Autopilot:** Its independent hackathon repository states **Apache-2.0**; its original competition timeframe, independent project claims, branding and attribution must remain intact.
- **SocialRightOS:** The separate canonical backend declares **AGPL-3.0-only**. There is no blanket license transfer from either frontend or hackathon project.

## Identical blobs observed in the two public repositories

Git SHA inspection identified **10 identical file-content blobs** across both repositories:

| Frontend path | RightFlow path | Category |
| --- | --- | --- |
| `.github/FUNDING.yml` | `.github/FUNDING.yml` | Sponsorship configuration |
| `docs/hackathon/alibaba-cloud/ecs-compose.yaml` | `deploy/ecs-compose.yaml` | Deployment example |
| `public/assets/rightflow/rightflow-architecture.jpg` | `public/rightflow-architecture.jpg` | Architecture visual |
| `public/assets/rightflow/rightflow-devpost-thumbnail.png` | `public/rightflow-devpost-thumbnail.png` | Marketing image |
| `src/app/api/rightflow/cases/approve/route.ts` | Same relative path | API code |
| `src/app/api/rightflow/cases/route.ts` | Same relative path | API code |
| `src/app/rightflow-autopilot/RightFlowWorkspace.tsx` | Same relative path | UI code |
| `src/lib/qwen-rightflow.ts` | Same relative path | Model boundary |
| `src/lib/rightflow.test.ts` | Same relative path | Synthetic tests |
| `src/lib/rightflow.ts` | Same relative path | Case rules |

**Important:** Identical blobs establish identical content at inspection time, **not** author identity, independent conception, infringement or permission. No file is copied into this PR.

## Release / legal review before reuse

1. Preserve each repository's original commit timestamps and hackathon provenance. Do not squash, migrate, remove, or overwrite history as part of licensing cleanup.
2. Have the relevant rights holder confirm author/asset ownership and the legal basis for publishing the same material under the frontend proprietary terms and RightFlow Apache-2.0 terms.
3. If explicit permission is confirmed, document source commit, rights holder approval, NOTICE obligations and outbound license boundary in each relevant repository **in a later, separately reviewed PR**.
4. Until then, **do not** automatically label the proprietary frontend open source, copy its components into the AGPL backend, relicense shared assets, or merge the independent hackathon repo.
5. Recheck Git tree blob SHAs before any future release; exact-match counts are time-dependent.

## Test and rollback

- Read-only verification: compare published tree blob SHAs, check current root LICENSE and RightFlow license declaration. No source run required.
- This document does not edit provider URLs, cloud keys, application behavior or deployment.
- Rollback: close draft PR / revert document in a reviewed branch. Protect the original license files and repository histories.
