# Refresh tokens for SPA persistence

The product SPA uses Auth0 refresh tokens with **refresh token rotation** and SDK `cacheLocation: 'localstorage'` so Users keep an API session across browser refreshes and tabs. Target signed-in longevity is about **7 days**, configured via Auth0 refresh token / session lifetimes.

We accepted the XSS exposure of persistent browser storage (mitigated by rotation and normal SPA XSS hygiene) because a gated SPA with invite-only Users needs a durable signed-in experience beyond in-memory access tokens alone.
