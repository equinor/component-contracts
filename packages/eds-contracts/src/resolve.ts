/** Contract resolver — the shared half of both emitters.
 *
 *  Loads a contract, expands prop interpolations, validates every token ref
 *  against the emitted token files (a dangling ref is a build error, not a
 *  runtime surprise), and computes the optical geometry per density using the
 *  token package's own formulas — the same functions the parity harness checks
 *  against Chrome. Nothing here invents a number.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  DENSITIES,
  fontSizeRem,
  lineHeightPx,
  remToPx,
  capHeightPx,
  type Density,
  type Size,
} from '../../eds-tokens/src/formulas.ts'
import {
  iconGapPx,
  ladderIndex,
  ladderValue,
  PROPORTION_OFFSET,
  SPACING_SIZES,
  type Proportion,
} from '../../eds-tokens/src/spacing.ts'
import { figmaName } from '../../eds-tokens/src/build/figma.ts'
import metrics from '../../eds-tokens/src/font-metrics.json' with { type: 'json' }

const root = fileURLToPath(new URL('../../..', import.meta.url))
const loadJson = (rel: string) => JSON.parse(readFileSync(root + rel, 'utf8'))

export const DENSITY_MODES = Object.keys(DENSITIES) as Density[]
export const UI_CAP = metrics.fonts.Inter.capRatio

// ---- token universe -------------------------------------------------------------

/** path → token, from every emitted token file (density paths appear once). */
export function tokenUniverse(): Map<string, any> {
  const files = [
    'packages/eds-tokens/tokens/primitives.tokens.json',
    'packages/eds-tokens/tokens/density/comfortable.tokens.json',
    'packages/eds-tokens/tokens/semantic-color.tokens.json',
    'packages/eds-tokens/tokens/color-scheme/light.tokens.json',
  ]
  const map = new Map<string, any>()
  const walk = (node: any, path: string[]) => {
    if (node === null || typeof node !== 'object') return
    if ('$value' in node || node.$extensions?.['com.equinor.eds.figma']) {
      map.set(path.join('.'), node)
      return
    }
    for (const [k, v] of Object.entries(node))
      if (!k.startsWith('$')) walk(v, [...path, k])
  }
  for (const f of files) walk(loadJson(f), [])
  return map
}

// ---- refs ------------------------------------------------------------------------

export const stripBraces = (ref: string) => ref.slice(1, -1)

/** Expand every `{prop}` placeholder over its enum values — cartesian across props.
 *  Returns one entry per combination, with the bindings that produced it. */
export function expandRef(
  ref: string,
  props: any[],
): { bindings: Record<string, string>; ref: string }[] {
  let out = [{ bindings: {} as Record<string, string>, ref }]
  for (const p of props.filter((p) => p.type.enum)) {
    const ph = `{${p.name}}`
    out = out.flatMap((o) =>
      o.ref.includes(ph)
        ? p.type.enum.map((v: string) => ({
            bindings: { ...o.bindings, [p.name]: v },
            ref: o.ref.split(ph).join(v),
          }))
        : [o],
    )
  }
  return out
}

/** Every enum-prop value combination, e.g. [{tone:'neutral',emphasis:'muted'}, …]. */
export function propCombos(props: any[]): Record<string, string>[] {
  return props
    .filter((p) => p.type.enum)
    .reduce<Record<string, string>[]>(
      (acc, p) =>
        acc.flatMap((ctx) =>
          p.type.enum.map((v: string) => ({ ...ctx, [p.name]: v })),
        ),
      [{}],
    )
}

/** Most-specific ref whose bindings are satisfied by the context. */
export function pickRef(
  refs: ResolvedContract['refs'],
  key: string,
  ctx: Record<string, string> = {},
) {
  return refs
    .filter(
      (r) =>
        r.key === key &&
        Object.entries(r.bindings).every(([k, v]) => ctx[k] === v),
    )
    .sort(
      (a, b) => Object.keys(b.bindings).length - Object.keys(a.bindings).length,
    )[0]
}

export function cssVar(token: any, path: string): string {
  const v = token.$extensions?.['com.equinor.eds.css']?.variable
  if (v) return v
  // Typography tokens carry no css extension — their variable names follow the
  // fixed pattern build/css/typography.css emits.
  const p = path.split('.')
  if (p[0] === 'typography' && p[1] === 'font-size')
    return `--eds-typography-ui-body-${p[2]}-font-size`
  if (p[0] === 'typography' && p[1] === 'line-height')
    return `--eds-typography-ui-body-${p[3]}-line-height-${p[2]}`
  // Elevation tokens carry no css extension either — shadows are emitted to
  // CSS under a fixed name and to Figma as effect styles, not variables.
  if (p[0] === 'elevation') return `--eds-elevation-${p[1]}`
  throw new Error(`token ${path} has no CSS variable`)
}

export function figmaVarName(path: string): string {
  const parts = path.split('.')
  return parts[0] === 'color' ? figmaName(parts.slice(1)) : figmaName(parts)
}

// ---- optical geometry ------------------------------------------------------------

export type Geometry = {
  density: Density
  fontPx: number
  lineHeightPx: number
  capPx: number
  insetPx: number
  paddingPx: number
  heightPx: number
}

/** The invariant: padding = inset − (lh − cap)/2, so height = inset × 2 + cap.
 *  The leading variant changes the padding, never the height — read text
 *  (default leading) breathes more inside the same box. */
export function opticalGeometry(
  labelSize: Size,
  insetSize: string,
  proportion: Proportion,
  leading: 'compressed' | 'default' = 'compressed',
): Geometry[] {
  return DENSITY_MODES.map((density) => {
    const fontPx = remToPx(fontSizeRem(DENSITIES[density], labelSize))
    const lh = lineHeightPx(fontPx, labelSize, leading)
    const capPx = capHeightPx(fontPx, UI_CAP)
    const insetPx = ladderValue(
      'spacing',
      ladderIndex(
        SPACING_SIZES.indexOf(insetSize as any),
        density,
        PROPORTION_OFFSET[proportion],
      ),
    )!
    return {
      density,
      fontPx,
      lineHeightPx: lh,
      capPx,
      insetPx,
      paddingPx: insetPx - (lh - capPx) / 2,
      heightPx: insetPx * 2 + capPx,
    }
  })
}

// ---- resolution ------------------------------------------------------------------

export type Disposition = 'CARRIED' | 'LOWERED' | 'RESOLVED' | 'REFUSED'
export type LedgerEntry = {
  fact: string
  css: Disposition
  figma: Disposition
  note: string
}

export type PairingVariable = {
  name: string
  collection: 'density'
  values: Record<Density, number>
  codeSyntax: string
  description: string
}

export type SizeAxis = {
  prop: string
  values: string[]
  /** value -> anatomy parameters */
  map: Record<string, { inset: string; label: string; icon?: string }>
}

export type StructuralVariant = {
  when: Record<string, string>
  iconOnly: string
  inset?: 'even'
  radius?: string
}

export type ResolvedContract = {
  contract: any
  geometry: Geometry[] | null
  /** one per size-axis value; index 0 = the default value */
  pairings: PairingVariable[]
  geometryBySize: Record<string, Geometry[]>
  sizeAxis: SizeAxis | null
  /** variant blocks that override anatomy, not just tokens (icon-only rounds) */
  structural: StructuralVariant[]
  /** key = part/channel (":state" suffixed for state overrides); bindings = the
   *  prop values this entry applies to. Resolution: pickRef, most specific wins. */
  refs: {
    key: string
    bindings: Record<string, string>
    path: string
    cssVar: string
    figmaVar: string
  }[]
}

export function resolveContract(contractPath: string): ResolvedContract {
  const contract = loadJson(contractPath)
  const universe = tokenUniverse()

  const refs: ResolvedContract['refs'] = []
  const addRef = (
    key: string,
    ref: string,
    fixed: Record<string, string> = {},
  ) => {
    for (const { bindings, ref: expanded } of expandRef(ref, contract.props)) {
      const path = stripBraces(expanded)
      const token = universe.get(path)
      if (!token) throw new Error(`dangling token ref in ${key}: ${expanded}`)
      refs.push({
        key,
        bindings: { ...fixed, ...bindings },
        path,
        cssVar: cssVar(token, path),
        figmaVar: figmaVarName(path),
      })
    }
  }

  for (const [partName, part] of Object.entries<any>(contract.anatomy)) {
    if (part.layout?.gap) addRef(`${partName}/gap`, part.layout.gap)
    if (part.radius) addRef(`${partName}/radius`, part.radius)
    if (part.thickness) addRef(`${partName}/thickness`, part.thickness)
    if (part.underline) addRef(`${partName}/underline`, part.underline)
    if (part.endline) addRef(`${partName}/endline`, part.endline)
    if (part.glyph) addRef(`${partName}/glyph`, part.glyph)
    if (part.footprint) addRef(`${partName}/footprint`, part.footprint)
    if (part.overhang) addRef(`${partName}/overhang`, part.overhang)
    for (const [channel, ref] of Object.entries<string>(part.tokens ?? {})) {
      addRef(`${partName}/${channel}`, ref)
    }
  }
  // Variant overrides: same keys, pinned to the prop values in `when`.
  for (const v of contract.variants ?? []) {
    for (const [key, ref] of Object.entries<string>(v.tokens)) {
      addRef(key, ref, v.when)
    }
    // Structural overrides: a per-variant radius is just a pinned ref —
    // pickRef('root/radius', ctx) resolves it, most specific wins.
    if (v.structure?.radius) addRef('root/radius', v.structure.radius, v.when)
  }
  for (const state of contract.states) {
    // A gated state's refs carry the gate as bindings — pickRef with a
    // non-matching combo finds nothing, so no rule and no variant is invented.
    for (const [key, ref] of Object.entries<string>(state.tokens)) {
      addRef(`${key}:${state.name}`, ref, state.when)
    }
  }

  // The size axis: at most one enum prop may carry per-value anatomy parameters.
  const axisProp = contract.props.find((p: any) => p.anatomy)
  let sizeAxis: SizeAxis | null = null
  if (axisProp) {
    sizeAxis = {
      prop: axisProp.name,
      values: axisProp.type.enum,
      map: axisProp.anatomy,
    }
    const def = sizeAxis.map[axisProp.default]
    const inset = contract.anatomy.root.inset
    const label = contract.anatomy[inset.opticalLabel]?.typography?.label
    if (def.inset !== inset.size || def.label !== label)
      throw new Error(
        `size axis default (${JSON.stringify(def)}) must match the anatomy literals ` +
          `(inset ${inset.size}, label ${label}) — the anatomy describes the default size`,
      )
    // Per non-default value: size-scoped refs for the icon's glyph and footprint.
    for (const value of sizeAxis.values) {
      if (value === axisProp.default) continue
      const p = sizeAxis.map[value]
      for (const [partName, part] of Object.entries<any>(contract.anatomy)) {
        if (!part.glyph || !part.footprint) continue
        addRef(
          `${partName}/glyph`,
          `{spacing.sizing-icon-${p.icon ?? p.label}}`,
          {
            [axisProp.name]: value,
          },
        )
        addRef(`${partName}/footprint`, `{recipe.cap-rounded-${p.label}}`, {
          [axisProp.name]: value,
        })
      }
    }
  }

  // Optical geometry from the root part's inset + the label part's typography —
  // per size-axis value when an axis exists, once otherwise.
  let geometry: Geometry[] | null = null
  const pairings: PairingVariable[] = []
  const geometryBySize: Record<string, Geometry[]> = {}
  const inset = contract.anatomy.root.inset
  if (inset?.opticalLabel) {
    const labelPart = contract.anatomy[inset.opticalLabel]
    if (!labelPart?.typography)
      throw new Error(`opticalLabel '${inset.opticalLabel}' has no typography`)
    const defaultLabel = labelPart.typography.label as Size
    const sizeParams: [string, { inset: string; label: string }][] = sizeAxis
      ? [
          [axisProp.default, sizeAxis.map[axisProp.default]],
          ...sizeAxis.values
            .filter((v: string) => v !== axisProp.default)
            .map((v: string) => [v, sizeAxis!.map[v]] as [string, any]),
        ]
      : [['default', { inset: inset.size, label: defaultLabel }]]
    const leading = (labelPart.typography.variant ?? 'compressed') as
      | 'compressed'
      | 'default'
    for (const [value, p] of sizeParams) {
      const proportion = (p as any).proportion ?? inset.proportion
      const geo = opticalGeometry(
        p.label as Size,
        p.inset,
        proportion,
        leading,
      )
      geometryBySize[value] = geo
      const samePair = p.label === p.inset
      // Read text (default leading) pairs with its own half-leading token —
      // the padding differs, so it must be its own Figma variable too.
      const leadingSuffix = leading === 'compressed' ? '' : `-${leading}-leading`
      const name =
        (samePair
          ? `recipe/optical-padding-${p.inset}-${proportion}`
          : `recipe/optical-padding-${p.inset}-${proportion}-${p.label}-label`) +
        leadingSuffix
      const halfLeadingVar =
        leading === 'compressed'
          ? `--eds-half-leading-${p.label}`
          : `--eds-half-leading-${p.label}-${leading}`
      pairings.push({
        name,
        collection: 'density',
        values: Object.fromEntries(
          geo.map((g) => [g.density, g.paddingPx]),
        ) as Record<Density, number>,
        codeSyntax: `calc(var(--eds-spacing-inset-${p.inset}-vertical-${proportion}) - var(${halfLeadingVar}))`,
        description:
          `${contract.id}: ${p.label} label in the ${p.inset}-${proportion} inset. ` +
          `Resolved because Figma cannot calc; CSS composes it live. ` +
          `Heights land at ${geo.map((g) => g.heightPx).join('/')}.`,
      })
      // A pointer part (tooltip arrow) derives its protrusion: half the
      // label's cap box — density-scaling, never authored, no arrow token.
      if (Object.values<any>(contract.anatomy).some((part) => part.pointer)) {
        pairings.push({
          name: `recipe/pointer-${p.label}`,
          collection: 'density',
          values: Object.fromEntries(
            geo.map((g) => [g.density, g.capPx / 2]),
          ) as Record<Density, number>,
          codeSyntax: `calc(var(--eds-cap-rounded-${p.label}) / 2)`,
          description:
            `${contract.id}: the bubble pointer's protrusion — half the ${p.label} ` +
            `cap box, so the arrow scales with density like everything else. ` +
            `Resolved because Figma cannot calc; CSS composes it live.`,
        })
      }
    }
    geometry = geometryBySize[sizeParams[0][0]]
  }

  // A derived indent: this contract's label aligns with ANOTHER contract's
  // label, so the leading inset = parent inset-h + icon cap cell + icon gap —
  // computed per density from the same formulas, minted as a recipe variable
  // (RESOLVED: Figma cannot calc; CSS composes it live).
  if (contract.anatomy.root.indent) {
    const parentId: string = contract.anatomy.root.indent.alignsWith
    const parentPath = contractPath.replace(
      /[^/]+\.contract\.json$/,
      `${parentId.replace(/^eds\./, '')}.contract.json`,
    )
    const parent = loadJson(parentPath)
    const pInset: string = parent.anatomy.root.inset.size
    const pLabel = parent.anatomy[parent.anatomy.root.inset.opticalLabel]
      .typography.label as Size
    const values = Object.fromEntries(
      DENSITY_MODES.map((density) => {
        const fontPx = remToPx(fontSizeRem(DENSITIES[density], pLabel))
        const insetH = ladderValue(
          'spacing',
          ladderIndex(SPACING_SIZES.indexOf(pInset as any), density, 0),
        )!
        const cap = capHeightPx(fontPx, UI_CAP)
        return [density, insetH + cap + iconGapPx(fontPx)]
      }),
    ) as Record<Density, number>
    pairings.push({
      name: `recipe/indent-${contract.id.replace(/^eds\./, '')}`,
      collection: 'density',
      values,
      codeSyntax: `calc(var(--eds-spacing-inset-${pInset}-horizontal) + var(--eds-cap-rounded-${pLabel}) + var(--eds-spacing-icon-${pLabel}-gap-horizontal))`,
      description: `${contract.id}: leading indent so the label aligns with ${parentId}'s label (parent inset + icon cap cell + icon gap). Resolved because Figma cannot calc; CSS composes it live.`,
    })
  }

  // Baseline-grid text: Figma needs a top pad CSS must never read — the
  // trimmed text occupies Figma's PIXEL-ROUNDED raw cap (measured: a
  // leadingTrim text node is round(fontSize × capRatio) tall), the grid
  // cell is the 4px-ROUNDED cap, and Figma cannot round() — so the
  // difference is minted per density (negative where the pixel cap
  // exceeds the cell; Figma binds negative padding — Victor's La Dupla
  // −1). CSS composes its own pad live from the EX line: same box,
  // different formula. The first deliberately FIGMA-ONLY value.
  if (contract.anatomy.root.baseline) {
    const bLabel = Object.entries<any>(contract.anatomy).find(
      ([n, p]) => n !== 'root' && p.typography,
    )![1].typography.label as Size
    pairings.push({
      name: `figma-only/baseline-pad-${bLabel}`,
      collection: 'density',
      values: Object.fromEntries(
        DENSITY_MODES.map((density) => {
          const fontPx = remToPx(fontSizeRem(DENSITIES[density], bLabel))
          return [
            density,
            capHeightPx(fontPx, UI_CAP) - Math.round(fontPx * UI_CAP),
          ]
        }),
      ) as Record<Density, number>,
      codeSyntax: `FIGMA-ONLY — never read in code. CSS trims to ex and pads round(1cap, 4px) − 1ex live.`,
      description: `${contract.id}: a leadingTrim text occupies Figma's pixel-rounded cap; this pad (cap-rounded-to-4px − cap-rounded-to-1px) lands it in the grid cell. FIGMA-ONLY: CSS reaches the same box from the ex line (round(1cap,4px) − 1ex), so this value must never be read in code.`,
    })
  }

  // The collapsed rail's width matches another contract's SQUARE EDGE —
  // that item's height (inset×2 + cap), which is also its own collapsed
  // width. Minted like the indent: computed per density, RESOLVED in Figma.
  if (contract.anatomy.root.collapsedWidth) {
    const matchId: string = contract.anatomy.root.collapsedWidth.matches
    const mPath = contractPath.replace(
      /[^/]+\.contract\.json$/,
      `${matchId.replace(/^eds\./, '')}.contract.json`,
    )
    const m = loadJson(mPath)
    const mInset = m.anatomy.root.inset
    const mLabel = m.anatomy[mInset.opticalLabel].typography
    const geo = opticalGeometry(
      mLabel.label as Size,
      mInset.size,
      mInset.proportion as Proportion,
      (mLabel.variant ?? 'compressed') as 'compressed' | 'default',
    )
    pairings.push({
      name: `recipe/square-${matchId.replace(/^eds\./, '')}`,
      collection: 'density',
      values: Object.fromEntries(
        geo.map((g) => [g.density, g.heightPx]),
      ) as Record<Density, number>,
      codeSyntax: `calc(var(--eds-spacing-inset-${mInset.size}-vertical-${mInset.proportion}) * 2 + var(--eds-cap-rounded-${mLabel.label}))`,
      description: `${contract.id}: the collapsed rail width = ${matchId}'s square edge (its height, which is also its collapsed width). Resolved because Figma cannot calc; CSS composes it live.`,
    })
  }

  const structural: StructuralVariant[] = (contract.variants ?? [])
    .filter((v: any) => v.structure)
    .map((v: any) => ({ when: v.when, ...v.structure }))

  return {
    contract,
    geometry,
    pairings,
    geometryBySize,
    sizeAxis,
    structural,
    refs,
  }
}

/** The disposition ledger — every fact, and what each renderer did with it. */
export function ledger(r: ResolvedContract): LedgerEntry[] {
  const c = r.contract
  const out: LedgerEntry[] = []
  if (c.semantics?.element === 'table' && r.sizeAxis) {
    out.push({
      fact: `size axis (${r.sizeAxis.values.join('/')}) — rows recompute per cell`,
      css: 'CARRIED',
      figma: 'LOWERED',
      note:
        'CSS: the data-size attribute repoints the five size channels and ' +
        'every height recomputes (24/36/44 default, 20/24/36 compressed). ' +
        'Figma: the canvas table ships the Default size only until the ' +
        'table builder learns per-variant cell bindings (queued in SCOPE).',
    })
  }
  if (r.geometry) {
    out.push({
      fact: 'height = inset × 2 + cap(label) — never authored',
      css: 'CARRIED',
      figma: 'RESOLVED',
      note: `CSS keeps the calc; Figma gets baked padding (${r.geometry.map((g) => g.paddingPx).join('/')}) and hug reproduces the height (${r.geometry.map((g) => g.heightPx).join('/')}).`,
    })
  }
  const optical = c.anatomy.root.inset?.opticalLabel
  if (optical && c.anatomy[optical]?.typography?.variant === 'default') {
    out.push({
      fact: 'read text is trimmed to the cap box (text-box)',
      css: 'CARRIED',
      figma: 'REFUSED',
      note:
        'CSS: text-box: trim-both ex alphabetic + padding-top ' +
        'round(1cap,4px)−1ex on the message (codepen VYmaowY) — the occupied ' +
        'box is exactly the ROUNDED cap and the BASELINE lands on the 4px ' +
        'grid; root padding = the raw inset (@supports-gated; the fallback ' +
        'keeps the half-leading subtraction — one switch flips all of it). ' +
        'Figma cannot trim — a recorded, bounded divergence: strip heights ' +
        'agree at every line count.',
    })
  }
  for (const [partName, part] of Object.entries<any>(c.anatomy)) {
    if (part.glyph && part.footprint) {
      out.push({
        fact: `${partName} is a glyph: footprint = cap box, ink overflows`,
        css: 'CARRIED',
        figma: 'LOWERED',
        note:
          'CSS: margin = (footprint − glyph)/2, negative, travels with the element; ' +
          'Figma: footprint-sized auto-layout container, glyph in flow, centered, clip off.',
      })
    }
    if (part.corner && part.instance) {
      out.push({
        fact: `${partName} IS the ${part.instance.component} — cap box on the corner, plate overflows like ink`,
        css: 'CARRIED',
        figma: 'LOWERED',
        note:
          'Composition, not imitation: the instance brings its own hover ' +
          'plate, focus ring and accessible-name guard. CSS: align-self ' +
          'start + auto inline margin, negative margins = the declared ' +
          'overhang; Figma: absolute, top-right constraints (bounded ' +
          'divergence: absolute offsets are not variable-bindable).',
      })
    }
    if (part.element) {
      out.push({
        fact: `${partName} styles <${part.element}> — rows and cells, not classes`,
        css: 'CARRIED',
        figma: 'LOWERED',
        note:
          'CSS: nested element rules (rows/cells cannot be classed per ' +
          'instance); Figma: the generated grid demo, column-major so ' +
          'columns align. Density means MORE ROWS, not narrower tables.',
      })
    }
    if (part.control) {
      out.push({
        fact: `${partName} is the native control inside a field wrapper`,
        css: 'CARRIED',
        figma: 'LOWERED',
        note:
          'An <input> cannot contain children, so the root is a wrapper and ' +
          'states read THROUGH the control: :has(:disabled), ' +
          ':has(:user-invalid), :focus-within. The control is reset flat and ' +
          'inherits the wrapper. Figma: a text node stands in.',
      })
    }
    if (part.instance) {
      out.push({
        fact: `${partName} is an instance of ${part.instance.component} (composition-lite)`,
        css: 'CARRIED',
        figma: 'LOWERED',
        note:
          'CSS: a slot — the consumer places the component; Figma: an exposed ' +
          'instance of the generated set, so its own props stay reachable.',
      })
    }
    if (part.pointer) {
      out.push({
        fact: `${partName} is the pointer: root fill, cap-derived, opposite the placement`,
        css: 'CARRIED',
        figma: 'LOWERED',
        note:
          'CSS: a ::before — width = cap box, protrusion = cap/2, positioned by ' +
          'the data-placement attribute; Figma: a triangle in the placement wrapper, ' +
          'rotated toward the anchor.',
      })
    }
  }
  for (const p of c.props) {
    if (p.type.enum)
      out.push({
        fact: `prop ${p.name} (${p.type.enum.join('|')})`,
        css: 'CARRIED',
        figma: 'LOWERED',
        note: `CSS: [data-<axis>='<value>'] attributes, default = attribute absent (ADR-0006); Figma: ${p.bindings.figma.property} variant axis.`,
      })
    if (p.type.text)
      out.push({
        fact: `prop ${p.name} (text)`,
        css: 'CARRIED',
        figma: 'LOWERED',
        note: 'CSS: element content; Figma: TEXT component property.',
      })
    if (p.type.boolean)
      out.push({
        fact: `prop ${p.name} (boolean)`,
        css: 'CARRIED',
        figma: 'LOWERED',
        note: 'CSS: presence of the slot; Figma: BOOLEAN property toggling layer visibility.',
      })
  }
  for (const p of c.props ?? []) {
    if (!p.bindings?.code?.inherit) continue
    out.push({
      fact: `${p.name} cascades from any ancestor`,
      css: 'CARRIED',
      figma: 'LOWERED',
      note:
        'CSS: one attribute on the container flips every item ' +
        `([data-${p.name}] * matches descendants). Figma cannot reach ` +
        "consumer SLOT content (instance content is the instance's own — " +
        'the slots model): baked defaults mirror the variant; edited slots ' +
        'are flipped WITH the rail by multi-select.',
    })
  }
  if (c.anatomy.root.endline) {
    out.push({
      fact: 'inline-end edge: the underline, rotated',
      css: 'CARRIED',
      figma: 'CARRIED',
      note:
        'CSS: an OUTER box-shadow on the inline-end edge (geometry ' +
        'untouched, and full-bleed items cannot paint over it); Figma: an ' +
        'OUTSIDE stroke, strokeRightWeight variable-bound — an inside ' +
        "stroke disappears behind the slot's full-bleed children " +
        "(Victor's catch, 2026-09-05). Shared rule with the top bar " +
        '(thick, subtle).',
    })
  }
  if (c.anatomy.root.bleedGuard) {
    out.push({
      fact: 'bleed guard: the panel pads its block ends by ITS OWN radius',
      css: 'CARRIED',
      figma: 'CARRIED',
      note:
        'Same token as the corner radius, so full-bleed item fills can ' +
        'never clip the rounded corners; the sides stay unpadded — items ' +
        'run edge to edge.',
    })
  }
  if (c.anatomy.root.baseline) {
    out.push({
      fact: 'the text sits ON the baseline grid — the box is the cap cell',
      css: 'CARRIED',
      figma: 'CARRIED',
      note:
        'CSS: text-box trim-both ex alphabetic + padding-top ' +
        'round(1cap,4px)−1ex, @supports-gated (fallback: the untrimmed ' +
        'line box). Figma (the La Dupla mechanism): leadingTrim ' +
        'CAP_HEIGHT + FILL width, and a FIGMA-ONLY top pad ' +
        '(capRounded − rawCap per density — a minted value code must ' +
        'NEVER read). An n-line text measures capRounded + (n−1)·lineHeight ' +
        'on BOTH surfaces — exact at every line count, with ' +
        "Inter's own cap metric (1490/2048): the first CARRIED " +
        "trim — 'Figma cannot trim' was wrong (issue #40).",
    })
  }
  if (c.anatomy.root.collapsedWidth) {
    out.push({
      fact: `collapsed width = ${c.anatomy.root.collapsedWidth.matches}'s square edge`,
      css: 'CARRIED',
      figma: 'RESOLVED',
      note:
        "The rail is exactly as wide as its squares are tall (inset×2 + " +
        'cap). CSS composes the calc live; Figma binds the minted ' +
        'per-density value to the collapsed variants. Collapsed, only the ' +
        'matched item kind remains: CSS hides other children; Figma hides ' +
        'seeds that cannot mirror the axis (their submenu floats).',
    })
  }
  for (const [pn, pt] of Object.entries<any>(c.anatomy)) {
    if (!pt.figmaSlot || !pt.seed) continue
    out.push({
      fact: `${pn}: a true SLOT — designers add as many children as they want`,
      css: 'CARRIED',
      figma: 'CARRIED',
      note:
        `Slots GA'd June 2026. CSS: the root's children ARE the content; ` +
        `Figma: a SLOT node seeded with ${pt.seed.length} representative ` +
        'instances (demo content, freely replaced per instance).',
    })
  }
  if (c.anatomy.root.indent) {
    out.push({
      fact: `leading indent aligns the label with ${c.anatomy.root.indent.alignsWith}'s label`,
      css: 'CARRIED',
      figma: 'RESOLVED',
      note:
        'parent inset + icon cap cell + icon gap. CSS composes the calc ' +
        'live; Figma gets the minted per-density value. The alignment rule ' +
        'survives any future change to its three inputs.',
    })
  }
  for (const [partName, part] of Object.entries<any>(c.anatomy)) {
    if (!part.flag) continue
    out.push({
      fact: `${partName}: corner flag marks the submenu on the collapsed square`,
      css: 'CARRIED',
      figma: 'CARRIED',
      note:
        'Legs = the xs spacing rung. CSS: an ::after pseudo (clip-path ' +
        'triangle) — emitter-owned decoration, no markup to get wrong; ' +
        'Figma: a corner-constrained vector, size variable-bound, corner ' +
        'offset baked (absolute offsets are not bindable — bounded).',
    })
  }
  if (c.anatomy.root.inset?.seat) {
    out.push({
      fact: 'seated container: vertical inset = the seat rung (xs), raw',
      css: 'CARRIED',
      figma: 'CARRIED',
      note:
        'The spacing taxonomy, one relation per rung: page xl → container md ' +
        '→ cluster sm → seat xs. Controls carry no half-leading, so nothing ' +
        'is compensated (the icon-only precedent). Height = tallest seated ' +
        'control + 2×seat, emergent on both surfaces (CSS content box, ' +
        'Figma hug).',
    })
  }
  for (const cl of [
    ...new Set(
      Object.values<any>(c.anatomy)
        .map((p) => p.cluster)
        .filter(Boolean),
    ),
  ]) {
    const members = Object.entries<any>(c.anatomy)
      .filter(([, p]) => p.cluster === cl)
      .map(([n]) => n)
    out.push({
      fact: `cluster '${cl}' (${members.join(', ')}): within-group gap = the sm rung`,
      css: 'CARRIED',
      figma: 'CARRIED',
      note:
        'One rung below the container gap — grouping must read tighter than ' +
        'separation (Gestalt), and boxes that bring their own inset need ' +
        'less air added (the optical argument). CSS: a consumer-marked ' +
        'wrapper element; Figma: an auto-layout frame, gap bound to sm.',
    })
  }
  if (c.anatomy.root.tokens?.['placeholder-color']) {
    out.push({
      fact: 'placeholder ink',
      css: 'CARRIED',
      figma: 'LOWERED',
      note:
        'CSS: ::placeholder styled from its own channel; typed text keeps the ' +
        'value ink. Figma: the canvas component PRESENTS the empty field, so ' +
        'its value text wears the placeholder ink (2026-09-04, was REFUSED — ' +
        "Victor's hand mock bound a low ink on the demo text; the typed-state " +
        'ink stays CSS-only).',
    })
  }
  for (const v of c.variants ?? []) {
    if (!v.structure) continue
    const pin = Object.entries(v.when)
      .map(([k, val]) => `${k}=${val}`)
      .join(', ')
    out.push({
      fact: `${pin} is icon-only: padding = inset, a circle by construction`,
      css: 'CARRIED',
      figma: 'LOWERED',
      note:
        'No text, so no half-leading to compensate — the optical correction drops out. ' +
        'CSS: the variant attribute zeroes --_half-leading and squares the insets; ' +
        'Figma: even inset binds, pill radius, only the icon part is built.',
    })
    if (['button', 'a', 'input'].includes(c.semantics.element)) {
      out.push({
        fact: `${pin} requires an accessible name`,
        css: 'RESOLVED',
        figma: 'LOWERED',
        note:
          'No text child names the control. CSS: a zero-specificity guard paints any ' +
          'icon-only control missing aria-label/aria-labelledby with a dashed danger ' +
          'outline — the omission is visible, never silent. ' +
          'Figma: the component description carries the requirement.',
      })
    }
  }
  // the state notes name the ACTUAL selector the CSS emitter writes —
  // 'selected' is an ARIA attribute, not a pseudo-class (Victor's catch,
  // 2026-09-07: the ledger claimed :selected), and wrappers read the
  // platform's truth through their control via :has().
  const hasControl = Object.values<any>(c.anatomy).some((p: any) => p.control)
  // mirror the emitter: the declared semantics.aria pick the attribute(s)
  const declaredAria = Object.keys(c.semantics?.aria ?? {})
  const selParts = [
    declaredAria.includes('aria-current') && '[aria-current]',
    declaredAria.includes('aria-pressed') && "[aria-pressed='true']",
    declaredAria.includes('aria-selected') && "[aria-selected='true']",
    declaredAria.includes('aria-checked') && "[aria-checked='true']",
  ].filter(Boolean) as string[]
  const selAttr =
    selParts.length > 1
      ? `:is(${selParts.join(', ')})`
      : selParts[0] === '[aria-current]'
        ? '[aria-current] (omit the attribute when not current)'
        : (selParts[0] ??
          (c.semantics?.element === 'button' && !c.semantics?.role
            ? "[aria-pressed='true']"
            : "[aria-selected='true']"))
  const stateCss = (name: string) =>
    name === 'selected'
      ? `${selAttr} — an ARIA state, not a pseudo-class`
      : name === 'invalid'
        ? hasControl
          ? ':has(:user-invalid) — the platform validates, the wrapper reads through the control'
          : ':user-invalid'
        : name === 'disabled'
          ? hasControl
            ? ':has(:disabled) — read through the control'
            : ':disabled'
          : `:${name}`
  for (const s of c.states) {
    out.push({
      fact: `state ${s.name}`,
      css: 'CARRIED',
      figma: s.name === 'focus' ? 'REFUSED' : 'LOWERED',
      note:
        (s.name === 'focus'
          ? "CSS: :focus-visible — the ring is the PLATFORM's, not a designable " +
            'state. A canvas has no keyboard; nobody instantiates State=Focus. ' +
            "Refused, not lowered (Marco Krenn's point, 2026-08-30)."
          : s.name === 'disabled'
            ? `CSS: ${stateCss('disabled')}; Figma: State variant (no interactivity on canvas).`
            : `CSS: ${stateCss(s.name)}; Figma: State variant.`) +
        (s.when
          ? ` Gated: only ${Object.entries(s.when)
              .map(([k, v]) => `${k}=${v}`)
              .join(', ')}.`
          : ''),
    })
    // The gate's flip side: the state is REFUSED, not silently absent, for
    // every other value of the gating prop — the ladder has no rung there.
    for (const [prop, value] of Object.entries<string>(s.when ?? {})) {
      const p = c.props.find((x: any) => x.name === prop)
      for (const other of (p?.type.enum ?? []).filter(
        (v: string) => v !== value,
      )) {
        out.push({
          fact: `state ${s.name} for ${prop}=${other}`,
          css: 'REFUSED',
          figma: 'REFUSED',
          note: `The gated tokens change nothing for ${prop}=${other} — the contract refuses to invent a binding it does not have.`,
        })
      }
    }
  }
  out.push({
    fact: `semantics: <${c.semantics.element}>${c.semantics.role ? ` role=${c.semantics.role}` : ''}`,
    css: 'CARRIED',
    figma: 'REFUSED',
    note: 'A canvas has no accessibility tree. Refused, not dropped — the fact stays in the contract.',
  })
  return out
}
