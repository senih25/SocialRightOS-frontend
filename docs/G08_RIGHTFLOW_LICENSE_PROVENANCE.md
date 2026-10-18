# G-08 — Cross-repository provenance and license boundary

**Inspection:** 18 October 2026, default-branch trees of `senih25/SocialRightOS-frontend` and `senih25/RightFlow-Autopilot`. This is a *read-only Git blob hash comparison*, not an authorship or license clearance finding.

## Important license distinction

- **SocialRightOS-frontend:** proprietary **All Rights Reserved**, © 2026 socialrightlabs, as declared in this repository's root `LICENSE`.
- **RightFlow-Autopilot:** published with the **Apache License 2.0** in its own root `LICENSE`; its hackathon submissions, creation timestamps, and independent project statement remain separate.
- The appearance of the **same Git blob SHA** in two repositories proves matching file bytes, **not** which repository originated the work, who owns the rights, or whether the proprietary project has permission to incorporate Apache-licensed source (or vice versa).
- No license relicensing, code movement, deletion, archive, rewrite, or provenance claim should be made automatically.

## File-level overlap found (10 blobs)

| SocialRightOS-frontend | RightFlow-Autopilot | Shared blob SHA prefix |
| --- | --- | --- |
| `.github/FUNDING.yml` | `.github/FUNDING.yml` | `fd71388015aa` |
| `docs/hackathon/alibaba-cloud/ecs-compose.yaml` | `deploy/ecs-compose.yaml` | `05832e05954c` |
| `public/assets/rightflow/rightflow-architecture.jpg` | `public/rightflow-architecture.jpg` | `9a50b3438577` |
| `public/assets/rightflow/rightflow-devpost-thumbnail.png` | `public/rightflow-devpost-thumbnail.png` | `49e7b360f52c` |
| `src/app/api/rightflow/cases/approve/route.ts` | `src/app/api/rightflow/cases/approve/route.ts` | `96f2ce7ba9e8` |
| `src/app/api/rightflow/cases/route.ts` | `src/app/api/rightflow/cases/route.ts` | `63fa8aa9b553` |
| `src/app/rightflow-autopilot/RightFlowWorkspace.tsx` | `src/app/rightflow-autopilot/RightFlowWorkspace.tsx` | `45a183c7f5aa` |
| `src/lib/qwen-rightflow.ts` | `src/lib/qwen-rightflow.ts` | `59004cd44065` |
| `src/lib/rightflow.test.ts` | `src/lib/rightflow.test.ts` | `2cdff88a88c3` |
| `src/lib/rightflow.ts` | `src/lib/rightflow.ts` | `f8d60f9724af` |

These overlaps include API handlers, Qwen integration, frontend UI and tests, a deployment manifest, two image assets and the shared sponsorship config. Executable and asset overlaps require **separate** author/rightsholder confirmation and the necessary attribution/NOTICE decisions.

## Human sign-off required before any consolidation or public rights claim

1. Establish the original author and the first-in-time commit for each file at the full commit-history level (blob identity alone is insufficient).
2. Obtain written rights-holder authorization for the cross-repository usage and for any code or visual asset redistribution.
3. Retain the applicable Apache-2.0 notice, copyright attribution and change notices where necessary; keep frontend's existing All Rights Reserved notice visible and accurate.
4. Verify that no confidential provider credentials, real user facts, or private material are embedded in shared demo examples. Do not copy content into an external report.
5. Preserve hackathon independent project statements, submission timestamps and audit trails.
6. If a license conclusion or scope is unclear, **HOLD** rather than retroactively assuming open-source permission.

## Testing and rollback

This documentation-only record is verified against the current Git blob paths. Runtime code, public demo, API, datasets and all licensing files are unchanged. Rollback is to close this draft PR or revert the documentation-only commit.
