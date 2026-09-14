# Optical padding

Generated from `src/recipe.ts` — do not edit.

A control has to land on the 4px grid while keeping an honest line-height. Both at once means
subtracting the half-leading from the vertical padding.

```
capRounded    = round(1cap, 4px)
min-height    = inset * 2 + capRounded
padding-block = inset - (lineHeight - capRounded) / 2
```

*Half-leading* is the difference between the line box and the glyph extent, which CSS distributes
half above and half below. Here it is measured to cap height rather than to the font's content box.

## Why this is a `calc()` and not a number

The line-height cancels out of the height:

```
height = 2 × padding + lineHeight
       = 2 × (inset − (lineHeight − cap) / 2) + lineHeight
       = 2 × inset − lineHeight + cap + lineHeight
       = 2 × inset + cap                              ← lineHeight is gone
```

So **the control measures the same whatever the line-height is**. The expression absorbs it. Verified
in the browser across line-heights from 4px to 36px on an md button — the box stays 36px in every case.

That holds while the padding stays non-negative, i.e. while `lineHeight ≤ 2 × inset + cap` — the
control's own height. Past that CSS clamps the padding to zero and the box grows to fit the text,
which is the right failure mode: text is never clipped.

**This is the difference between the computation layer and a rendering of it.** A `calc()` does not
need to know the line-height. A baked number does, and is silently wrong if the line-height ever
changes. That is why CSS is upstream of Figma and React Native here, rather than a matter of taste.

## The rule that matters

**The padding is deliberately off the 4px ladder. Do not round it back.** A 14px label with a 16px
line-height in a 12px inset gives **10px** padding and a **36px** control. Rounding 10 to 12 breaks
the optical result *and* pushes the control off the grid to 40px — the opposite of the intent.

The padding values are not arbitrary. Line-height and cap height are both snapped to 4px, so their
difference is a multiple of 4 and the half-leading a multiple of 2. **The optical values always land
on a 2px ladder** — a finer grid, not no grid.

## When it applies

**Scanned text only** — buttons, chips, inputs, tabs, labels, table headers. Text meant to be
scanned rather than read, which always uses the UI family and the `compressed` line-height.
(`squished` is the spacing *proportion* — a different axis; see `src/formulas.ts`.)

**Read text uses `text-box: trim-both` instead** — paragraphs, list items, prose. Different
problem, different mechanism. A wrapped button label is still scanned text and still uses this
recipe; the distinction is scanned-versus-read, not single-line-versus-multi-line.

## In CSS

Use the ready-made tokens. They are expressions, so they resolve per element and follow density
automatically.

```css
.eds-button {
  padding-block: var(--eds-optical-padding-md-squished);
  min-height: var(--eds-optical-height-md-squished);
  padding-inline: var(--eds-spacing-inset-md-horizontal);
}
```

Sizes `xs`–`xl`, proportions `squished` | `squared` | `stretched`.

## In Figma and React Native

Neither can compute `1cap`, so both need the resolved numbers below. Note these are Inter values —
scanned text is always the UI family, so the recipe never involves the header face.

If you are working in Figma *without* the typography component, these padding values are what you
type in, and they match what the CSS renders. The typography component's grid-clean numbers are the
ones that only exist inside Figma.

All 45 combinations — 3 densities × 5 sizes × 3 proportions. Every row is
browser-verified by the harness (parity check 5).

### comfortable — squished

| size | font | line-height | cap→4px | inset | padding | height |
|------|------|-------------|---------|-------|---------|--------|
| xs   | 10.5 | 12          | 8       | 6     | 4       | 20     |
| sm   | 12   | 12          | 8       | 8     | 6       | 24     |
| md   | 14   | 16          | 12      | 12    | 10      | 36     |
| lg   | 16   | 20          | 12      | 16    | 12      | 44     |
| xl   | 18.5 | 20          | 12      | 20    | 16      | 52     |

### comfortable — squared

| size | font | line-height | cap→4px | inset | padding | height |
|------|------|-------------|---------|-------|---------|--------|
| xs   | 10.5 | 12          | 8       | 8     | 6       | 24     |
| sm   | 12   | 12          | 8       | 12    | 10      | 32     |
| md   | 14   | 16          | 12      | 16    | 14      | 44     |
| lg   | 16   | 20          | 12      | 20    | 16      | 52     |
| xl   | 18.5 | 20          | 12      | 24    | 20      | 60     |

### comfortable — stretched

| size | font | line-height | cap→4px | inset | padding | height |
|------|------|-------------|---------|-------|---------|--------|
| xs   | 10.5 | 12          | 8       | 12    | 10      | 32     |
| sm   | 12   | 12          | 8       | 16    | 14      | 40     |
| md   | 14   | 16          | 12      | 20    | 18      | 52     |
| lg   | 16   | 20          | 12      | 24    | 20      | 60     |
| xl   | 18.5 | 20          | 12      | 28    | 24      | 68     |

### compact — squished

| size | font | line-height | cap→4px | inset | padding | height |
|------|------|-------------|---------|-------|---------|--------|
| xs   | 9    | 12          | 8       | 4     | 2       | 16     |
| sm   | 10.5 | 12          | 8       | 6     | 4       | 20     |
| md   | 12   | 12          | 8       | 8     | 6       | 24     |
| lg   | 14   | 16          | 12      | 12    | 10      | 36     |
| xl   | 16   | 16          | 12      | 16    | 14      | 44     |

### compact — squared

| size | font | line-height | cap→4px | inset | padding | height |
|------|------|-------------|---------|-------|---------|--------|
| xs   | 9    | 12          | 8       | 6     | 4       | 20     |
| sm   | 10.5 | 12          | 8       | 8     | 6       | 24     |
| md   | 12   | 12          | 8       | 12    | 10      | 32     |
| lg   | 14   | 16          | 12      | 16    | 14      | 44     |
| xl   | 16   | 16          | 12      | 20    | 18      | 52     |

### compact — stretched

| size | font | line-height | cap→4px | inset | padding | height |
|------|------|-------------|---------|-------|---------|--------|
| xs   | 9    | 12          | 8       | 8     | 6       | 24     |
| sm   | 10.5 | 12          | 8       | 12    | 10      | 32     |
| md   | 12   | 12          | 8       | 16    | 14      | 40     |
| lg   | 14   | 16          | 12      | 20    | 18      | 52     |
| xl   | 16   | 16          | 12      | 24    | 22      | 60     |

### relaxed — squished

| size | font | line-height | cap→4px | inset | padding | height |
|------|------|-------------|---------|-------|---------|--------|
| xs   | 12   | 12          | 8       | 8     | 6       | 24     |
| sm   | 14   | 16          | 12      | 12    | 10      | 36     |
| md   | 16   | 20          | 12      | 16    | 12      | 44     |
| lg   | 18.5 | 20          | 12      | 20    | 16      | 52     |
| xl   | 21.5 | 24          | 16      | 24    | 20      | 64     |

### relaxed — squared

| size | font | line-height | cap→4px | inset | padding | height |
|------|------|-------------|---------|-------|---------|--------|
| xs   | 12   | 12          | 8       | 12    | 10      | 32     |
| sm   | 14   | 16          | 12      | 16    | 14      | 44     |
| md   | 16   | 20          | 12      | 20    | 16      | 52     |
| lg   | 18.5 | 20          | 12      | 24    | 20      | 60     |
| xl   | 21.5 | 24          | 16      | 28    | 24      | 72     |

### relaxed — stretched

| size | font | line-height | cap→4px | inset | padding | height |
|------|------|-------------|---------|-------|---------|--------|
| xs   | 12   | 12          | 8       | 16    | 14      | 40     |
| sm   | 14   | 16          | 12      | 20    | 18      | 52     |
| md   | 16   | 20          | 12      | 24    | 20      | 60     |
| lg   | 18.5 | 20          | 12      | 28    | 24      | 68     |
| xl   | 21.5 | 24          | 16      | 32    | 28      | 80     |
