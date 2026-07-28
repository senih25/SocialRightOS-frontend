# Staging Smoke Report

## Run Info

- Date: 2026-07-28
- Reviewer: Codex
- Frontend URL: https://social-right-os-frontend-njprx1ru3-bayankulsnh-6579s-projects.vercel.app
- Backend URL: https://api.sosyalhakrehberi.com
- Build Reference: dpl_BdcWrkuX7wieXnpFS3R15SoeTghi

## Environment

- `NEXT_PUBLIC_SITE_URL` correct: Pass
- `NEXT_PUBLIC_API_BASE_URL` correct: Fail
- staging CORS confirmed: Fail
- SSL active: Pass
- `robots` noindex: Pass
- sitemap production-safe: Pass

## Static And SEO

- `/`: Pass
- `/evde-bakim-maasi`: Pass
- `/evde-bakim-maasi/hesaplama`: Pass
- page title: Pass
- meta description: Pass
- canonical host: Pass
- OG preview: Pass
- favicon: Pass

## Tool Flow

- form load: Pass
- submit flow: Pass
- loading state: Pass
- `ELIGIBLE` render: Pass
- `NOT_ELIGIBLE` render: Pass
- `NEEDS_INFO` render: Pass
- `missing_facts` render: Pass
- trust/disclaimer visible: Pass
- no unnecessary PII: Pass

## Error Paths

- backend unavailable fallback: Pass
- invalid payload fallback: Pass
- timeout or network fail fallback: Pass
- empty or unexpected response fallback: Pass

## Integration

- request goes to staging backend: Fail
- no localhost calls: Pass
- only `POST /api/v1/eligibility-check` used for tool decision flow: Pass

## Notes

- Preview deployment responds correctly, but the configured backend host (`api.sosyalhakrehberi.com`) does not resolve from this environment, so the app is still serving the local deterministic fallback engine.
- Smoke evidence:
  - `ELIGIBLE` payload returned `status: ELIGIBLE` and `evaluation_mode: LOCAL_FALLBACK`
  - `NOT_ELIGIBLE` payload returned `status: NOT_ELIGIBLE` and the expected disability-threshold reason
  - `NEEDS_INFO` payload returned `status: NEEDS_INFO` with 2 missing facts
  - empty payload returned `status: 400` with `error: invalid_request`
- Preview HTML exposed:
  - title: `Dijital Sosyal Hak Rehberi`
  - canonical host: preview deployment URL
  - `noindex, nofollow`
  - OG tags and favicon
- `/robots.txt` includes `Disallow: /admin`
- `/sitemap.xml` did not leak the preview or production host

## Final Outcome

- Smoke status: Hold
- Launch recommendation: Hold
