---
version: alpha
name: EDS
description: >-
  Equinor Design System, December architecture — contract-driven. GENERATED
  from eds-contracts (the fourth renderer, beside CSS and Figma); edit the
  contracts, not this file. The format has no theming, so colors ship as
  paired tokens (name + name-dark); dimensions are the comfortable-density
  digest — the normative values are the DTCG tokens (see Overview).
colors:
  primary: "oklch(0.5 0.075 204.6)"
  primary-dark: "oklch(0.82 0.071 204.6)"
  on-primary: "oklch(1 0.011 204.6)"
  on-primary-dark: "oklch(0.1 0.001 204.6)"
  canvas: "oklch(0.97 0 0)"
  canvas-dark: "oklch(0.15 0.02 252.5)"
  surface: "oklch(0.999 0 0)"
  surface-dark: "oklch(0.25 0.036 252.5)"
  floating: "oklch(0.999 0 0)"
  floating-dark: "oklch(0.47 0.04 252.5)"
  inverse: "oklch(0.23 0 0)"
  inverse-dark: "oklch(0.99 0.013 243)"
  on-inverse: "oklch(1 0 0)"
  on-inverse-dark: "oklch(0.1 0 243)"
  text: "oklch(0.23 0 0)"
  text-dark: "oklch(0.99 0.013 243)"
  text-subtle: "oklch(0.46 0 0)"
  text-subtle-dark: "oklch(0.91 0.021 243)"
  danger: "oklch(0.5 0.204 21.1)"
  danger-dark: "oklch(0.82 0.193 21.1)"
  focus: "oklch(0.75 0.102 240.7)"
  focus-dark: "oklch(0.61 0.123 240.7)"
  disabled: "oklch(0.91 0 0)"
  disabled-dark: "oklch(0.47 0.04 252.5)"
typography:
  body:
    fontFamily: "Inter"
    fontSize: "0.875rem"
    lineHeight: 1.429
  label:
    fontFamily: "Inter"
    fontSize: "0.75rem"
    lineHeight: 1.334
rounded:
  none: "0px"
  md: "4px"
  pill: "1000px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
  chip-muted:
    rounded: "{rounded.pill}"
  tooltip:
    backgroundColor: "{colors.inverse}"
    textColor: "{colors.on-inverse}"
    rounded: "{rounded.md}"
---

# EDS — design context for agents

## Overview

EDS is calm, dense-capable and engineered: a working-tool aesthetic for energy-
industry applications, not a marketing site. Neutral surfaces carry the work;
the moss-green accent is spent, not sprinkled.

**Non-negotiables (read these even if you read nothing else):**

1. **Never author a control height.** Heights emerge: `inset × 2 + cap(label)`.
2. **Bind tokens, never raw hex or px** — the only literal allowed is the semantic `0px`.
3. **States change only what they declare**; everything else falls back to resting.
4. **Variants are `data-*` attributes** named after the axis (ADR-0006); omit the attribute for the default value. ARIA attributes carry state
   state and the ancestor mode scopes `data-density` / `data-color-scheme`.
5. **Accent is budgeted**: primary CTA, checked/selected state, focus ring — nothing
   else. When in doubt: neutral, subtle, flat.

This file is deliberately THIN — rules and pointers, loaded details on demand:

- tokens (normative): `packages/eds-tokens/tokens/` (DTCG; density + color-scheme modes)
- CSS: `packages/eds-tokens/build/css/` + `packages/eds-contracts/build/*.css`
- contracts (component truth): `packages/eds-contracts/contracts/*.contract.json`
- Figma: 412 variables in 4 collections + generated component sets
- measured preview: `packages/eds-contracts/preview/index.html`

## Modes

Two runtime axes the flat token digest above cannot express (colors ship as
`name` + `name-dark` pairs; dimensions are the comfortable-density values):

- **density** `compact | comfortable | relaxed` — an application-level USER choice;
  never mix densities in one view. Set `data-density` on an ancestor.
- **color-scheme** `light | dark` — the palette flips, aliases are scheme-independent.
  Dark is NOT inverted light: canvas sits below surface in both schemes, and
  elevation becomes lightness (see Elevation & Depth).

## Colors

Usage rules sit NEXT to the families, and the “bound by” column is computed from
which contracts actually reference each family — this whitelist cannot go stale.
A family bound by nothing is not yet licensed for use.

| family | intent | bound by |
| --- | --- | --- |
| `bg-*-fill-emphasis-*` | the filled call-to-action tier | eds.button, eds.chip |
| `bg-*-fill-muted-*` | the quiet opaque fill tier | eds.chip |
| `bg-*-fill-ghost-*` | the ghost ladder — transparent-resting surfaces (hover = step 3, active = step 4) | eds.button, eds.menu-item, eds.side-bar-item, eds.side-bar-sub-item, eds.tab, eds.table |
| `bg-*-surface / bg-*-canvas` | tone surfaces; canvas sits below surface in BOTH schemes | eds.banner |
| `icon-*` | icon ink — the SUBTLE step (icons are graphical objects: APCA Lc60, not Lc90) | eds.banner, eds.button, eds.checkbox, eds.chip, eds.input, eds.menu-item, eds.radio, eds.side-bar-item, eds.switch |
| `text-*-strong / *-on-emphasis` | text ink; on-emphasis variants invert on filled tiers | eds.banner, eds.button, eds.chip, eds.input, eds.label, eds.menu-item, eds.side-bar-item, eds.side-bar-sub-item, eds.tab, eds.table, eds.top-bar |
| `bg-inverse + text-on-inverse` | the inverse surface — a negative panel on either scheme | eds.tooltip |
| `bg-floating` | the ELEVATED surface: white in light; one step ABOVE surface in dark | eds.menu |
| `border-focus` | the focus ring — it REPLACES the border, mirroring :focus-visible | eds.button, eds.card, eds.checkbox, eds.input, eds.menu-item, eds.radio, eds.side-bar-item, eds.side-bar-sub-item, eds.switch, eds.tab |
| `*-disabled` | disabled ink and fill; states only state what changes | eds.button, eds.checkbox, eds.chip, eds.input, eds.menu-item, eds.radio, eds.switch, eds.tab |

## Typography

One UI family (Inter). Sizes come from a modular scale per density; controls use
the COMPRESSED line-height variant so the optical-padding recipe holds. Icons are
glyphs: their layout footprint is the label’s cap box and the ink overflows it
like ascenders and descenders — never resize an icon to “fit”.

## Layout

Numbers, not adjectives. Control heights per density (compact/comfortable/relaxed),
all derived — if you are typing a pixel height you are in the wrong layer:

| contract | heights (px) |
| --- | --- |
| eds.banner | 24 / 36 / 44 |
| eds.button | 24 / 36 / 44 |
| eds.chip | 20 / 24 / 36 |
| eds.input | 24 / 36 / 44 |
| eds.menu-item | 24 / 36 / 44 |
| eds.side-bar-item | 40 / 52 / 60 |
| eds.side-bar-sub-item | 32 / 44 / 52 |
| eds.tab | 36 / 44 / 52 |
| eds.table | 24 / 36 / 44 |
| eds.tooltip | 20 / 24 / 36 |

- Spacing is a golden-ratio ladder; inter-element space belongs to the PARENT
  (gap), never to component margins.
- The selectable ladder is a target-size floor (WCAG 2.5.8: 24px min), not a menu.

## Elevation & Depth

The flashlight principle: in light mode elevation is shadow size (`elevation-low`
for tooltips/menus/popovers, `elevation-high` for dialogs); in dark mode elevation
is surface LIGHTNESS — raised surfaces get lighter (`bg-floating` sits one ladder
step above `surface`) and shadows nearly vanish. Never fake depth with borders.

## Shapes

Default is `border-radius-rounded` (4px). Pill is EARNED, not decorative: chips,
and the round ghost-icon button, where the circle falls out of the geometry
(padding = inset when there is no text). Never round a card corner past `rounded`.

## Components

**Reuse these — do not recreate.** Each exists as generated, dependency-free CSS
(class-based, `@layer eds-components`) and as a generated Figma component set;
both render the same contract:

| contract | version | axes | states |
| --- | --- | --- | --- |
| eds.banner | 0.4.0 | tone(4) | — |
| eds.button | 0.8.0 | tone(3) × variant(4) × size(2) | hover, focus, active, disabled, disabled |
| eds.card | 0.2.0 | — | hover, focus |
| eds.checkbox | 0.2.0 | checked(3) | focus, disabled |
| eds.chip | 0.5.0 | tone(6) × emphasis(2) | hover, active, selected, disabled |
| eds.divider | 0.1.0 | weight(2) | — |
| eds.input | 0.7.0 | — | hover, focus, invalid, disabled |
| eds.label | 0.2.1 | — | — |
| eds.menu-item | 0.3.1 | — | hover, active, selected, focus, disabled |
| eds.menu | 0.3.0 | — | — |
| eds.radio | 0.1.0 | checked(2) | focus, disabled |
| eds.side-bar-item | 0.2.0 | collapsed(2) | hover, active, selected, focus |
| eds.side-bar-sub-item | 0.2.0 | — | hover, active, selected, focus |
| eds.side-bar | 0.4.0 | collapsed(2) | — |
| eds.switch | 0.1.0 | checked(2) | focus, disabled |
| eds.tab | 0.2.0 | — | hover, focus, selected, disabled |
| eds.table | 0.3.0 | size(2) | hover, selected |
| eds.tooltip | 0.3.0 | placement(12) | — |
| eds.top-bar | 0.6.0 | — | — |

Compositions own LAYOUT only — every box belongs to a contract:

- **eds.text-field** — Label + Input + Label

States come from the platform, not classes: `:checked`, `[aria-selected]`,
`:user-invalid`, `:focus-visible`, `:disabled`. Disabled replaces ink and fill
with the `*-disabled` concepts and nothing else.

## Do's and Don'ts

```css
/* DON'T — authored height, baked color, class-driven state */
.my-button { height: 36px; background: #007079; }
.my-button.is-hovered { background: #004f55; }

/* DO — emergent height, bound channel, platform state flips the variable */
.eds-button {
  min-height: calc(var(--_inset-v) * 2 + var(--eds-cap-rounded));
  background-color: var(--_bg);
}
.eds-button:not(:disabled):hover { --_bg: var(--eds-color-bg-accent-fill-emphasis-hover); }
```

```html
<!-- DON'T — rebuild a field from raw elements -->
<div class="field"><span>Label</span><input style="border:1px solid gray"></div>

<!-- DO — the shipped parts and the shipped composition -->
<div class="eds-text-field">
  <label class="eds-label" for="x">Label</label>
  <div class="eds-input"><input class="eds-value" id="x"></div>
</div>
```

Known drift: generated output comes back saturated, rounded and shadowed.
When in doubt: neutral, subtle, flat.

Facts a canvas refuses (from the disposition ledgers — recorded, not dropped):

- **read text is trimmed to the cap box (text-box)** — CSS: text-box: trim-both ex alphabetic + padding-top round(1cap,4px)−1ex on the message (codepen VYmaowY) — the occupied box is exactly the ROUNDED cap and the BASELINE lands on the 4px grid; root padding = the raw inset (@supports-gated; the fallback keeps the half-leading subtraction — one switch flips all of it).
- **state focus** — CSS: :focus-visible — the ring is the PLATFORM's, not a designable state.
- **state disabled for variant=secondary** — The gated tokens change nothing for variant=secondary — the contract refuses to invent a binding it does not have..
- **state disabled for variant=ghost** — The gated tokens change nothing for variant=ghost — the contract refuses to invent a binding it does not have..
- **state disabled for variant=ghost-icon** — The gated tokens change nothing for variant=ghost-icon — the contract refuses to invent a binding it does not have..

