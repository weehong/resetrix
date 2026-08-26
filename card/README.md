# Digital Business Card (`*.resetrix.biz`)

Mobile-first personal digital business card for **RESETRIX** employees,
served per-person under a wildcard subdomain of `*.resetrix.biz` and opened
via the QR code printed on the physical business card.

The card is **hostname-driven**: it reads the requesting subdomain
(e.g. `vernonkoh.resetrix.biz`) to decide whose card to render. Each employee
is one entry in `src/data/people.ts`. A Short.io short link
(`resetrix.biz/vernonkoh`) redirects to the person's card subdomain.

- Personal card, not a mini marketing site — the Website action links out to
  [resetrix.com](https://resetrix.com) for the company story.
- Primary action: **Save contact** (vCard download/import).
- Secondary actions: Call, Email, Website, Maps (Apple Maps on iOS,
  Google Maps elsewhere).
- Locales: English + 简体中文. First visit follows the device language
  (`zh*` → Chinese, else English); the visitor's toggle choice is remembered
  in `localStorage`.

## Commands

```bash
npm install           # install dependencies
npm run dev           # local dev server
npm run build         # production build → dist/
npm test              # vitest — domain seam tests (person, vcard, locale, maps)
npm run lint          # oxlint
npm run generate-qr   # regenerate print-ready QR assets → public/qr/
```

## Adding an employee

1. Add a person entry keyed by short name to `src/data/people.ts` (copy facts +
   localized copy for `en` and `zh-CN`).
2. Point `scripts/generate-qr.mjs` at their short link and run
   `npm run generate-qr` to produce print QR assets.
3. If the Vercel project uses `*.resetrix.biz`, no hosting or DNS change is
   needed. Otherwise, add their subdomain (e.g. `mary.resetrix.biz`) under the
   project's Domains settings; Vercel issues its certificate automatically.
4. Create the Short.io short link `resetrix.biz/<shortname>` → `<shortname>.resetrix.biz`.

## Going live (Vercel + DNS)

Deploy configuration lives in `vercel.json` (Vite build `npm run build`, output
`dist`, plus cache and security headers). The site deploys as its **own Vercel
project**, separate from the main Resetrix marketing site. Set the project's
Root Directory to `card` when importing this monorepo.

The preferred setup adds `*.resetrix.biz` to the card project once, but Vercel
requires the `resetrix.biz` nameservers to be managed by Vercel for wildcard
domain verification. Copy every existing DNS record before changing
nameservers. If DNS must remain with another provider, add each employee
subdomain to Vercel individually and create the CNAME value Vercel displays.

Run the interactive wizard — it walks through Vercel project creation, domain
setup, HTTPS verification, and a phone-based smoke checklist:

```bash
./scripts/setup-card-hosting.sh
```

## Print assets

`public/qr/resetrix-biz-vernonkoh.svg` and `resetrix-biz-vernonkoh.png` encode
`https://resetrix.biz/vernonkoh` in high-contrast black-on-white (error
correction H, 4-module quiet zone), suitable for print. Regenerate with
`npm run generate-qr`. If you change the short link, update the URL in
`scripts/generate-qr.mjs` and regenerate before reprinting.

## Content sources

- People registry (per-person facts + localized copy): `src/data/people.ts`
- UI copy per locale (action labels, section labels):
  `src/i18n/en.json` and `src/i18n/zh-CN.json`
