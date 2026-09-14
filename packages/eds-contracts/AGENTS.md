# eds-contracts — agent instructions

One JSON contract per component generates both the CSS and the Figma component
set. The contract is the source of truth; the renderers never sync side-to-side.

## The map

- `contracts/*.contract.json` — authored. The only place component facts live.
- `contract.schema.json` — the contract vocabulary.
- `src/` — resolver + emitters (`emit-css`, `emit-figma`, `emit-builder`).
- `build/` — **generated. Never edit.** Change the contract, run the build.
- `test/check.ts` — the harness. Every number is recomputed from the token
  package's formulas; silence is never a pass.
- `preview/index.html` — hand-authored code preview (density + scheme toggles).
- `SCOPE.md` — what's shipped (incl. Figma node ids) and what's next, in order.
- The token package lives in `../eds-tokens` (its own harness).

## Commands

**pnpm only** — enforced at the workspace root. This package lives in the
component-contracts workspace; install once at the repo root with plain
`pnpm install`.

```sh
pnpm --filter @equinor/eds-contracts build   # regenerate build/ + the root DESIGN docs
pnpm --filter @equinor/eds-contracts test    # the harness — must pass before any commit
pnpm preview                                 # serve the REPO ROOT (the preview links
                                             # ../eds-tokens, so serving the package
                                             # alone 404s the tokens)
```

## Rules

- **Heights are never authored.** `height = inset × 2 + cap(label)` — geometry
  emerges from the contract's inset + typography. If you are typing a pixel
  height, you are in the wrong layer.
- **Fix the emitter or the contract, never the output.** The freshness checks
  diff `build/` against a clean generation and will fail on hand edits.
- **Generated CSS must pass stylelint as born** — the emitter is the formatter.
- **Variants are `data-*` attributes, never modifier classes** (ADR-0006
  rule 3 in equinor/design-system, Accepted 2026-06-29 — adopted here
  2026-08-30, replacing an earlier BEM rule that mis-cited ADR-0016, the
  colour ADR). The attribute name derives from the contract's Figma property
  (`Tone` → `data-tone`); the default value also matches the attribute's
  absence, so `<button class="eds-button">` IS the default button; booleans
  are valueless presence attributes (`data-dismissible`), like the platform's
  own `disabled`. The ancestor mode scopes `data-density`/`data-color-scheme`
  stay reserved to the token layer — the harness rejects them at component
  level, along with any attribute that is not one of the contract's own axes.
- **Semantic descendants are targeted by element, not class** (accordion.css
  precedent): the native control inside a field wrapper is
  `& > :is(input, select, textarea)`; table rows/cells are `& th, & td`.
  Part classes remain only where the element is ambiguous (two icon slots) —
  and they are SIMPLE, UNPREFIXED names (`.icon`, `.label`, `.chevron`),
  scoped by nesting under the eds- root class (the upstream convention,
  adopted 2026-09-05 after `.eds-label` on a sidebar part collided with the
  Label COMPONENT's root class: eds- prefixed classes are components,
  unprefixed classes are parts — disjoint namespaces, collisions impossible).
  Glyph markup is ONE element (`<svg class="icon">`): the glyph IS its own
  cell; the negative cap-box margins are the centring. No wrapper — the
  wrapper exists only in Figma (mask+tint swap machinery).
- **Figma sets are generated too.** Edit the contract, rebuild, and repair or
  re-run the builder — don't hand-tune variants. Node ids are in SCOPE.md.
- When writing CSS **by hand** (preview, gallery, demos): follow the
  `css-authoring` skill (equinor/skills) — channel variables (`--_bg`-style
  pseudo-privates; states override the variable, never the property), modern
  selectors, and verify browser support instead of recalling it.

## Figma script parser gotcha (2026-09-05)

Figma's `use_figma` script parser sometimes rejects very long single-line
string literals with `SyntaxError: expecting '}'` — observed with a generated
builder's PLAN description (~700 chars, one line); the identical structure
with a short description parses. Flaky (one long-PLAN run parsed, two
failed). Workaround when running builders by hand: replace the description
with a placeholder in the PLAN and set the real text in a follow-up script,
assembled from `+`-concatenated shorter literals.
