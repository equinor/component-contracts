/**
 * The algorithms. Everything else in this package is derived from these.
 *
 * Ported from packages/eds-core-react/src/components/next/Foundation/typography.css,
 * which is the authored source — the Style Dictionary output in
 * packages/eds-tokens/build/ is a baked snapshot of these same formulas.
 *
 * Recorded in decisions.md:
 *   type scale    f1 = f0 * r^(i/n), rounded to nearest 0.5px
 *   line-height   1.39 - pow(n/9, 3) * 0.29, rounded to nearest 4px
 */

/** Root font size assumed when converting rem <-> px. */
export const ROOT_PX = 16

/** Size steps, in scale order. Index doubles as `n` in the line-height curve. */
export const SIZES = [
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
export type Size = (typeof SIZES)[number]

/** `lg` is the base step; everything else is an offset from it. */
export const STEP_OFFSET = -3

/** Fifth root of two: five steps per octave. */
export const SCALE_STEPS_PER_OCTAVE = 5

/** Type sizes snap to half a pixel — the sub-pixel precision that keeps the
 *  small end of the scale from jumping (10 -> 12 -> 14 is too coarse). */
export const TYPE_SNAP_REM = 0.03125 // 0.5px

/** Line-heights snap to the 4px layout grid. The grid is the invariant; the
 *  resulting ratio is derived, and is deliberately non-monotonic. */
export const GRID_PX = 4

/** Line-height curve: ease-out cubic from `max` at xs down to `max - drop` at 6xl. */
export const LINE_HEIGHT_CURVES = {
  /** Read text — prose meant to be read. */
  default: { max: 1.39, drop: 0.29 },
  /** Scanned text — UI labels. Exists so a wrapped label reads as one block.
   *  Named `compressed`, not `squished`: `squished` is Nathan Curtis's term for the
   *  spacing proportion, and using it for both made two unrelated things collide
   *  inside a single expression. A stronger rename is deferred. */
  compressed: { max: 1.13, drop: 0.13 },
} as const
export type LineHeightVariant = keyof typeof LINE_HEIGHT_CURVES

/** Density is a single number: the base size. Every other value derives from it. */
export const DENSITIES = {
  compact: 0.875,
  comfortable: 1,
  relaxed: 1.15625,
} as const
export type Density = keyof typeof DENSITIES

/** CSS round() with no strategy is `nearest`, ties toward +infinity — same as Math.round. */
export function cssRound(value: number, step: number): number {
  return Math.round(value / step) * step
}

/** Guard against binary-float dust from the rem/px conversions. */
function clean(n: number): number {
  return Math.round(n * 1e6) / 1e6
}

export function stepFor(size: Size): number {
  return SIZES.indexOf(size) + STEP_OFFSET
}

/** Font size in rem, snapped to half a pixel. */
export function fontSizeRem(base: number, size: Size): number {
  const raw = base * Math.pow(2, stepFor(size) / SCALE_STEPS_PER_OCTAVE)
  return clean(cssRound(raw, TYPE_SNAP_REM))
}

/** Line-height in px, snapped to the 4px grid. */
export function lineHeightPx(
  fontSizePx: number,
  size: Size,
  variant: LineHeightVariant,
): number {
  const n = SIZES.indexOf(size)
  const { max, drop } = LINE_HEIGHT_CURVES[variant]
  const multiplier = max - Math.pow(n / (SIZES.length - 1), 3) * drop
  return clean(cssRound(fontSizePx * multiplier, GRID_PX))
}

/** Cap height snapped to the grid — the visual height of a single-line label. */
export function capHeightPx(
  fontSizePx: number,
  effectiveCapRatio: number,
): number {
  return clean(cssRound(fontSizePx * effectiveCapRatio, GRID_PX))
}

/**
 * Half-leading: half the difference between the line box and the glyph extent.
 * Subtracting it from vertical padding makes a control land on the grid while
 * keeping an honest line-height. See docs/optical-padding.md.
 */
export function halfLeadingPx(
  lineHeightPx: number,
  capHeightPx: number,
): number {
  return clean((lineHeightPx - capHeightPx) / 2)
}

/** x-height alignment factor for a secondary family against the reference family. */
export function xHeightCorrection(
  referenceXRatio: number,
  selfXRatio: number,
): number {
  return clean(referenceXRatio / selfXRatio)
}

/**
 * Header font size — the ui size corrected for x-height, snapped to half a pixel.
 *
 * Baked rather than delivered via CSS `size-adjust`, because `size-adjust` is a CSS
 * @font-face descriptor: Figma has no equivalent and React Native never parses it,
 * so two of three targets would silently render the uncorrected size. It also puts
 * the correction somewhere nobody reads, which is how it came to ship at 105.9%
 * when the formula requires 113.73%.
 *
 * Rounding here is what keeps headers on the same half-pixel grid as the rest of
 * the scale; `size-adjust` multiplies continuously and lands on 15.9220.
 *
 * Font size only. Line-height is shared with the ui scale, not scaled — the point
 * of x-height alignment is that both faces look the same size at the same step, so
 * they get the same line box. Equinor's vertical footprint is 1.000em against
 * Inter's 1.210em, so it fits wherever Inter fits.
 */
export function headerFontSizeRem(
  base: number,
  size: Size,
  correction: number,
): number {
  return clean(
    cssRound(remToPx(fontSizeRem(base, size)) * correction, 0.5) / ROOT_PX,
  )
}

export const remToPx = (rem: number) => clean(rem * ROOT_PX)
export const pxToRem = (px: number) => clean(px / ROOT_PX)
