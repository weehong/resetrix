# Auth0 operator setup checklist

One shared Auth0 tenant serves every environment (ADR-0006); environments
differ only by Application URLs and client configuration. Work through this
checklist once per tenant, repeating the URL lists for each SPA origin
(local dev, staging, prod).

For a guided local setup that writes `app/.env` and `api/.env`, run:

```bash
./scripts/setup-auth0-local.sh
```

## 1. SPA Application

Applications → Create Application → **Single Page Web Application**.

On the application's **Settings** tab:

- **Allowed Callback URLs** — one per environment, each ending in `/callback`:
  - `http://localhost:5173/callback` (local dev)
  - `https://<staging-origin>/callback`
  - `https://<prod-origin>/callback`
- **Allowed Logout URLs** — the SPA origin(s), no path:
  - `http://localhost:5173`, `https://<staging-origin>`, `https://<prod-origin>`
- **Allowed Web Origins** — same origin list as logout URLs.
- **Grant Types** (Advanced Settings → Grant Types): `Authorization Code` and
  `Refresh Token` enabled.

### Refresh token rotation (~7-day session, ADRs 0007–0008)

Settings → **Refresh Tokens** section:

- **Rotation** — enabled (rotating refresh tokens; reuse interval `0`).
- **Absolute Lifetime** — `604800` seconds (7 days).
- **Inactivity Lifetime** — `604800` seconds (7 days).

Tenant Settings → **Advanced** → **Log In Session Management**: set the idle
and maximum session lifetimes to match the ~7-day target (e.g. idle 7 days,
maximum 7 days) so the Auth0 session does not outlive or undercut the refresh
token lifetimes.

## 2. API audience with RBAC

Applications → APIs → Create API:

- **Identifier** — the audience the SPA and API share (e.g.
  `https://api.resetrix.dev`). This value is `VITE_AUTH0_AUDIENCE` in the SPA
  and `AUTH0_AUDIENCE` in the API.
- **RBAC Settings** — enable **Enable RBAC** and **Add Permissions in the
  Access Token**.
- **Allow Skipping User Consent** — enable (first-party SPA should not bounce
  through `/u/consent` on every login).
- **Allow Offline Access** — enable (required for `offline_access` / refresh
  tokens). If this is off, Auth0 omits refresh tokens and the SPA login loop
  redirects through consent forever.

On the API's **Permissions** tab, add:

| Permission      | Description            |
| --------------- | ---------------------- |
| `read:profile`  | Read the own Profile   |

## 3. Role

User Management → Roles → Create Role:

- Name: `user`
- Assign the `read:profile` permission from the API above.

## 4. Invite-only signup (ADR-0004)

- Authentication → Database → (connection) → **Disable Sign Ups** — enabled,
  so no public registration exists.
- Inviting a User (v1): User Management → Users → **Create User** (Auth0 sends
  the default verification / password-set email), or the Management API
  `POST /api/v2/users`. No in-app invite UI exists yet.
- After creating the User, assign the `user` role (User → Roles, or
  Management API) so `GET /api/v1/me` returns their Profile; without the role
  they sign in but get 403 / a no-access state.
- The User must **verify their email** (Auth0 verification link) before login
  succeeds. Until `email_verified` is true, the Post-Login Action in §5 denies
  the login, and the API rejects tokens that lack a verified-email claim.

## 5. Post-Login Action (verified email + profile claims)

Actions → **Library** → **Build Custom** → **Login / Post Login**. Deploy and
add the Action to the Login flow (Flows → Login).

Use the same namespace as `AUTH0_ROLES_NAMESPACE` in `api/.env` (e.g.
`https://api.resetrix.com`):

```js
exports.onExecutePostLogin = async (event, api) => {
  // Post-Login deny takes a single reason string (not code + message).
  if (!event.user.email_verified) {
    api.access.deny("Verify your email before signing in to Resetrix.");
    return;
  }

  const ns = "https://api.resetrix.com";
  api.accessToken.setCustomClaim(`${ns}/email_verified`, true);
  if (event.authorization?.roles) {
    api.accessToken.setCustomClaim(`${ns}/roles`, event.authorization.roles);
  }
  if (event.user.email) {
    api.accessToken.setCustomClaim(`${ns}/email`, event.user.email);
  }
  const name = event.user.name || event.user.nickname;
  if (name) {
    api.accessToken.setCustomClaim(`${ns}/name`, name);
  }
};
```

If you already have a claims Action, add the `email_verified` deny + claim to
it (do not run two conflicting Login Actions unless you intend to).

**UX note:** Post-Login `api.access.deny(reason)` does **not** show an error on
the Universal Login page. Auth0 sends the User back to the SPA `/callback`
with `error` / `error_description`; the SPA displays that reason (and offers
Log out so a stuck Auth0 SSO session does not redirect-loop).

## 6. Wire the SPA and API environments

Copy values into `app/.env` (see `app/.env.example`):

- `VITE_AUTH0_DOMAIN` — tenant domain, bare (no protocol/path), e.g.
  `your-tenant.us.auth0.com`.
- `VITE_AUTH0_CLIENT_ID` — Client ID of the SPA Application.
- `VITE_AUTH0_AUDIENCE` — API identifier from step 2.
- `VITE_AUTH0_CALLBACK_URL` — optional; only set when the callback URL cannot
  be derived as `<origin>/callback`.

The SPA validates these at boot and refuses to start when they are missing or
malformed.

Copy values into `api/.env` (see `api/.env.example`):

- `AUTH0_ISSUER` — issuer URL with trailing slash, e.g.
  `https://your-tenant.us.auth0.com/`.
- `AUTH0_AUDIENCE` — same API identifier as `VITE_AUTH0_AUDIENCE`.
- `AUTH0_JWKS_URI` — JWKS URL, e.g.
  `https://your-tenant.us.auth0.com/.well-known/jwks.json`.
- Leave `AUTH0_TEST_JWT_SECRET` unset for local runs against the real tenant
  (that secret is for automated tests only).

## 7. Smoke test

1. Start the API (`npm run dev` in `api/`) and the SPA (`pnpm dev` in `app/`)
   with both env files filled in.
2. Open `http://localhost:5173/` → public landing with a **Log in** button (no
   automatic redirect to Auth0).
3. Click **Log in** → Auth0 Universal Login → return through `/callback` → land
   on `/home` with the Profile loaded (proves `GET /api/v1/me` with a live
   Bearer token).
4. Full browser refresh on `/home` → still signed in.
5. Log out → land on `/` signed out; the landing is visible again (clicking
   **Log in** starts a new Universal Login).
6. Optional: visit `/home` while signed out → auto-redirect to Universal Login
   (gated product routes still enforce login).
