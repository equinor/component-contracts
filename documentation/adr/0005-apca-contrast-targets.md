# Contrast targets are APCA: Lc 90 read, Lc 60 scanned and icons

- **Status:** Accepted
- **Date:** 2026-08-28
- **Decision makers:** Victor Nystad

## Context

The colour system needs a contrast model to generate and verify palettes
against. WCAG 2.x contrast ratio is the compliance default, but it is
symmetric (it cannot tell light-on-dark from dark-on-light, which is
exactly the swap dark mode performs) and correlates poorly with
perceived contrast at the ends of the lightness range. APCA models
polarity and perceptual lightness, and maps thresholds to use, not to a
single pass number.

## Decision Drivers

- Dark mode is a first-class scheme, so polarity must be modelled
- Thresholds should map to how text is used: read versus scanned
- Icons are graphical objects with their own floor, not text
- Verdicts must be computable in the build and in the CLI, live

## Options Considered

### Option 1: WCAG 2.x ratios (4.5:1 / 3:1)

**Pros:**

- The regulatory lingua franca; every audit tool speaks it

**Cons:**

- Symmetric: the same pair scores identically in both polarities although
  it does not read identically
- One threshold for very different reading tasks

### Option 2: APCA with use-mapped targets

Lc 90 for read text (body, default leading), Lc 60 for scanned text
(labels, compressed leading) and for icon ink (graphical objects,
WCAG 1.4.11's spirit at ≈ Lc 60).

**Pros:**

- Polarity-aware: light and dark schemes are measured as they are seen
- The read/scanned distinction the typography system already makes
  (two line-height curves) gets the matching contrast distinction
- Live computation via `apca-w3`; the CLI shows the number and the
  threshold with provenance

**Cons:**

- Not (yet) the regulatory standard; a compliance audit may still ask
  for WCAG ratios

## Decision

Option 2. The palette generator owns the targets and builds ladders that
clear them; the CLI's `eds contrast` recomputes Lc live from the token
sources and names the threshold it holds the pairing to. Transparent
resting fills (the ghost ladder) are measured against the canvas, and
the output states that assumption on its own line. For icon-only
variants the measured ink is the contract's `structure.iconOnly` part at
the graphical-object floor.

### Consequences

- Good, because dark-mode verdicts are real measurements, not mirrored
  assumptions (the sign of Lc flips with polarity)
- Good, because "energetic in branding, danger in an interface" class
  decisions can be argued with numbers
- Bad, because compliance conversations may require translating APCA
  results back into WCAG terms until APCA lands in a standard

### Confirmation

`eds contrast <target> [--scheme dark]` computes the verdict live with
the token chain as provenance; the CLI's checks pin the thresholds and
the icon-only target resolution.

## Related

- Barlow is the reference font of APCA's size-and-weight lookup tables;
  the Lc formula itself is font-agnostic
- [ADR-0001](0001-marker-colour-is-an-app-token.md) — a measured Lc as a
  decision input
