# 03 — SPA Profile + API client

Status: ready-for-agent

## Parent

`.scratch/auth0-auth/spec.md`

## What to build

A signed-in User’s SPA attaches their Auth0 access token as a Bearer token to API calls, loads their **Profile** from `GET /api/v1/me`, and renders it. If the API returns 403, the SPA shows a no-access state (not a login loop). If the API returns 401 after the session cannot be refreshed, the User is sent through login again. Token attachment uses a fresh access token when the SDK can provide one (including via refresh) so routine navigation does not spuriously 401 inside the session window.

## Acceptance criteria

- [ ] After login, the SPA successfully loads Profile from `/me` using a Bearer access token
- [ ] Profile UI reflects local User identity plus roles/permissions returned by the API
- [ ] A 403 from `/me` (or other protected calls) shows a no-access state and does not redirect into an Auth0 login loop
- [ ] A 401 after refresh failure sends the User through login again
- [ ] Authenticated API calls attach `Authorization: Bearer <access_token>` (CORS remains Bearer-style; no cookie-session BFF)

## Blocked by

- 01 — Protected Profile API
- 02 — SPA Auth0 session gate
