# Resetrix

Product context for the Resetrix SPA and API: people invited to use the product, proven by Auth0 and represented locally for application data.

## Language

**User**:
A person invited to use the product who authenticates to the SPA via Auth0.
_Avoid_: Customer, End-user, Account, Client

**Profile**:
The User's product-facing identity as exposed by the API after authentication: the local User record plus the roles and permissions from the access token that the SPA needs to render the signed-in User.
_Avoid_: Account, me-resource, session user
