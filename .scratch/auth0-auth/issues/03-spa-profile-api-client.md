# 03 — SPA Profile + API client

Status: resolved

## Parent

`.scratch/auth0-auth/spec.md`

## What to build

A signed-in User’s SPA attaches their Auth0 access token as a Bearer token to API calls, loads their **Profile** from `GET /api/v1/me`, and renders it. If the API returns 403, the SPA shows a no-access state (not a login loop). If the API returns 401 after the session cannot be refreshed, the User is sent through login again. Token attachment uses a fresh access token when the SDK can provide one (including via refresh) so routine navigation does not spuriously 401 inside the session window.

## Acceptance criteria

- [x] After login, the SPA successfully loads Profile from `/me` using a Bearer access token
- [x] Profile UI reflects local User identity plus roles/permissions returned by the API
- [x] A 403 from `/me` (or other protected calls) shows a no-access state and does not redirect into an Auth0 login loop
- [x] A 401 after refresh failure sends the User through login again
- [x] Authenticated API calls attach `Authorization: Bearer <access_token>` (CORS remains Bearer-style; no cookie-session BFF)

## Blocked by

- 01 — Protected Profile API
- 02 — SPA Auth0 session gate

## Comments

- API client: `app/src/features/api/client.ts` — `createApiClient(baseUrl, getAccessToken)` fetches with `Authorization: Bearer <token>` (plain cross-origin fetch, no cookie credentials, per ADR-0001) and validates the `{ data }` envelope with zod. `useApiClient()` binds it to Auth0's `getAccessTokenSilently`, so every call gets a fresh token (refresh-token renewal inside the session window per ADR-0007). Errors are classified: `ApiUnauthorizedError` (401 from the API **or** token acquisition failure, i.e. refresh failed), `ApiForbiddenError` (403), `ApiRequestError` (other non-OK, with the API's error-envelope message when readable).
- Profile feature: `app/src/features/profile/` — `profile.ts` (zod `ProfileSchema` matching the API's Profile: local User fields + roles/permissions, timestamps as ISO strings), `useProfile.ts` (TanStack Query hook; 401/403 are terminal and never retried, transient errors retry twice, 60 s stale time), and `ProfileGate.tsx` mounted inside `AuthenticatedLayout` under `RequireAuth`.
- Gate behavior: pending → loading screen; 403 → `NoAccessScreen` (`features/auth/NoAccessScreen.tsx`, with logout so a different User can sign in) — never a login redirect; 401 → `loginWithRedirect` with `appState.returnTo` (same pattern as `RequireAuth`), showing the redirecting screen meanwhile; other failures → error screen with a retry button.
- Profile UI: `app/src/pages/Home.tsx` now renders the Profile card (name, email, User ID, member-since, roles and permissions as chips) reading the gate-cached `useProfile()` data; the translate button stays as the i18n smoke path. `home.greeting` removed; new `profile.*` and `auth.noAccess*` keys in both en/es locales.
- Config: new required `VITE_API_URL` (http(s) origin, trailing slash normalized), validated fail-fast in `app/src/features/api/env.ts` mirroring the auth env pattern; added to `app/.env` (`http://localhost:3000`), `.env.example`, and `environment.d.ts`. API-side `CORS_ORIGIN` already covers the SPA origin — no API changes needed.
- Tests: `features/api/client.test.ts` (7 tests: Bearer header + envelope parsing, 401, token-acquisition failure with fetch untouched, 403, API error message + fallback, schema mismatch) and `features/api/env.test.ts` (3 tests). `pnpm lint`, `tsc`, and `vitest run src/` (14 tests) all pass. Browser behavior (real-token attach, refresh-failure login loop exit, no-access UX) is verified by construction per the spec's testing decision — run the smoke test in `docs/auth0-operator-setup.md` §6 against the real tenant once env is configured.
