# 02 — SPA Auth0 session gate

Status: ready-for-agent

## Parent

`.scratch/auth0-auth/spec.md`

## What to build

The product SPA is gated behind Auth0 login. An unauthenticated User is sent to Auth0 Universal Login, returns through a dedicated `/callback` route, keeps a roughly seven-day session using refresh tokens with rotation and `localStorage` caching, and can federated-logout back to the SPA. SPA Auth0 configuration is validated via env. Operator setup for the shared Auth0 tenant is documented enough to invite a User, assign role `user` / permission `read:profile`, disable public signup, enable refresh token rotation, and set ~7-day lifetimes (invite via Dashboard / Management API; Auth0 default invite/password emails).

## Acceptance criteria

- [ ] Visiting the product SPA while signed out redirects to Auth0 Universal Login (no ungated product shell)
- [ ] Successful login returns through `/callback` and lands the User in the SPA
- [ ] Session survives a full browser refresh within the configured ~7-day window (refresh tokens + rotation + `localStorage`)
- [ ] Logout clears SPA auth state and completes Auth0 logout with an allowed return to the SPA
- [ ] SPA Auth0 env (domain/client/audience/callback-related settings as required) fails fast when invalid
- [ ] Operator checklist exists for: SPA Application, API audience with RBAC, role `user` + permission `read:profile`, invite-only signup, refresh token rotation, ~7-day session lifetimes

## Blocked by

None — can start immediately (parallel with 01).
