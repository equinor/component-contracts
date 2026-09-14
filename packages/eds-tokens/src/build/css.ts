/** Emits CSS with the formulas intact — the browser evaluates them, not us.
 *  This is the whole point: the algorithm ships, not a snapshot of its output. */
import { matchedWeight, WEIGHT_TIERS } from '../weight-match.ts'
import {
  DENSITIES,
  GRID_PX,
  LINE_HEIGHT_CURVES,
  SIZES,
  TYPE_SNAP_REM,
  fontSizeRem,
  headerFontSizeRem,
  remToPx,
  stepFor,
  type Density,
  type LineHeightVariant,
} from '../formulas.ts'
import { X_HEIGHT_CORRECTION } from './tokens.ts'
import metrics from '../font-metrics.json' with { type: 'json' }
import { spacingDensityCss, spacingRelationCss } from './spacing-emit.ts'
import { FONT_WEIGHTS } from './tokens.ts'
import { recipeCss } from './recipe-emit.ts'

const P = '--eds-typography-ui-body'
const DEFAULT_DENSITY: Density = 'comfortable'

const banner = (title: string) => `/* ${title}
 * Generated — do not edit. Source: src/formulas.ts
 */\n`

function scaleBlock(density: Density): string {
  // `:where(:root)` carries zero specificity, so an explicit [data-density]
  // always wins regardless of source order — and consumers can override without
  // a specificity fight. Plain `:root` here would tie with [data-density] at
  // (0,1,0) and let file order decide, which silently broke `compact`.
  const selector =
    density === DEFAULT_DENSITY
      ? `:where(:root),\n[data-density='${density}']`
      : `[data-density='${density}']`

  const lines: string[] = [`  --_base: ${DENSITIES[density]}rem;`, '']

  for (const size of SIZES) {
    const step = stepFor(size)
    const expr =
      step === 0
        ? 'var(--_base)'
        : `round(calc(var(--_base) * pow(2, ${step}/5)), ${TYPE_SNAP_REM}rem)`
    lines.push(`  ${P}-${size}-font-size: ${expr};`)
  }

  lines.push(
    '',
    '  /* Header sizes — the ui size corrected for x-height, snapped to 0.5px.',
  )
  lines.push(
    '   * Baked, not `size-adjust`: Figma has no equivalent and React Native never',
  )
  lines.push(
    '   * parses @font-face, so both would render the uncorrected size. */',
  )
  for (const size of SIZES) {
    const px = remToPx(
      headerFontSizeRem(DENSITIES[density], size, X_HEIGHT_CORRECTION),
    )
    lines.push(
      `  ${P.replace('ui-body', 'header')}-${size}-font-size: ${px / 16}rem;`,
    )
  }

  lines.push(
    '',
    '  /* Header (Equinor) weights — MATCHED to the Inter tier at the same',
    "   * perceived size (measured stem widths; src/weight-match.json). A",
    "   * function of the step's px, so density moves it. Inter needs no",
    '   * table: font-optical-sizing: auto is the browser-side equivalent. */',
  )
  for (const size of SIZES) {
    const px = remToPx(fontSizeRem(DENSITIES[density], size))
    for (const tier of WEIGHT_TIERS) {
      lines.push(
        `  ${P.replace('ui-body', 'header')}-${size}-font-weight-${tier}: ${matchedWeight(px, tier)};`,
      )
    }
  }

  for (const variant of Object.keys(
    LINE_HEIGHT_CURVES,
  ) as LineHeightVariant[]) {
    const { max, drop } = LINE_HEIGHT_CURVES[variant]
    lines.push('', `  /* line-height: ${variant} */`)
    for (const size of SIZES) {
      const n = SIZES.indexOf(size)
      lines.push(
        `  ${P}-${size}-line-height-${variant}: round(` +
          `calc(var(${P}-${size}-font-size) * (${max} - pow(${n}/9, 3) * ${drop}))` +
          `, ${GRID_PX}px);`,
      )
    }
  }

  lines.push(
    '',
    '  /* spacing, sizing and radius — ladder lookups at this density */',
  )
  lines.push(spacingDensityCss(density))

  return `${selector} {\n${lines.join('\n')}\n}`
}

/** Relationships that hold at every density, so they are declared once. */
function relationBlock(): string {
  return `/* Density-independent relationships.
 * These reference tokens that shift with density, so they follow automatically
 * rather than being re-emitted per density.
 */
:where(:root) {
${spacingRelationCss()}
}`
}

/** Cap-height metrics. `1cap` is Safari 17.2+, so the fallback keeps older
 *  engines rendering something sane instead of dropping the declaration. */
function capBlock(): string {
  return `/* Cap height drives single-line control heights.
 * 1cap resolves per font at the point of use, so this cannot be a token value.
 * Fallback: 1ex is universally supported and close enough to keep layout intact.
 */
:where(:root) {
  --eds-cap-rounded: round(1ex, ${GRID_PX}px);
  --eds-padding-top-baseline: calc(round(1ex, 0.25rem) - 1ex);
  --eds-padding-bottom-baseline: 0px;
}

@supports (height: 1cap) {
  :where(:root) {
${recipeCss()}
    --eds-padding-top-baseline: calc(round(1cap, 0.25rem) - 1ex);
  }
}

/* Read text only. Scanned text uses the half-leading calc instead —
 * see PLAN.md "Scanned vs read". Ex, not cap — and always paired with
 * --eds-padding-top-baseline (round(1cap, 4px) − 1ex): the pair makes the
 * occupied text box exactly --eds-cap-rounded, the same box every glyph
 * footprint and height formula uses, AND lands the baseline itself on the
 * 4px grid. A raw cap trim would give the UNROUNDED cap and miss the grid.
 * (Victor's reference: codepen VYmaowY.) */
@supports (text-box: trim-both ex alphabetic) {
  :root {
    --eds-text-box: trim-both ex alphabetic;
  }
}`
}

function fontFaceBlock(): string {
  const out: string[] = []
  for (const [name, f] of Object.entries(metrics.fonts)) {
    const isRef = name === 'Inter'
    const note = isRef
      ? '/* Reference family — x-heights are aligned to this one. */'
      : `/* No size-adjust. The x-height correction is baked into the header font-size\n` +
        ` * tokens instead, so Figma and React Native get the same number CSS does. */`
    const decls = [
      `  font-family: ${name};`,
      `  src:\n    local('${name}'),\n${f.src.map((s) => `    ${s}`).join(',\n')};`,
      `  font-style: normal;`,
      `  font-weight: ${f.weightRange};`,
      `  font-display: fallback;`,
    ]
    out.push(`${note}\n@font-face {\n${decls.join('\n')}\n}`)
  }
  return out.join('\n\n')
}

/** Weight, family and the remaining scalars. None of these move with density. */
function scalarBlock(): string {
  const lines: string[] = []

  lines.push('  /* Weight — flat across every size and both families. */')
  for (const [name, value] of Object.entries(FONT_WEIGHTS)) {
    lines.push(`  --eds-font-weight-${name}: ${value};`)
  }

  lines.push(
    '',
    '  /* Family. `size-adjust` handles x-height alignment; see font-faces.css. */',
  )
  lines.push('  --eds-typography-ui-body-font-family: Inter, sans-serif;')
  lines.push('  --eds-typography-header-font-family: Equinor, serif;')
  lines.push('  --eds-typography-code-font-family: CommitMono, monospace;')

  lines.push(
    '',
    '  /* Border width — alias, kept so component CSS keeps resolving. */',
  )
  lines.push('  --eds-border-width-default: var(--eds-sizing-stroke-thin);')

  lines.push(
    '',
    '  /* Per-size UI weight aliases. Carry no information beyond the three',
    '   * above (Inter self-adjusts via opsz); they exist so existing component',
    '   * CSS resolves without edits. The HEADER weights are NOT aliases any',
    '   * more — they are matched per size and density (see typography.css',
    '   * density blocks). */',
  )
  for (const role of ['ui-body']) {
    for (const size of SIZES) {
      for (const name of Object.keys(FONT_WEIGHTS)) {
        lines.push(
          `  --eds-typography-${role}-${size}-font-weight-${name}: var(--eds-font-weight-${name});`,
        )
      }
    }
  }

  return `/* Scalars — weight, family, border width. */\n:where(:root) {\n${lines.join('\n')}\n}`
}

/** Two shadow levels for floating UI, composed in the legacy build from decomposed
 *  Figma primitives. Carried across as the composed values — the primitives are not
 *  exposed as variables there either. */
function elevationBlock(): string {
  return `/* Elevation — low: tooltips, menus, popovers, snackbars. high: dialogs, drawers. */
:where(:root) {
  --eds-elevation-low:
    0px 1px 8px 0px rgba(0, 0, 0, 0.2),
    0px 4px 8px 3px rgba(0, 0, 0, 0.12);
  --eds-elevation-high:
    0px 4px 12px 0px rgba(0, 0, 0, 0.2),
    0px 12px 16px 6px rgba(0, 0, 0, 0.12);
}`
}

export function typographyCss(): string {
  return [
    banner('EDS typography — algorithmic scale'),
    (Object.keys(DENSITIES) as Density[]).map(scaleBlock).join('\n\n'),
    relationBlock(),
    scalarBlock(),
    elevationBlock(),
    capBlock(),
  ].join('\n')
}

export function fontFacesCss(): string {
  return [
    banner('EDS font faces — x-height alignment'),
    `/* The x-height correction (x${X_HEIGHT_CORRECTION}) is baked into the header font-size`,
    ' * tokens, NOT applied here as size-adjust. size-adjust is a CSS-only descriptor:',
    ' * Figma has no equivalent and React Native never parses @font-face, so both would',
    ' * render the uncorrected size. Baking also keeps headers on the 0.5px grid.',
    ' * See DECISIONS.md 5. */',
    '',
    fontFaceBlock(),
  ].join('\n')
}
