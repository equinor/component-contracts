/** Recipe emitters — CSS tokens, resolved Figma table, docs, skill. */
import {
  RECIPE,
  RECIPE_PROPORTIONS,
  RECIPE_SIZES,
  capRoundedPx,
  opticalHeight,
  opticalPadding,
} from '../recipe.ts'
import {
  DENSITIES,
  GRID_PX,
  SIZES,
  fontSizeRem,
  lineHeightPx,
  remToPx,
  type Density,
} from '../formulas.ts'
import {
  ladderIndex,
  ladderValue,
  PROPORTION_OFFSET,
  SPACING_SIZES,
  type Proportion,
} from '../spacing.ts'
import metrics from '../font-metrics.json' with { type: 'json' }

const NS = 'com.equinor.eds'
const UI_CAP = metrics.fonts.Inter.capRatio

/** Ready-made tokens whose values are expressions. Declared once — every input
 *  already shifts with density, so these follow automatically.
 *
 *  Decomposed along the real seam. Padding depends on **two independent** things:
 *  the inset size and the *label* size (via its line-height). Baking both into one
 *  token name silently assumed they always match — true for today's components,
 *  because button.css couples them, but not guaranteed by anything.
 *
 *  So half-leading is its own token, keyed by label size. Control height needs no
 *  such token: height is `inset × 2 + cap` and does not involve line-height at all.
 *  Line-height does not change how tall the control is — it changes the padding
 *  needed to reach that height. Which is exactly why the padding looks wrong. */
export function recipeCss(): string {
  const lines: string[] = []
  lines.push(
    '  /* Cap height, snapped to the grid. Resolves per font at the point of use. */',
  )
  lines.push(`  --eds-cap-rounded: round(1cap, ${GRID_PX}px);`)

  lines.push(
    '',
    '  /* Per-size cap boxes — icon container dimensions, keyed by label size. */',
  )
  for (const size of RECIPE_SIZES) {
    lines.push(
      `  --eds-cap-rounded-${size}: ` +
        `round(calc(var(--eds-typography-ui-body-${size}-font-size) * ${UI_CAP}), ${GRID_PX}px);`,
    )
  }

  lines.push(
    '',
    '  /* Half-leading, keyed by LABEL size. Subtract from any inset. */',
  )
  for (const size of SIZES) {
    const lh = `var(--eds-typography-ui-body-${size}-line-height-compressed)`
    lines.push(
      `  --eds-half-leading-${size}: calc((${lh} - var(--eds-cap-rounded)) / 2);`,
    )
  }

  lines.push(
    '',
    '  /* Read text (default leading) — same subtraction, taller line box.',
    '   * Created on demand: only the sizes a component actually reads at. */',
  )
  // md: the banner's message; sm: the table's cells (v0.3.0 — cells are read)
  for (const size of ['sm', 'md']) {
    const lh = `var(--eds-typography-ui-body-${size}-line-height-default)`
    lines.push(
      `  --eds-half-leading-${size}-default: calc((${lh} - var(--eds-cap-rounded)) / 2);`,
    )
  }

  lines.push(
    '',
    '  /* Height — inset and cap only. Independent of line-height. */',
  )
  for (const size of RECIPE_SIZES) {
    for (const p of RECIPE_PROPORTIONS) {
      lines.push(
        `  --eds-optical-height-${size}-${p}: ` +
          `calc(var(--eds-spacing-inset-${size}-vertical-${p}) * 2 + var(--eds-cap-rounded));`,
      )
    }
  }

  lines.push(
    '',
    '  /* Padding for the common case where label size == inset size.',
  )
  lines.push('   * If they differ, compose it yourself:')
  lines.push('   *   calc(var(--eds-spacing-inset-<inset>-vertical-<prop>)')
  lines.push('   *        - var(--eds-half-leading-<label>))')
  lines.push('   * Deliberately off the 4px ladder. Do not round it back. */')
  for (const size of RECIPE_SIZES) {
    for (const p of RECIPE_PROPORTIONS) {
      lines.push(
        `  --eds-optical-padding-${size}-${p}: ` +
          `calc(var(--eds-spacing-inset-${size}-vertical-${p}) - var(--eds-half-leading-${size}));`,
      )
    }
  }
  return lines.join('\n')
}

export type Resolved = {
  density: Density
  size: string
  proportion: Proportion
  fontSize: number
  lineHeight: number
  capRounded: number
  inset: number
  padding: number
  height: number
}

/** Build-time resolution for targets that cannot compute — Figma, React Native.
 *  Inter only: the recipe applies to scanned text, which is always the UI family. */
export function resolveAll(): Resolved[] {
  const out: Resolved[] = []
  for (const density of Object.keys(DENSITIES) as Density[]) {
    for (const size of RECIPE_SIZES) {
      const fontSize = remToPx(fontSizeRem(DENSITIES[density], size as any))
      const lineHeight = lineHeightPx(fontSize, size as any, 'compressed')
      const capRounded = capRoundedPx(fontSize, UI_CAP)
      for (const proportion of RECIPE_PROPORTIONS) {
        const idx = ladderIndex(
          SPACING_SIZES.indexOf(size as any),
          density,
          PROPORTION_OFFSET[proportion],
        )
        const inset = ladderValue('spacing', idx)
        if (inset === undefined) continue
        out.push({
          density,
          size,
          proportion,
          fontSize,
          lineHeight,
          capRounded,
          inset,
          padding: opticalPadding(inset, lineHeight, capRounded),
          height: opticalHeight(inset, capRounded),
        })
      }
    }
  }
  return out
}

export function recipeTokens() {
  const entry = (
    name: string,
    expression: string,
    inputs: Record<string, unknown>,
    resolved?: Record<string, { value: number; unit: 'px' }>,
  ) => ({
    $extensions: {
      [`${NS}.derived`]: { expression, inputs },
      [`${NS}.css`]: { emit: 'expression', variable: `--eds-${name}` },
      [`${NS}.figma`]: {
        emit: 'resolved',
        ...(resolved ? { resolved } : {}),
        note: 'Figma cannot compute 1cap; use the resolved table.',
      },
    },
  })

  // Resolved per density — same numbers the docs table publishes and check 5 verifies.
  const all = resolveAll()
  const resolvedFor = (
    size: string,
    p: Proportion,
    field: 'padding' | 'height',
  ) =>
    Object.fromEntries(
      (Object.keys(DENSITIES) as Density[]).map((d) => {
        const row = all.find(
          (r) => r.density === d && r.size === size && r.proportion === p,
        )!
        return [d, { value: row[field], unit: 'px' as const }]
      }),
    )

  const out: Record<string, any> = {
    $description:
      'Optical padding for scanned controls. Tier 3 — 1cap resolves per font at the ' +
      'point of use, so these are expressions, not values. Read text uses text-box trim instead.',
    'cap-rounded': entry('cap-rounded', RECIPE.capRounded.expression, {}),
  }
  // Per-size cap boxes. An icon is a glyph: its layout footprint is the cap box of
  // the label it sits beside, and its ink overflows like ascenders and descenders.
  // Figma cannot compute 1cap, so these carry resolved per-density values (Inter).
  for (const size of RECIPE_SIZES) {
    out[`cap-rounded-${size}`] = entry(
      `cap-rounded-${size}`,
      `round(fontSize * ${UI_CAP}, ${GRID_PX}px)`,
      { fontSize: `{typography.font-size.${size}}` },
      Object.fromEntries(
        (Object.keys(DENSITIES) as Density[]).map((d) => [
          d,
          {
            value: capRoundedPx(
              remToPx(fontSizeRem(DENSITIES[d], size as any)),
              UI_CAP,
            ),
            unit: 'px' as const,
          },
        ]),
      ),
    )
  }
  for (const size of RECIPE_SIZES) {
    for (const p of RECIPE_PROPORTIONS) {
      out[`optical-padding-${size}-${p}`] = entry(
        `optical-padding-${size}-${p}`,
        RECIPE.paddingBlock.expression,
        {
          inset: `{spacing.spacing-inset-${size}-vertical-${p}}`,
          lineHeight: `{typography.line-height.compressed.${size}}`,
          capRounded: '{recipe.cap-rounded}',
        },
        resolvedFor(size, p, 'padding'),
      )
      out[`optical-height-${size}-${p}`] = entry(
        `optical-height-${size}-${p}`,
        RECIPE.minHeight.expression,
        {
          inset: `{spacing.spacing-inset-${size}-vertical-${p}}`,
          capRounded: '{recipe.cap-rounded}',
        },
        resolvedFor(size, p, 'height'),
      )
    }
  }
  return out
}
