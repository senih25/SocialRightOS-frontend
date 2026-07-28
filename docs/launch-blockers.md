# Launch Blockers

## Release

- Date: 2026-07-28
- Staging URL: https://social-right-os-frontend-njprx1ru3-bayankulsnh-6579s-projects.vercel.app
- Backend URL: https://api.sosyalhakrehberi.com
- Reviewer: Codex

## Blockers

### Blocker 1

- Title: Backend hostname not reachable from staging
- Severity: Critical
- Area: API / Deploy
- Description: The preview deployment is live, but the configured backend base URL does not resolve from this environment. The frontend therefore falls back to the local deterministic engine instead of exercising the real staging backend.
- Reproduction:
  1. Run `Resolve-DnsName api.sosyalhakrehberi.com` from the project environment.
  2. Open the preview deployment with `vercel curl`.
  3. POST a valid `POST /api/v1/eligibility-check` payload.
- Expected: Preview requests should reach the staging backend and return a non-local evaluation mode.
- Actual: DNS resolution fails, and the API response metadata reports `evaluation_mode: LOCAL_FALLBACK`.
- Owner: Backend / Platform
- Status: Open

### Blocker 2

- Title: —
- Severity: —
- Area: —
- Description: —
- Reproduction: —
- Expected: —
- Actual: —
- Owner: —
- Status: —

## Final Decision

- Launch ready: No
- Notes: Static SEO and local fallback behavior are correct, but staging does not yet exercise the real backend. The release candidate gate remains closed until the backend hostname is reachable and preview traffic no longer falls back locally.
