# SPA Appearance extends brand navy/cyan with mirrored semantic tokens

The SPA gets light and dark schemes while `web/` and `card/` stay dark-only. Dark mirrors the existing marketing/card tokens (`--bg`, `--bg-soft`, `--ink`, `--ink-dim`, `--line`, `--accent`); light is a cool companion pair. Delivery is SPA-local CSS variables bridged into Tailwind v4 `@theme` — no shared package yet, and no shadcn-style token layer.

Bright `--accent` (#22d3ee) stays for fills and glow; a separate `--accent-text` keeps links/interactive text at WCAG AA in each scheme. The User's **Appearance** preference (light / dark / system) persists in `localStorage` under `resetrix.appearance` and is applied before paint via an inline script in `index.html` to avoid a scheme flash.
