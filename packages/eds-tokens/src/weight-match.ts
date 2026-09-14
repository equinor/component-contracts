/** Equinor weights matched to Inter's tiers at the same perceived size.
 *
 *  The table is MEASURED (stem widths from the font outlines — see
 *  weight-match.json for provenance and the regenerate command); this module
 *  only interpolates it. The px axis is the step's UI text size: that is the
 *  opsz Inter renders at (font-optical-sizing: auto), clamped to Inter's
 *  14–32 axis — flat below and above, linear between the measured points.
 *  Density changes the px per step, so the weight is a FUNCTION of px,
 *  evaluated per density mode (the issue #42 caveat, honored). */
import table from './weight-match.json' with { type: 'json' }

export type WeightTier = 'lighter' | 'normal' | 'bolder'
export const WEIGHT_TIERS: WeightTier[] = ['lighter', 'normal', 'bolder']

export function matchedWeight(px: number, tier: WeightTier): number {
  const [lo, hi] = table.opszClamp
  const x = Math.min(hi, Math.max(lo, px))
  const pts = table.points
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]
    const b = pts[i + 1]
    if (x >= a.px && x <= b.px) {
      const t = (x - a.px) / (b.px - a.px)
      return Math.round((a[tier] + t * (b[tier] - a[tier])) * 10) / 10
    }
  }
  return pts[x <= pts[0].px ? 0 : pts.length - 1][tier]
}
