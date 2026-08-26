# 11. Marketing site appearance tokens

Date: 2026-08-09

## Status

Accepted. Supersedes the `web/` clauses of
[0010 — SPA appearance tokens](0010-spa-appearance-tokens.md); 0010's decisions
about the SPA and `card/` stand unchanged.

## Context

`web/` was a stock `create-next-app` template: `--background: #ffffff`,
`--foreground: #171717`, a `prefers-color-scheme` block, and a
`body { font-family: Arial }` rule that quietly overrode the font token — the
home page worked around it with an explicit `font-sans` class and the 404 page,
which did not, rendered in Arial.

We were handed a generated palette: 99 oklch values across nine families of
eleven steps (`primary`, `secondary`, `tertiary`, `color-4`, `color-5`,
`neutral`, `success`, `warning`, `error`). It is a complete UI system and it
arrived without a brief, so the first question was what it is *for*.

Two facts settled that. First, `#22d3ee` is already the brand across `app/` and
`card/` and is recorded as such in 0010. Second — and this is the one that is
easy to get wrong — the palette's nearest colour to it, `tertiary-400`, shares
its lightness and hue but carries half its chroma, and renders as `#80c9cc`: a
dusty sage-teal, not the brand cyan. The palette does not contain the brand.

0010 also states that `web/` and `card/` "stay dark-only". That was true of the
previous marketing site, which was a dark, scroll-driven three.js piece. The
rebuild is a conventional light marketing site, so that clause no longer
describes reality and this ADR replaces it for `web/`.

## Decision

**The palette is the UI system; `#22d3ee` remains the brand.** The 99 values
ship verbatim as raw scales. `--accent` is the literal hex, held outside them,
so one cyan is shared by `web/`, `app/` and `card/`.

**Two tiers, and only the second reaches Tailwind.** Tier 1 is `@theme static`
in `app/tokens.css` — the raw scales, which do generate utilities
(`bg-primary-600`) for the cases that need a specific shade. Tier 2 is a
`:root` block of semantic aliases, and it is the only tier bridged through
`@theme inline` in `app/globals.css`. Components write `bg-bg text-ink`.

`static` rather than plain `@theme`: tier 2 reaches tier 1 through `var()`, and
Tailwind's usage detection cannot see through that, so the variables have to be
emitted unconditionally.

**Light only.** `:root { color-scheme: light }`. The `dark` variant is defined
(`&:where(html.dark, html.dark *)`) and Storybook's switcher is wired to it, but
nothing sets the class. Adding a dark scheme means adding one `html.dark` block
to tier 2 — no component changes, because no component names a palette step.

**Three accent tokens, not one.** `--accent` `#22d3ee` is 1.69:1 on the page
background and can only be a fill. `--accent-text` `#0e7490` (5.01:1) carries
links and interactive text. `--accent-ink` `#04202a` (9.33:1) is the only text
that may sit on an accent fill — white is 1.81:1 there. This mirrors the split
0010 established for the SPA, for the same reason.

**Status tokens are picked to work in both directions.** Each clears AA as text
on `--bg` *and* under white as a solid fill: `--success` `success-900`
(6.03 / 6.45), `--warning` `warning-800` (4.77 / 5.10), `--danger` `error-700`
(5.06 / 5.41).

**Two boundary tokens.** `--line` (`neutral-200`, 1.30:1) is a decorative
hairline. `--line-strong` (`neutral-500`, 3.12:1) is for anything a user can
operate, where WCAG 1.4.11 applies.

**Sora and Inter, self-hosted.** `next/font/google`, variable axes, no pinned
weights and no third-party request. Exposed as `--typeface-display` and
`--typeface-body`. Geist and the Arial override are gone.

**`color-4` → `info`, `color-5` → `data`.** Values unchanged; the generator
names produced utilities like `bg-color-4-500`.

**`primary` and `secondary` get no semantic role.** They remain raw scales.

## Consequences

The site is light-only and will stay that way until someone writes the
`html.dark` block. `siteConfig.themeColor.dark` already holds the correct value
(`#05070f`, from 0010) and the generated icon and OG images use it, so the dark
ground is already brand-correct.

Two collisions are live in the palette and are not fixable in the token layer,
because both members are values we were given:

- `secondary-500` `#63c742` and `success-600` `#1bc762` are **1.04:1** apart and
  11.6° apart in hue. They are the same colour to the eye. Only `success` enters
  the semantic layer; `secondary` must never be placed adjacent to it.
- `primary-600` `#c71a26` and `error-600` `#c76219` are **1.44:1** apart. Never
  rely on hue alone to distinguish crimson from the error orange.

`--color-neutral-*` overrides Tailwind's built-in `neutral`. This is
intentional — the scale is warm (hue ~17°) where Tailwind's is not — but it
means `bg-neutral-500` does not mean what a newcomer expects.

`themeColor` in `lib/site-config.ts` duplicates `--bg` and is still kept in sync
by hand. Nothing enforces it.

The contrast ratios quoted here and in `app/tokens.css` were computed from the
oklch values (oklch → linear sRGB → WCAG 2.1 relative luminance), not estimated.
If a token value changes, the comment next to it is now wrong.
