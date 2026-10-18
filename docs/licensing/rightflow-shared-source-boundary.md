# RightFlow shared-source and license boundary — GH-OPT-GPT2 G-08

**Read-only comparison date:** 18 October 2026. Repository baselines: `SocialRightOS-frontend` `f4b90efcebdc35ec1fdae99e22ec97eaffb5016c`; `RightFlow-Autopilot` `98776fac36df50ae1cdeb823a955fc3d498fe5e1`.

## Facts that are verified

- `SocialRightOS-frontend/LICENSE` states **All Rights Reserved**; it does **not** grant an open-source license, permission to merge, or redistribution rights.
- `RightFlow-Autopilot` independently declares **Apache-2.0** and its `NOTICE` attributes the project to SocialRightLabs.
- Read-only Git tree comparison found exactly **10 identical blob SHA-1 objects** in these two baseline trees. Byte identity does **not** independently establish who authored the objects, the first publication time, trademark rights, or that proprietary assets may be relicensed.

| Frontend source path | Independent RightFlow path | Identical Git blob SHA-1 |
| --- | --- | --- |
| `.github/FUNDING.yml` | `.github/FUNDING.yml` | `fd71388015aa003b29e2b24936d7b7a9088b5655` |
| `docs/hackathon/alibaba-cloud/ecs-compose.yaml` | `deploy/ecs-compose.yaml` | `05832e05954c5b05112ceb8f6635ba9b0d8ae931` |
| `public/assets/rightflow/rightflow-architecture.jpg` | `public/rightflow-architecture.jpg` | `9a50b3438577251f373c6bd7b2153da6b03857bd` |
| `public/assets/rightflow/rightflow-devpost-thumbnail.png` | `public/rightflow-devpost-thumbnail.png` | `49e7b360f52c3db6b8d9f8bd772d4dfca948cd00` |
| `src/app/api/rightflow/cases/approve/route.ts` | `src/app/api/rightflow/cases/approve/route.ts` | `96f2ce7ba9e8089cfd519bdd899c1f701a2341f3` |
| `src/app/api/rightflow/cases/route.ts` | `src/app/api/rightflow/cases/route.ts` | `63fa8aa9b553209e1bd9b5f5dc6dab397a0cadcf` |
| `src/app/rightflow-autopilot/RightFlowWorkspace.tsx` | `src/app/rightflow-autopilot/RightFlowWorkspace.tsx` | `45a183c7f5aa9600b572a423ad025093a9072042` |
| `src/lib/qwen-rightflow.ts` | `src/lib/qwen-rightflow.ts` | `59004cd44065425ca2fa415cc5355bdf86bf8e78` |
| `src/lib/rightflow.test.ts` | `src/lib/rightflow.test.ts` | `2cdff88a88c33814c4a41caefd1d176afc82d2b4` |
| `src/lib/rightflow.ts` | `src/lib/rightflow.ts` | `f8d60f9724afe4b0124cc977ce21c6870e10788a` |

## Current separation (do not silently consolidate)

1. Keep the original hackathon submission repository, its commits, assets, timestamps and separate Apache-2.0 license intact.
2. Keep the active frontend repo's All Rights Reserved notice visible and accurate; do **not** describe the entire frontend as Apache/MIT/AGPL or open source.
3. Do **not** copy, move, delete, relicense or merge shared files as an outcome of this documentation PR.
4. Before publication or reuse across products, request a written, file-level rights determination from the rights-holder for code and assets (images, branding, deployment manifests). The current Git blob comparison is technical evidence only.
5. If dual licensing is approved in writing later, retain commit provenance, per-file attribution and independent hackathon dates in a separate reviewed change.

## Acceptance and rollback

- Confirm 10 matching blobs at the two documented baseline SHAs; any later difference requires a new comparison rather than an automated synchronization.
- Confirm frontend root `LICENSE` remains All Rights Reserved and RightFlow root `LICENSE`/`NOTICE` remain unchanged.
- No runtime, API, demo, deployment or user data changes. Rollback: close/revert this documentation-only PR.

This inventory is not a legal opinion or a transfer of copyright.
