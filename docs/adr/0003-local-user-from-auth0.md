# Local User projection from Auth0

Auth0 is the identity provider. On authenticated API access, the API upserts a local `User` keyed by Auth0 `sub` (syncing profile fields such as email/name as needed) so application data can foreign-key to a stable local id.

We rejected JWT-only identity for v1 because product features will need local relations, and a sample `User` model already exists.
