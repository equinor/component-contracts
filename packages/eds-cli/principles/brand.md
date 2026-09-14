<!-- DRAFT — pending Victor's review. This page speaks for the design
     system and is not approved until he has read it. Everything below is
     grounded in this repository (packages/eds-cli/intent.md, eds-tokens
     DECISIONS.md/PLAN.md, the token build, the contracts); the intent and
     rationale wording is a first draft, not established EDS documentation. -->

---
title: How EDS uses the Equinor brand guidelines
keywords: brand, guidelines, colors, colour, red, energy red, danger, fonts, font, typeface, Inter, Equinor, typography, headings, accessibility, contrast, APCA, WCAG
status: DRAFT — pending Victor's review
---

## Energy Red: energetic in branding, danger in an interface

Energy Red is the Equinor brand's signature colour — in branding contexts it
reads as *energetic*. An application interface reads colour differently: a
saturated red on an interactive element reads as *danger* — destructive,
stop, something is wrong. The same pigment carries opposite messages in the
two media.

EDS therefore **refuses Energy Red for primary actions.** The Button
contract's default tone is `accent`; red exists in the system only as the
`danger` tone — an explicit opt-in for destructive actions, where "danger" is
exactly the message (`packages/eds-contracts/contracts/button.contract.json`). This is
a refusal in the contract-ledger sense: the brand fact is not lost or
watered down, it is deliberately not carried into this context, and the
reason is recorded.

## Type: Inter for UI text, the Equinor typeface for headings

The token build maps the families directly (`build/css/typography.css`):
`ui` → **Inter**, `header` → **Equinor**, `code` → CommitMono.

- **Inter carries UI text** — labels, controls, tables, body. It is the
  system's reference family: every metric in the type system (cap heights,
  half-leading, the optical-padding formula) is computed from Inter's own
  font metrics (`packages/eds-tokens/src/font-metrics.json`), and its larger
  x-height (0.546 vs Equinor's 0.48) keeps small, dense text legible.
- **The Equinor typeface carries headings** — the brand's own voice, where
  display type does brand work. To make the two faces read as the same size
  at the same step, the x-height correction (×1.137288) is baked into the
  header font-size tokens rather than hidden in a CSS `size-adjust`
  descriptor, so CSS, Figma and React Native all get the same number
  (DECISIONS.md, decision 5).

One brand voice in the headline, one legibility workhorse in the interface —
aligned so they share a perceived size and the same 4px rhythm.

## Contrast: APCA, not WCAG 2.x ratios

EDS measures contrast with **APCA** (Lc), not the WCAG 2.x ratio:

- The palette is generated algorithmically in OKLCH with APCA checks built
  in — contrast is computed, not eyeballed (`packages/eds-tokens/PLAN.md`,
  `ids-talk-summary.md`).
- The WCAG 2.x formula is least reliable exactly in the alarm hues — the
  saturated reds and oranges this palette leans on — which the token work
  flags as the old algorithm's problem area (`PLAN.md`, `REVIEW.md`).
- Targets, as the token package states them: **Lc 90 for body text, Lc 60
  for spot-readable text**; icons are graphical objects (WCAG 1.4.11 ≈ APCA
  Lc 60), so icon ink maps to the subtle text step, not the body-text step
  (`PLAN.md`, `src/build/color.ts`, the semantic token descriptions).

`eds contrast <target>` computes the Lc live from the resolved tokens and
returns a verdict against these thresholds — never a stored number.
