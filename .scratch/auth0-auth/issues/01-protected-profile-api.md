# 01 — Protected Profile API

Status: ready-for-agent

## Parent

`.scratch/auth0-auth/spec.md`

## What to build

An invited User with a valid Auth0 access token that includes `read:profile` can call `GET /api/v1/me` and receive their **Profile**. The API validates Bearer JWTs, enforces Auth0 RBAC, and upserts a local **User** keyed by Auth0 subject (keeping email unique and syncing email/name). Callers without a token get 401; authenticated callers without `read:profile` get 403. Public probes stay public. OpenAPI documents Bearer security and `/me` outside production; `/docs` and `/openapi.json` are not mounted in production.

## Acceptance criteria

- [ ] `GET /api/v1/me` without a Bearer token returns 401
- [ ] `GET /api/v1/me` with a valid token that lacks `read:profile` returns 403
- [ ] `GET /api/v1/me` with a valid token that includes `read:profile` returns 200 with a Profile (local User fields plus roles/permissions from the token)
- [ ] A successful authenticated call upserts a local User by `auth0Sub` and syncs email/name when present in the token
- [ ] `GET /health` still succeeds without authentication
- [ ] `/docs` and `/openapi.json` are available in non-production and are not mounted when the app runs as production
- [ ] Behavior is covered at the API HTTP seam (`createApp` + supertest) using signed test JWTs — no live Auth0 tenant required

## Blocked by

None — can start immediately.
