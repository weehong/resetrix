# Product SPA is authentication-gated

The product SPA (`app/`) requires Auth0 login for access; unauthenticated visitors are redirected to Auth0 Universal Login. Public marketing remains on `web/`.

We rejected leaving the SPA ungated (API-only enforcement) so invite-only Users are not dropped into an empty shell, and the SPA matches the product’s default-deny access model.
