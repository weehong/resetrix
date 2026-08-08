# 01 — Protected Profile API

Status: resolved

## Parent

`.scratch/auth0-auth/spec.md`

## What to build

An invited User with a valid Auth0 access token that includes `read:profile` can call `GET /api/v1/me` and receive their **Profile**. The API validates Bearer JWTs, enforces Auth0 RBAC, and upserts a local **User** keyed by Auth0 subject (keeping email unique and syncing email/name). Callers without a token get 401; authenticated callers without `read:profile` get 403. Public probes stay public. OpenAPI documents Bearer security and `/me` outside production; `/docs` and `/openapi.json` are not mounted in production.

## Acceptance criteria

- [x] `GET /api/v1/me` without a Bearer token returns 401
- [x] `GET /api/v1/me` with a valid token that lacks `read:profile` returns 403
- [x] `GET /api/v1/me` with a valid token that includes `read:profile` returns 200 with a Profile (local User fields plus roles/permissions from the token)
- [x] A successful authenticated call upserts a local User by `auth0Sub` and syncs email/name when present in the token
- [x] `GET /health` still succeeds without authentication
- [x] `/docs` and `/openapi.json` are available in non-production and are not mounted when the app runs as production
- [x] Behavior is covered at the API HTTP seam (`createApp` + supertest) using signed test JWTs — no live Auth0 tenant required

## Blocked by

None — can start immediately.

## Comments

- Implemented on branch `dev` in commit `31c47e2`.
- Bugbot review found and fixed: permission check order (403 before upsert), P2002 email-conflict mapping, empty test JWT secret guard.
- `repomix-output.xml` is untracked local tooling output and was intentionally not committed.
