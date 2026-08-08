# card.resetrix.com — Digital Business Card

Mobile-first personal digital business card for **Vernon Wee Hong KOH**
(Founder, RESETRIX PTE. LTD.), served at `https://card.resetrix.com` and
opened via the QR code printed on the physical business card.

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
npm test              # vitest — domain seam tests (vcard, locale, maps)
npm run lint          # oxlint
npm run generate-qr   # regenerate print-ready QR assets → public/qr/
```

## Going live (Netlify + DNS)

Deploy configuration lives in `netlify.toml` (build `npm run build`,
publish `dist`). The site deploys as its **own Netlify site**, separate from
the main Resetrix marketing site.

Run the interactive wizard — it walks through Netlify site creation,
attaching `card.resetrix.com`, the DNS CNAME record, HTTPS verification, and
a phone-based smoke checklist:

```bash
./scripts/setup-card-hosting.sh
```

## Print assets

`public/qr/card-resetrix-com.svg` and `card-resetrix-com.png` encode
`https://card.resetrix.com` in high-contrast black-on-white (error
correction H, 4-module quiet zone), suitable for print. Regenerate with
`npm run generate-qr`. If you change the public URL, update the URL in
`scripts/generate-qr.mjs` and regenerate before reprinting.

## Content sources

- Contact facts (phone, email, address, slogan): `src/data/contact.ts`
- Copy per locale (title, company, slogan, address, UI labels):
  `src/i18n/en.json` and `src/i18n/zh-CN.json`

> **Note:** the zh-CN copy is a draft pending Vernon’s approval
> (see `.scratch/digital-business-card/issues/04-en-zh-cn-i18n.md`).
