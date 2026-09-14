---
name: optical-padding
description: >-
  Compute vertical padding for UI controls in the Equinor Design System so the control lands on the
  4px grid while keeping an honest line-height. Use when styling any scanned control — button, chip,
  input, tab, badge, table header — or when a padding value looks "wrong" because it is not a
  multiple of 4. Do NOT use for prose; read text uses text-box trim instead.
---

# Optical padding

Generated from `src/recipe.ts` — do not edit.

## The formula

```
capRounded    = round(1cap, 4px)
min-height    = inset * 2 + capRounded
padding-block = inset - (lineHeight - capRounded) / 2
```

## Why it is an expression

The line-height cancels out of the height: `2 × (inset − (lh − cap)/2) + lh` reduces to
`2 × inset + cap`. So the control measures the same whatever the line-height is — the expression
absorbs it. A baked number cannot; it has to know the line-height in advance and is silently wrong
if it changes.

Valid while `lineHeight ≤ 2 × inset + cap`. Past that, padding clamps to zero and the box grows to
fit the text rather than clipping it.

## Guardrail — read this before "fixing" a value

**Padding values are deliberately off the 4px grid. Never round them to a multiple of 4.**

```
button md:  14px label, 16px line-height, cap→12, inset 12
            → padding 10px, height 36px
chip   sm:  12px label, 12px line-height, cap→8, inset 8
            → padding 6px, height 24px
```

`10px` looks wrong and is correct. Rounding it to 12 breaks the optical result and
pushes the control to 40px, off the grid it was supposed to land on.

The values always land on a **2px ladder** — line-height and cap are both 4px-snapped, so the
half-leading is always a multiple of 2. Finer grid, not no grid.

## What to do

**In CSS**, use the tokens. Do not re-implement the calc inline:

```css
padding-block: var(--eds-optical-padding-<size>-<proportion>);
min-height:    var(--eds-optical-height-<size>-<proportion>);
padding-inline: var(--eds-spacing-inset-<size>-horizontal);
```

Sizes `xs`–`xl`. Proportions: `squished` (button — vertical one step tighter),
`squared` (tab — vertical equals horizontal), `stretched` (one step looser).

If the **label size differs from the inset size**, compose from the parts rather than using the
combined token:

```css
padding-block: calc(var(--eds-spacing-inset-md-vertical-squished)
                    - var(--eds-half-leading-sm));
```

`--eds-optical-padding-<size>-<proportion>` assumes the **label size matches the inset size**,
which is the normal case. If they differ, compose it from the parts — padding depends on two
independent inputs, the inset and the label's line-height:

```css
padding-block: calc(var(--eds-spacing-inset-md-vertical-squished)
                    - var(--eds-half-leading-sm));   /* md inset, sm label */
```

Height needs no such care: it is `inset × 2 + cap` and does not involve line-height at all.
Line-height does not change how tall the control is — it changes the padding needed to reach that
height. Which is exactly why the padding looks wrong.

**In Figma or React Native**, neither can compute `1cap`. Use the resolved table in
`docs/optical-padding.md`. Inter only — scanned text never uses the header face.

## When NOT to use this

Read text — paragraphs, list items, prose — uses `text-box: trim-both ex alphabetic` with
`--eds-padding-top-baseline`. Different problem, different mechanism.

The test is scanned versus read, not single-line versus multi-line. A wrapped button label is still
scanned and still uses this recipe.
