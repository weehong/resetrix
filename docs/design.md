# Design System — Botanical

**Derived from:** a physical paint-chip card (two swatch groups: sage/mint/forest greens, and chartreuse/gold yellows)
**Surface:** Marketing / landing site
**Stack:** Tailwind CSS v4 + React + shadcn/ui
**Modes:** Light and dark, both first-class — neither is "the default"
**Accessibility target:** WCAG 2.2 AA
**Colour strategy:** Forest green leads. Yellow accents.

---

## 0. Read this first — provenance and assumptions

**Colour provenance.** The five green and five yellow anchors were read off a photograph of a physical paint card. Paper texture, ambient light, and camera white balance all shift colour, so **these anchors approximate the physical swatches, not match them.** Every ramp in this document is mathematically consistent with the anchors as read — but if the physical card is the authority, re-measure it with a colorimeter and re-derive. §2.1 lists the ten anchors and where each one landed, so a re-derivation only means editing ten values.

**Assumptions I made, and how to change them.** You specified the palette, the medium, the stack, dark mode, and the colour strategy. The rest is my judgement, marked here so you can overrule any of it without hunting:

| Decision | What I chose | Why | Swap it for |
|---|---|---|---|
| Display face | **Fraunces** | A soft, organic serif — this palette is botanical, and a grotesque display would fight it | DM Serif Display (sharper), or General Sans (if you want all-sans) |
| Body face | **Inter** | Neutral, exceptional at small sizes, doesn't compete with Fraunces | Söhne, Public Sans |
| Mono | **JetBrains Mono** | Meta labels and eyebrows only, not code-heavy | IBM Plex Mono |
| Motion | Moderate — reveals, hovers, one hero sequence | Landing sites carry motion well, but nothing here needs parallax to make its point | §6 has a "rich" upgrade path |
| Density | Generous / airy | The palette is quiet; crowding it makes it muddy | Tighten §5.2 section padding one step |
| Corner language | Soft, medium-large radii | Organic palette, organic geometry | Halve every value in §5.3 for a crisper feel |

---

## 1. Design principles

1. **Forest is structure, gold is the event.** Green carries the page — grounds, type, buttons, bands. Yellow appears where something is *happening*: the thing to click next, the badge that's new, the word being emphasised. Yellow everywhere means nothing is happening.
2. **The palette is quiet by nature.** Nine of the ten source swatches sit above 0.74 lightness with chroma under 0.17 — this is a low-contrast, low-saturation family. Contrast has to be *manufactured* through lightness range, not assumed. Every text pairing in this doc is measured, because eyeballing this palette will fail you.
3. **Warm neutrals only.** `stone` is a greige at hue 117 — it has green in it. Never mix in a cool grey; a `#71717A` next to `#7A7E6C` reads as a mistake.
4. **Tint, don't grey.** Disabled and secondary states step *within* the family (forest-400 rather than forest-600 at 50% opacity). Opacity on this palette turns everything to mud.
5. **Depth through ground, not shadow.** Sage-on-cream separations are subtle by design. Use a background step first; reach for elevation second; draw a border last.
6. **Green means brand, not "success".** See §3.5 — this is the single biggest trap in the system.

---

## 2. Colour foundation

### 2.1 The ten source anchors

| Card swatch | Hex read | Landed at | Exact? |
|---|---|---|---|
| Pale sage | `#D9DDCA` | `stone-200` | ✅ exact |
| Cream | `#D6DBC7` | `stone-200` | ≈ — within 0.007 L of pale sage; the two are the same colour for practical purposes |
| Mint | `#CBDCD2` | `forest-200` | ✅ exact |
| Sage green | `#8DB6A1` | `forest-400` | ✅ exact |
| Forest | `#30503E` | `forest-800` | ✅ exact |
| Aqua | `#ABD4C7` | `aqua-300` | ✅ exact |
| Chartreuse | `#D9DE7B` | `chartreuse-300` | ✅ exact |
| Lemon | `#F0E24F` | `gold-200` | ✅ exact |
| Gold | `#DFCC28` | `gold-300` | ✅ exact |
| Olive-gold | `#D2C924` | between `gold-300` and `gold-400` | ⚠️ see below |

**On olive-gold.** `#D2C924` sits at L 0.818, and `gold-300` is at L 0.836 — a 2% lightness gap with near-identical chroma and hue. There is no room for both on a standard 11-step ramp. Use `gold-300` and accept the difference, or, if the physical olive-gold is specifically the one you want, add an off-scale step:

```css
--color-gold-350: oklch(0.818 0.1667 106.10); /* #D2C924 — olive-gold, off-scale */
```

**On mint vs aqua.** Mint `#CBDCD2` (hue 160) and aqua `#ABD4C7` (hue 174) are 14° apart — mint is a green, aqua is a teal. They belong to different ramps, which is why mint lives in `forest` and aqua has its own. Do not treat them as light/dark of the same colour.

### 2.2 The five families

| Family | Anchor | Role |
|---|---|---|
| **forest** | `#30503E` / `#8DB6A1` / `#CBDCD2` | Primary. Brand, body text, buttons, dark grounds. Hue ~160. |
| **stone** | `#D9DDCA` | Warm greige neutral. Paper, secondary text, hairlines. Hue 117 — **not** a grey. |
| **gold** | `#DFCC28` / `#F0E24F` | Signal accent. Highlights, badges, active states. Hue ~103. |
| **chartreuse** | `#D9DE7B` | Soft highlight. Marker sweeps, quiet emphasis, the third chart series. Hue 111. |
| **aqua** | `#ABD4C7` | Cool counterweight. Links, quiet chips, info-adjacent fills. Hue 174. |

Plus four status families — `success`, `warning`, `error`, `info` — synthesised at hues chosen for maximum separation from the brand (§3.5).

### 2.3 Full ramps

**forest** — primary

| Step | Hex | Step | Hex |
|---|---|---|---|
| 50 | `#F3F8F5` | 500 | `#70A087` |
| 100 | `#E8F1EC` | 600 | `#59886F` |
| 200 | `#CBDCD2` ← mint | 700 | `#466F59` |
| 300 | `#B4CFC0` | 800 | `#30503E` ← forest |
| 400 | `#8DB6A1` ← sage | 900 | `#284434` |
| | | 950 | `#172A1F` |

**stone** — warm neutral

| Step | Hex | Step | Hex |
|---|---|---|---|
| 50 | `#F6F8EE` | 500 | `#929683` |
| 100 | `#EDF0E4` | 600 | `#7A7E6C` |
| 200 | `#D9DDCA` ← pale sage | 700 | `#636756` |
| 300 | `#C6CAB4` | 800 | `#4F5243` |
| 400 | `#ACB19B` | 900 | `#3C3F32` |
| | | 950 | `#25261D` |

**gold** — signal

| Step | Hex | Step | Hex |
|---|---|---|---|
| 50 | `#FDFACA` | 500 | `#A49621` |
| 100 | `#FAF39F` | 600 | `#897E1A` |
| 200 | `#F0E24F` ← lemon | 700 | `#706613` |
| 300 | `#DFCC28` ← gold | 800 | `#59510D` |
| 400 | `#C1B028` | 900 | `#453E08` |
| | | 950 | `#2A2603` |

**chartreuse** — soft highlight

| Step | Hex | Step | Hex |
|---|---|---|---|
| 50 | `#F7FAD9` | 500 | `#969A40` |
| 100 | `#F0F4BB` | 600 | `#7E8130` |
| 200 | `#DFE48E` | 700 | `#67691F` |
| 300 | `#D9DE7B` ← chartreuse | 800 | `#525410` |
| 400 | `#B1B555` | 900 | `#3F4008` |
| | | 950 | `#262703` |

**aqua** — cool counterweight

| Step | Hex | Step | Hex |
|---|---|---|---|
| 50 | `#F1F9F6` | 500 | `#56A590` |
| 100 | `#E5F2EE` | 600 | `#3C8C78` |
| 200 | `#CAE3DB` | 700 | `#297361` |
| 300 | `#ABD4C7` ← aqua | 800 | `#1B5C4D` |
| 400 | `#80BCAA` | 900 | `#12473B` |
| | | 950 | `#072C23` |

**Status**

| | 300 | 400 | 700 | 800 |
|---|---|---|---|---|
| success | `#A7D5AC` | `#7DC187` | `#237738` | `#16602A` |
| warning | `#FBB867` | `#E19F4A` | `#895913` | `#6E460D` |
| error | `#F7B4A9` | `#EE9182` | `#A44033` | `#853025` |
| info | `#AACBEC` | `#83B3E1` | `#32689A` | `#24537D` |

### 2.4 Semantic roles

| Role | Light | Dark |
|---|---|---|
| Page ground | `stone-50` `#F6F8EE` | `forest-950` `#172A1F` |
| Raised surface | `#FFFFFF` | `forest-900` `#284434` |
| Alternating band | `forest-50` `#F3F8F5` | `forest-900` `#284434` |
| Deep band (paint-chip) | `stone-200` `#D9DDCA` | `forest-900` `#284434` |
| Inverted band | `forest-800` `#30503E` | `stone-100` `#EDF0E4` |
| Text — primary | `forest-950` `#172A1F` | `stone-100` `#EDF0E4` |
| Text — secondary | `stone-800` `#4F5243` | `stone-300` `#C6CAB4` |
| Text — muted | `stone-700` `#636756` | `stone-400` `#ACB19B` |
| Text — link | `aqua-800` `#1B5C4D` | `aqua-300` `#ABD4C7` |
| CTA fill | `forest-800` `#30503E` | `forest-300` `#B4CFC0` |
| CTA label | `stone-50` `#F6F8EE` | `forest-950` `#172A1F` |
| CTA hover fill | `forest-900` `#284434` | `forest-200` `#CBDCD2` |
| Accent (signal) | `gold-300` `#DFCC28` | `gold-300` `#DFCC28` |
| Accent label | `forest-950` `#172A1F` | `forest-950` `#172A1F` |
| Highlight sweep | `chartreuse-300` `#D9DE7B` | `chartreuse-400` `#B1B555` |
| Quiet chip fill | `aqua-200` `#CAE3DB` | `rgba(171,212,199,.14)` |
| Hairline | `stone-200` `#D9DDCA` | `rgba(237,240,228,.10)` |
| Control boundary | `stone-600` `#7A7E6C` | `rgba(237,240,228,.30)` |
| Focus ring | `forest-800` `#30503E` | `gold-300` `#DFCC28` |

### 2.5 Usage budget

Per viewport, not per page.

- **Forest + stone — ~88%.** Grounds, all body copy, buttons, bands, borders.
- **Aqua — ~7%.** Links, quiet chips, one supporting fill per section.
- **Gold — ~4%.** One primary accent moment per section: the active nav underline, a badge, a stat figure, a hero highlight. Never two golds competing in the same viewport.
- **Chartreuse — ~1%.** Highlight sweeps behind single words, and the third series in a chart. Nothing else.

### 2.6 Hard colour rules

- ❌ **`gold-200` / `gold-300` as text on any light ground** — 1.53:1 and 1.64:1. They are fills. The lightest gold that works as text on `stone-50` is **`gold-700` `#706613`** (5.44:1).
- ❌ **`gold-300` as a focus ring on a light ground** — 1.53:1 against `stone-50`, far under the 3:1 that non-text contrast requires. Light mode rings are `forest-800`.
- ❌ **`chartreuse-300` as text anywhere.** 1.33:1 on `stone-50`. Fill only, always with `forest-950` on it.
- ❌ **`aqua-300` or `forest-200` as text on white** — 1.62:1 / 1.43:1. These are chip and band fills.
- ❌ **`stone-500` as body text** — 2.83:1 on `stone-50`. Decorative only.
- ❌ Pure black or pure cool grey anywhere. Darkest inks are `forest-950` and `stone-950`.
- ❌ A gold→chartreuse gradient. They are 9° apart in hue — the gradient reads as a printing error. Sanctioned gradients: `forest-800 → forest-950`, `stone-50 → forest-50`, and `gold-300 → chartreuse-300` **only** at ≥40% width with both at ≤20% opacity as a background wash.
- ✅ White is permitted only as a raised-card surface in light mode. The page ground is always `stone-50`.

---

## 3. Contrast reference

All ratios computed from the ramp values above using WCAG 2.1 relative luminance. Nothing here is estimated.

### 3.1 Light mode — on page ground `stone-50` `#F6F8EE`

| Foreground | Ratio | Verdict |
|---|---|---|
| `stone-950` `#25261D` | **14.25** | AAA |
| `forest-950` `#172A1F` | **14.11** | AAA — primary text |
| `stone-900` `#3C3F32` | **10.05** | AAA |
| `forest-900` `#284434` | **9.96** | AAA |
| `forest-800` `#30503E` | **8.36** | AAA — CTA fill, focus ring |
| `gold-800` `#59510D` | **7.51** | AAA |
| `stone-800` `#4F5243` | **7.47** | AAA — secondary text |
| `chartreuse-800` `#525410` | **7.43** | AAA |
| `aqua-800` `#1B5C4D` | **7.29** | AAA — links |
| `success-800` `#16602A` | **7.14** | AAA |
| `error-700` `#A44033` | **5.83** | AA |
| `warning-700` `#895913` | **5.59** | AA |
| `info-700` `#32689A` | **5.47** | AA |
| `gold-700` `#706613` | **5.44** | AA — smallest safe gold text |
| `stone-700` `#636756` | **5.43** | AA — muted text (floor) |
| `chartreuse-700` `#67691F` | **5.41** | AA |
| `forest-700` `#466F59` | **5.32** | AA |
| `aqua-700` `#297361` | **5.26** | AA |
| `success-700` `#237738` | **5.20** | AA |
| `error-600` `#C35445` | **4.19** | ⚠️ ≥24px / UI only |
| `stone-600` `#7A7E6C` | **3.89** | ⚠️ control boundaries only |
| `gold-600` `#897E1A` | **3.87** | ⚠️ ≥24px / UI only |
| `forest-600` `#59886F` | **3.78** | ⚠️ ≥24px / UI only |
| `stone-500` `#929683` | **2.83** | ❌ decorative only |

### 3.2 Light mode — on white `#FFFFFF` (raised cards)

| Foreground | Ratio | Verdict |
|---|---|---|
| `stone-950` `#25261D` | **15.29** | AAA |
| `forest-950` `#172A1F` | **15.14** | AAA |
| `forest-900` `#284434` | **10.68** | AAA |
| `forest-800` `#30503E` | **8.96** | AAA |
| `gold-800` `#59510D` | **8.05** | AAA |
| `stone-800` `#4F5243` | **8.01** | AAA |
| `chartreuse-800` `#525410` | **7.97** | AAA |
| `aqua-800` `#1B5C4D` | **7.82** | AAA |
| `success-800` `#16602A` | **7.66** | AAA |
| `error-700` `#A44033` | **6.25** | AA |
| `warning-700` `#895913` | **6.00** | AA |
| `info-700` `#32689A` | **5.86** | AA |
| `gold-700` `#706613` | **5.84** | AA |
| `stone-700` `#636756` | **5.83** | AA |
| `chartreuse-700` `#67691F` | **5.81** | AA |
| `forest-700` `#466F59` | **5.71** | AA |
| `aqua-700` `#297361` | **5.65** | AA |
| `stone-600` `#7A7E6C` | **4.18** | ⚠️ UI only |
| `forest-600` `#59886F` | **4.06** | ⚠️ UI only |
| `stone-500` `#929683` | **3.04** | ⚠️ boundaries only |
| `stone-300` `#C6CAB4` | **1.68** | ❌ hairlines only |

### 3.3 Light mode — on the paint-chip band `stone-200` `#D9DDCA`

This is the darkest light-mode ground, so its safe list is much shorter. **Only these belong on it.**

| Foreground | Ratio | Verdict |
|---|---|---|
| `stone-950` `#25261D` | **11.03** | AAA |
| `forest-950` `#172A1F` | **10.92** | AAA — use this |
| `stone-900` `#3C3F32` | **7.77** | AAA |
| `forest-900` `#284434` | **7.70** | AAA |
| `forest-800` `#30503E` | **6.47** | AA |
| `gold-800` `#59510D` | **5.81** | AA |
| `stone-800` `#4F5243` | **5.78** | AA |
| `chartreuse-800` `#525410` | **5.75** | AA |
| `aqua-800` `#1B5C4D` | **5.64** | AA |
| `success-800` `#16602A` | **5.53** | AA |
| `error-700` `#A44033` | **4.51** | AA (barely) |
| `warning-700` `#895913` | **4.32** | ❌ fails on this ground |
| `stone-700` `#636756` | **4.20** | ❌ fails on this ground |
| `forest-700` `#466F59` | **4.12** | ❌ fails on this ground |

> **The trap:** `stone-700` is the muted-text token and it *fails* on the `stone-200` band. On this ground, muted text steps down to `stone-800`. Same for any 700-step colour. If you put a card inside this band, give the card a white ground and the normal rules resume.

### 3.4 Dark mode — on page ground `forest-950` `#172A1F`

| Foreground | Ratio | Verdict |
|---|---|---|
| `stone-50` `#F6F8EE` | **14.11** | AAA |
| `forest-100` `#E8F1EC` | **13.14** | AAA |
| `stone-100` `#EDF0E4` | **13.11** | AAA — primary text |
| `gold-200` `#F0E24F` | **11.31** | AAA |
| `forest-200` `#CBDCD2` | **10.60** | AAA |
| `chartreuse-300` `#D9DE7B` | **10.58** | AAA |
| `aqua-300` `#ABD4C7` | **9.35** | AAA — links |
| `gold-300` `#DFCC28` | **9.23** | AAA — accent, focus ring |
| `success-300` `#A7D5AC` | **9.19** | AAA |
| `forest-300` `#B4CFC0` | **9.10** | AAA — CTA fill |
| `stone-300` `#C6CAB4` | **9.02** | AAA — secondary text |
| `info-300` `#AACBEC` | **8.98** | AAA |
| `warning-300` `#FBB867` | **8.76** | AAA |
| `error-300` `#F7B4A9` | **8.69** | AAA |
| `success-400` `#7DC187` | **7.10** | AAA |
| `aqua-400` `#80BCAA` | **6.99** | AA |
| `chartreuse-400` `#B1B555` | **6.93** | AA |
| `stone-400` `#ACB19B` | **6.86** | AA — muted text |
| `gold-400` `#C1B028` | **6.85** | AA |
| `forest-400` `#8DB6A1` | **6.73** | AA |
| `stone-500` `#929683` | **4.98** | AA (floor) |

### 3.5 Dark mode — on raised card `forest-900` `#284434`

| Foreground | Ratio | Verdict |
|---|---|---|
| `stone-50` `#F6F8EE` | **9.96** | AAA |
| `forest-100` `#E8F1EC` | **9.27** | AAA |
| `stone-100` `#EDF0E4` | **9.25** | AAA |
| `gold-200` `#F0E24F` | **7.98** | AAA |
| `forest-200` `#CBDCD2` | **7.48** | AAA |
| `chartreuse-300` `#D9DE7B` | **7.47** | AAA |
| `aqua-300` `#ABD4C7` | **6.60** | AA |
| `gold-300` `#DFCC28` | **6.51** | AA |
| `success-300` `#A7D5AC` | **6.49** | AA |
| `forest-300` `#B4CFC0` | **6.42** | AA |
| `stone-300` `#C6CAB4` | **6.36** | AA |
| `warning-300` `#FBB867` | **6.18** | AA |
| `error-300` `#F7B4A9` | **6.13** | AA |
| `stone-400` `#ACB19B` | **4.84** | AA (floor) |
| `forest-400` `#8DB6A1` | **4.75** | AA (floor) |

### 3.6 Approved filled pairings

| Fill | Label | Ratio | Use |
|---|---|---|---|
| `forest-800` `#30503E` | `stone-50` `#F6F8EE` | **8.36** | Light-mode primary button |
| `forest-800` `#30503E` | `#FFFFFF` | **8.96** | Light-mode button, cool label |
| `forest-900` `#284434` | `stone-50` `#F6F8EE` | **9.96** | Button :hover |
| `forest-300` `#B4CFC0` | `forest-950` `#172A1F` | **9.10** | Dark-mode primary button |
| `forest-200` `#CBDCD2` | `forest-950` `#172A1F` | **10.60** | Dark button :hover |
| `gold-300` `#DFCC28` | `forest-950` `#172A1F` | **9.23** | Accent badge, both modes |
| `gold-200` `#F0E24F` | `forest-950` `#172A1F` | **11.31** | Bright accent fill |
| `chartreuse-300` `#D9DE7B` | `forest-950` `#172A1F` | **10.58** | Highlight sweep |
| `aqua-300` `#ABD4C7` | `forest-950` `#172A1F` | **9.35** | Chip, tag |
| `aqua-200` `#CAE3DB` | `forest-950` `#172A1F` | **11.19** | Quiet chip |
| `stone-200` `#D9DDCA` | `forest-950` `#172A1F` | **10.92** | Paint-chip band |
| `forest-800` `#30503E` | `gold-200` `#F0E24F` | **6.70** | Gold text on the inverted band |

> **Why the CTA flips ramp step between modes.** `forest-800` on a dark ground would be nearly invisible — a dark green button on a darker green page. Dark mode inverts the button: a pale `forest-300` fill carrying dark `forest-950` text, 9.10:1, and 9.10:1 against the page ground too, which also satisfies WCAG 2.2 §1.4.11 for the control's boundary. It is a different-looking button, deliberately. Gold stays the accent in both modes because it is one of the few colours here that clears AA against a light *and* a dark ground.

### 3.7 The green-means-success problem

`forest-800` `#30503E` (brand) and `success-800` `#16602A` (status) are 10° apart in hue. In a green-branded product this is a real hazard: a green button does not mean "it worked."

**Rules:**

1. Status messages **always** pair colour with an icon and a word. Never colour alone. (This is a WCAG 1.4.1 requirement anyway; here it is also a legibility requirement.)
2. Success states use `success-*`, which is markedly more chromatic (C 0.111 vs 0.049 at step 800) — it reads as a *brighter* green. Never substitute `forest-*` for it.
3. Never place a success message directly against a forest surface. Put it on a `stone-50` or white ground first.
4. Consider dropping green from status entirely and using `aqua-800` for confirmation, keeping all green for brand. This is the safer choice if the product has heavy status UI — it does not, being a landing site, so the ramp stays available.

---

## 4. Typography

### 4.1 Families

| Role | Family | Weights | Stack |
|---|---|---|---|
| Display | **Fraunces** | 400, 600, 700 (opsz variable) | `"Fraunces", "Iowan Old Style", Georgia, serif` |
| Body / UI | **Inter** | 400, 500, 600 | `"Inter", system-ui, -apple-system, "Segoe UI", sans-serif` |
| Mono / meta | **JetBrains Mono** | 400, 500 | `"JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace` |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Fraunces is a variable optical-size face.** Set `font-variation-settings: "opsz" <px-size>` to match the rendered size — at display sizes this thins the strokes and opens the counters, which is the whole reason to use it. Also set `"SOFT" 30` on display sizes for the rounded terminals that suit this palette; leave `SOFT` at 0 for anything under 32px.

Fraunces is never used below 20px. Inter handles all UI, all body copy under `body-lg`, and every button label.

### 4.2 Scale

| Token | Size | Family / Weight | Line height | Tracking | Use |
|---|---|---|---|---|---|
| `display-xl` | `clamp(3rem, 7.5vw, 5rem)` | Fraunces 700, opsz 96, SOFT 30 | 1.04 | `-0.025em` | Hero |
| `display-lg` | `clamp(2.5rem, 5vw, 3.75rem)` | Fraunces 600, opsz 60, SOFT 30 | 1.08 | `-0.02em` | Section opener |
| `h1` | `clamp(2.25rem, 4vw, 3rem)` | Fraunces 600, opsz 48 | 1.14 | `-0.018em` | Page title |
| `h2` | `clamp(1.75rem, 3vw, 2.25rem)` | Fraunces 600, opsz 36 | 1.2 | `-0.014em` | Section heading |
| `h3` | `clamp(1.25rem, 2vw, 1.5rem)` | Fraunces 600, opsz 24 | 1.3 | `-0.008em` | Card title |
| `h4` | `1.0625rem` | Inter 600 | 1.4 | `-0.005em` | Small heading |
| `body-lg` | `1.1875rem` | Inter 400 | 1.7 | `0` | Intro paragraph |
| `body` | `1rem` | Inter 400 | 1.72 | `0` | Default |
| `body-sm` | `0.9375rem` | Inter 400 | 1.6 | `0` | Card copy |
| `label` | `0.875rem` | Inter 500 | 1.4 | `0.004em` | Buttons, form labels |
| `caption` | `0.8125rem` | Inter 400 | 1.45 | `0.01em` | Meta |
| `overline` | `0.75rem` | JetBrains Mono 500 | 1.3 | `0.16em` | Eyebrows — **uppercase** |

### 4.3 Rules

- **Measure:** `body` caps at `68ch`, `body-lg` at `56ch`, display headings at `16ch`.
- **One display size per section.** Never a `display-lg` and an `h2` in the same block.
- **Eyebrows** are mono, uppercase, tracked `0.16em`, coloured `stone-700` (light) / `stone-400` (dark), sitting `12px` above their heading.
- **Emphasis inside a heading** is a colour swap to `forest-700`, or a `chartreuse-300` highlight sweep behind the word — never italic Fraunces at display sizes (its italic is decorative and gets shouty above 40px).
- Line height on Fraunces runs tighter than on Inter at the same size; the table already accounts for this. Do not normalise them.
- `font-variant-numeric: tabular-nums` on all stats, prices, and tables.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.
- Never letter-space Fraunces positively. Never letter-space Inter body copy at all.

---

## 5. Space, layout, radii, elevation

### 5.1 Spacing — 4px base

`0 · 1(4) · 2(8) · 3(12) · 4(16) · 5(20) · 6(24) · 8(32) · 10(40) · 12(48) · 16(64) · 20(80) · 24(96) · 32(128) · 40(160)`

These values only.

### 5.2 Layout

| Token | Value |
|---|---|
| Page container | `1200px` |
| Prose container | `680px` |
| Wide container | `1400px` |
| Gutter | `24px` → `40px` (md) → `64px` (lg) |
| Section padding, block | `96px` → `128px` (lg) |
| Section padding, tight | `64px` → `80px` |
| Grid | 12 col, `24px` gutter → `32px` (lg) |
| Card grid gap | `32px` |

**Breakpoints:** `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`

**Rhythm inside a section:** eyebrow → `12px` → heading → `20px` → intro → `48px` → content → `64px` → section CTA.

### 5.3 Radii

| Token | Value | Applied to |
|---|---|---|
| `radius-xs` | `6px` | Code chips, checkboxes |
| `radius-sm` | `10px` | Inputs, tags, small buttons |
| `radius-md` | `14px` | Buttons, badges, tooltips |
| `radius-lg` | `20px` | Cards, dropdowns, thumbnails |
| `radius-xl` | `28px` | Feature panels, modals |
| `radius-2xl` | `40px` | Hero panels, full-bleed section cards |
| `radius-full` | `9999px` | Pills, dots, icon buttons, avatars |

**Nesting:** inner radius = outer radius − the padding between them, floored at `radius-xs`.

### 5.4 Elevation

Shadows are forest-tinted. Never neutral black in light mode — a grey shadow under a sage card looks dirty.

| Token | Light | Dark |
|---|---|---|
| `shadow-xs` | `0 1px 2px rgba(23,42,31,.05)` | `0 1px 2px rgba(0,0,0,.4)` |
| `shadow-sm` | `0 2px 4px rgba(23,42,31,.05), 0 4px 12px rgba(23,42,31,.05)` | `0 2px 6px rgba(0,0,0,.4)` |
| `shadow-md` | `0 4px 8px rgba(23,42,31,.06), 0 12px 28px rgba(23,42,31,.07)` | `0 6px 20px rgba(0,0,0,.45)` |
| `shadow-lg` | `0 8px 16px rgba(23,42,31,.07), 0 24px 48px rgba(23,42,31,.08)` | `0 12px 36px rgba(0,0,0,.5)` |
| `shadow-xl` | `0 16px 32px rgba(23,42,31,.08), 0 40px 80px rgba(23,42,31,.09)` | `0 24px 64px rgba(0,0,0,.55)` |

**Dark mode gets hierarchy from ground steps, not shadow.** A raised surface is `forest-900` on a `forest-950` page, plus a `1px rgba(237,240,228,.10)` top edge. Keep the shadow tokens for genuinely floating things — sticky nav, dropdown, modal.

**There is no glow token.** On this palette a coloured glow reads as a rendering artefact. Hover lift comes from `translateY` and a shadow step.

---

## 6. Motion

Moderate by default: entrances, hovers, one hero sequence. §6.4 has the upgrade path if you want more.

### 6.1 Tokens

| Token | Value |
|---|---|
| `duration-instant` | `120ms` |
| `duration-fast` | `200ms` |
| `duration-base` | `320ms` |
| `duration-slow` | `560ms` |
| `duration-slower` | `840ms` |
| `ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| `ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` |
| `ease-organic` | `cubic-bezier(0.34, 0.9, 0.32, 1)` |
| `ease-in` | `cubic-bezier(0.7, 0, 0.84, 0)` |

`ease-organic` is the house curve — a slightly softer settle than `ease-out`, matching the palette. Use it for anything that grows, unfolds, or expands.

### 6.2 Patterns

- **Scroll reveal:** `opacity 0→1`, `translateY 20px→0`, `duration-slow`, `ease-out`, triggered at 15% intersection, **fires once**.
- **Stagger:** `60ms` between siblings, capped at 8 — beyond that the stagger resets.
- **Card hover:** `translateY(-3px)` + `shadow-sm → shadow-md`, `duration-base`, `ease-organic`.
- **Button hover:** background colour only, `duration-fast`. No scale — the radii here are large enough that scaling reads as wobble.
- **Highlight sweep:** the `chartreuse-300` block behind an emphasised word grows `scaleX 0→1` from the left over `duration-slow` on reveal, `transform-origin: left`.
- **Nav underline:** the gold active-indicator slides between items over `duration-base`, `ease-in-out`.
- **Image reveal:** `clip-path: inset(0 0 100% 0)` → `inset(0)` over `duration-slower`, `ease-organic`. Softer than a fade on photographic content.

### 6.3 Reduced motion — mandatory

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

And in JS: check `matchMedia('(prefers-reduced-motion: reduce)')` before initialising any scroll observer, set revealed elements to their final state immediately, and re-check on `change`. CSS alone does not stop scroll-driven transforms.

### 6.4 If you want richer motion

Add, in this order of payoff: (1) a hero background wash that drifts at `0.15×` scroll rate; (2) `0.12×` internal parallax on framed imagery inside `overflow: hidden`; (3) one pinned section for a 3-state product walkthrough, never exceeding `300vh`. Foreground text never parallaxes. Nothing exceeds `0.3×`.

---

## 7. Components

shadcn/ui primitives with these variants layered on. Keep the `cva` API; replace the class strings.

### 7.1 Button

| Variant | Light | Dark |
|---|---|---|
| `primary` | bg `forest-800`, text `stone-50`, `shadow-xs` | bg `forest-300`, text `forest-950` |
| `primary:hover` | bg `forest-900` | bg `forest-200` |
| `accent` | bg `gold-300`, text `forest-950` | bg `gold-300`, text `forest-950` |
| `accent:hover` | bg `gold-200` | bg `gold-200` |
| `secondary` | bg white, text `forest-950`, border `1px stone-300`, `shadow-xs` | bg `rgba(237,240,228,.07)`, text `stone-100`, border `1px rgba(237,240,228,.16)` |
| `secondary:hover` | bg `stone-50`, border `stone-400` | bg `rgba(237,240,228,.13)` |
| `ghost` | text `forest-900` | text `stone-100` |
| `ghost:hover` | bg `forest-50` | bg `rgba(171,212,199,.10)` |
| `link` | text `aqua-800`, underline offset `4px`, `1.5px` decoration | text `aqua-300` |
| `destructive` | bg `error-700`, text white | bg `error-300`, text `error-950` |

**Sizes:** `sm` 36px / `10px 16px` · `md` 44px / `12px 24px` · `lg` 52px / `16px 32px`.
**Radius** `radius-md`. Icon-only → `radius-full`, `40×40px`, `aria-label` required.
**Icon gap** `8px`, icons `1em`, stroke `1.75px`.
**Disabled:** step to `forest-400` / `stone-300` fills rather than reducing opacity — see principle 4.
**Loading:** spinner replaces the leading icon, label stays, width locked.

**The accent button is for one thing per page**, typically the hero CTA. Everything else is `primary`. Two gold buttons on one screen cancel each other out.

### 7.2 Focus ring

```css
:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 3px;
  border-radius: inherit;
}
```

Light: `forest-800` (8.36:1 on the page ground). Dark: `gold-300` (9.23:1). On a `forest-800` or `forest-900` surface the ring switches to `gold-300` (5.47:1 / 6.51:1) so it stays visible against the button itself. `:focus-visible` only, never `:focus`, never suppressed without replacement.

### 7.3 Card

Light: bg white, `radius-lg`, padding `32px`, `shadow-sm`, no border.
Dark: bg `forest-900`, `1px solid rgba(237,240,228,.10)`, no shadow.
Hover (interactive only): `translateY(-3px)` + one shadow step, `duration-base`, `ease-organic`.

**Feature card** — media on top at `radius-md`, `aspect-ratio: 3/2`, `overflow: hidden`, image `scale(1) → scale(1.03)` on card hover over `duration-slow`. Body padding `24px`. Title `h3`, copy `body-sm` `stone-800` clamped to 3 lines, tag row beneath, arrow icon that translates `4px` on hover. Whole card is one link — no nested buttons.

### 7.4 Tag / chip

`radius-full`, `4px 12px`, `caption`, Inter 500.
Default: bg `aqua-200`, text `forest-950`. Dark: bg `rgba(171,212,199,.14)`, text `aqua-300`.
Neutral: bg `stone-200`, text `forest-950`. Dark: bg `rgba(237,240,228,.08)`, text `stone-300`.
Accent (max one per card): bg `gold-300`, text `forest-950`.

### 7.5 Badge

`radius-full`, `caption`, Inter 600, `4px 10px`.
`new` — bg `gold-300`, text `forest-950`, both modes.
`status` — bg `forest-100` / `rgba(171,212,199,.12)`, text `forest-900` / `forest-200`, with a leading `8px` dot.

### 7.6 Navigation

Sticky, `72px` → `60px` after `80px` of scroll over `duration-base`.
Transparent at scroll 0; then `rgba(246,248,238,.75)` + `backdrop-filter: blur(16px) saturate(140%)` + `shadow-sm` + bottom hairline. Dark: `rgba(23,42,31,.75)`.
Links `label`, `stone-800` → `forest-950` on hover. Active link carries a `2px gold-300` underline that slides between items.
One `accent` or `primary` button at the right.
**Mobile:** full-screen `stone-50` / `forest-950` overlay, links stagger `60ms`, scroll locked, `Esc` closes, focus trapped, `44×44px` close target.

### 7.7 Forms

Input / textarea: `48px` (textarea min `140px`), `radius-sm`, `12px 16px`, bg white / `rgba(237,240,228,.05)`, border `1px stone-600` — **this is the 3:1 boundary minimum; `stone-500` fails at 2.83:1 and `stone-300` is a hairline, not a border.**
Focus: border `forest-800` + the focus ring.
Error: border `error-700`, message below in `caption` `error-700`, `role="alert"`, `aria-describedby` wired.
Success: `success-800` text **with a check icon** (see §3.7).
Label: `label` token, `forest-950`, `8px` above. Always visible — placeholders are not labels.
Placeholder: `stone-700`. Never `stone-500`.

### 7.8 Other

- **Avatar:** `radius-full`, `2px` white / `rgba(237,240,228,.14)` ring. 32 / 40 / 56 / 96.
- **Divider:** `1px` `stone-200` / `rgba(237,240,228,.10)`. Prefer whitespace.
- **Tooltip:** bg `forest-900`, text `stone-100`, `radius-sm`, `caption`, `8px 12px`, `shadow-md`, 300ms delay.
- **Blockquote:** `4px` left rule in `gold-300`, `24px` padding, `body-lg`, attribution `caption` `stone-700`.
- **Code block:** bg `forest-950` in both modes, text `stone-100`, `radius-md`, `24px`, JetBrains Mono `0.875rem`, `overflow-x: auto`.
- **Stat:** figure `display-lg` Fraunces 700 `forest-800` (light) / `gold-300` (dark), tabular numerals, count-up on reveal. Label `overline` `stone-700`.
- **Highlight mark:** `<mark>` with bg `chartreuse-300`, text `forest-950`, `2px 6px`, `radius-xs`, `box-decoration-break: clone`.

---

## 8. Page patterns

### 8.1 Hero
Full viewport minus nav, min `640px`.
Eyebrow → `display-xl` with one word carrying a `chartreuse-300` sweep → `body-lg` (max `56ch`) → `accent` + `ghost` button pair → trust row (logos or a one-line proof point).
Ground: `stone-50` with two soft washes — `forest-300` at 18% and `gold-200` at 10%, both `blur(140px)`. Dark: `forest-950` with `forest-700` at 26% and `gold-400` at 12%.
Entrance staged `120ms` apart, `duration-slower`, `ease-organic`.

### 8.2 Feature / benefit grid
Eyebrow → `display-lg` → `body-lg` → 3-up card grid (`32px` gap, stacks at `md`).
Each card: icon in an `aqua-200` `radius-md` `48px` tile → `h3` → `body-sm`.
Every third section alternates onto the `forest-50` band; **one** section per page uses the `stone-200` paint-chip band, with §3.3's shortened colour list.

### 8.3 How it works
Three or four numbered steps on a horizontal rule (`stone-300`), nodes as `gold-300` dots with a `4px` page-ground ring. Numbers in Fraunces, step titles `h3`, copy `body-sm`. Stacks to vertical below `md` with the rule running left.

### 8.4 Showcase / proof
Full-bleed `forest-800` inverted band, `radius-2xl` if inset. `stone-50` text, `gold-200` for any figure or emphasis (6.70:1 on that ground). One large image or a 2×2 stat grid. This is the page's strongest contrast moment — use it once.

### 8.5 Testimonials
Max three, static grid, no carousel. Cards on `forest-50` (light) / `forest-900` (dark). Quote `body-lg`, avatar + name + role beneath in `caption`.

### 8.6 Pricing (if needed)
Three tiers, middle one raised: white card, `shadow-lg`, `2px forest-800` border, and a `gold-300` "Most popular" badge overlapping the top edge. Figures `display-lg`, tabular numerals. Feature lists use check icons in `forest-700`, not bare green ticks.

### 8.7 FAQ
Prose container, accordion items separated by `stone-200` hairlines, `24px` vertical padding, chevron rotating `180°` over `duration-base`. Native `<details>` unless you need animated height.

### 8.8 Final CTA
`stone-200` paint-chip band or `forest-800` inverted band. `display-lg` → one line → single `accent` button. Nothing else in this section.

### 8.9 Footer
`64px` block padding, ground `stone-100` / `forest-950`, top hairline. Four columns: wordmark + line, product links, company links, contact/social. Bottom row `caption` `stone-700` / `stone-400`.

---

## 9. Accessibility checklist — WCAG 2.2 AA

- [ ] Every text/background pairing appears in §3. This palette is too low-contrast to eyeball.
- [ ] The `stone-200` band uses §3.3's shortened list, not the general one.
- [ ] Controls and their boundaries clear 3:1 against adjacent colour.
- [ ] `:focus-visible` on everything focusable; ring swaps to `gold-300` on forest surfaces.
- [ ] Focus order matches visual order; no positive `tabindex`.
- [ ] Targets ≥24×24px (2.2 §2.5.8); everything interactive here is ≥40px.
- [ ] Status is never colour alone — icon plus word, always (§3.7).
- [ ] Success messaging is never placed on a forest ground.
- [ ] Every image has `alt`; background washes are `aria-hidden="true"`.
- [ ] Icon-only buttons carry `aria-label`.
- [ ] Form errors announced (`role="alert"`) and linked (`aria-describedby`).
- [ ] Headings descend without skipping; one `h1` per page.
- [ ] Mobile menu traps focus, closes on `Esc`, restores focus to trigger.
- [ ] `prefers-reduced-motion` handled in JS, not only CSS.
- [ ] Usable at 200% zoom and 320px width with no horizontal scroll.
- [ ] `prefers-color-scheme` respected on first visit, explicit choice persisted after.
- [ ] Nothing flashes more than three times per second.

---

## 10. Tailwind v4 implementation

### 10.1 Ramps

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-forest-50: oklch(0.975 0.0063 160.17); /* #F3F8F5 */
  --color-forest-100: oklch(0.950 0.0114 160.17); /* #E8F1EC */
  --color-forest-200: oklch(0.879 0.0227 160.17); /* #CBDCD2 */
  --color-forest-300: oklch(0.830 0.0349 161.32); /* #B4CFC0 */
  --color-forest-400: oklch(0.740 0.0535 162.48); /* #8DB6A1 */
  --color-forest-500: oklch(0.665 0.0634 161.50); /* #70A087 */
  --color-forest-600: oklch(0.585 0.0634 160.52); /* #59886F */
  --color-forest-700: oklch(0.505 0.059 159.54); /* #466F59 */
  --color-forest-800: oklch(0.401 0.0488 158.56); /* #30503E */
  --color-forest-900: oklch(0.360 0.0444 158.56); /* #284434 */
  --color-forest-950: oklch(0.265 0.033 158.56); /* #172A1F */

  --color-aqua-50: oklch(0.975 0.0085 173.85); /* #F1F9F6 */
  --color-aqua-100: oklch(0.950 0.0153 173.85); /* #E5F2EE */
  --color-aqua-200: oklch(0.895 0.0289 173.85); /* #CAE3DB */
  --color-aqua-300: oklch(0.837 0.0468 173.85); /* #ABD4C7 */
  --color-aqua-400: oklch(0.750 0.0681 173.85); /* #80BCAA */
  --color-aqua-500: oklch(0.665 0.0851 173.85); /* #56A590 */
  --color-aqua-600: oklch(0.585 0.0851 173.85); /* #3C8C78 */
  --color-aqua-700: oklch(0.505 0.0791 173.85); /* #297361 */
  --color-aqua-800: oklch(0.430 0.0698 173.85); /* #1B5C4D */
  --color-aqua-900: oklch(0.360 0.05958 173.85); /* #12473B */
  --color-aqua-950: oklch(0.265 0.0443 173.85); /* #072C23 */

  --color-chartreuse-50: oklch(0.975 0.043 111.22); /* #F7FAD9 */
  --color-chartreuse-100: oklch(0.950 0.0737 111.22); /* #F0F4BB */
  --color-chartreuse-200: oklch(0.895 0.1081 111.22); /* #DFE48E */
  --color-chartreuse-300: oklch(0.876 0.1229 111.22); /* #D9DE7B */
  --color-chartreuse-400: oklch(0.750 0.1204 111.22); /* #B1B555 */
  --color-chartreuse-500: oklch(0.665 0.11304 111.22); /* #969A40 */
  --color-chartreuse-600: oklch(0.585 0.1044 111.22); /* #7E8130 */
  --color-chartreuse-700: oklch(0.505 0.0958 111.22); /* #67691F */
  --color-chartreuse-800: oklch(0.430 0.086 111.22); /* #525410 */
  --color-chartreuse-900: oklch(0.360 0.0739 111.22); /* #3F4008 */
  --color-chartreuse-950: oklch(0.265 0.0547 111.22); /* #262703 */

  --color-gold-50: oklch(0.975 0.061 103.84); /* #FDFACA */
  --color-gold-100: oklch(0.950 0.1046 103.84); /* #FAF39F */
  --color-gold-200: oklch(0.898 0.1624 103.84); /* #F0E24F */
  --color-gold-300: oklch(0.836 0.1663 102.16); /* #DFCC28 */
  --color-gold-400: oklch(0.750 0.1462 102.16); /* #C1B028 */
  --color-gold-500: oklch(0.665 0.1296 102.16); /* #A49621 */
  --color-gold-600: oklch(0.585 0.1141 102.16); /* #897E1A */
  --color-gold-700: oklch(0.505 0.0985 102.16); /* #706613 */
  --color-gold-800: oklch(0.430 0.0839 102.16); /* #59510D */
  --color-gold-900: oklch(0.360 0.07038 102.16); /* #453E08 */
  --color-gold-950: oklch(0.265 0.052 102.16); /* #2A2603 */

  --color-stone-50: oklch(0.975 0.0135 116.58); /* #F6F8EE */
  --color-stone-100: oklch(0.950 0.0165 116.58); /* #EDF0E4 */
  --color-stone-200: oklch(0.889 0.0259 116.58); /* #D9DDCA */
  --color-stone-300: oklch(0.830 0.03 116.58); /* #C6CAB4 */
  --color-stone-400: oklch(0.750 0.03 116.58); /* #ACB19B */
  --color-stone-500: oklch(0.665 0.0285 116.58); /* #929683 */
  --color-stone-600: oklch(0.585 0.027 116.58); /* #7A7E6C */
  --color-stone-700: oklch(0.505 0.0255 116.58); /* #636756 */
  --color-stone-800: oklch(0.430 0.0234 116.58); /* #4F5243 */
  --color-stone-900: oklch(0.360 0.021 116.58); /* #3C3F32 */
  --color-stone-950: oklch(0.265 0.0174 116.58); /* #25261D */

  --color-success-50: oklch(0.975 0.0135 148.00); /* #F1F9F2 */
  --color-success-100: oklch(0.950 0.0243 148.00); /* #E4F3E6 */
  --color-success-200: oklch(0.895 0.0459 148.00); /* #C9E5CC */
  --color-success-300: oklch(0.830 0.0743 148.00); /* #A7D5AC */
  --color-success-400: oklch(0.750 0.108 148.00); /* #7DC187 */
  --color-success-500: oklch(0.665 0.135 148.00); /* #52AA62 */
  --color-success-600: oklch(0.585 0.135 148.00); /* #37914B */
  --color-success-700: oklch(0.505 0.1256 148.00); /* #237738 */
  --color-success-800: oklch(0.430 0.1107 148.00); /* #16602A */
  --color-success-900: oklch(0.360 0.0945 148.00); /* #0D4A1E */
  --color-success-950: oklch(0.265 0.0702 148.00); /* #052E10 */

  --color-warning-50: oklch(0.975 0.0168 70.00); /* #FEF5EB */
  --color-warning-100: oklch(0.950 0.034 70.00); /* #FEEBD7 */
  --color-warning-200: oklch(0.895 0.0741 70.00); /* #FDD5A7 */
  --color-warning-300: oklch(0.830 0.1255 70.00); /* #FBB867 */
  --color-warning-400: oklch(0.750 0.1274 70.00); /* #E19F4A */
  --color-warning-500: oklch(0.665 0.1196 70.00); /* #C28536 */
  --color-warning-600: oklch(0.585 0.1105 70.00); /* #A56F25 */
  --color-warning-700: oklch(0.505 0.1014 70.00); /* #895913 */
  --color-warning-800: oklch(0.430 0.0868 70.00); /* #6E460D */
  --color-warning-900: oklch(0.360 0.0728 70.00); /* #553507 */
  --color-warning-950: oklch(0.265 0.0538 70.00); /* #362003 */

  --color-error-50: oklch(0.975 0.0114 30.00); /* #FEF4F2 */
  --color-error-100: oklch(0.950 0.0233 30.00); /* #FEE9E5 */
  --color-error-200: oklch(0.895 0.0493 30.00); /* #FCD1C9 */
  --color-error-300: oklch(0.830 0.0798 30.00); /* #F7B4A9 */
  --color-error-400: oklch(0.750 0.116 30.00); /* #EE9182 */
  --color-error-500: oklch(0.665 0.145 30.00); /* #DE6D5C */
  --color-error-600: oklch(0.585 0.145 30.00); /* #C35445 */
  --color-error-700: oklch(0.505 0.1348 30.00); /* #A44033 */
  --color-error-800: oklch(0.430 0.1189 30.00); /* #853025 */
  --color-error-900: oklch(0.360 0.1015 30.00); /* #68231A */
  --color-error-950: oklch(0.265 0.0754 30.00); /* #43130D */

  --color-info-50: oklch(0.975 0.0105 248.00); /* #F1F8FE */
  --color-info-100: oklch(0.950 0.0189 248.00); /* #E5F0FB */
  --color-info-200: oklch(0.895 0.0357 248.00); /* #CBDFF3 */
  --color-info-300: oklch(0.830 0.0578 248.00); /* #AACBEC */
  --color-info-400: oklch(0.750 0.084 248.00); /* #83B3E1 */
  --color-info-500: oklch(0.665 0.105 248.00); /* #5D99D1 */
  --color-info-600: oklch(0.585 0.105 248.00); /* #4480B7 */
  --color-info-700: oklch(0.505 0.0977 248.00); /* #32689A */
  --color-info-800: oklch(0.430 0.0861 248.00); /* #24537D */
  --color-info-900: oklch(0.360 0.0735 248.00); /* #194062 */
  --color-info-950: oklch(0.265 0.0546 248.00); /* #0C273E */
}
```

### 10.2 Semantic layer

```css
:root {
  --surface-base:    var(--color-stone-50);
  --surface-raised:  #ffffff;
  --surface-band:    var(--color-forest-50);
  --surface-chip:    var(--color-stone-200);
  --surface-invert:  var(--color-forest-800);

  --text-primary:    var(--color-forest-950);
  --text-secondary:  var(--color-stone-800);
  --text-muted:      var(--color-stone-700);
  --text-link:       var(--color-aqua-800);
  --text-on-invert:  var(--color-stone-50);

  --cta-fill:        var(--color-forest-800);
  --cta-fill-hover:  var(--color-forest-900);
  --cta-label:       var(--color-stone-50);
  --accent-fill:     var(--color-gold-300);
  --accent-label:    var(--color-forest-950);
  --highlight:       var(--color-chartreuse-300);

  --line-hairline:   var(--color-stone-200);
  --line-control:    var(--color-stone-600);
  --focus-ring:      var(--color-forest-800);

  --radius-xs: 6px;  --radius-sm: 10px; --radius-md: 14px;
  --radius-lg: 20px; --radius-xl: 28px; --radius-2xl: 40px;

  --shadow-xs: 0 1px 2px rgb(23 42 31 / .05);
  --shadow-sm: 0 2px 4px rgb(23 42 31 / .05), 0 4px 12px rgb(23 42 31 / .05);
  --shadow-md: 0 4px 8px rgb(23 42 31 / .06), 0 12px 28px rgb(23 42 31 / .07);
  --shadow-lg: 0 8px 16px rgb(23 42 31 / .07), 0 24px 48px rgb(23 42 31 / .08);
  --shadow-xl: 0 16px 32px rgb(23 42 31 / .08), 0 40px 80px rgb(23 42 31 / .09);

  --duration-instant: 120ms; --duration-fast: 200ms; --duration-base: 320ms;
  --duration-slow: 560ms;    --duration-slower: 840ms;
  --ease-out:     cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);
  --ease-organic: cubic-bezier(0.34, 0.9, 0.32, 1);
  --ease-in:      cubic-bezier(0.7, 0, 0.84, 0);
}

.dark {
  --surface-base:    var(--color-forest-950);
  --surface-raised:  var(--color-forest-900);
  --surface-band:    var(--color-forest-900);
  --surface-chip:    var(--color-forest-900);
  --surface-invert:  var(--color-stone-100);

  --text-primary:    var(--color-stone-100);
  --text-secondary:  var(--color-stone-300);
  --text-muted:      var(--color-stone-400);
  --text-link:       var(--color-aqua-300);
  --text-on-invert:  var(--color-forest-950);

  --cta-fill:        var(--color-forest-300);
  --cta-fill-hover:  var(--color-forest-200);
  --cta-label:       var(--color-forest-950);
  --accent-fill:     var(--color-gold-300);
  --accent-label:    var(--color-forest-950);
  --highlight:       var(--color-chartreuse-400);

  --line-hairline:   rgb(237 240 228 / .10);
  --line-control:    rgb(237 240 228 / .30);
  --focus-ring:      var(--color-gold-300);

  --shadow-xs: 0 1px 2px rgb(0 0 0 / .40);
  --shadow-sm: 0 2px 6px rgb(0 0 0 / .40);
  --shadow-md: 0 6px 20px rgb(0 0 0 / .45);
  --shadow-lg: 0 12px 36px rgb(0 0 0 / .50);
  --shadow-xl: 0 24px 64px rgb(0 0 0 / .55);
}

@theme inline {
  --color-surface:        var(--surface-base);
  --color-surface-raised: var(--surface-raised);
  --color-surface-band:   var(--surface-band);
  --color-surface-chip:   var(--surface-chip);
  --color-surface-invert: var(--surface-invert);

  --color-ink:        var(--text-primary);
  --color-ink-soft:   var(--text-secondary);
  --color-ink-muted:  var(--text-muted);
  --color-ink-link:   var(--text-link);
  --color-ink-invert: var(--text-on-invert);

  --color-cta:        var(--cta-fill);
  --color-cta-hover:  var(--cta-fill-hover);
  --color-cta-label:  var(--cta-label);
  --color-accent:     var(--accent-fill);
  --color-accent-ink: var(--accent-label);
  --color-highlight:  var(--highlight);

  --color-hairline:   var(--line-hairline);
  --color-control:    var(--line-control);
  --color-ring:       var(--focus-ring);

  --font-display: "Fraunces", "Iowan Old Style", Georgia, serif;
  --font-sans:    "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-mono:    "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;

  --container-prose: 680px;
  --container-page:  1200px;
  --container-wide:  1400px;
}

@layer base {
  html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
  body {
    background-color: var(--color-surface);
    color: var(--color-ink);
    font-family: var(--font-sans);
    line-height: 1.72;
  }
  h1, h2, h3 {
    font-family: var(--font-display);
    font-variation-settings: "SOFT" 30;
    text-wrap: balance;
  }
  h4, h5, h6 { font-family: var(--font-sans); font-variation-settings: normal; }
  p { text-wrap: pretty; }
  mark {
    background: var(--color-highlight);
    color: var(--color-forest-950);
    padding: 2px 6px;
    border-radius: var(--radius-xs);
    box-decoration-break: clone;
  }
  :focus-visible {
    outline: 2px solid var(--color-ring);
    outline-offset: 3px;
  }
  ::selection {
    background: var(--color-gold-300);
    color: var(--color-forest-950);
  }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```

### 10.3 Class vocabulary

| Intent | Class |
|---|---|
| Page | `bg-surface text-ink` |
| Card | `bg-surface-raised rounded-[20px] p-8 shadow-sm dark:border dark:border-hairline dark:shadow-none` |
| Band | `bg-surface-band` |
| Paint-chip band | `bg-surface-chip text-forest-950` |
| Inverted band | `bg-surface-invert text-ink-invert` |
| Body copy | `text-ink-soft` |
| Meta | `text-ink-muted text-[0.8125rem]` |
| Link | `text-ink-link underline underline-offset-4 decoration-[1.5px]` |
| Primary button | `bg-cta text-cta-label hover:bg-cta-hover rounded-[14px] px-6 h-11` |
| Accent button | `bg-accent text-accent-ink hover:bg-gold-200 rounded-[14px] px-6 h-11` |
| Eyebrow | `font-mono text-xs uppercase tracking-[0.16em] text-ink-muted` |
| Section | `py-24 lg:py-32` |
| Container | `mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16` |

### 10.4 Mode toggle

Both modes are first-class: the site follows `prefers-color-scheme` until the user chooses, then honours their choice. Resolve before first paint:

```html
<meta name="color-scheme" content="light dark">
<script>
  (function () {
    var s = localStorage.getItem('theme');
    var d = s ? s === 'dark'
              : matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.classList.toggle('dark', d);
  })();
</script>
```

The toggle offers three states — Light / Dark / System — and System is the initial value. Do not ship a two-state toggle that silently pins a preference on first click.

---

## 11. Anti-patterns

| Don't | Do |
|---|---|
| Gold text on a light ground | Gold fill with `forest-950` on it, or `gold-700` if it must be text |
| A gold focus ring in light mode | `forest-800` in light, `gold-300` in dark |
| Two gold elements in one viewport | One accent moment per section |
| `stone-700` muted text on the `stone-200` band | Step to `stone-800` on that ground (§3.3) |
| A green success message on a green surface | Success on `stone-50` or white, always with an icon |
| Cool grey next to `stone` | Warm greige only — `stone` has green in it |
| Opacity for disabled states | Step down the ramp instead |
| Gold→chartreuse gradients | They're 9° apart; use forest→forest or a low-opacity wash |
| Grey drop shadows under sage cards | Forest-tinted shadows |
| Fraunces italic at display size | Colour swap or a `chartreuse-300` sweep for emphasis |
| A carousel for three testimonials | A static three-up grid |
| Eyeballing a colour pairing | Look it up in §3 |

---

*Ramps generated in OKLCH from ten photographed paint-card anchors, gamut-mapped to sRGB, with chroma capped at 93% of the in-gamut maximum per step. Every contrast ratio in §3 is a computed value.*
