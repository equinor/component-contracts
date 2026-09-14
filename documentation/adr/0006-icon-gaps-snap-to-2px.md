# Icon gaps snap to 2px

- **Status:** Accepted
- **Date:** 2026-08-28
- **Decision makers:** Victor Nystad

## Context

The gap between an icon and its label is derived, not authored:
`round(fontSize × 0.618, snap)` — the golden-ratio proportion of the
step's font size. The original snap was 0.5px, faithful to the scale's
grid. Designers reported icons rendering blurry: a half-pixel gap
offsets the glyph from the pixel grid on 1x displays.

## Decision Drivers

- Rendered sharpness beats derivational purity
- Ladder values should compose with the 4px spacing system
- The derivation (the principle) must survive the change; only the
  rounding moves

## Options Considered

### Option 1: Keep the 0.5px snap

**Pros:**

- Most faithful to the golden-ratio derivation

**Cons:**

- Blurry icons on 1x displays; the fidelity is invisible, the blur is not

### Option 2: Snap to 2px

**Pros:**

- Whole, composable values; comfortable md lands on 8px (incidentally
  the same flat gap the upstream EDS Button uses — convergence, not
  imitation)
- One constant changes (`GAP_SNAP_PX`); the derivation is untouched

**Cons:**

- 32 cells across the size × density matrix move away from the exact
  golden-ratio value

## Decision

Option 2. Every cell where the two snaps disagree is pinned in
`packages/eds-tokens/test/deviations.ts`, so the cost of the decision is
enumerated rather than implied, and reverting is one constant plus a
review of the pinned list.

### Consequences

- Good, because icons are sharp and gap values read as system values
- Good, because the deviation set is explicit: the tests fail if the
  formula and the pinned expectations drift apart
- Bad, because the derivation's output is no longer literally golden
  ratio at 32 cells; the principle holds, the rounding is pragmatic

### Confirmation

`packages/eds-tokens/test/deviations.ts` pins all 32 disagreeing cells;
the parity checks recompute both snaps and assert the shipped one.

## Related

- [ADR-0002](0002-control-heights-are-emergent.md) — the same
  derive-then-snap philosophy for geometry
