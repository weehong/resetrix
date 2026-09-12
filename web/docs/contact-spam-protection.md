# Inquiry form spam protection

The form requires Cloudflare Turnstile verification before sending through
Mailjet. Verification checks `success`, action `contact`, and an exact allowed
hostname. Missing configuration and verification outages fail closed. Tokens
are verified once per attempt; the widget is recreated after each submission
so retries obtain a new token. No tokens or provider secrets are logged.

The handler also discards filled `website` honeypot submissions with a normal
success response, validates required fields, and limits the actual body stream
to 64 KiB before JSON parsing (including absent or forged Content-Length).

## Vercel environment

Set these for **Production and Preview**, then rebuild/redeploy:

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: the widget's public site key (inlined at build time).
- `TURNSTILE_SECRET_KEY`: the matching secret, server-only.
- Existing Mailjet settings are still required.

Configure the widget in Cloudflare as **Managed**, allowing `resetrix.com` and
the exact preview hostnames used to open the form. A stable Vercel branch URL
avoids adding every new deployment URL. Do not authorize all of `vercel.app`.
Turnstile's free tier permits 10 hostnames per widget.

The server accepts `resetrix.com` and `www.resetrix.com`. On Vercel previews it
also accepts the exact `VERCEL_URL` and `VERCEL_BRANCH_URL` supplied by Vercel.
Ensure Vercel system environment variables are exposed to the deployment.
This server allowance does **not** update Cloudflare's widget hostname list.
For additional custom preview domains, set `TURNSTILE_ALLOWED_HOSTNAMES` to a
comma-separated list of exact hostnames and authorize them in Cloudflare too.
Never include protocols, paths, wildcards, or ports in that list.

## Required Vercel Firewall rule

Rate limiting is enforced by the hosting firewall, not an in-memory application
counter. Adding environment variables alone does not enable this rule.

In the project's **Firewall → Configure → New Rule**:

1. Match request path **equals `/api/contact`** AND method **equals `POST`**.
2. Action: **Rate Limit**, strategy: **Fixed Window**.
3. Counting key: **IP**, window: **600 seconds**, request limit: **5**.
4. Excess-request action: **Default (429)**.
5. Save, review, and publish. Confirm coverage for both production and previews.

Hobby includes one rate-limit rule per project and supports windows up to ten
minutes. Counters are regional, so this is not a global email quota. The form
handles 429 responses without assuming the firewall returns JSON.

Reference: <https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting>

## Verification

Run `npm run test:unit:run`, `npm run lint`, and `npm run build`.
Automated tests mock Cloudflare and Mailjet; they do not send real inquiries.
Run `npx playwright test e2e/contact.spec.ts` against a fresh Playwright-managed
server to check the real browser script lifecycle, rate-limit messaging, and
fresh-token retries. Playwright supplies a dummy public key and the test
intercepts both the widget script and contact endpoint. Stop any existing dev
server first so Playwright does not reuse a server built without its test key.
For local manual verification use Cloudflare's documented **test key pair**
and allow the test response hostname via `TURNSTILE_ALLOWED_HOSTNAMES` as
described in their testing docs. Never deploy the always-pass test pair to a
public environment. There is no application bypass for development/previews.

After deploying, verify:

- The widget loads on production and the chosen preview URL.
- A genuine inquiry arrives once and the form shows success.
- Verification retries work and preserve entered form details.
- Requests missing a token cannot send mail.
- Repeated requests hit the firewall's 429 response; inspect Firewall events.

Cloudflare references:
- <https://developers.cloudflare.com/turnstile/get-started/server-side-validation/>
- <https://developers.cloudflare.com/turnstile/additional-configuration/hostname-management/>
- <https://developers.cloudflare.com/turnstile/troubleshooting/testing/>
