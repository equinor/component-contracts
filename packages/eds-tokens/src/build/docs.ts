/** Doc and skill, generated from the recipe. One source, so they cannot drift. */
import { RECIPE } from '../recipe.ts'
import { resolveAll, type Resolved } from './recipe-emit.ts'

const table = (rows: Resolved[], cols: (keyof Resolved)[], head: string[]) => {
  const w = head.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => String(r[cols[i]]).length)),
  )
  const line = (cells: string[]) =>
    '| ' + cells.map((c, i) => c.padEnd(w[i])).join(' | ') + ' |'
  return [
    line(head),
    '|' + w.map((n) => '-'.repeat(n + 2)).join('|') + '|',
    ...rows.map((r) => line(cols.map((c) => String(r[c])))),
  ].join('\n')
}

const COLS = [
  'size',
  'fontSize',
  'lineHeight',
  'capRounded',
  'inset',
  'padding',
  'height',
] as const
const HEAD = [
  'size',
  'font',
  'line-height',
  'cap→4px',
  'inset',
  'padding',
  'height',
]

const DENSITY_ORDER = ['comfortable', 'compact', 'relaxed'] as const
const PROPORTION_ORDER = ['squished', 'squared', 'stretched'] as const

export function opticalPaddingDoc(): string {
  const all = resolveAll()
  const section = (d: string, p: string) => {
    const rows = all.filter((r) => r.density === d && r.proportion === p)
    return `### ${d} — ${p}\n\n${table(rows, COLS as any, HEAD)}`
  }
  const sections = DENSITY_ORDER.flatMap((d) =>
    PROPORTION_ORDER.map((p) => section(d, p)),
  )

  return `# Optical padding

Generated from \`src/recipe.ts\` — do not edit.

A control has to land on the 4px grid while keeping an honest line-height. Both at once means
subtracting the half-leading from the vertical padding.

\`\`\`
capRounded    = ${RECIPE.capRounded.expression}
min-height    = ${RECIPE.minHeight.expression}
padding-block = ${RECIPE.paddingBlock.expression}
\`\`\`

*Half-leading* is the difference between the line box and the glyph extent, which CSS distributes
half above and half below. Here it is measured to cap height rather than to the font's content box.

## Why this is a \`calc()\` and not a number

The line-height cancels out of the height:

\`\`\`
height = 2 × padding + lineHeight
       = 2 × (inset − (lineHeight − cap) / 2) + lineHeight
       = 2 × inset − lineHeight + cap + lineHeight
       = 2 × inset + cap                              ← lineHeight is gone
\`\`\`

So **the control measures the same whatever the line-height is**. The expression absorbs it. Verified
in the browser across line-heights from 4px to 36px on an md button — the box stays 36px in every case.

That holds while the padding stays non-negative, i.e. while \`lineHeight ≤ 2 × inset + cap\` — the
control's own height. Past that CSS clamps the padding to zero and the box grows to fit the text,
which is the right failure mode: text is never clipped.

**This is the difference between the computation layer and a rendering of it.** A \`calc()\` does not
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
scanned rather than read, which always uses the UI family and the \`compressed\` line-height.
(\`squished\` is the spacing *proportion* — a different axis; see \`src/formulas.ts\`.)

**Read text uses \`text-box: trim-both\` instead** — paragraphs, list items, prose. Different
problem, different mechanism. A wrapped button label is still scanned text and still uses this
recipe; the distinction is scanned-versus-read, not single-line-versus-multi-line.

## In CSS

Use the ready-made tokens. They are expressions, so they resolve per element and follow density
automatically.

\`\`\`css
.eds-button {
  padding-block: var(--eds-optical-padding-md-squished);
  min-height: var(--eds-optical-height-md-squished);
  padding-inline: var(--eds-spacing-inset-md-horizontal);
}
\`\`\`

Sizes \`xs\`–\`xl\`, proportions \`squished\` | \`squared\` | \`stretched\`.

## In Figma and React Native

Neither can compute \`1cap\`, so both need the resolved numbers below. Note these are Inter values —
scanned text is always the UI family, so the recipe never involves the header face.

If you are working in Figma *without* the typography component, these padding values are what you
type in, and they match what the CSS renders. The typography component's grid-clean numbers are the
ones that only exist inside Figma.

All ${all.length} combinations — 3 densities × 5 sizes × 3 proportions. Every row is
browser-verified by the harness (parity check 5).

${sections.join('\n\n')}
`
}

export function opticalPaddingSkill(): string {
  const md = resolveAll().find(
    (r) =>
      r.density === 'comfortable' &&
      r.size === 'md' &&
      r.proportion === 'squished',
  )!
  const sm = resolveAll().find(
    (r) =>
      r.density === 'comfortable' &&
      r.size === 'sm' &&
      r.proportion === 'squished',
  )!

  return `---
name: optical-padding
description: >-
  Compute vertical padding for UI controls in the Equinor Design System so the control lands on the
  4px grid while keeping an honest line-height. Use when styling any scanned control — button, chip,
  input, tab, badge, table header — or when a padding value looks "wrong" because it is not a
  multiple of 4. Do NOT use for prose; read text uses text-box trim instead.
---

# Optical padding

Generated from \`src/recipe.ts\` — do not edit.

## The formula

\`\`\`
capRounded    = ${RECIPE.capRounded.expression}
min-height    = ${RECIPE.minHeight.expression}
padding-block = ${RECIPE.paddingBlock.expression}
\`\`\`

## Why it is an expression

The line-height cancels out of the height: \`2 × (inset − (lh − cap)/2) + lh\` reduces to
\`2 × inset + cap\`. So the control measures the same whatever the line-height is — the expression
absorbs it. A baked number cannot; it has to know the line-height in advance and is silently wrong
if it changes.

Valid while \`lineHeight ≤ 2 × inset + cap\`. Past that, padding clamps to zero and the box grows to
fit the text rather than clipping it.

## Guardrail — read this before "fixing" a value

**Padding values are deliberately off the 4px grid. Never round them to a multiple of 4.**

\`\`\`
button md:  ${md.fontSize}px label, ${md.lineHeight}px line-height, cap→${md.capRounded}, inset ${md.inset}
            → padding ${md.padding}px, height ${md.height}px
chip   sm:  ${sm.fontSize}px label, ${sm.lineHeight}px line-height, cap→${sm.capRounded}, inset ${sm.inset}
            → padding ${sm.padding}px, height ${sm.height}px
\`\`\`

\`${md.padding}px\` looks wrong and is correct. Rounding it to 12 breaks the optical result and
pushes the control to 40px, off the grid it was supposed to land on.

The values always land on a **2px ladder** — line-height and cap are both 4px-snapped, so the
half-leading is always a multiple of 2. Finer grid, not no grid.

## What to do

**In CSS**, use the tokens. Do not re-implement the calc inline:

\`\`\`css
padding-block: var(--eds-optical-padding-<size>-<proportion>);
min-height:    var(--eds-optical-height-<size>-<proportion>);
padding-inline: var(--eds-spacing-inset-<size>-horizontal);
\`\`\`

Sizes \`xs\`–\`xl\`. Proportions: \`squished\` (button — vertical one step tighter),
\`squared\` (tab — vertical equals horizontal), \`stretched\` (one step looser).

If the **label size differs from the inset size**, compose from the parts rather than using the
combined token:

\`\`\`css
padding-block: calc(var(--eds-spacing-inset-md-vertical-squished)
                    - var(--eds-half-leading-sm));
\`\`\`

\`--eds-optical-padding-<size>-<proportion>\` assumes the **label size matches the inset size**,
which is the normal case. If they differ, compose it from the parts — padding depends on two
independent inputs, the inset and the label's line-height:

\`\`\`css
padding-block: calc(var(--eds-spacing-inset-md-vertical-squished)
                    - var(--eds-half-leading-sm));   /* md inset, sm label */
\`\`\`

Height needs no such care: it is \`inset × 2 + cap\` and does not involve line-height at all.
Line-height does not change how tall the control is — it changes the padding needed to reach that
height. Which is exactly why the padding looks wrong.

**In Figma or React Native**, neither can compute \`1cap\`. Use the resolved table in
\`docs/optical-padding.md\`. Inter only — scanned text never uses the header face.

## When NOT to use this

Read text — paragraphs, list items, prose — uses \`text-box: trim-both ex alphabetic\` with
\`--eds-padding-top-baseline\`. Different problem, different mechanism.

The test is scanned versus read, not single-line versus multi-line. A wrapped button label is still
scanned and still uses this recipe.
`
}
