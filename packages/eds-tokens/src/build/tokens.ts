/** Emits DTCG token files. Values are resolved; the rule that produced them
 *  travels alongside in `com.equinor.eds.derived`. */
import { matchedWeight, WEIGHT_TIERS } from '../weight-match.ts'
import {
  DENSITIES,
  LINE_HEIGHT_CURVES,
  SIZES,
  GRID_PX,
  TYPE_SNAP_REM,
  fontSizeRem,
  headerFontSizeRem,
  lineHeightPx,
  remToPx,
  xHeightCorrection,
  stepFor,
  type Density,
  type LineHeightVariant,
  type Size,
} from '../formulas.ts'
import metrics from '../font-metrics.json' with { type: 'json' }
import {
  ladderTokens,
  spacingDensityTokens,
  spacingRelationTokens,
} from './spacing-emit.ts'
import { recipeTokens } from './recipe-emit.ts'

const NS = 'com.equinor.eds'

/** Weight is flat across every size and both families in the source data — the
 *  per-size matrix the legacy build emits carries no information the three
 *  values below don't. Emitted as three tokens; the per-size aliases exist only
 *  so existing component CSS keeps resolving. */
export const FONT_WEIGHTS = { lighter: 300, normal: 400, bolder: 500 } as const
const dim = (value: number, unit: 'px' | 'rem') => ({ value, unit })

/** Every derived token carries the rule and its inputs, so the harness can
 *  recompute and assert rather than trust the committed number. */
function derived(expression: string, inputs: Record<string, unknown>) {
  return {
    [`${NS}.derived`]: { expression, inputs },
    [`${NS}.css`]: { emit: 'expression' },
    [`${NS}.figma`]: { emit: 'value' },
  }
}

/** Inter is the reference; the header face is corrected to match its x-height. */
export const X_HEIGHT_CORRECTION = xHeightCorrection(
  metrics.fonts.Inter.xRatio,
  metrics.fonts.Equinor.xRatio,
)

export function densityTokens(density: Density) {
  const base = DENSITIES[density]
  const fontSize: Record<string, unknown> = {}
  const headerFontSize: Record<string, unknown> = {}
  const headerFontWeight: Record<string, unknown> = {}
  const lineHeight: Record<LineHeightVariant, Record<string, unknown>> = {
    default: {},
    compressed: {},
  }

  for (const size of SIZES) {
    const rem = fontSizeRem(base, size)
    fontSize[size] = {
      $value: dim(rem, 'rem'),
      $extensions: derived(
        `round(base * pow(2, step / 5), ${TYPE_SNAP_REM}rem)`,
        { base: dim(base, 'rem'), step: stepFor(size) },
      ),
    }

    headerFontWeight[size] = Object.fromEntries(
      WEIGHT_TIERS.map((tier) => [
        tier,
        {
          $value: matchedWeight(remToPx(rem), tier),
          $extensions: derived(
            'matchedWeight(uiPx, tier) — measured stem-match curve, linear between points, opsz-clamped 14–32',
            {
              uiPx: `{typography.font-size.${size}}`,
              tier,
              source: 'src/weight-match.json (issue #42, Option B: bolder = Inter 500)',
            },
          ),
        },
      ]),
    )

    const headerRem = headerFontSizeRem(base, size, X_HEIGHT_CORRECTION)
    headerFontSize[size] = {
      $value: dim(headerRem, 'rem'),
      $extensions: derived('round(uiFontSize * xHeightCorrection, 0.5px)', {
        uiFontSize: `{typography.font-size.${size}}`,
        xHeightCorrection: X_HEIGHT_CORRECTION,
        reference: '{typography.font-family.ui}',
      }),
    }

    for (const variant of Object.keys(
      LINE_HEIGHT_CURVES,
    ) as LineHeightVariant[]) {
      const { max, drop } = LINE_HEIGHT_CURVES[variant]
      lineHeight[variant][size] = {
        $value: dim(lineHeightPx(remToPx(rem), size, variant), 'px'),
        $extensions: derived(
          `round(fontSize * (max - pow(n / 9, 3) * drop), ${GRID_PX}px)`,
          {
            fontSize: `{typography.font-size.${size}}`,
            n: SIZES.indexOf(size),
            max,
            drop,
          },
        ),
      }
    }
  }

  return {
    $extensions: {
      [`${NS}.context`]: { modifier: 'density', context: density },
    },
    density: {
      base: {
        $type: 'dimension',
        $value: dim(base, 'rem'),
        $description:
          'The only value density changes. Every size and line-height derives from it.',
      },
    },
    spacing: spacingDensityTokens(density),
    typography: {
      'font-size': { $type: 'dimension', ...fontSize },
      'header-font-size': {
        $type: 'dimension',
        $description:
          'The ui size corrected for x-height and snapped to half a pixel. Baked rather ' +
          'than delivered via CSS size-adjust, so one number serves CSS, Figma and React ' +
          'Native. Line-height is NOT corrected — both faces share the line box at a given step.',
        ...headerFontSize,
      },
      'header-font-weight': {
        $type: 'fontWeight',
        $description:
          "Equinor's weight matched to Inter's tier at the same perceived size — " +
          'stem widths, measured (see src/weight-match.json). One tier definition ' +
          'across both families (Option B, 2026-09-06): header bolder ≙ Inter 500. ' +
          "A function of the step's px, so density changes it; Inter itself needs " +
          'no table — font-optical-sizing: auto does this in the browser.',
        ...headerFontWeight,
      },
      'line-height': {
        $type: 'dimension',
        $description:
          'default = read (prose). compressed = scanned (UI labels). ' +
          'The variant also determines the vertical metric: compressed pairs with ' +
          'calc() half-leading, default pairs with text-box trim.',
        ...lineHeight,
      },
    },
  }
}

export function primitiveTokens() {
  const family = (name: keyof typeof metrics.fonts, value: string) => {
    const f = metrics.fonts[name]
    const isRef = name === 'Inter'
    return {
      $value: value,
      $description: `${f.role} — ${f.licence}`,
      $extensions: {
        [`${NS}.font-metrics`]: {
          unitsPerEm: f.unitsPerEm,
          capHeight: f.capHeight,
          xHeight: f.xHeight,
          capRatio: f.capRatio,
          xRatio: f.xRatio,
        },
        ...(isRef
          ? {
              [`${NS}.role`]: {
                reference: true,
                note: 'x-heights are aligned to this family.',
              },
            }
          : {
              [`${NS}.derived`]: {
                'x-height-correction': {
                  expression: 'xRatio(reference) / xRatio(self)',
                  inputs: { reference: '{typography.font-family.ui}' },
                  value: xHeightCorrection(
                    metrics.fonts.Inter.xRatio,
                    f.xRatio,
                  ),
                  appliedAs: 'baked into typography.header-font-size',
                  note:
                    'NOT emitted as CSS size-adjust. size-adjust is a CSS-only @font-face ' +
                    'descriptor — Figma has no equivalent and React Native never parses it, ' +
                    'so both would render the uncorrected size. Baking also keeps header ' +
                    'sizes on the 0.5px grid, which size-adjust does not.',
                },
              },
            }),
        [`${NS}.css`]: { emit: 'font-face' },
        [`${NS}.figma`]: { emit: 'value' },
      },
    }
  }

  return {
    typography: {
      'font-family': {
        $type: 'fontFamily',
        ui: family('Inter', 'Inter'),
        header: family('Equinor', 'Equinor'),
        code: family('CommitMono', 'CommitMono'),
      },
    },
    'font-weight': {
      $type: 'fontWeight',
      $description:
        'Flat across every size and both families. The legacy per-size matrix carried ' +
        'no information beyond these three values.',
      ...Object.fromEntries(
        Object.entries(FONT_WEIGHTS).map(([k, v]) => [k, { $value: v }]),
      ),
    },
    elevation: {
      $type: 'shadow',
      $description:
        'Composed in the legacy build from decomposed Figma primitives; the primitives ' +
        'are not exposed as variables there either, so the composed values are carried across.',
      low: {
        $value: [
          {
            offsetX: { value: 0, unit: 'px' },
            offsetY: { value: 1, unit: 'px' },
            blur: { value: 8, unit: 'px' },
            spread: { value: 0, unit: 'px' },
            color: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0.2 },
          },
          {
            offsetX: { value: 0, unit: 'px' },
            offsetY: { value: 4, unit: 'px' },
            blur: { value: 8, unit: 'px' },
            spread: { value: 3, unit: 'px' },
            color: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0.12 },
          },
        ],
        $description:
          'Tooltips, menus, popovers, autocomplete lists, snackbars.',
      },
      high: {
        $value: [
          {
            offsetX: { value: 0, unit: 'px' },
            offsetY: { value: 4, unit: 'px' },
            blur: { value: 12, unit: 'px' },
            spread: { value: 0, unit: 'px' },
            color: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0.2 },
          },
          {
            offsetX: { value: 0, unit: 'px' },
            offsetY: { value: 12, unit: 'px' },
            blur: { value: 16, unit: 'px' },
            spread: { value: 6, unit: 'px' },
            color: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0.12 },
          },
        ],
        $description: 'Dialogs, modals, drawers.',
      },
    },
    recipe: recipeTokens(),
    ladder: ladderTokens(),
    spacing: spacingRelationTokens(),
    grid: {
      $type: 'dimension',
      base: {
        $value: dim(GRID_PX, 'px'),
        $description:
          'Layout grid. The invariant that line-heights snap to — the resulting ' +
          'ratio curve is derived from it and is deliberately non-monotonic.',
      },
    },
  }
}

export function resolver() {
  const ctx = (d: Density) => [{ $ref: `density/${d}.tokens.json` }]
  return {
    name: 'eds-tokens',
    version: '2025.10',
    description:
      'Two runtime axes: density and colour-scheme. Everything else is semantic.',
    sets: {
      core: {
        sources: [
          { $ref: 'primitives.tokens.json' },
          { $ref: 'semantic-color.tokens.json' },
        ],
      },
    },
    modifiers: {
      density: {
        contexts: Object.fromEntries(
          (Object.keys(DENSITIES) as Density[]).map((d) => [d, ctx(d)]),
        ),
        default: 'comfortable',
      },
      'color-scheme': {
        contexts: {
          light: [{ $ref: 'color-scheme/light.tokens.json' }],
          dark: [{ $ref: 'color-scheme/dark.tokens.json' }],
        },
        default: 'light',
      },
    },
    resolutionOrder: [
      { $ref: '#/sets/core' },
      { $ref: '#/modifiers/density' },
      { $ref: '#/modifiers/color-scheme' },
    ],
  }
}
