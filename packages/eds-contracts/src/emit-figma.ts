/** Contract → Figma build plan. Figma gets resolved numbers where it cannot compute
 *  (the pairing variables) and variable NAMES everywhere else — bindings, never hexes.
 *  States and enum props are LOWERED to variant axes; the size axis additionally
 *  parameterizes the structural bindings per value (`bySize`). The plan is pure data;
 *  the generic builder (emit-builder.ts) interprets it — one interpreter, any component. */
import {
  pickRef,
  propCombos,
  resolveContract,
  type ResolvedContract,
} from './resolve.ts'

const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

export type PlanPart =
  | {
      kind: 'glyph'
      name: string
      swap?: { property?: string; componentKey: string }
      /** glyph identity follows an enum prop: each variant places its value's
       *  component (the spec's glyphSwaps carries the resolved key) */
      swapByProp?: {
        prop: string
        glyphs: Record<string, { componentKey: string; icon: string }>
      }
      /** the part is a real control anchored to the corner (banner dismiss):
       *  top-aligned; the root gets a fixed width and the text fills */
      corner?: boolean
    }
  | {
      kind: 'text'
      name: string
      defaultText: string
      /** absorbs the spare inline space — the contract owns the distribution */
      fill?: boolean
      /** baseline-grid text: leadingTrim CAP_HEIGHT — Figma CAN trim */
      trim?: boolean
    }
  | {
      kind: 'slot'
      name: string
      /** absorbs the spare space on the root's main axis */
      fill?: boolean
      /** the slot IS a cluster: internal gap = the sm rung */
      cluster?: string
      /** demo content: instances placed inside the slot */
      seed?: { component: string; overrides?: Record<string, string> }[]
    }
  | { kind: 'pointer'; name: string }
  | {
      /** corner triangle indicator — built only in iconOnly variants */
      kind: 'flag'
      name: string
      corner: 'bottom-right'
    }
  | {
      kind: 'instance'
      name: string
      component: string
      overrides?: Record<string, string>
      corner?: boolean
      /** cluster membership: wrapped with siblings, gap = the sm rung */
      cluster?: string
      /** authored inline size for the placed instance */
      width?: number
    }

/** Structural bindings for one size-axis value. Every field is a capability:
 *  a component without an inset has no paddings, one without typography has
 *  no label binds, and so on. */
export type SizeBinds = {
  paddingBlock?: string
  paddingInline?: string
  /** derived leading indent (recipe var) — overrides paddingLeft only */
  indentVar?: string
  /** the raw (uncorrected) inset — icon-only variants pad with this on all sides */
  insetVar?: string
  gap?: string
  label?: Record<string, string>
  glyphs: Record<string, { containerVar: string; glyphVar: string; containerHVar?: string }>
}

export type FigmaPlan = {
  component: string
  requiredVariables: {
    name: string
    collection: string
    values: Record<string, number>
    codeSyntax: string
    description: string
  }[]
  componentSet: {
    name: string
    description: string
    axes: Record<string, string[]>
    textProps: { property: string; default: string; part: string }[]
    booleanProps: {
      property: string
      default: boolean
      part: string
      /** all gated parts when the boolean gates more than one */
      parts?: string[]
    }[]
    root: {
      layout: 'HORIZONTAL' | 'VERTICAL'
      align: 'CENTER' | 'MIN' | 'MAX' | 'BASELINE'
      radiusVar?: string
      strokeWeightVar: string
      /** the part is a RULE (divider): plain component, height bound, no layout */
      rule?: { thicknessVar: string }
      /** border-bottom underline weight (defaults to sizing/stroke-thick) */
      underlineVar?: string
      /** a fill part needs an edge to fill to: demo width for the set's
       *  variants (instances resize freely) */
      fixedWidth?: number
      /** demo block size for containers whose real height is the app's */
      fixedHeight?: number
      /** inline-end edge weight (the sidebar's right border) */
      endlineVar?: string
      /** bleed guard: block padding bound to the root's OWN radius */
      bleedGuard?: boolean
      /** baseline-grid caption (the La Dupla mechanism): a FIGMA-ONLY top
       *  pad (capRounded − rawCap, negative allowed) lands the trimmed,
       *  wrapping text on the grid — multi-line grows correctly */
      baselinePad?: string
    }
    parts: PlanPart[]
    /** table grid demo: column-major so columns align; cell padding keeps the
     *  invariant so density means MORE ROWS, not narrower tables */
    table?: {
      columns: string[]
      rows: string[][]
      cellPadV: string
      cellPadH: string
      headerLabel: Record<string, string>
      cellLabel: Record<string, string>
      headerBorder: string
      cellBorder: string
      headerFg: string
      cellFg: string
      selectedBg: string
    }
    /** the bubble pointer: width = cap box, protrusion = half (both resolved
     *  as density variables); each variant carries its side + alignment */
    pointer?: { prop: string; widthVar: string; heightVar: string }
    /** keyed by capitalized size-axis value; 'Default' when no axis */
    bySize: Record<string, SizeBinds>
    variants: {
      /** '' for a single-variant component — the builder ships a plain COMPONENT */
      name: string
      size: string
      bg?: string
      fg?: string
      border?: string
      borderBottom?: string
      /** inline-end edge colour (the sidebar's right border) */
      borderRight?: string
      /** collapsed variants: width bound to the matched square-edge recipe */
      widthVar?: string
      iconFg?: string
      ring?: { colorVar: string; widthVar: string }
      /** an effect style name (elevation/low) — shadows are styles, not variables */
      effect?: string
      /** structural override: build only this part, pad with insetVar all sides */
      iconOnly?: string
      /** structural override: per-variant radius (icon-only rounds are pills) */
      radiusVar?: string
      /** pointer placement: which edge the arrow sits on and how it aligns */
      pointer?: {
        side: 'top' | 'bottom' | 'left' | 'right'
        align: 'start' | 'center' | 'end'
      }
      /** value-gated parts hidden in THIS variant (whenValue mismatches) */
      hideParts?: string[]
      /** swapByProp resolution: part name → this variant's component key */
      glyphSwaps?: Record<string, string>
      /** per-part ink overrides where a glyph's colour differs from iconFg */
      glyphFg?: Record<string, string>
    }[]
  }
}

export function emitFigmaPlan(r: ResolvedContract): FigmaPlan {
  const c = r.contract
  const inset = c.anatomy.root.inset
  // The text part: the optical label when the inset names one, otherwise the
  // first part that declares typography (a component may have neither).
  const textEntry: [string, any] | undefined = inset?.opticalLabel
    ? [inset.opticalLabel, c.anatomy[inset.opticalLabel]]
    : Object.entries<any>(c.anatomy).find(([, p]) => p.typography)
  const labelName = textEntry?.[0]
  const t = textEntry?.[1]?.typography
  const enumProps = c.props.filter((p: any) => p.type.enum)
  // Focus is REFUSED on canvas (Marco Krenn's point, 2026-08-30): a canvas
  // has no keyboard, nobody instantiates State=Focus — the ring is the
  // platform's, carried by CSS alone. Names dedupe: a state may be split
  // into an ungated + a gated entry (disabled's contained-only plate).
  const states = [
    'default',
    ...[...new Set<string>(c.states.map((s: any) => s.name))].filter(
      (n) => n !== 'focus',
    ),
  ]
  const axisProp = r.sizeAxis?.prop

  const fv = (key: string, ctx: Record<string, string> = {}) => {
    const hit = pickRef(r.refs, key, ctx)
    if (!hit)
      throw new Error(`no resolved ref for ${key} @ ${JSON.stringify(ctx)}`)
    return hit.figmaVar
  }

  const variants: FigmaPlan['componentSet']['variants'] = []
  for (const ctx of propCombos(c.props)) {
    for (const state of states) {
      // A gated state exists only for matching combos — skipping (not falling
      // back to resting bindings) keeps a lying look-alike variant out. A
      // split state (ungated + gated entries) is never skipped: the ungated
      // half applies everywhere, the gated refs simply don't resolve.
      const entries = c.states.filter((s: any) => s.name === state)
      if (
        entries.length > 0 &&
        entries.every(
          (e: any) =>
            e.when && Object.entries(e.when).some(([k, v]) => ctx[k] !== v),
        )
      )
        continue
      const axisName = enumProps
        .flatMap((p: any) => {
          const split = p.bindings.figma.split
          if (!split) return [`${cap(p.name)}=${cap(ctx[p.name])}`]
          // one code value, several Figma axes (top-start → Side=Top, Align=Start)
          const parts = ctx[p.name].split(split.separator)
          return split.axes.map(
            (axis: string, i: number) => `${axis}=${cap(parts[i] ?? split.pad)}`,
          )
        })
        .join(', ')
      const border =
        (state !== 'default' &&
          pickRef(r.refs, `root/border-color:${state}`, ctx)) ||
        pickRef(r.refs, 'root/border-color', ctx)
      // A state's tokens define what CHANGES; anything it does not mention
      // falls back to the resting binding (focus changes only the ring).
      const bg =
        (state !== 'default' &&
          pickRef(r.refs, `root/background-color:${state}`, ctx)) ||
        pickRef(r.refs, 'root/background-color', ctx)
      // A root with a placeholder channel PRESENTS the empty field on canvas:
      // the value text wears the placeholder ink unless the state carries its
      // own override (disabled). Typed-text ink is CSS's fact (ledger: LOWERED).
      const phRef = pickRef(r.refs, 'root/placeholder-color', ctx)
      const fgRef = labelName
        ? (state !== 'default' &&
            pickRef(r.refs, `${labelName}/color:${state}`, ctx)) ||
          phRef ||
          pickRef(r.refs, `${labelName}/color`, ctx)
        : undefined
      const effect =
        (state !== 'default' &&
          pickRef(r.refs, `root/elevation:${state}`, ctx)) ||
        pickRef(r.refs, 'root/elevation', ctx)
      const ring =
        state === 'focus' ? pickRef(r.refs, 'root/focus-ring:focus') : undefined
      const borderBottom =
        (state !== 'default' &&
          pickRef(r.refs, `root/border-bottom-color:${state}`, ctx)) ||
        pickRef(r.refs, 'root/border-bottom-color', ctx)
      const glyphPart = Object.entries<any>(c.anatomy).find(
        ([n, p]) => n !== 'root' && p.glyph && p.footprint,
      )
      const iconFg = glyphPart
        ? (state !== 'default' &&
            pickRef(r.refs, `${glyphPart[0]}/color:${state}`, ctx)) ||
          pickRef(r.refs, `${glyphPart[0]}/color`, ctx)
        : undefined
      const structure = r.structural.find((sv) =>
        Object.entries(sv.when).every(([k, v]) => ctx[k] === v),
      )
      const pointerEntry = Object.entries<any>(c.anatomy).find(
        ([, p]) => p.pointer,
      )
      const placementValue = pointerEntry
        ? ctx[pointerEntry[1].pointer.prop]
        : undefined
      const [pSide, pAlign = 'center'] = (placementValue ?? '').split('-')
      const hideParts = Object.entries<any>(c.anatomy)
        .filter(
          ([, p]) => p.whenValue && ctx[p.whenValue.prop] !== p.whenValue.value,
        )
        .map(([n]) => n)
      // swapByProp: this variant's glyph is the enum value's component.
      const glyphSwaps: Record<string, string> = {}
      for (const [n, p] of Object.entries<any>(c.anatomy)) {
        if (!p.swapByProp) continue
        const g = p.swapByProp.glyphs[ctx[p.swapByProp.prop]]
        if (g) glyphSwaps[n] = g.componentKey
      }
      // Glyph parts past the first may carry their OWN ink (banner dismiss
      // stays neutral while the tone icon follows the tone).
      const glyphFg: Record<string, string> = {}
      for (const [n, p] of Object.entries<any>(c.anatomy)) {
        if (n === 'root' || !p.glyph || !p.footprint || n === glyphPart?.[0])
          continue
        const own =
          (state !== 'default' && pickRef(r.refs, `${n}/color:${state}`, ctx)) ||
          pickRef(r.refs, `${n}/color`, ctx)
        if (own && own.figmaVar !== iconFg?.figmaVar)
          glyphFg[n] = own.figmaVar
      }
      variants.push({
        // no states → no State axis; no axes at all → '' (a single component)
        name: [axisName, c.states.length > 0 ? `State=${cap(state)}` : '']
          .filter(Boolean)
          .join(', '),
        size: axisProp ? cap(ctx[axisProp]) : 'Default',
        ...(bg ? { bg: bg.figmaVar } : {}),
        ...(fgRef ? { fg: fgRef.figmaVar } : {}),
        ...(effect ? { effect: effect.figmaVar } : {}),
        ...(iconFg ? { iconFg: iconFg.figmaVar } : {}),
        // focus REPLACES the border, mirroring :focus-visible replacing the outline
        ...(border && !ring ? { border: border.figmaVar } : {}),
        ...(borderBottom ? { borderBottom: borderBottom.figmaVar } : {}),
        ...((() => {
          const brRef = pickRef(r.refs, 'root/border-right-color', ctx)
          return brRef ? { borderRight: brRef.figmaVar } : {}
        })()),
        ...(ctx['collapsed'] === 'true' ? { collapsed: true } : {}),
        ...(c.anatomy.root.collapsedWidth && ctx['collapsed'] === 'true'
          ? {
              widthVar: `recipe/square-${c.anatomy.root.collapsedWidth.matches.replace(/^eds\./, '')}`,
            }
          : {}),
        ...(ring
          ? {
              ring: {
                colorVar: ring.figmaVar,
                widthVar: 'sizing/stroke-thick',
              },
            }
          : {}),
        ...(structure
          ? {
              iconOnly: structure.iconOnly,
              ...(structure.radius
                ? { radiusVar: fv('root/radius', ctx) }
                : {}),
            }
          : {}),
        ...(placementValue
          ? { pointer: { side: pSide as any, align: pAlign as any } }
          : {}),
        ...(hideParts.length > 0 ? { hideParts } : {}),
        ...(Object.keys(glyphSwaps).length > 0 ? { glyphSwaps } : {}),
        ...(Object.keys(glyphFg).length > 0 ? { glyphFg } : {}),
      })
    }
  }

  const parts: PlanPart[] = []
  for (const [name, part] of Object.entries<any>(c.anatomy)) {
    if (name === 'root') continue
    if (part.figmaSlot) {
      parts.push({
        kind: 'slot',
        name,
        ...(part.fill ? { fill: true } : {}),
        ...(part.cluster ? { cluster: part.cluster } : {}),
        ...(part.seed ? { seed: part.seed } : {}),
      })
    } else if (part.pointer) {
      parts.push({ kind: 'pointer', name })
    } else if (part.flag) {
      parts.push({ kind: 'flag', name, corner: part.flag.corner })
    } else if (part.instance) {
      parts.push({
        kind: 'instance',
        name,
        component: part.instance.component,
        ...(part.instance.overrides
          ? { overrides: part.instance.overrides }
          : {}),
        ...(part.instance.collapsedOverrides
          ? { collapsedOverrides: part.instance.collapsedOverrides }
          : {}),
        ...(part.corner ? { corner: true } : {}),
        ...(part.cluster ? { cluster: part.cluster } : {}),
        ...(part.width ? { width: part.width } : {}),
      })
    } else if (part.glyph && part.footprint) {
      parts.push({
        kind: 'glyph',
        name,
        ...(part.swap ? { swap: part.swap } : {}),
        ...(part.swapByProp ? { swapByProp: part.swapByProp } : {}),
        ...(part.corner ? { corner: true } : {}),
      })
    } else if (part.typography) {
      parts.push({
        kind: 'text',
        name,
        defaultText:
          c.props.find((p: any) => p.bindings.figma.kind === 'TEXT')?.default ??
          name,
        ...(part.fill || c.anatomy.root.baseline ? { fill: true } : {}),
        ...(c.anatomy.root.baseline ? { trim: true } : {}),
      })
    }
  }

  // Structural bindings per size-axis value (single 'Default' entry without an axis).
  const sizeEntries: [
    string,
    { inset?: string; label?: string },
    Record<string, string>,
  ][] = r.sizeAxis
    ? r.sizeAxis.values.map((v: string) => [
        cap(v),
        r.sizeAxis!.map[v],
        { [axisProp!]: v },
      ])
    : [['Default', { inset: inset?.size, label: t?.label }, {}]]
  const bySize: Record<string, SizeBinds> = {}
  for (const [key, p, ctx] of sizeEntries) {
    const glyphs: SizeBinds['glyphs'] = {}
    const reading =
      inset?.opticalLabel &&
      c.anatomy[inset.opticalLabel]?.typography?.variant === 'default'
    for (const part of parts) {
      if (part.kind !== 'glyph') continue
      glyphs[part.name] = {
        containerVar: fv(`${part.name}/footprint`, ctx),
        glyphVar: fv(`${part.name}/glyph`, ctx),
        // Reading + start-aligned: the container becomes the first LINE BOX
        // tall (glyph centered in it), so top-alignment seats the icon on
        // the first line — Figma's mirror of the CSS trim seat.
        ...(reading && c.anatomy.root.layout?.align === 'start' && t?.label
          ? { containerHVar: `typography/line-height/${t.variant}/${t.label}` }
          : {}),
      }
    }
    bySize[key] = { glyphs }
    if (p.inset) {
      // Optical inset: the vertical padding is the resolved pairing variable.
      // Plain inset (no optical label): the raw inset on both axes.
      // A size value may override the proportion (the table's compressed
      // size drops squared to squished) — same rule as the resolver.
      const proportion = (p as any).proportion ?? inset.proportion
      const samePair = p.label === p.inset
      const leading = c.anatomy[inset.opticalLabel]?.typography?.variant
      const leadingSuffix =
        leading && leading !== 'compressed' ? `-${leading}-leading` : ''
      bySize[key].paddingBlock = inset.seat
        ? // seated container: cross-axis = the SEAT rung (xs), raw
          `spacing/vertical-xs`
        : inset.opticalLabel
          ? (samePair
              ? `recipe/optical-padding-${p.inset}-${proportion}`
              : `recipe/optical-padding-${p.inset}-${proportion}-${p.label}-label`) +
            leadingSuffix
          : `spacing/inset-${p.inset}-vertical-${proportion}`
      bySize[key].paddingInline = `spacing/inset-${p.inset}-horizontal`
      if (c.anatomy.root.indent)
        bySize[key].indentVar =
          `recipe/indent-${c.id.replace(/^eds\./, '')}`
      bySize[key].insetVar = inset.seat
        ? `spacing/vertical-xs`
        : `spacing/inset-${p.inset}-vertical-${proportion}`
    }
    if (c.anatomy.root.bleedGuard) {
      // the bleed guard: block padding bound to the root's OWN radius
      bySize[key].paddingBlock = fv('root/radius')
    }
    if (c.anatomy.root.layout?.gap) {
      const g = pickRef(r.refs, 'root/gap', {})!
      bySize[key].gap = p.label
        ? g.figmaVar.replace(/icon-[a-z0-9]+-gap/, `icon-${p.label}-gap`)
        : g.figmaVar
    }
    if (t && p.label)
      bySize[key].label = {
        fontFamily: `typography/font-family/${t.family}`,
        fontWeight: `font-weight/${t.weight}`,
        fontSize: `typography/font-size/${p.label}`,
        lineHeight: `typography/line-height/${t.variant}/${p.label}`,
      }
  }

  // Pairings, deduped by name (both sizes may share the same-pair token).
  const requiredVariables = [
    ...new Map(r.pairings.map((p) => [p.name, p])).values(),
  ]

  return {
    component: c.id,
    requiredVariables,
    componentSet: {
      name: cap(c.id.split('.')[1]),
      description: `${c.description}\n\nGenerated from ${c.id} v${c.version} — edit the contract, not this component.`,
      axes: Object.fromEntries([
        ...enumProps.flatMap((p: any) => {
          const split = p.bindings.figma.split
          if (!split) return [[cap(p.name), p.type.enum.map(cap)]]
          return split.axes.map((axis: string, i: number) => [
            axis,
            [
              ...new Set<string>(
                p.type.enum.map((v: string) =>
                  cap(v.split(split.separator)[i] ?? split.pad),
                ),
              ),
            ],
          ])
        }),
        ['State', states.map(cap)],
      ]),
      textProps: c.props
        .filter((p: any) => p.bindings.figma.kind === 'TEXT')
        .map((p: any) => ({
          property: p.bindings.figma.property,
          default: p.default,
          part: labelName,
        })),
      booleanProps: c.props
        .filter((p: any) => p.bindings.figma.kind === 'BOOLEAN')
        .map((p: any) => {
          // every part the boolean gates (the sidebar item's hasMenu gates
          // both the chevron and the collapsed flag)
          const gated = Object.entries<any>(c.anatomy)
            .filter(([, part]) => part.when === p.name)
            .map(([n]) => n)
          return {
            property: p.bindings.figma.property,
            default: p.default,
            part: gated[0] ?? p.name,
            ...(gated.length > 1 ? { parts: gated } : {}),
          }
        }),
      ...(() => {
        if (c.semantics.element !== 'table') return {}
        const th = Object.entries<any>(c.anatomy).find(
          ([, p]) => p.element === 'th',
        )!
        const td = Object.entries<any>(c.anatomy).find(
          ([, p]) => p.element === 'td',
        )!
        const lab = (ty: any) => ({
          fontFamily: `typography/font-family/${ty.family}`,
          fontWeight: `font-weight/${ty.weight}`,
          fontSize: `typography/font-size/${ty.label}`,
          lineHeight: `typography/line-height/${ty.variant}/${ty.label}`,
        })
        return {
          table: {
            columns: c.demo.columns,
            rows: c.demo.rows,
            cellPadV: bySize.Default.paddingBlock!,
            cellPadH: bySize.Default.paddingInline!,
            headerLabel: lab(th[1].typography),
            cellLabel: lab(td[1].typography),
            headerBorder: fv(`${th[0]}/border-bottom-color`),
            cellBorder: fv(`${td[0]}/border-bottom-color`),
            headerFg: fv(`${th[0]}/color`),
            cellFg: fv(`${td[0]}/color`),
            selectedBg: fv('row/background-color:selected'),
          },
        }
      })(),
      ...(() => {
        const pe = Object.entries<any>(c.anatomy).find(([, p]) => p.pointer)
        return pe && t
          ? {
              pointer: {
                prop: pe[1].pointer.prop,
                widthVar: `recipe/cap-rounded-${t.label}`,
                heightVar: `recipe/pointer-${t.label}`,
              },
            }
          : {}
      })(),
      root: {
        layout:
          c.anatomy.root.layout?.direction === 'column'
            ? 'VERTICAL'
            : 'HORIZONTAL',
        align: (
          {
            center: 'CENTER',
            start: 'MIN',
            end: 'MAX',
            baseline: 'BASELINE',
          } as const
        )[(c.anatomy.root.layout?.align ?? 'center') as 'center'],
        ...(pickRef(r.refs, 'root/radius')
          ? { radiusVar: fv('root/radius') }
          : {}),
        // border width for the border channel; upstream POC used border-width-default
        strokeWeightVar: 'sizing/stroke-thin',
        ...(c.anatomy.root.thickness
          ? { rule: { thicknessVar: fv('root/thickness') } }
          : {}),
        ...(c.anatomy.root.underline
          ? { underlineVar: fv('root/underline') }
          : {}),
        ...(c.anatomy.root.width
          ? { fixedWidth: c.anatomy.root.width }
          : Object.entries<any>(c.anatomy).some(
                ([n, p]) => n !== 'root' && p.fill,
              )
            ? // a filling part needs an edge to fill to — the DEMO width
              // (canvas convenience, instances resize freely): a seated
              // chrome strip demos app-wide, a control at the field's 256
              { fixedWidth: c.anatomy.root.inset?.seat ? 1200 : 256 }
            : c.anatomy.root.baseline
              ? // the trimmed caption FILLs so it can wrap — same demo edge
                { fixedWidth: 256 }
              : {}),
        ...(c.anatomy.root.height
          ? { fixedHeight: c.anatomy.root.height }
          : {}),
        ...(c.anatomy.root.endline
          ? { endlineVar: fv('root/endline') }
          : {}),
        ...(c.anatomy.root.bleedGuard ? { bleedGuard: true } : {}),
        ...(c.anatomy.root.baseline
          ? {
              baselinePad: `figma-only/baseline-pad-${
                Object.entries<any>(c.anatomy).find(
                  ([n, p]) => n !== 'root' && p.typography,
                )![1].typography.label
              }`,
            }
          : {}),
      },
      parts,
      bySize,
      variants,
    },
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = resolveContract('packages/eds-contracts/contracts/chip.contract.json')
  process.stdout.write(JSON.stringify(emitFigmaPlan(r), null, 2) + '\n')
}
