/**
 * The optical-padding recipe.
 *
 * A control has to land on the 4px grid while keeping an honest line-height. The
 * way to get both is to subtract the half-leading from the vertical padding:
 *
 *   capRounded    = round(1cap, 4px)
 *   min-height    = inset × 2 + capRounded
 *   padding-block = inset − (lineHeight − capRounded) / 2
 *
 * Worked through at comfortable density:
 *
 *   button md   14px label, 16px squished line-height, cap→12, inset 12
 *               → padding 10px, height 36px
 *   chip   sm   12px label, 12px squished line-height, cap→ 8, inset  8
 *               → padding  6px, height 24px
 *
 * The 10px and 6px are deliberately off the 4px ladder. That is the point: the
 * system optimises for optical rather than measured spacing, and the *measured*
 * result stays on the grid. Rounding the padding back to a grid multiple is the
 * specific mistake this recipe exists to prevent.
 *
 * Tier 3 — `1cap` resolves per font at the point of use, so no single number is
 * correct for every family. It cannot be a token value; it has to stay an
 * expression. But it CAN be a ready-made token whose *value* is an expression,
 * which is what we emit, so components stop re-implementing the calc inline.
 *
 * Applies to **scanned** text only. Read text uses `text-box: trim-both` instead —
 * see PLAN.md "Scanned vs read". Since scanned text is always the UI family, the
 * recipe only ever involves Inter; headings are read text and never use it.
 */
import { INSET_SIZES, PROPORTION_OFFSET, type Proportion } from './spacing.ts'
import { GRID_PX, cssRound } from './formulas.ts'

export const RECIPE = {
  capRounded: {
    expression: 'round(1cap, 4px)',
    note: 'Cap height snapped to the layout grid — the visual height of a single line.',
  },
  minHeight: {
    expression: 'inset * 2 + capRounded',
    note: 'What the control measures. Lands on the grid by construction.',
  },
  paddingBlock: {
    expression: 'inset - (lineHeight - capRounded) / 2',
    note: 'Half-leading subtracted. Deliberately off-grid; do not round it back.',
  },
} as const

/** Always even, because lineHeight and capRounded are both 4px-snapped, so their
 *  difference is a multiple of 4 and the half-leading a multiple of 2. The optical
 *  values are not arbitrary — they live on a 2px ladder, provably. */
export function opticalPadding(
  inset: number,
  lineHeight: number,
  capRounded: number,
): number {
  return inset - (lineHeight - capRounded) / 2
}

export function opticalHeight(inset: number, capRounded: number): number {
  return inset * 2 + capRounded
}

export function capRoundedPx(fontSizePx: number, capRatio: number): number {
  return cssRound(fontSizePx * capRatio, GRID_PX)
}

/** Sizes the recipe covers — the inset scale, which the label size tracks. */
export const RECIPE_SIZES = INSET_SIZES
export const RECIPE_PROPORTIONS = Object.keys(PROPORTION_OFFSET) as Proportion[]
