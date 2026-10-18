# G-08 — RightFlow shared-file provenance and license boundary

**Evidence snapshot:** 18 October 2026. Scope: `senih25/SocialRightOS-frontend` at `f4b90efcebdc35ec1fdae99e22ec97eaffb5016c` and `senih25/RightFlow-Autopilot` at `98776fac36df50ae1cdeb823a955fc3d498fe5e1`. This is a read-only Git blob comparison, **not a license grant, infringement finding, authorship conclusion or archive proposal**.

## Current licensing statements

- This frontend repository's root `LICENSE` explicitly reads **All Rights Reserved (proprietary)**, copyright `socialrightlabs`. Its public visibility alone grants **no** general right to reuse assets/source.
- The independent hackathon repository `RightFlow-Autopilot` declares **Apache-2.0**. Its publication, source timestamp, project independence, and demo must be preserved.
- A matching Git blob SHA establishes byte identity only. It does not establish which repository was created first, whether a contributor is a rights holder, or whether every image is authorized for relicensing.

## Exact-match inventory (10 Git blob SHA matches)

| RightFlow-Autopilot path | Path in this frontend | Type |
|---|---|---|
| `.github/FUNDING.yml` | `.github/FUNDING.yml` | repository metadata |
| `deploy/ecs-compose.yaml` | `docs/hackathon/alibaba-cloud/ecs-compose.yaml` | deployment example |
| `public/rightflow-architecture.jpg` | `public/assets/rightflow/rightflow-architecture.jpg` | image asset |
| `public/rightflow-devpost-thumbnail.png` | `public/assets/rightflow/rightflow-devpost-thumbnail.png` | image asset |
| `src/app/api/rightflow/cases/approve/route.ts` | `src/app/api/rightflow/cases/approve/route.ts` | API route |
| `src/app/api/rightflow/cases/route.ts` | `src/app/api/rightflow/cases/route.ts` | API route |
| `src/app/rightflow-autopilot/RightFlowWorkspace.tsx` | `src/app/rightflow-autopilot/RightFlowWorkspace.tsx` | UI |
| `src/lib/qwen-rightflow.ts` | `src/lib/qwen-rightflow.ts` | provider adapter |
| `src/lib/rightflow.test.ts` | `src/lib/rightflow.test.ts` | synthetic tests |
| `src/lib/rightflow.ts` | `src/lib/rightflow.ts` | deterministic workflow |

## Required rights-holder decision before any code movement

1. Identify author/asset creator and first repository commit for each material component, using immutable Git commit references.
2. Obtain explicit confirmation from the actual rights holder that the identified source/assets may be distributed under Apache-2.0 in the separate hackathon repository.
3. Record exactly which files/versions the permission covers and required copyright/NOTICE attribution. Apache-2.0 source notice obligations and any third-party asset permissions must be reviewed.
4. If rights cannot be established, **hold code reuse, relicensing, public redistribution and repo consolidation**. Do not overwrite either root license as a workaround.
5. Preserve original hackathon commits, submission timestamps, manifests, promotional assets and independent claims.

## No-change test / rollback

This G-08 branch only adds this documentation and a README pointer. It does not move, rewrite, or relicense code, assets, or project history. Validate its repo/asset links and that both root `LICENSE` files are unchanged. Close this draft PR to roll back. Other agent-owned branches and profile/pin settings are out of scope.
