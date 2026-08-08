# Invite-only User registration

Users cannot self-register. Access to the product requires an invitation (no public Auth0 signup for this effort). Invited Users must verify their email before Auth0 completes login; the API also requires a verified-email claim on the access token.

Open signup was rejected so membership stays controlled while the product and permission model are still thin. Unverified emails are rejected so invite links cannot be used until the mailbox is confirmed.
