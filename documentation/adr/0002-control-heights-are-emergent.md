# Control heights are emergent, never authored

- **Status:** Accepted
- **Date:** 2026-08-28
- **Decision makers:** Victor Nystad

## Context

Every design system needs control heights (buttons, chips, inputs, menu
items), and most author them directly: a `height: 36px` per size, per
density. Authored heights drift from their contents: change a font size
or an inset and the label no longer sits optically centred, so a second
set of hand-tuned paddings appears, and the two sets disagree over time.
This system generates components for two surfaces (CSS and Figma) from
one contract, so a height that is authored twice will eventually be
authored differently.

## Decision Drivers

- One derivation must serve both surfaces so they cannot disagree
- Text boxes lie about their edges: the visual mass of a label is its cap
  height, not its line box, so centring the line box looks wrong
- Heights must land on the 4px grid at every density
- A designer inspecting the component should find explainable numbers

## Options Considered

### Option 1: Author heights per size and density

**Pros:**

- Direct; every value visible where it is used

**Cons:**

- Two surfaces, one hand-kept promise; drifts exactly like the paddings
  it replaces
- Adding a density or size means inventing numbers instead of deriving them

### Option 2: Derive height from the inset and the label's cap height

`height = inset × 2 + cap(label)`, where the vertical padding is the
optical padding: `inset − half-leading`, so the padding absorbs the gap
between the label's line box and its cap box.

**Pros:**

- The height emerges from two facts the contract already states
- The label is optically centred by construction, at every size and density
- Both emitters compute the same number from the same formula; the parity
  harness can verify it

**Cons:**

- Padding values look "wrong" in isolation (not multiples of 4) until the
  reader knows the half-leading is inside them

## Decision

Option 2. Heights are never typed anywhere in the system: the contract
states an inset and a label typography, and `inset × 2 + cap` resolves
per size and per density (the default button lands 24/36/44, small lands
20/24/36). The half-leading is defined against the cap-rounded value so
the trimmed and untrimmed derivations agree by construction.

```css
.eds-button {
  min-height: calc(var(--_inset-v) * 2 + var(--eds-cap-rounded));
  padding-block: var(--eds-spacing-optical-padding); /* inset − half-leading */
}
```

### Consequences

- Good, because a new density or size is a formula evaluation, not a
  design meeting
- Good, because Figma gets baked padding numbers from the same derivation
  and hug reproduces the height exactly (verified by the harness)
- Bad, because the inspector shows optical paddings that need the
  half-leading story to read as intentional (see `docs/optical-padding.md`
  in the tokens package, and the generated `optical-padding` skill)

### Confirmation

The parity harness recomputes every height and padding from the token
formulas on every test run; hand-typed heights fail the freshness checks.

## Related

- [ADR-0003](0003-read-text-is-trimmed.md) — the same cap-box thinking
  for read text
- `packages/eds-tokens/docs/optical-padding.md` — the generated recipe
