# Auth0 RBAC for API authorization

Authorization for protected API actions uses Auth0 RBAC: roles and permissions are defined on the Auth0 API audience and enforced by the API from access-token claims (e.g. `permissions`).

We rejected owning the permission matrix only in Postgres for v1 so Auth0 remains the source of truth for “who may do what” on the API, and the API stays a validator of tokens rather than a second authorization store. Local authorization can be revisited if product rules outgrow Auth0’s RBAC model.
