# Digital business card (card.resetrix.com)

Status: in-progress

## Problem Statement

Vernon's physical business card carries a QR code that must open a mobile-first
digital business card. The card is a standalone Vite/React app (originally in
`Business/card/`) served at `https://card.resetrix.com` and deployed as its own
Netlify site, independent of the main Resetrix marketing site (`web/`). The
card source must live inside this monorepo so it can be versioned with
Resetrix and later reused as a per-person template (e.g. `john.resetrix.biz`,
`mary.resetrix.biz`) as more people onboard.

## Solution

Copy the card source into `card/` at the monorepo root, build/verify it in
place, commit it to the Resetrix repo (scoped to `card/` + this `.scratch/`
entry), and configure a new Netlify site that imports this GitHub repo with
base directory `card` (its own `card/netlify.toml` runs `npm run build` →
`dist/`). Attach the `card.resetrix.com` subdomain, point `resetrix.biz`
Short.io links (e.g. `resetrix.biz/vernonkoh` → `vernonkoh.resetrix.biz`) as
advertised by the card, and verify HTTPS.

## User Stories

1. As a person who scanned the business-card QR code, I want to open the card
   at a stable URL, so that my phone loads `card.resetrix.com` reliably.
2. As a visitor, I want the card to work on a phone (Save contact / Call /
   Email / Website / Maps, EN + 简体中文 toggle), so that it fully stands in
   for the physical card.
3. As the maintainer, I want the card source versioned inside the Resetrix
   monorepo, so that it deploys from the same GitHub repo and is reusable as a
   per-person template later.

## Acceptance criteria

- [ ] `card/` exists at the monorepo root with `npm run build` → `dist/` and
      `npm test` green in place
- [ ] `card/` is committed to the Resetrix repo and pushed to `origin`
- [ ] New Netlify site imports this repo with base directory `card`,
      publishing `card/dist`, and auto-deploys on push
- [ ] `https://card.resetrix.com` loads the card over HTTPS with a valid cert
- [ ] Card smoke test passes (see `card/scripts/setup-card-hosting.sh` Stage 6)
