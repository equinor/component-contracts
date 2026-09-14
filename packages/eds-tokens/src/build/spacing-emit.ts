/** Spacing emitters. See src/spacing.ts for the model. */
import {
  CONSTANTS,
  GAP_RATIO,
  GAP_SNAP_PX,
  ICON_SIZES,
  INSET_SIZES,
  LADDERS,
  PROPORTION_OFFSET,
  SELECTABLE_SIZES,
  SPACING_SIZES,
  EXTRAPOLATED,
  iconGapPx,
  isExtrapolated,
  ladderIndex,
  ladderValue,
  type Ladder,
  type Proportion,
} from '../spacing.ts'
import {
  DENSITIES,
  SIZES,
  fontSizeRem,
  remToPx,
  type Density,
} from '../formulas.ts'

const NS = 'com.equinor.eds'
const px = (value: number) => ({ value, unit: 'px' as const })

/** The inset a given size/proportion resolves to, as a spacing-scale label.
 *  Proportion is an index shift, and labels map 1:1 onto ladder indices, so the
 *  shift is expressible as "one label up/down" — which keeps it a var() reference
 *  rather than a baked number, and therefore density-independent. */
export function insetLabel(size: string, proportion: Proportion): string {
  const i = SPACING_SIZES.indexOf(size as any) + PROPORTION_OFFSET[proportion]
  return SPACING_SIZES[i]
}

type Entry = { name: string; value: number; ladder: Ladder; index: number }

/** Everything that moves with density. */
export function densitySpacingEntries(density: Density): Entry[] {
  const out: Entry[] = []
  const add = (name: string, ladder: Ladder, labelIndex: number) => {
    const index = ladderIndex(labelIndex, density)
    const value = ladderValue(ladder, index)
    if (value !== undefined) out.push({ name, value, ladder, index })
  }
  SPACING_SIZES.forEach((s, i) => {
    add(`spacing-horizontal-${s}`, 'spacing', i)
    add(`spacing-vertical-${s}`, 'spacing', i)
  })
  ICON_SIZES.forEach((s, i) => add(`sizing-icon-${s}`, 'icon', i))
  SELECTABLE_SIZES.forEach((s, i) =>
    add(`sizing-selectable-${s}`, 'selectable', i),
  )
  add('spacing-border-radius-rounded', 'radius', 0)
  return out
}

export function spacingDensityTokens(density: Density) {
  const root: Record<string, any> = {}
  for (const e of densitySpacingEntries(density)) {
    root[e.name] = {
      $value: px(e.value),
      $extensions: {
        [`${NS}.derived`]: {
          expression: 'ladder[labelIndex + densityOffset + 1]',
          inputs: { ladder: e.ladder, index: e.index },
          ...(isExtrapolated(e.ladder, e.index)
            ? { extrapolated: true, rule: EXTRAPOLATED[e.ladder].rule }
            : {}),
        },
        [`${NS}.css`]: { variable: `--eds-${e.name}` },
      },
    }
  }
  return { $type: 'dimension', ...root }
}

/** Scheme- and density-independent: relationships, not values. */
export function spacingRelationTokens() {
  const inset: Record<string, any> = {}
  for (const size of INSET_SIZES) {
    inset[`spacing-inset-${size}-horizontal`] = {
      $value: `{spacing.spacing-horizontal-${size}}`,
      $extensions: {
        [`${NS}.css`]: { variable: `--eds-spacing-inset-${size}-horizontal` },
      },
    }
    for (const p of Object.keys(PROPORTION_OFFSET) as Proportion[]) {
      inset[`spacing-inset-${size}-vertical-${p}`] = {
        $value: `{spacing.spacing-vertical-${insetLabel(size, p)}}`,
        $extensions: {
          [`${NS}.derived`]: {
            expression: 'spacing[labelIndex + proportionOffset]',
            inputs: {
              size,
              proportion: p,
              proportionOffset: PROPORTION_OFFSET[p],
            },
          },
          [`${NS}.css`]: {
            variable: `--eds-spacing-inset-${size}-vertical-${p}`,
          },
        },
      }
    }
  }

  const gap: Record<string, any> = {}
  for (const size of SIZES) {
    // Density-dependent through the font size, so Figma needs one number per density
    // mode. Unlike 1cap this is build-time computable — bake it here, same formulas.
    const resolved = Object.fromEntries(
      (Object.keys(DENSITIES) as Density[]).map((d) => [
        d,
        px(iconGapPx(remToPx(fontSizeRem(DENSITIES[d], size)))),
      ]),
    )
    for (const axis of ['horizontal', 'vertical'] as const) {
      gap[`spacing-icon-${size}-gap-${axis}`] = {
        $extensions: {
          [`${NS}.derived`]: {
            expression: `round(fontSize * ${GAP_RATIO}, ${GAP_SNAP_PX}px)`,
            inputs: { fontSize: `{typography.font-size.${size}}` },
            note: 'Golden ratio — matches `gap: round(0.618em, 1px)` in Button/button.css.',
          },
          [`${NS}.css`]: {
            emit: 'expression',
            variable: `--eds-spacing-icon-${size}-gap-${axis}`,
          },
          [`${NS}.figma`]: { emit: 'resolved', resolved },
        },
      }
    }
  }

  const constant: Record<string, any> = {}
  for (const [name, value] of Object.entries(CONSTANTS)) {
    constant[name] = {
      $value: px(value),
      $description: 'Does not move with density.',
      $extensions: { [`${NS}.css`]: { variable: `--eds-${name}` } },
    }
  }

  return { $type: 'dimension', ...inset, ...gap, ...constant }
}

export function ladderTokens() {
  const out: Record<string, any> = {}
  for (const [name, values] of Object.entries(LADDERS)) {
    out[name] = {
      $description: `Shared ${name} ladder. Density and proportion are index offsets into it.`,
      $extensions: {
        [`${NS}.ladder`]: {
          values,
          measuredLength: values.length - 1,
          extrapolatedTail: EXTRAPOLATED[name as Ladder],
        },
      },
      ...Object.fromEntries(
        values.map((v, i) => [
          String(i),
          {
            $value: px(v),
            ...(isExtrapolated(name as Ladder, i)
              ? {
                  $description: `Extrapolated — ${EXTRAPOLATED[name as Ladder].rule}`,
                }
              : {}),
          },
        ]),
      ),
    }
  }
  return { $type: 'dimension', ...out }
}

// --- CSS ------------------------------------------------------------------------

export function spacingDensityCss(density: Density): string {
  return densitySpacingEntries(density)
    .map(
      (e) =>
        `  --eds-${e.name}: ${e.value}px;` +
        (isExtrapolated(e.ladder, e.index) ? '  /* extrapolated */' : ''),
    )
    .join('\n')
}

export function spacingRelationCss(): string {
  const lines: string[] = []

  lines.push(
    '  /* Insets are the spacing ladder. Proportion is an index shift, so',
  )
  lines.push(
    '   * these are references, not values — they follow density for free. */',
  )
  for (const size of INSET_SIZES) {
    lines.push(
      `  --eds-spacing-inset-${size}-horizontal: var(--eds-spacing-horizontal-${size});`,
    )
    for (const p of Object.keys(PROPORTION_OFFSET) as Proportion[]) {
      lines.push(
        `  --eds-spacing-inset-${size}-vertical-${p}: ` +
          `var(--eds-spacing-vertical-${insetLabel(size, p)});`,
      )
    }
  }

  lines.push(
    '',
    '  /* Icon-to-text gap: golden ratio of the active font size. */',
  )
  for (const size of SIZES) {
    const expr = `round(calc(var(--eds-typography-ui-body-${size}-font-size) * ${GAP_RATIO}), ${GAP_SNAP_PX}px)`
    for (const axis of ['horizontal', 'vertical'] as const) {
      lines.push(`  --eds-spacing-icon-${size}-gap-${axis}: ${expr};`)
    }
  }

  lines.push('', '  /* Constants — do not move with density. */')
  for (const [name, value] of Object.entries(CONSTANTS)) {
    lines.push(`  --eds-${name}: ${value}px;`)
  }

  return lines.join('\n')
}
