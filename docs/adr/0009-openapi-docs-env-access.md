# OpenAPI docs public only outside production

`/docs` and `/openapi.json` stay publicly reachable in non-production environments so local and staging work stays easy. In production those routes are not mounted.

We rejected always-public docs to avoid advertising the full API surface in prod, and rejected always-authenticated docs to avoid slowing day-to-day development.
