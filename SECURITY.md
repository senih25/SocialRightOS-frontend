# Security Policy

## Reporting a Vulnerability

If you discover a security issue, do not open a public GitHub issue with exploit details.

Instead:

- report the issue privately to the repository maintainers
- include a short description, impact, and reproduction steps
- avoid posting secrets, tokens, or personal data

## Scope Notes

This repository is a public frontend.

Important security expectations:

- secrets must not be committed
- frontend must not own policy decision logic
- backend URLs and credentials must be configured through environment variables
- public UI must avoid exposing sensitive operational details

## Dependency Security Log

### 2026-08-04 — Next.js dependency chain remediation

Base: `origin/main` @ `2d48de6`. Node 22.22.3, npm 11.x.

Before (`npm ci` on the untouched lockfile):

| Package | Severity | Installed | Chain | Prod? | Advisory |
|---|---|---|---|---|---|
| postcss | high | 8.5.10 (pinned by root override) and 8.5.20 (dev) | root override `next > postcss`; `@tailwindcss/postcss > postcss` | yes | GHSA-6g55-p6wh-862q, GHSA-r28c-9q8g-f849, GHSA-fxqj-rqcc-2cmp (range `<=8.5.22`) |
| sharp | high | 0.34.5 | `next > sharp` (optional) | yes | GHSA-f88m-g3jw-g9cj — libvips CVE-2026-33327/33328/35590/35591 (range `<0.35.0`) |
| next | high | 16.2.12 | root dependency | yes | flagged transitively via postcss and sharp |
| brace-expansion | high | 1.1.16 and 5.0.8 | `eslint > @eslint/config-array > minimatch`; `eslint-config-next` | dev only | GHSA-mh99-v99m-4gvg, GHSA-rgw5-rvv9-x895 |

Totals before: `npm audit` 4 high / 0 critical; `npm audit --omit=dev` 3 high.

After: `npm audit` **0 vulnerabilities**; `npm audit --omit=dev` **0 vulnerabilities**.

Versions changed (all minor/patch, no major, no downgrade):

- `next` 16.2.12 → **16.3.0** (minor). Required: 16.2.12 declares `sharp@^0.34.5`, and every 0.34.x release is inside the vulnerable range. 16.3.0 declares `sharp@^0.35.3`, so this is the vendor-sanctioned path to a patched sharp rather than forcing an out-of-range version into an untested combination.
- `sharp` 0.34.5 → **0.35.3** (+ its `@img/*` platform packages 0.34.5 → 0.35.3 and libvips 1.2.4 → 1.3.2)
- `postcss` (dev/hoisted) 8.5.20 → **8.5.25**; `next`'s own nested copy now resolves to **8.5.23**, both above the vulnerable `<=8.5.22` range
- `brace-expansion` 1.1.16 → **1.1.18** and 5.0.8 → **5.0.9** (dev only)

`package.json` change: the root override `overrides: { "next": { "postcss": "8.5.10" } }` was **removed**. That override was an exact pin to a version that is now itself vulnerable, and it actively prevented resolution of a patched postcss inside next's tree. With next 16.3.0 the package's own declared range already resolves to a patched postcss (8.5.23), so a stale manual pin is strictly worse than no pin: it must be maintained by hand and silently blocks future security releases. No new override was introduced.

Method: targeted `npm update` with `--package-lock-only` plus the override removal, then a clean `npm ci`. `npm audit fix --force` was **not** used — it is not needed here and it is allowed to perform major upgrades and other unreviewed changes. Plain `npm audit fix` was also rejected: its dry run added 64 platform-specific optional packages unrelated to the fix, whereas the targeted path changes 41 lockfile entries and adds 8 (2 new sharp platform targets that sharp 0.35.x introduces, 6 nested `@tailwindcss/oxide-wasm32-wasi` entries re-materialized during resolution). No finding was suppressed, ignored or allowlisted; no dependency was downgraded; no application source file was changed.

Verification after the change: `npm ci`, `npm test` (276/276 pass), `npm run lint`, `npm run typecheck`, `npm run check:secrets` (`SECRET_EXPOSURE_COUNT=0`) and `npm run build` (Next.js 16.3.0, exit 0, nine legacy `/blog` routes still generated) all pass.

Residual risk: advisory databases change, so "0 vulnerabilities" is a snapshot of 2026-08-04 and `npm audit` must be re-run periodically. The `next` minor upgrade (16.2.12 → 16.3.0) carries the usual minor-release regression risk; it is covered here only by this repository's own test, lint, typecheck and build gates, not by a runtime smoke test against staging.
