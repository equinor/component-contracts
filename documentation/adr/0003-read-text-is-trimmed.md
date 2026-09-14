# Read text is trimmed to its visual box

- **Status:** Accepted
- **Date:** 2026-09-05
- **Decision makers:** Victor Nystad

## Context

Controls centre their labels ([ADR-0002](0002-control-heights-are-emergent.md)),
but read text (labels-as-text, banner messages, prose) sits on a baseline
grid. The bounding box of text is taller than the text: the half-leading
above the cap and below the baseline makes stacked text land off-grid and
makes the first line of a box sit visibly low. CSS can now remove that
lie (`text-box: trim-both`), and Figma can too (`leadingTrim`), but the
two platforms round differently, so a naive port drifts by a pixel.

## Decision Drivers

- Text boxes should measure what the eye sees: cap to baseline
- Stacked text must land on the 4px grid in both surfaces
- Figma pixel-rounds trimmed text heights (`round(fontSize × capRatio)`),
  so the correction is per size, not one number
- Code and canvas must agree to the pixel, provably

## Options Considered

### Option 1: Accept the bounding box; compensate in margins

**Pros:**

- No new platform features required

**Cons:**

- Every consumer compensates separately; the 1–2px error is tolerated,
  not computed away

### Option 2: A typography component that owns the alignment

**Pros:**

- The arithmetic holds without hand-snapping

**Cons:**

- Adoption cost: designers must use a component to get what should be a
  property (a prior attempt at exactly this was rejected for the
  machinery, not the maths)

### Option 3: Platform trim plus a minted per-size correction

CSS: `text-box: trim-both ex alphabetic` with
`padding-top: round(1cap, 4px) − 1ex`. Figma: `leadingTrim: CAP_HEIGHT`
plus a minted `figma-only/baseline-pad-*` variable,
`round(cap, 4px) − round(cap, 1px)`, exactly the pixel-rounding error,
computed rather than tolerated.

**Pros:**

- The trim is a property, invisible to consumers
- The Figma rounding error is corrected per size, deterministically
- Both surfaces produce the same n-line height by construction:
  `capRounded + (n − 1) × lineHeight`

**Cons:**

- Mints the system's first `figma-only/*` variables: values code must
  never read, which needs an explicit rule

## Decision

Option 3. The `figma-only/*` folder exists for corrections a design tool
needs and code must never consume; the union fingerprint admits it, and
the ledger entry for the fact records the constraint. Where an engine
cannot trim, the fallback height equals the trimmed height by
construction, because the half-leading is defined against the same
cap-rounded value.

### Consequences

- Good, because baseline-grid alignment is a property of the emitted
  component, not a discipline asked of consumers
- Good, because a REFUSED ledger entry (Figma could not trim the banner)
  was later renegotiated to CARRIED when the mechanism landed: the ledger
  is a living record
- Bad, because `figma-only/*` is a new vocabulary that emitters and
  audits must respect (code reading one of these values is a defect)

### Confirmation

The parity harness recomputes the pad values (`0 / −1 / +2` across
densities at sm) from the cap formulas and asserts the union fingerprint
over all live Figma variables, `figma-only/*` included.

## Related

- [ADR-0002](0002-control-heights-are-emergent.md)
- Ethan Wang, "The 4px baseline grid" (uxdesign.cc) — the same insight as
  manual craft; this decision computes away the 1–2px error that approach
  tolerates
