# 01 — Card: move into monorepo, hostname-driven, deploy to Netlify

Status: in-progress

Type: task

## Parent

`.scratch/card/spec.md`

## What to do

Bring the card app (previously `Business/card/`) into the Resetrix monorepo at
`card/`, make it **hostname-driven** (people resolved by subdomain under
`*.resetrix.biz`), and deploy it as its own Netlify site serving each employee's
subdomain.

- Copy `Business/card/` → `card/` (exclude `node_modules/`, `dist/`, `.git`).
- Verify in place: `npm install && npm run build && npm test && npm run lint`.
- Refactor to hostname-driven: per-person registry in `src/data/people.ts`
  keyed by short name; `src/lib/person.ts` + `usePerson()` resolve the person
  from `window.location.hostname`; components read the resolved person and
  localized copy.
- Point the QR generator at the Short.io short link
  (`https://resetrix.biz/vernonkoh`) and regenerate print assets.
- Commit only `card/` + `.scratch/card/`, then push to `origin`.
- Set up a new Netlify site importing this GitHub repo with base directory
  `card` (uses `card/netlify.toml`: `npm run build` → `dist/`).
- Attach the employee subdomain `vernonkoh.resetrix.biz`, add DNS wildcard
  CNAME `*` → `<site>.netlify.app`, verify Let's Encrypt HTTPS.
- Create Short.io link `resetrix.biz/vernonkoh` → `https://vernonkoh.resetrix.biz`.

## Acceptance criteria

- [x] `card/` copied into the monorepo with build/test/lint green
- [x] Card is hostname-driven: `vernonkoh.resetrix.biz` resolves Vernon from
      `src/data/people.ts`; unknown subdomains fall back to the default person
- [ ] `card/` committed + pushed to `origin`
- [ ] Netlify site live serving `vernonkoh.resetrix.biz` over HTTPS
- [ ] Short.io `resetrix.biz/vernonkoh` → `https://vernonkoh.resetrix.biz`
- [ ] Card smoke test passes on a phone

## Blocked by

None.

## Comments

- Copied `Business/card/` → `card/` (source only), keeping `Business/card/`
  intact. Build, tests, and lint pass in place.
- Changed the deployment target from the original `card.resetrix.com` to a
  per-person subdomain under `*.resetrix.biz`: the card now reads the request
  subdomain to pick the person, so one Netlify site + one DNS wildcard CNAME
  serves every employee. Netlify does not accept a literal `*.resetrix.biz`
  domain entry, so each employee's subdomain is attached individually while
  DNS stays wildcard. The QR code encodes the short link `resetrix.biz/vernonkoh`;
  Short.io redirects to `vernonkoh.resetrix.biz`.
- Run `card/scripts/setup-card-hosting.sh` interactively to walk through the
  Netlify UI (site creation, subdomain, DNS, HTTPS, short link + smoke
  test) since no Netlify CLI/token is available.
