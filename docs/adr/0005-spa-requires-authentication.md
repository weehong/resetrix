# Product routes are authentication-gated; public landing is not

The product SPA (`app/`) exposes a public landing at `/` with an explicit Log in
CTA that sends the User through Auth0 Universal Login. Product routes (under
the authenticated layout, starting with `/home`) require an Auth0 session;
unauthenticated deep links auto-redirect to Universal Login. Logout returns to
the public landing. Public marketing remains on `web/`.

We rejected gating the entire SPA (auto-redirect on every visit) so Operators
and invited Users can see a clear entry point and re-enter after logout without
immediately bouncing to Auth0. We rejected leaving product routes ungated
(API-only enforcement) so invite-only Users are not dropped into an empty shell.
