# Single Auth0 tenant across environments

Dev, staging, and prod share one Auth0 tenant, separated by Application callback URLs and environment-specific client configuration rather than by tenant.

We accepted the operational simplicity of one tenant over stricter isolation (separate prod tenant). Secrets, User lists, and misconfigured callbacks are therefore a cross-environment risk and must be handled with care in Auth0 Application settings.
