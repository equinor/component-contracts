/**
 * Spacing — ratio-based, after Nathan Curtis, "Space in Design Systems".
 *
 * The whole system is one idea: **shared ladders plus index offsets**.
 *
 *   density    shifts the ladder index by -1 / 0 / +1
 *   proportion shifts the spacing-ladder index by -1 / 0 / +1
 *
 * Verified against every cell of the legacy build:
 *   - `inset-<size>-horizontal` IS `spacing-horizontal-<size>` (not separate data)
 *   - icon gaps are `round(0.618 * fontSize, 0.5px)` — the golden ratio, matching
 *     `gap: round(0.618em, 1px)` in Button/button.css
 *   - spacing, icon sizing, selectable sizing and border radius are ALL shifted by
 *     one index per density step
 *
 * So ~31 numbers and two formulas replace the 104 tokens the legacy build emits
 * per density — and it extends to a third density for free, apart from one
 * missing top entry per ladder (see EXTRAPOLATED).
 *
 * WHY HORIZONTAL AND VERTICAL ARE SEPARATE TOKENS WITH IDENTICAL VALUES:
 * density was designed to scale anisotropically — vertical tighter than
 * horizontal — because switching comfortable → compact should show MORE TABLE
 * ROWS, not a narrower table. The axis split is the prepared seam; the values
 * never diverged before the feature shipped, and the intent was previously
 * recorded nowhere (recovered from Victor Nystad, 2026-08-28). If revived:
 * DENSITY_OFFSET becomes per-axis. Values change, no names do — consumers are
 * untouched, which is what the "redundant" split was buying all along.
 *
 * Density is also an APPLICATION-LEVEL USER CHOICE, not a per-view style: it
 * answered product teams who found EDS too airy (airy to meet WCAG target
 * sizes). Component SIZE variants (Button small/default) are the orthogonal,
 * per-component knob — both exist, they are not the same axis.
 */

/** Where each ladder ends in the legacy data. Beyond this we are extrapolating,
 *  because `relaxed` never existed there. Flagged rather than silently invented —
 *  these four numbers need a design decision. See REVIEW.md. */
export const EXTRAPOLATED = {
  spacing: {
    value: 36,
    rule: 'top of the ladder steps by +4 (20, 24, 28, 32)',
  },
  icon: {
    value: 64,
    rule: 'top of the ladder follows the type ratio 2^(1/5): 56 * 1.1487 = 64.3',
  },
  selectable: { value: 68, rule: 'top of the ladder steps by +8 (44, 52, 60)' },
  radius: { value: 5, rule: 'ladder is 3, 4 — continues by +1' },
} as const

export const LADDERS = {
  spacing: [1, 2, 4, 6, 8, 12, 16, 20, 24, 28, 32, EXTRAPOLATED.spacing.value],
  icon: [14, 16, 18, 20, 24, 28, 32, 37, 42, 48, 56, EXTRAPOLATED.icon.value],
  selectable: [16, 20, 24, 36, 44, 52, 60, EXTRAPOLATED.selectable.value],
  radius: [3, 4, EXTRAPOLATED.radius.value],
} as const
export type Ladder = keyof typeof LADDERS

/** Index in a ladder that is extrapolated rather than measured. */
export const LADDER_MEASURED_LENGTH: Record<Ladder, number> = {
  spacing: LADDERS.spacing.length - 1,
  icon: LADDERS.icon.length - 1,
  selectable: LADDERS.selectable.length - 1,
  radius: LADDERS.radius.length - 1,
}

export const SPACING_SIZES = [
  '4xs',
  '3xs',
  '2xs',
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
] as const
export const ICON_SIZES = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
] as const
export const SELECTABLE_SIZES = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const
/** Insets exist for the middle of the spacing scale only. */
export const INSET_SIZES = ['xs', 'sm', 'md', 'lg', 'xl'] as const

export const DENSITY_OFFSET = {
  compact: -1,
  comfortable: 0,
  relaxed: 1,
} as const
export const PROPORTION_OFFSET = {
  squished: -1,
  squared: 0,
  stretched: 1,
} as const
export type Proportion = keyof typeof PROPORTION_OFFSET

/** `comfortable` sits one step up the ladder from its first entry. */
const BASE_INDEX = 1

/** Golden ratio — icon-to-text gap as a proportion of font size. */
export const GAP_RATIO = 0.618
/** Gaps snap to 2px — the fine end of the spacing ladder. Was 0.5px (type-scale
 *  snap); designers reported the half-pixel offset rendering icons blurry, so
 *  gaps now land on whole ladder values (decided 2026-08-28). Legacy used 1px. */
export const GAP_SNAP_PX = 2

export function ladderIndex(
  labelIndex: number,
  density: keyof typeof DENSITY_OFFSET,
  proportionOffset = 0,
): number {
  return labelIndex + DENSITY_OFFSET[density] + BASE_INDEX + proportionOffset
}

export function ladderValue(ladder: Ladder, index: number): number | undefined {
  return LADDERS[ladder][index]
}

export function isExtrapolated(ladder: Ladder, index: number): boolean {
  return index >= LADDER_MEASURED_LENGTH[ladder]
}

/** Icon-to-text gap, derived from the active font size. */
export function iconGapPx(fontSizePx: number): number {
  return Math.round((fontSizePx * GAP_RATIO) / GAP_SNAP_PX) * GAP_SNAP_PX
}

/** Constants that do not move with density. */
export const CONSTANTS = {
  'spacing-horizontal-none': 0,
  'spacing-vertical-none': 0,
  'spacing-border-radius-none': 0,
  'spacing-border-radius-pill': 1000,
  'sizing-stroke-none': 0,
  'sizing-stroke-thin': 1,
  'sizing-stroke-thick': 2,
} as const
