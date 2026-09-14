# Provenance

Reference copies of the sources this package was ported from. Nothing here is built,
imported or tested — these exist so the derivation is auditable and so the talk can point
at the original rather than at a claim about it.

| File | Origin | Establishes |
|---|---|---|
| `typography.css` | `packages/eds-core-react/src/components/next/Foundation/typography.css` | The algorithms were authored in CSS; density is one number; the legacy token package it overrides disagrees with it |

Related, elsewhere in the package because they *are* load-bearing:

| File | Role |
|---|---|
| `../../test/fixtures/legacy-oracle.css` | Parity oracle — the legacy Style Dictionary build, pinned |
| `../../src/semantic-mapping.json` | Which source palette backs each semantic family per scheme |
| `../../src/palette-generator-export.css` | OKLCH palette from the generator |
| `../../src/font-metrics.json` | Measured font metrics — no binaries, Equinor's licence forbids redistribution |
