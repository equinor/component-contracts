/**
 * Known, deliberate divergences from the oracle.
 *
 * The parity harness fails on anything not listed here. Silence is never a pass.
 */

export type Deviation = {
  density: string
  property: string
  ours: number
  oracle: number
  reason: string
  resolved: boolean
}

export const DEVIATIONS: Deviation[] = [
  {
    density: 'comfortable',
    property: '--eds-typography-ui-body-4xl-line-height-default',
    ours: 36,
    oracle: 32,
    reason:
      'Oracle contradicts its own documented formula. decisions.md publishes this row ' +
      'explicitly: "4XL | 28 | 35.09947874 | 36 | 129%". 28px x 1.25355 = 35.1, which snaps ' +
      'to 36 on the 4px grid, not 32. The oracle value is stale. Ours is correct.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-typography-ui-body-xl-line-height-default',
    ours: 20,
    oracle: 24,
    reason:
      'Ours ports typography.css faithfully (curve indexed by step label, n=4 here). The oracle ' +
      'behaves as though the curve is indexed by absolute px size (16px always gets 24px), which ' +
      'is arguably more defensible but is an improvement rather than a fix ' +
      '"Governing constraint". Decision: keep the faithful port. Recorded as a finding, ' +
      'not a pending decision.',
    resolved: true,
  },
  {
    density: 'compact',
    property:
      '--eds-typography-ui-body-xl-line-height-squished' /* oracle name */,
    ours: 16,
    oracle: 20,
    reason: 'Same root cause as the -default row above.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-2xl-gap-horizontal',
    ours: 12,
    oracle: 11.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-2xl-gap-vertical',
    ours: 12,
    oracle: 11.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-3xl-gap-horizontal',
    ours: 12,
    oracle: 13.008,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-3xl-gap-vertical',
    ours: 12,
    oracle: 13.008,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-4xl-gap-horizontal',
    ours: 16,
    oracle: 15.008,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-4xl-gap-vertical',
    ours: 16,
    oracle: 15.008,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-5xl-gap-horizontal',
    ours: 18,
    oracle: 17.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-5xl-gap-vertical',
    ours: 18,
    oracle: 17.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-lg-gap-horizontal',
    ours: 8,
    oracle: 8.496,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-lg-gap-vertical',
    ours: 8,
    oracle: 8.496,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-md-gap-horizontal',
    ours: 8,
    oracle: 7.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-md-gap-vertical',
    ours: 8,
    oracle: 7.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-sm-gap-horizontal',
    ours: 6,
    oracle: 6.496,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-sm-gap-vertical',
    ours: 6,
    oracle: 6.496,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-xs-gap-horizontal',
    ours: 6,
    oracle: 5.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'compact',
    property: '--eds-spacing-icon-xs-gap-vertical',
    ours: 6,
    oracle: 5.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-2xl-gap-horizontal',
    ours: 12,
    oracle: 13.008,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-2xl-gap-vertical',
    ours: 12,
    oracle: 13.008,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-3xl-gap-horizontal',
    ours: 16,
    oracle: 15.008,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-3xl-gap-vertical',
    ours: 16,
    oracle: 15.008,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-4xl-gap-horizontal',
    ours: 18,
    oracle: 17.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-4xl-gap-vertical',
    ours: 18,
    oracle: 17.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-6xl-gap-horizontal',
    ours: 22,
    oracle: 23.008,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-6xl-gap-vertical',
    ours: 22,
    oracle: 23.008,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-md-gap-horizontal',
    ours: 8,
    oracle: 8.496,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-md-gap-vertical',
    ours: 8,
    oracle: 8.496,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-sm-gap-horizontal',
    ours: 8,
    oracle: 7.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-sm-gap-vertical',
    ours: 8,
    oracle: 7.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-xl-gap-horizontal',
    ours: 12,
    oracle: 11.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-xl-gap-vertical',
    ours: 12,
    oracle: 11.504,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-xs-gap-horizontal',
    ours: 6,
    oracle: 6.496,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
  {
    density: 'comfortable',
    property: '--eds-spacing-icon-xs-gap-vertical',
    ours: 6,
    oracle: 6.496,
    reason:
      'Gap snap moved from 0.5px to 2px (decided 2026-08-28): designers reported the ' +
      'half-pixel offset rendering icons blurry, so icon gaps now land on whole ' +
      'ladder values. round(fontSize x 0.618, 2px) instead of 0.5px; legacy used ' +
      'browser-computed round(0.618em, 1px). Deliberate, applies wherever the two ' +
      'snaps disagree. See documentation/adr/0006-icon-gaps-snap-to-2px.md.',
    resolved: true,
  },
]

export function findDeviation(density: string, property: string) {
  return DEVIATIONS.find(
    (d) => d.density === density && d.property === property,
  )
}
