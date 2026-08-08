# 01 — Card: move into monorepo and deploy to Netlify

Status: in-progress

Type: task

## Parent

`.scratch/card/spec.md`

## What to do

Bring the card app (previously `Business/card/`) into the Resetrix monorepo at
`card/` and deploy it as its own Netlify site at `card.resetrix.com`.

- Copy `Business/card/` → `card/` (exclude `node_modules/`, `dist/`, `.git`).
- Verify in place: `npm install && npm run build && npm test && npm run lint`.
- Commit only `card/` + `.scratch/card/` (the pending `web/` changes stay
  staged and out of this commit), then push to `origin`.
- Set up a new Netlify site importing this GitHub repo with base directory
  `card` (uses `card/netlify.toml`: `npm run build` → `dist/`).
- Attach `card.resetrix.com`, add DNS CNAME `card` → `<site>.netlify.app`,
  verify Let's Encrypt HTTPS.

## Acceptance criteria

- [x] `card/` copied into the monorepo with build/test/lint green
- [ ] `card/` committed + pushed to `origin`
- [ ] Netlify site live at `https://card.resetrix.com` over HTTPS
- [ ] Card smoke test passes on a phone

## Blocked by

None.

## Comments

- Copied `Business/card/` → `card/` (source only), keeping `Business/card/`
  intact. Build, 15 tests, and lint all pass in place.
- Run `card/scripts/setup-card-hosting.sh` interactively to walk through the
  Netlify UI (site creation, domain, DNS, HTTPS) since no Netlify CLI/token is
  available.
