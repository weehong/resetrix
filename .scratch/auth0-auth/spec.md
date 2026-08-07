# Auth0 authentication and authorization

Status: ready-for-agent

## Problem Statement

Resetrix’s product SPA and API have no way for an invited User to sign in, prove who they are on API calls, or see a Profile. Anyone who can reach the SPA can use it; the API cannot tell a valid caller from an anonymous one. Operators need controlled, invite-only access with Auth0 as the identity provider and a thin RBAC check before the product grows more features.

## Solution

Invite-only Users authenticate through Auth0 in the product SPA, send Bearer access tokens to the API, and receive a Profile from `GET /api/v1/me` when they hold the `read:profile` permission. The API validates JWTs, enforces Auth0 RBAC, upserts a local User keyed by Auth0 subject, and keeps public marketing and non-prod API docs as they are today. The SPA is fully gated behind login, persists a ~7-day session via refresh tokens, and logs out through Auth0.

## User Stories

1. As an invited User, I want to sign in via Auth0 Universal Login, so that I can access the product SPA without a public signup form.
2. As an invited User, I want my first credentials to come from Auth0’s default invite / password email flow, so that I do not need a custom accept-invite page.
3. As an invited User, I want the entire product SPA to require login, so that I am not dropped into an empty ungated shell.
4. As an invited User who is not signed in, I want to be redirected to Auth0 to authenticate, so that I can reach the product.
5. As an invited User completing login, I want Auth0 to return me through a dedicated `/callback` route, so that redirect handling stays off product pages.
6. As a signed-in User, I want to stay signed in across browser refreshes and tabs for about seven days, so that I am not prompted on every visit.
7. As a signed-in User, I want refresh tokens with rotation stored per the SPA SDK `localStorage` cache, so that my session survives reloads.
8. As a signed-in User, I want to log out and be sent through Auth0 logout with an allowed return to the SPA, so that my Auth0 session ends and I am not silently signed back in.
9. As a signed-in User, I want the SPA to call the API with my access token as a Bearer token, so that the API can authorize me.
10. As a signed-in User with role `user` and permission `read:profile`, I want `GET /api/v1/me` to return my Profile, so that the SPA can show who I am and what I may do.
11. As a signed-in User, I want my Profile to include my local User fields plus roles and permissions from the access token, so that one request is enough for display and UI gating.
12. As a signed-in User calling a protected API route for the first time, I want a local User row to be upserted from my Auth0 identity, so that product data can reference me later.
13. As a signed-in User, I want my local User to be keyed by Auth0 `sub` (`auth0Sub`) with email kept unique and email/name synced on upsert, so that identity stays stable while profile fields stay current.
14. As a signed-in User without `read:profile`, I want the API to respond with 403, so that “logged in but not allowed” is distinct from “not logged in.”
15. As a signed-in User without `read:profile`, I want the SPA to show a no-access state rather than looping me through login again, so that a missing Auth0 role assignment is understandable.
16. As an anonymous caller of a protected API route, I want a 401, so that missing or invalid tokens are clearly unauthorized.
17. As an operator, I want to invite Users only via the Auth0 Dashboard / Management API for v1, so that we do not build in-app invite UI yet.
18. As an operator, I want to assign the `user` role (with `read:profile`) in Auth0, so that invited Users can load their Profile.
19. As a developer, I want a single Auth0 tenant shared across environments with environment-specific Application callbacks and client config, so that setup stays simple.
20. As a developer, I want Auth0 env configuration validated at API and SPA boot (issuer/domain, audience, client id, etc.), so that misconfig fails fast.
21. As a developer, I want OpenAPI to document Bearer security and the `/me` contract in non-production, so that local exploration stays easy.
22. As a developer, I want `/docs` and `/openapi.json` not mounted in production, so that the full API surface is not openly browsable in prod.
23. As a developer, I want `/health` and `/ready` to remain public, so that probes keep working without tokens.
24. As a developer writing API tests, I want to use signed test JWTs against `createApp()`, so that auth behavior is fast and deterministic without a live Auth0 tenant in CI.
25. As a marketing visitor, I want the static `web/` site to remain public and unaffected, so that Auth0 only gates the product SPA and API.
26. As a User whose Auth0 token is expired and refresh fails, I want to be sent through login again, so that I can regain access cleanly.
27. As a User on the SPA, I want API client calls to attach a fresh access token when possible (including via refresh), so that routine navigation does not fail with 401s after access-token expiry within the session window.
28. As an implementer, I want CORS to continue allowing the SPA origin to call the API with Bearer tokens, so that cross-origin calls succeed without cookie credentials.
29. As an implementer, I want protected `/api/v1` routers to run an ensure-User step, so that health/docs are not upserting Users and callers need not hit `/me` first for linkage.
30. As a future agent or developer, I want this behavior to respect ADRs 0001–0009 and the glossary terms User and Profile, so that language and architecture stay consistent.

## Implementation Decisions

- **Packages in scope:** product SPA (`app/`) and HTTP API (`api/`) only. Marketing `web/` unchanged.
- **Identity provider:** Auth0. Same Auth0 tenant for all deploy environments; separate Application callback URLs and client settings per environment (ADR-0006).
- **Registration:** invite-only; no public signup. Invites operated in Auth0 Dashboard / Management API. First credentials via Auth0 default invite / password emails (ADR-0004).
- **SPA library:** `@auth0/auth0-react` with a dedicated `/callback` route; Auth0 provider wraps the app; TanStack Router gates the SPA so unauthenticated Users are sent to login (ADR-0005).
- **Token transport:** SPA obtains Auth0 access tokens and calls the API with `Authorization: Bearer` (ADR-0001). No BFF or cookie session layer.
- **Session persistence:** `useRefreshTokens: true`, refresh token rotation enabled in Auth0, SDK `cacheLocation: 'localstorage'`, ~7-day signed-in target via Auth0 lifetime settings (ADR-0007, ADR-0008 seven-day session).
- **Logout:** clear SPA auth state and redirect through Auth0 logout with an allowed `returnTo` to the SPA origin (or `/`). Federated logout is enough for v1; no Management API refresh-token revocation path required.
- **API JWT validation:** validate access tokens (issuer, audience, signature via JWKS). Reject missing/invalid tokens with 401 on protected routes.
- **RBAC:** Auth0 RBAC on the API audience. Skeleton: role `user`, permission `read:profile`. Enforce permission claims on protected handlers (ADR-0002). Missing permission → 403.
- **Profile endpoint:** `GET /api/v1/me` requires `read:profile`. Response is Profile: local User fields plus roles/permissions from the access token.
- **Local User projection:** on protected `/api/v1` routers, ensure/upsert local User keyed by required unique `auth0Sub`; keep `email` unique; sync email/name from token/claims as available (ADR-0003). Do not upsert on public routes such as health/ready/docs.
- **Express layering:** auth middleware + ensure-User on protected v1 routers; thin controller for `/me`; services for User upsert; env validated via existing frozen env config pattern; extend Express request typing for auth/User context; use existing `HttpError.unauthorized` / `forbidden`.
- **OpenAPI:** register Bearer security and `/me` path/schemas in the zod OpenAPI registry. Mount `/docs` and `/openapi.json` only when not production (ADR-0009).
- **SPA API access:** introduce an API client (or fetch wrapper) that attaches the access token for authenticated calls and treats 401 vs 403 differently (login vs no-access UI).
- **No in-app invite UI, social login, organizations, M2M, or staff User type** in this effort.

## Testing Decisions

- **Good tests** assert external HTTP behavior only (status, headers where relevant, JSON envelope shape). Do not assert Auth0 SDK internals, private middleware function names, or Prisma call sequences.
- **Single agreed seam:** API HTTP boundary — Vitest + supertest against `createApp()`, same style as existing `tests/integration/health.route.test.ts`.
- **Auth fixtures:** signed test JWTs (local keys or mocked JWKS) representing anonymous, authenticated-without-permission, and authenticated-with-`read:profile` callers. No live Auth0 tenant required in CI.
- **Cases to cover at that seam (at minimum):**
  - Protected `/api/v1/me` without token → 401
  - Valid token without `read:profile` → 403
  - Valid token with `read:profile` → 200 Profile; local User upserted/linked by `auth0Sub`
  - Upsert syncs email/name when present in token/claims
  - `/health` (and similarly public probes) still succeed without auth
  - `/docs` and `/openapi.json` available in non-production test env; not mounted when app is created under production env configuration
- **Prior art:** `api/tests/integration/health.route.test.ts` for supertest + `createApp()`; unit tests under `api/tests/unit/` for pure service logic if User upsert is extracted and worth unit coverage without HTTP.
- **SPA Auth0 behavior** (Universal Login redirect, `/callback`, refresh-token storage, federated logout, no-access UI) is **not** an automated seam for this spec; verify manually / by construction against ADRs.

## Out of Scope

- Staff / internal Users and any staff-vs-customer split
- In-app invite UI or Auth0 Organizations invitation product flow
- Social / enterprise connections beyond whatever Auth0 Database + default invite emails already provide
- BFF / cookie-session architecture
- Local Postgres-owned permission matrix as source of truth
- Full RBAC catalog beyond `user` / `read:profile`
- Machine-to-machine applications
- Real Auth0 tenant usage inside CI
- Playwright/Auth0 browser e2e as an acceptance gate for this effort
- Changes to the marketing site (`web/`)
- Explicit Management API refresh-token revocation on logout
- Custom branded accept-invite pages

## Further Notes

- Glossary: use **User** and **Profile** as in `CONTEXT.md`. Avoid Customer, End-user, Account, Client for the authenticated person.
- Respect ADRs under `docs/adr/` (0001 Bearer JWT; 0002 Auth0 RBAC; 0003 local User; 0004 invite-only; 0005 SPA gate; 0006 single tenant; 0007 refresh tokens + localStorage/rotation; 0008 ~7-day session; 0009 OpenAPI docs env access). Note: seven-day session and OpenAPI docs were both filed as `0008-*` briefly; OpenAPI docs is `0009-openapi-docs-env-access.md`.
- Next step in the build chain is usually `/to-tickets` to slice this spec into tracer-bullet implementation issues under `.scratch/auth0-auth/issues/`.
