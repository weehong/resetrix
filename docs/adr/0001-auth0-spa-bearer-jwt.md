# Auth0 SPA with Bearer JWT access tokens

The product SPA (`app/`) and HTTP API (`api/`) are separate origins. Authentication uses Auth0's SPA SDK: the browser obtains Auth0-issued access tokens and sends them to the API as `Authorization: Bearer` JWTs; the API validates issuer, audience, and signature via JWKS.

We rejected a BFF/cookie-session model because it would add a new session layer the codebase does not have, while CORS SPA↔API already matches the Bearer pattern.
