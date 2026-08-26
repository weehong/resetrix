# Digital business card (`*.resetrix.biz`)

Status: in-progress

## Problem Statement

Vernon's physical business card carries a QR code that must open a mobile-first
digital business card. The card is a standalone Vite/React app (originally in
`Business/card/`) served per-person on a `*.resetrix.biz` subdomain
(`vernonkoh.resetrix.biz`, `mary.resetrix.biz`, ...) deployed to Vercel. The
card source lives inside this monorepo so it can be versioned with Resetrix and
reused as a per-person template as more people onboard.

## Solution

Copy the card source into `card/` at the monorepo root, build/verify it in
place, commit it to the Resetrix repo (scoped to `card/` + this `.scratch/`
entry), and configure one Vercel project that imports this GitHub repo with
Root Directory `card` (its own `card/vercel.json` runs `npm run build` and
serves `dist/`). Add `*.resetrix.biz` to the project and use Vercel nameservers
so future employee subdomains need no hosting or DNS edits, then verify HTTPS.
If nameservers cannot move, attach employee subdomains individually using the
CNAME values Vercel provides. The card app is
**hostname-driven**: it reads the subdomain (e.g. `vernonkoh`) to pick the
person from `card/src/data/people.ts`. Point `resetrix.biz` Short.io links
(e.g. `resetrix.biz/vernonkoh` → `vernonkoh.resetrix.biz`) as advertised by
the QR code, and verify HTTPS.

## User Stories

1. As a person who scanned the business-card QR code, I want to open the card
   at a stable URL, so that my phone loads Vernon's card at
   `vernonkoh.resetrix.biz` reliably.
2. As a visitor, I want the card to work on a phone (Save contact / Call /
   Email / Website / Maps, EN + 简体中文 toggle), so that it fully stands in
   for the physical card.
3. As the maintainer, I want the card source versioned inside the Resetrix
   monorepo and people resolvable by subdomain, so that one site deploys from
   the same GitHub repo and any employee (`john.resetrix.biz`,
   `mary.resetrix.biz`) resolves without new DNS.

## Acceptance criteria

- [ ] `card/` exists at the monorepo root with `npm run build` → `dist/` and
      `npm test` green in place
- [ ] Card is hostname-driven: `vernonkoh.resetrix.biz` renders Vernon from
      `src/data/people.ts`; unknown subdomains fall back to the default person
- [ ] `card/` is committed to the Resetrix repo and pushed to `origin`
- [ ] New Vercel project imports this repo with Root Directory `card`,
      publishing `card/dist`, with the employee subdomain attached, and
      auto-deploys on push
- [ ] Vercel wildcard domain `*.resetrix.biz` and nameservers configured (or
      the employee subdomain and its CNAME configured); HTTPS valid for
      `vernonkoh.resetrix.biz`
- [ ] Short.io `resetrix.biz/vernonkoh` → `https://vernonkoh.resetrix.biz`
- [ ] Card smoke test passes (see `card/scripts/setup-card-hosting.sh` Stage 6)
