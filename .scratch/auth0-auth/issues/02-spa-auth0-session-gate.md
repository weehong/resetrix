# 02 — SPA Auth0 session gate

Status: resolved

## Parent

`.scratch/auth0-auth/spec.md`

## What to build

The product SPA is gated behind Auth0 login. An unauthenticated User is sent to Auth0 Universal Login, returns through a dedicated `/callback` route, keeps a roughly seven-day session using refresh tokens with rotation and `localStorage` caching, and can federated-logout back to the SPA. SPA Auth0 configuration is validated via env. Operator setup for the shared Auth0 tenant is documented enough to invite a User, assign role `user` / permission `read:profile`, disable public signup, enable refresh token rotation, and set ~7-day lifetimes (invite via Dashboard / Management API; Auth0 default invite/password emails).

## Acceptance criteria

- [x] Visiting the product SPA while signed out redirects to Auth0 Universal Login (no ungated product shell)
- [x] Successful login returns through `/callback` and lands the User in the SPA
- [x] Session survives a full browser refresh within the configured ~7-day window (refresh tokens + rotation + `localStorage`)
- [x] Logout clears SPA auth state and completes Auth0 logout with an allowed return to the SPA
- [x] SPA Auth0 env (domain/client/audience/callback-related settings as required) fails fast when invalid
- [x] Operator checklist exists for: SPA Application, API audience with RBAC, role `user` + permission `read:profile`, invite-only signup, refresh token rotation, ~7-day session lifetimes

## Blocked by

None — can start immediately (parallel with 01).

## Comments

- Implemented: `@auth0/auth0-react` provider (`useRefreshTokens` + `cacheLocation: 'localstorage'`) wraps the router in `app/src/App.tsx`; a pathless `_authenticated` TanStack layout gates every product route behind `RequireAuth` (signed-out Users get only a status screen, then Universal Login with `appState.returnTo`); `/callback` lives outside the gate and returns the User to their original page via `onRedirectCallback`; the authenticated shell header shows the User and logs out through Auth0 with `returnTo` = SPA origin.
- Fail-fast env: `app/src/features/auth/env.ts` validates `VITE_AUTH0_DOMAIN` (bare domain) / `VITE_AUTH0_CLIENT_ID` / `VITE_AUTH0_AUDIENCE` / optional `VITE_AUTH0_CALLBACK_URL` (defaults to `<origin>/callback`) at module load and freezes the result, mirroring the API's env pattern. Covered by `app/src/features/auth/env.test.ts` (4 tests, first unit tests in `app/`).
- Operator checklist: `docs/auth0-operator-setup.md` (SPA Application URLs, refresh token rotation + ~7-day lifetimes, API audience with RBAC, `user` role + `read:profile`, invite-only signup, env wiring, smoke test).
- `app/.env` now ships the Auth0 keys empty — `pnpm dev` refuses to boot until real tenant values are filled in.
- Browser behavior (redirect, session persistence, federated logout) is verified by construction against ADRs 0005–0008 per the spec's testing decision; run the smoke test in `docs/auth0-operator-setup.md` §6 against the real tenant once env is configured.
- Drive-by fixes: `vitest.setup.ts` updated to `@testing-library/jest-dom/vitest` (the old `matchers` import broke setup under jest-dom v6); `browser-tabs-lock: false` recorded in `pnpm-workspace.yaml` `allowBuilds` (its postinstall is a promo message only); `Home` now fills the layout instead of `h-screen`.
