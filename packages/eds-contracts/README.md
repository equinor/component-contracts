# eds-contracts

Spec-driven EDS components. One JSON contract per component is the source of truth;
the CSS and the Figma component set are **renderers** of it and never sync side-to-side.

Model borrowed from [Southleft's ds-contracts](https://github.com/southleft/ds-contracts-poc)
(dual figma/code bindings, interpolated token refs, dispositioned facts), with one
EDS-specific invariant added:

> **Control heights are never authored.** A part that declares `inset` derives its
> vertical padding optically from its label: `padding = inset − halfLeading(label)`,
> so `height = inset × 2 + cap(label)`. CSS keeps this as a live `calc()`; Figma gets
> the resolved numbers as per-density variables (it cannot compute), created on demand —
> the variable set grows with declared components, not with combinatorics.

## Usage

```bash
npm run build   # emit build/<name>.css, .figma-plan.json, .ledger.json per contract
npm test        # recompute every number from ../eds-tokens formulas; verify
                # every CSS var against build/css and every Figma binding against
                # build/figma/variables.json. Silence is never a pass.
```

Node 24+; imports the token package's formulas directly — no duplication, no build step.

## Layout

```
contract.schema.json      the format (JSON Schema 2020-12)
contracts/*.contract.json one file per component — the source of truth
src/resolve.ts            expansion, validation, optical geometry, pairing variables
src/emit-css.ts           contract → CSS (mechanisms kept: calc, pseudo-classes, attributes)
src/emit-figma.ts         contract → Figma build plan (bindings by variable name, never hexes)
src/emit-builder.ts       plan → runnable Figma script: one generic interpreter, any component,
                          any transport (use_figma or figma_execute). Deterministic — no
                          component-specific build code, capabilities grow instead
build/                    generated artefacts, harness-checked against a fresh generation
```

## Dispositions

Every fact is `CARRIED`, `LOWERED`, `RESOLVED`, or `REFUSED` — recorded in
`build/*.ledger.json`. Examples from the chip: states are CARRIED to CSS pseudo-classes
and LOWERED to a Figma `State` variant axis; the height rule is CARRIED as a calc and
RESOLVED to baked padding; `<button>` semantics are REFUSED by the canvas — the fact
stays in the contract, nothing is silently dropped.

## The chip pilot

`contracts/chip.contract.json` carries the open sizing decision as data:
`anatomy.label.typography.label: "md"` → 20/28/36 px across densities (upstream EDS
next parity). Flip it to `"sm"` → the legacy 20/24/36. One reviewable line; both
renderers re-derive. Findings the pilot surfaced, kept in the contract's `notes`:
the icon's layout box must be the line box or it inflates the control past the invariant.
