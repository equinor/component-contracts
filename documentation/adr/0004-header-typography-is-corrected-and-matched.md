# Header typography is x-height corrected and stem matched

- **Status:** Accepted
- **Date:** 2026-09-06
- **Decision makers:** Victor Nystad

## Context

The system pairs two families: Inter for UI text and the Equinor
typeface for headings. Their metrics disagree: Equinor's x-height is
0.48 em against Inter's ~0.546, so at equal font size Equinor renders
visibly smaller, and its stems are thinner, so at equal weight it
renders lighter. The shipped EDS 1.x correction was `size-adjust:
113.73%` in `@font-face`: invisible to React Native (which never parses
CSS), never on the 0.5px grid, and a value living in one place while
transforming numbers in another — the exact drift pattern that had
already produced a stale 105.9% in production.

## Decision Drivers

- The correction must exist on every platform: CSS, Figma, React Native
- A designer and a developer must read the same number for the same
  heading
- Sizes stay on the 0.5px grid the scale is built on
- Weight parity should be measured (stem widths), not eyeballed

## Options Considered

### Option 1: Keep `size-adjust` in CSS; bake numbers only for Figma and React Native

**Pros:**

- Smallest change to shipped CSS

**Cons:**

- Figma says 16, the CSS token says 14 with an invisible ×1.1373: the
  same class of failure the decision is meant to remove

### Option 2: Bake the correction into header font-size tokens

`header-font-size = round(uiSize × xHeightRatio, 0.5px)`; font size
only, line-height is shared with the ui step. Weights: Equinor's tiers
are matched to Inter's (lighter 300, normal 400, bolder 500) by measured
stem width at the step's optical size, per density.

**Pros:**

- One number, true on every platform, on-grid
- Headers become real tokens (they did not exist before: an addition,
  not a rewrite)
- Weight parity is measured from the font outlines, with provenance

**Cons:**

- More tokens (a header size and three matched weights per step per
  density)
- The correction is baked at build time, so a font update requires a
  re-measure and rebuild

## Decision

Option 2. Header font sizes are emitted per step and density from the
measured x-height ratio; header font weights are emitted per step, tier
and density from the stem-match curve (`src/weight-match.json`, measured
by the typography-weight-matching skill's scripts, never typed). The UI
family's per-size weights stay flat on purpose: Inter self-adjusts via
`font-optical-sizing` in the browser; Figma has no auto-opsz, so binding
text weights to these variables is how the canvas gets what the browser
gets for free.

### Consequences

- Good, because "the heading is 16px" is true in Figma, CSS and React
  Native simultaneously
- Good, because the bolder tier is Inter 500 by measurement (552.7 at
  comfortable md), not 600 by convention
- Bad, because the flat correction (1.137288) is exact only at small
  optical sizes: Inter's x-height falls along its opsz axis, so large
  headings are slightly oversized — a measured, per-step correction is
  proposed as the successor (see Related)

### Confirmation

The token package's checks recompute every emitted size from the
formulas; the weight curve carries its measurement provenance (font
checksums, axis locations) in the source file.

## Related

- Proposed successor: per-opsz x-height corrections and per-step matched
  weights — tracked in issue #2 (migration) and the skills repo's
  typography-tokens demo, which already emits the corrected ramp
- [ADR-0002](0002-control-heights-are-emergent.md) — cap-height thinking
  everywhere else
