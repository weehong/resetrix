# Approximately seven-day signed-in lifetime

Users should remain signed in for about seven days without an interactive login. Auth0 refresh-token and session lifetimes are configured to match that expectation.

Shorter defaults or a thirty-day “remember me” were rejected for v1 in favor of a week-scale return visit without making long-lived tokens the product norm.
