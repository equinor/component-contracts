/** Contract → CSS. The web renderer keeps the mechanisms: optical padding stays a
 *  calc, states stay pseudo-classes, props become data-* attributes. Nothing is baked.
 *
 *  Authoring style follows the upstream design-system AGENTS.md: vanilla CSS in
 *  @layer eds-components, one eds- root class, SIMPLE unprefixed part classes
 *  scoped by nesting (upstream convention — disjoint from component classes, so
 *  a part named 'label' can never collide with the Label component),
 *  data-* attributes for variants (ADR-0006; the ancestor mode scopes
 *  data-density/data-color-scheme stay in the token layer), and --_
 *  pseudo-private custom properties — variants and sizes override only the
 *  variable, never the property.
 *  The emitter is the formatter — generated output must pass lint as born.
 *
 *  Anatomy capabilities are optional and independent: a component may have no
 *  typography (Divider), no inset (Label), or a plain inset with no optical
 *  label (Card). Each capability contributes its own declarations; absence
 *  contributes nothing. */
import * as edsIcons from '@equinor/eds-icons'
import {
  pickRef,
  propCombos,
  resolveContract,
  type ResolvedContract,
} from './resolve.ts'

/** eds-icons export -> a mask-image data URI (the icon at build time). */
function iconMaskUri(name: string): string {
  const icon = (edsIcons as any)[name]
  if (!icon) throw new Error(`unknown eds-icons export: ${name}`)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${icon.width ?? 24} ${icon.height ?? 24}">` +
    `<path fill-rule="evenodd" d="${icon.svgPathData}"/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const FAMILY_VAR: Record<string, string> = {
  ui: '--eds-typography-ui-body-font-family',
  header: '--eds-typography-header-font-family',
  code: '--eds-typography-code-font-family',
}

/** The size-dependent --_ parameter set for one size's anatomy parameters. */
function sizeParams(
  r: ResolvedContract,
  p: { inset?: string; label?: string; icon?: string },
  proportion: string | undefined,
  variant: string | undefined,
  ctx: Record<string, string>,
): [string, string][] {
  const out: [string, string][] = []
  const optical = r.contract.anatomy.root.inset?.opticalLabel
  if (p.label && variant) {
    out.push([
      '--_font-size',
      `var(--eds-typography-ui-body-${p.label}-font-size)`,
    ])
    out.push([
      '--_line-height',
      `var(--eds-typography-ui-body-${p.label}-line-height-${variant})`,
    ])
    if (optical)
      out.push([
        '--_half-leading',
        `var(--eds-half-leading-${p.label}${variant === 'default' ? '-default' : ''})`,
      ])
  }
  if (p.inset && r.contract.anatomy.root.inset?.seat) {
    // seated container: the cross-axis inset is the SEAT rung (xs), raw —
    // page xl → container md → cluster sm → seat xs.
    out.push(['--_inset-v', `var(--eds-spacing-vertical-xs)`])
    out.push(['--_inset-h', `var(--eds-spacing-inset-${p.inset}-horizontal)`])
  } else if (p.inset && proportion) {
    out.push([
      '--_inset-v',
      `var(--eds-spacing-inset-${p.inset}-vertical-${proportion})`,
    ])
    out.push(['--_inset-h', `var(--eds-spacing-inset-${p.inset}-horizontal)`])
  }
  if (r.contract.anatomy.root.layout?.gap) {
    // The contract's gap ref, size-scaled only when it is the icon-gap
    // family (a glyph beside its label follows the label size; a container
    // gap like the banner's horizontal-md is one value).
    const g = pickRef(r.refs, 'root/gap', {})!
    out.push([
      '--_gap',
      `var(${p.label ? g.cssVar.replace(/icon-[a-z0-9]+-gap/, `icon-${p.label}-gap`) : g.cssVar})`,
    ])
  }
  // Glyph parts share one --_glyph/--_cap pair (identical refs by construction).
  const firstGlyph = Object.entries<any>(r.contract.anatomy).find(
    ([n, p]) => n !== 'root' && p.glyph && p.footprint,
  )
  if (firstGlyph) {
    const glyph = pickRef(r.refs, `${firstGlyph[0]}/glyph`, ctx)!
    const footprint = pickRef(r.refs, `${firstGlyph[0]}/footprint`, ctx)!
    out.push(['--_glyph', `var(${glyph.cssVar})`])
    out.push(['--_cap', `var(${footprint.cssVar})`])
  }
  return out
}

/** Table mode: rows and cells are DOM elements, not classable parts — the
 *  rules nest under the root class. Geometry keeps the invariant per CELL:
 *  padding = inset − halfLeading, so the row height emerges and density means
 *  MORE ROWS, not narrower tables. */
function emitTableCss(r: ResolvedContract): string {
  const c = r.contract
  const cls = `.eds-${c.id.split('.')[1]}`
  const inset = c.anatomy.root.inset
  const pick = (key: string) => {
    const hit = pickRef(r.refs, key)
    if (!hit) throw new Error(`table: no resolved ref for ${key}`)
    return `var(${hit.cssVar})`
  }
  const th = Object.entries<any>(c.anatomy).find(([, p]) => p.element === 'th')!
  const td = Object.entries<any>(c.anatomy).find(([, p]) => p.element === 'td')!
  const t = td[1].typography
  const out: string[] = []
  out.push(
    `/* Generated from contracts/${c.id.split('.')[1]}.contract.json — do not edit. */`,
  )
  out.push('')
  out.push('@layer eds-components {')
  const b: string[] = []
  b.push(`${cls} {`)
  b.push(`  /* Size-dependent parameters. */`)
  b.push(`  --_font-size: var(--eds-typography-ui-body-${t.label}-font-size);`)
  b.push(
    `  --_line-height: var(--eds-typography-ui-body-${t.label}-line-height-${t.variant});`,
  )
  b.push(
    `  --_half-leading: var(--eds-half-leading-${t.label}${t.variant === 'default' ? '-default' : ''});`,
  )
  b.push(
    `  --_inset-v: var(--eds-spacing-inset-${inset.size}-vertical-${inset.proportion});`,
  )
  b.push(`  --_inset-h: var(--eds-spacing-inset-${inset.size}-horizontal);`)
  b.push('')
  b.push(`  border-collapse: collapse;`)
  b.push(
    `  font: var(--eds-font-weight-${t.weight}) var(--_font-size) / var(--_line-height) var(--eds-typography-ui-body-font-family);`,
  )
  b.push(`  background-color: ${pick('root/background-color')};`)
  b.push('')
  b.push(
    `  /* The invariant, per CELL: padding = inset − halfLeading, so the row`,
  )
  b.push(
    `   * height emerges — and density means MORE ROWS, not narrower tables. */`,
  )
  b.push(`  & th,`)
  b.push(`  & td {`)
  b.push(`    padding-block: calc(var(--_inset-v) - var(--_half-leading));`)
  b.push(`    padding-inline: var(--_inset-h);`)
  b.push(`    text-align: start;`)
  b.push(`  }`)
  b.push('')
  b.push(
    `  /* Separators are inset box-shadows, not borders: a collapsed border`,
  )
  b.push(
    `   * still occupies layout space (half billed to each row), which would`,
  )
  b.push(
    `   * push rows off the 4px grid. The shadow overlays the padding, so the`,
  )
  b.push(
    `   * row rhythm stays exactly 24/36/44 — matching Figma's INSIDE strokes.`,
  )
  b.push(
    `   * Known cost: box-shadows drop in forced-colors mode and in print. */`,
  )
  b.push(`  & th {`)
  b.push(`    font-weight: var(--eds-font-weight-${th[1].typography.weight});`)
  b.push(`    color: ${pick(`${th[0]}/color`)};`)
  b.push(
    `    box-shadow: inset 0 calc(-1 * var(--eds-sizing-stroke-thick)) 0 ${pick(`${th[0]}/border-bottom-color`)};`,
  )
  b.push(`  }`)
  b.push('')
  b.push(`  & td {`)
  b.push(`    color: ${pick(`${td[0]}/color`)};`)
  b.push(
    `    box-shadow: inset 0 calc(-1 * var(--eds-sizing-stroke-thin)) 0 ${pick(`${td[0]}/border-bottom-color`)};`,
  )
  b.push(`  }`)
  b.push(`}`)
  // Size axis: the attribute repoints the five size channels and every
  // height recomputes — 20/24/36 compressed vs 24/36/44 default, per cell.
  if (r.sizeAxis) {
    for (const value of r.sizeAxis.values) {
      if (value === c.props.find((p: any) => p.anatomy)!.default) continue
      const m: any = r.sizeAxis.map[value]
      const prop = m.proportion ?? inset.proportion
      b.push('')
      b.push(`${cls}[data-${r.sizeAxis.prop}='${value}'] {`)
      b.push(`  --_font-size: var(--eds-typography-ui-body-${m.label}-font-size);`)
      b.push(`  --_line-height: var(--eds-typography-ui-body-${m.label}-line-height-${t.variant});`)
      b.push(`  --_half-leading: var(--eds-half-leading-${m.label}${t.variant === 'default' ? '-default' : ''});`)
      b.push(`  --_inset-v: var(--eds-spacing-inset-${m.inset}-vertical-${prop});`)
      b.push(`  --_inset-h: var(--eds-spacing-inset-${m.inset}-horizontal);`)
      b.push(`}`)
    }
  }

  const hover = pickRef(r.refs, 'row/background-color:hover')
  if (hover) {
    b.push('')
    b.push(`${cls} tbody tr:not([aria-selected='true']):hover {`)
    b.push(`  background-color: var(${hover.cssVar});`)
    b.push(`}`)
  }
  const selected = pickRef(r.refs, 'row/background-color:selected')
  if (selected) {
    b.push('')
    b.push(`${cls} tbody tr[aria-selected='true'] {`)
    b.push(`  background-color: var(${selected.cssVar});`)
    b.push(`}`)
  }
  out.push(...b.map((line) => (line === '' ? '' : '  ' + line)))
  out.push('}')
  return out.join('\n') + '\n'
}

export function emitCss(r: ResolvedContract): string {
  const c = r.contract
  if (c.semantics.element === 'table') return emitTableCss(r)
  const cls = `.eds-${c.id.split('.')[1]}`
  const inset = c.anatomy.root.inset
  // The text part: the optical label when the inset names one, otherwise the
  // first part that declares typography (a component may have neither).
  const textEntry: [string, any] | undefined = inset?.opticalLabel
    ? [inset.opticalLabel, c.anatomy[inset.opticalLabel]]
    : Object.entries<any>(c.anatomy).find(([, p]) => p.typography)
  const labelName = textEntry?.[0]
  const t = textEntry?.[1]?.typography
  const fgKey = `${labelName}/color`
  // A field wrapper: the native control sits INSIDE the root (an <input>
  // cannot contain children), so states read THROUGH it via :has().
  const controlEntry = Object.entries<any>(c.anatomy).find(([, p]) => p.control)
  // The control is targeted by ELEMENT, not by class (accordion.css precedent:
  // semantic descendants of the component class need no class of their own).
  // Direct-child scoped so consumer content can never collide.
  const controlCls = controlEntry ? `> :is(input, select, textarea)` : undefined
  // Single-element mask controls (checkbox/radio/switch): the element IS the
  // control — appearance: none, the EDS icon as a build-time mask, the
  // background-color as ink. The CSS twin of the Figma mask+tint.
  const maskParts = Object.entries<any>(c.anatomy).filter(
    ([, p]) => p.whenValue && p.swap?.icon,
  )
  const maskControl = !controlEntry && maskParts.length > 0
  // The pointer part (tooltip arrow): paints with the root bg, sized from the
  // cap box, positioned by its placement prop's data-placement attribute.
  const pointerEntry = Object.entries<any>(c.anatomy).find(([, p]) => p.pointer)
  const placementProp = pointerEntry
    ? c.props.find((p: any) => p.name === pointerEntry[1].pointer.prop)
    : undefined
  // Colour rules vary over the enum props that colour refs actually bind; the
  // size axis and the placement axis vary structure, not colour — they get
  // their own override blocks.
  const colorProps = c.props.filter(
    (p: any) =>
      p.type.enum &&
      p.name !== r.sizeAxis?.prop &&
      p.name !== placementProp?.name,
  )
  const combos = propCombos(colorProps)

  const pick = (key: string, ctx: Record<string, string> = {}) => {
    const hit = pickRef(r.refs, key, ctx)
    if (!hit)
      throw new Error(`no resolved ref for ${key} @ ${JSON.stringify(ctx)}`)
    return `var(${hit.cssVar})`
  }
  // Variants are data-* attributes, never modifier classes (ADR-0006 rule 3).
  // The attribute name derives from the contract's Figma property — ADR-0015's
  // canonical axis vocabulary — so both surfaces speak the same axis names:
  // Tone -> data-tone, Placement -> data-placement. A prop's DEFAULT value
  // also matches the attribute's absence, so resting markup stays bare
  // (<button class="eds-button"> IS the default button); booleans are
  // valueless presence attributes, like the platform's own disabled.
  // A pseudo-bound enum lowers to the platform's pseudo-classes instead: every
  // non-default value IS a pseudo-class of the same name (:checked,
  // :indeterminate), the default value negates them all. Overlap is real —
  // an input can be :checked and :indeterminate at once — so emission order
  // (enum order) decides, and later values win in the cascade.
  const attrOf = (p: any) =>
    'data-' +
    p.bindings.figma.property.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const propSel = (p: any, value: string) => {
    if (p.bindings.code.pseudo) {
      const hit = (name: string) =>
        controlEntry ? `:has(:${name})` : `:${name}`
      // list-form :not() keeps specificity at one pseudo (max of the args), so
      // the default rule never outweighs the value rules that follow it
      const pseudos: string[] = p.type.enum.slice(1)
      return value === p.type.enum[0]
        ? `:not(${pseudos.map(hit).join(', ')})`
        : hit(value)
    }
    const attr = attrOf(p)
    if (p.type.boolean)
      return value === 'true' ? `[${attr}]` : `:not([${attr}])`
    if (p.bindings.code.inherit) {
      // the prop CASCADES: one attribute on the container flips every item
      // ([attr='v'] * = any element with such an ancestor). Figma cannot do
      // this for consumer slot content — a recorded, bounded divergence.
      const others: string[] = p.type.enum.filter(
        (v: string) => v !== p.default,
      )
      return value === p.default
        ? `:is([${attr}='${value}'], :not([${attr}], ${others.map((v) => `[${attr}='${v}'] *`).join(', ')}))`
        : `:is([${attr}='${value}'], [${attr}='${value}'] *)`
    }
    return value === p.default
      ? `:is([${attr}='${value}'], :not([${attr}]))`
      : `[${attr}='${value}']`
  }
  const selector = (ctx: Record<string, string>) =>
    cls + colorProps.map((p: any) => propSel(p, ctx[p.name])).join('')

  // The icon ink channel keys off the FIRST glyph part (they share it by
  // construction — asserted below by identical refs).
  const glyphName = Object.entries<any>(c.anatomy).find(
    ([n, p]) => n !== 'root' && p.glyph && p.footprint,
  )?.[0]
  // Channel variables: each line exists exactly when the contract binds the
  // channel — an unbound channel contributes nothing, not a default.
  const channelLines = (ctx: Record<string, string>): string[] => {
    const lines: string[] = []
    const bg = pickRef(r.refs, 'root/background-color', ctx)
    if (bg) lines.push(`--_bg: var(${bg.cssVar});`)
    const fg = labelName && pickRef(r.refs, fgKey, ctx)
    if (fg) lines.push(`--_fg: var(${fg.cssVar});`)
    const iconFg = glyphName && pickRef(r.refs, `${glyphName}/color`, ctx)
    if (iconFg) lines.push(`--_icon-fg: var(${iconFg.cssVar});`)
    const border = pickRef(r.refs, 'root/border-color', ctx)
    if (border) lines.push(`--_border: var(${border.cssVar});`)
    const bb = pickRef(r.refs, 'root/border-bottom-color', ctx)
    if (bb) lines.push(`--_border-bottom: var(${bb.cssVar});`)
    const br = pickRef(r.refs, 'root/border-right-color', ctx)
    if (br) lines.push(`--_border-right: var(${br.cssVar});`)
    const elev = pickRef(r.refs, 'root/elevation', ctx)
    if (elev) lines.push(`--_elevation: var(${elev.cssVar});`)
    const ph = pickRef(r.refs, 'root/placeholder-color', ctx)
    if (ph) lines.push(`--_placeholder: var(${ph.cssVar});`)
    if (maskControl) {
      const hit = maskParts.find(
        ([, p]) =>
          ctx[p.whenValue.prop] === p.whenValue.value &&
          p.whenValue.value !==
            c.props.find((pr: any) => pr.name === p.whenValue.prop).default,
      )
      if (hit) lines.push(`--_mask: ${iconMaskUri(hit[1].swap.icon)};`)
    }
    // A glyph whose identity follows an enum prop (the banner's tone icon):
    // every combo carries its value's mask — identity is the variant's fact.
    const byProp = Object.entries<any>(c.anatomy).find(
      ([n, p]) => n !== 'root' && p.swapByProp,
    )
    if (byProp) {
      const g = byProp[1].swapByProp.glyphs[ctx[byProp[1].swapByProp.prop]]
      if (g) lines.push(`--_mask: ${iconMaskUri(g.icon)};`)
    }
    return lines
  }

  const defaultParams = r.sizeAxis
    ? r.sizeAxis.map[
        c.props.find((p: any) => p.name === r.sizeAxis!.prop).default
      ]
    : { inset: inset?.size, label: t?.label }

  const out: string[] = []
  out.push(
    `/* Generated from contracts/${c.id.split('.')[1]}.contract.json — do not edit. */`,
  )
  out.push('')
  out.push('@layer eds-components {')

  // Three sub-layers, declared in order: base < variants < states. A state
  // always beats a variant regardless of selector weight — no specificity
  // fights (`.eds-x:disabled` vs a three-modifier combo), no !important.
  const b: string[] = []
  const variantRules: string[] = []
  const stateRules: string[] = []
  b.push(`${cls} {`)
  if (combos.length === 1 && Object.keys(combos[0]).length === 0) {
    const lines = channelLines({})
    if (lines.length > 0) {
      b.push(
        `  /* No variant axes — the channel variables live on the root. */`,
      )
      for (const line of lines) b.push(`  ${line}`)
      b.push('')
    }
  }
  // Reading text (default leading): the message is TRIMMED to the cap box
  // where the engine can (text-box); one variable switches the padding and
  // every glyph seat between the exact (trimmed) and approximate
  // (half-leading) geometry.
  const reading =
    inset?.opticalLabel &&
    c.anatomy[inset.opticalLabel]?.typography?.variant === 'default'
  // Baseline-grid text without a box (captions, helpers): the root itself is
  // the trim's block container — the occupied box becomes the cap cell.
  const baselineRoot = !!c.anatomy.root.baseline
  const params = sizeParams(r, defaultParams, inset?.proportion, t?.variant, {})
  if (params.length > 0) {
    b.push(
      `  /* Size-dependent parameters (${r.sizeAxis ? `size axis: ${r.sizeAxis.prop}; the size attribute overrides the variables only` : 'single size'}). */`,
    )
    for (const [k, v] of params) b.push(`  ${k}: ${v};`)
    if (reading) {
      b.push(`  --_trim-lead: var(--_half-leading);`)
      b.push(`  --_baseline-pad: 0px;`)
    } else if (baselineRoot) {
      // no box, so no seat to compensate — only the pad switches
      b.push(`  --_baseline-pad: 0px;`)
    }
    if (maskControl) {
      const prop = c.props.find(
        (p: any) => p.name === maskParts[0][1].whenValue.prop,
      )
      const defaultPart = maskParts.find(
        ([, p]) => p.whenValue.value === prop.default,
      )!
      b.push(`  --_mask: ${iconMaskUri(defaultPart[1].swap.icon)};`)
    }
    b.push('')
  }
  // The pointer's positioning context. Consumers float the tooltip themselves
  // (popover + anchor positioning); relative only anchors the ::before.
  // Interaction cursor: states imply an affordance — pointer at rest,
  // not-allowed when disabled (the :disabled rule flips the variable).
  const interactive = c.states.some(
    (s: any) =>
      ['hover', 'active', 'disabled'].includes(s.name) && !s.interactiveOnly,
  )
  // interactiveOnly states: the affordance belongs to the MARKUP — an <a> or
  // <button> with the class affords, a <div> sits still. No attribute.
  const interactiveByElement = c.states.some((s: any) => s.interactiveOnly)
  if (interactive) {
    // text-entry controls keep the platform's I-beam at rest; everything else
    // (buttons, checkboxes, radios, switches) affords a click
    const resting =
      c.semantics.element === 'textarea' ||
      (controlEntry && controlEntry[1].typography)
        ? 'text'
        : 'pointer'
    b.push(`  cursor: var(--_cursor, ${resting});`)
    b.push('')
  }
  if (pointerEntry || (controlEntry && !controlEntry[1].typography)) {
    b.push(`  position: relative;`)
    b.push('')
  }
  if (maskControl) {
    b.push(
      `  /* The element IS the control: the EDS icon (from @equinor/eds-icons,`,
    )
    b.push(
      `   * resolved at build time) is the MASK, the background is the ink —`,
    )
    b.push(
      `   * the CSS twin of the Figma mask+tint. The footprint stays the cap`,
    )
    b.push(
      `   * box, so the control sits on a label's cap line like any glyph. */`,
    )
    b.push(`  inline-size: var(--_glyph);`)
    b.push(`  block-size: var(--_glyph);`)
    b.push(`  margin: calc((var(--_cap) - var(--_glyph)) / 2);`)
    b.push('')
    b.push(`  appearance: none;`)
    b.push(`  background-color: var(--_icon-fg);`)
    b.push('')
    b.push(`  mask-image: var(--_mask);`)
    b.push(`  mask-repeat: no-repeat;`)
    b.push(`  mask-size: 100% 100%;`)
  }
  const layout = maskControl ? undefined : c.anatomy.root.layout
  if (maskControl) {
    /* no display/box declarations beyond the control itself */
  } else if (layout) {
    b.push(
      `  display: ${layout.direction === 'column' ? 'flex' : 'inline-flex'};`,
    )
    if (layout.direction === 'column') b.push(`  flex-direction: column;`)
    if (layout.gap) b.push(`  gap: var(--_gap);`)
    if (layout.align) b.push(`  align-items: ${layout.align};`)
  } else if (baselineRoot) {
    // the trim needs a block container, and the root IS the text
    b.push(`  display: inline-block;`)
  } else {
    b.push(`  display: block;`)
  }
  if (baselineRoot) {
    b.push('')
    b.push(
      `  /* the caption sits ON the baseline grid (codepen VYmaowY): trim to`,
    )
    b.push(
      `   * ex over alphabetic, then pad the top by round(1cap,4px) − 1ex —`,
    )
    b.push(
      `   * the occupied box is exactly the cap cell (--eds-cap-rounded) and`,
    )
    b.push(`   * the baseline is the box bottom. Both declarations self-gate:`)
    b.push(`   * the tokens only exist under @supports, so engines without`)
    b.push(`   * text-box keep the untrimmed line box. */`)
    b.push(`  margin: 0;`)
    b.push(`  padding-block: var(--_baseline-pad) 0;`)
    b.push('')
    b.push(`  text-box: var(--eds-text-box);`)
  }
  if (inset?.opticalLabel) {
    b.push('')
    b.push(
      `  /* The contract's invariant, kept as a mechanism: height = inset × 2 + cap(label).`,
    )
    b.push(
      `   * Resolves to ${r.geometry!.map((g) => g.heightPx).join(' / ')} px across densities (default size). Do not bake, do not round.`,
    )
    b.push(
      `   * border-box so min-height measures the BOX — buttons get this from the UA`,
    )
    b.push(`   * stylesheet, a <div> pays its padding twice without it. */`)
    b.push(`  box-sizing: border-box;`)
    if (c.semantics.element === 'input' || c.semantics.element === 'select') {
      // single-line fields: the browser enforces the font's NATURAL line box
      // inside text inputs (compressed line-height alone lands 2px tall at
      // compact), and the element can never wrap — so the height is stated
      // exactly, from the same derivation.
      b.push(
        `  block-size: calc(var(--_inset-v) * 2 + var(--eds-cap-rounded));`,
      )
    }
    b.push(`  min-height: calc(var(--_inset-v) * 2 + var(--eds-cap-rounded));`)
    b.push(
      `  padding-block: calc(var(--_inset-v) - var(${reading ? '--_trim-lead' : '--_half-leading'}));`,
    )
    b.push(`  padding-inline: var(--_inset-h);`)
    if (c.anatomy.root.indent) {
      const indentPairing = r.pairings.find((p) =>
        p.name.startsWith('recipe/indent-'),
      )!
      b.push('')
      b.push(
        `  /* derived indent: the label aligns with ${c.anatomy.root.indent.alignsWith}'s`,
      )
      b.push(
        `   * label — parent inset + icon cap cell + icon gap, composed live. */`,
      )
      b.push(`  padding-inline-start: ${indentPairing.codeSyntax};`)
    }
  } else if (c.anatomy.root.bleedGuard) {
    b.push('')
    b.push(
      `  /* the bleed guard: the panel pads its block ends by ITS OWN radius`,
    )
    b.push(
      `   * (same token), so full-bleed item fills never clip the corners;`,
    )
    b.push(`   * the sides stay unpadded — items run edge to edge. The inline`)
    b.push(`   * zero is EXPLICIT: the UA's [popover] { padding: 0.25em } sets`)
    b.push(`   * all four sides, and an unauthored side belongs to the UA. */`)
    b.push(`  box-sizing: border-box;`)
    b.push(`  padding-block: ${pick('root/radius')};`)
    b.push(`  padding-inline: 0;`)
    b.push('')
    b.push(`  /* popover-safe: the contract names popover + anchor positioning`)
    b.push(`   * as the consumer's mechanism — our display must not beat the`)
    b.push(`   * UA's closed-state display: none. */`)
    b.push(`  &[popover]:not(:popover-open) {`)
    b.push(`    display: none;`)
    b.push(`  }`)
  } else if (inset) {
    b.push('')
    if (inset.seat) {
      b.push(
        `  /* A seated container: vertical inset = the SEAT rung (xs), RAW —`,
      )
      b.push(
        `   * controls carry no half-leading, so nothing is compensated. The`,
      )
      b.push(
        `   * height is the tallest seated control + 2×seat, emergent. */`,
      )
    } else {
      b.push(`  /* Plain (uncorrected) inset — no text to compensate for. */`)
    }
    b.push(`  box-sizing: border-box;`)
    b.push(`  padding-block: var(--_inset-v);`)
    b.push(`  padding-inline: var(--_inset-h);`)
  }
  if (c.anatomy.root.thickness) {
    b.push('')
    b.push(
      `  /* A rule: the thickness is the sizing token, the ink is --_bg. The`,
    )
    b.push(
      `   * UA margin is zeroed for the same reason gutters were refused —`,
    )
    b.push(
      `   * spacing belongs to the parent (and <hr>'s auto inline margins`,
    )
    b.push(`   * shrink-wrap it to zero width in flex and grid parents). */`)
    b.push(`  block-size: ${pick('root/thickness')};`)
    b.push(`  margin: 0;`)
  }
  if (!maskControl) {
    if (!inset && !c.anatomy.root.thickness) b.push('')
    b.push(`  border: none;`)
    if (c.anatomy.root.thickness) b.push('')
  }
  if (c.anatomy.root.radius)
    b.push(`  border-radius: var(--_radius, ${pick('root/radius')});`)
  // Channel presence = ANY ref with the key, regardless of which prop values
  // pin it — the property line is emitted once, the combos fill the variable.
  const has = (key: string) => r.refs.some((x) => x.key === key)
  if (t) {
    b.push('')
    b.push(
      `  font: var(--eds-font-weight-${t.weight}) var(--_font-size) / var(--_line-height) var(${FAMILY_VAR[t.family]});`,
    )
    if (has(fgKey)) b.push(`  color: var(--_fg);`)
  }
  // Interaction cursor: states imply an affordance — pointer at rest,
  // not-allowed when disabled (the :disabled rule flips the variable).
  const hasBg = has('root/background-color')
  const hasBorder = has('root/border-color')
  const ring = pickRef(r.refs, 'root/focus-ring:focus')
  if (hasBg) {
    // group separation, except when the fill directly follows a bare border
    // reset (the rule case) — clean-order treats those as one group
    if (t || c.anatomy.root.radius || inset) b.push('')
    b.push(`  background-color: var(--_bg);`)
  }
  // The border channel: an inside outline — no layout shift, and combos that
  // set no --_border render a transparent (invisible) ring.
  if ((hasBorder || ring) && !maskControl) {
    if (!hasBg) b.push('')
    b.push(
      `  outline: var(--eds-sizing-stroke-thin) solid var(--_border, transparent);`,
    )
    b.push(`  outline-offset: calc(-1 * var(--eds-sizing-stroke-thin));`)
  }
  const hasBorderBottom = has('root/border-bottom-color')
  const hasElevation =
    has('root/elevation') ||
    r.refs.some((ref) => ref.key.startsWith('root/elevation:'))
  if (hasBorderBottom && hasElevation)
    throw new Error(
      `${c.id}: border-bottom and elevation both lower to box-shadow — pick one`,
    )
  if (hasBorderBottom) {
    b.push('')
    b.push(
      `  /* the underline: an inset shadow so geometry is untouched — exact parity`,
    )
    b.push(
      `   * with Figma's inside stroke; a real border would displace the cap box. */`,
    )
    b.push(
      `  box-shadow: inset 0 calc(-1 * ${has('root/underline') ? pick('root/underline') : 'var(--eds-sizing-stroke-thick)'}) 0 var(--_border-bottom);`,
    )
  }
  if (hasElevation) {
    b.push('')
    b.push(
      `  /* Elevation lowers to an effect style in Figma, a shadow here. */`,
    )
    b.push(`  box-shadow: var(--_elevation, none);`)
  }
  const hasBorderRight = r.refs.some((ref) =>
    ref.key.startsWith('root/border-right-color'),
  )
  if (hasBorderRight && (hasBorderBottom || hasElevation))
    throw new Error(
      `${c.id}: the endline shares box-shadow with underline/elevation — combine them first`,
    )
  if (hasBorderRight) {
    b.push('')
    b.push(
      `  /* the inline-end edge: the underline, rotated — an OUTER shadow`,
    )
    b.push(
      `   * (geometry untouched, and full-bleed children cannot paint over`,
    )
    b.push(`   * it; Figma's twin is an OUTSIDE stroke — Victor's catch). */`)
    b.push(
      `  box-shadow: ${has('root/endline') ? pick('root/endline') : 'var(--eds-sizing-stroke-thick)'} 0 0 var(--_border-right);`,
    )
  }

  if (interactiveByElement) {
    b.push('')
    b.push(`  /* interactivity is the MARKUP's fact: an <a> or <button> with the`)
    b.push(`   * class affords, a <div> sits still — no attribute invented. */`)
    b.push(`  &:is(a, button) {`)
    b.push(`    cursor: pointer;`)
    b.push(`  }`)
  }
  if (c.semantics.element === 'a') {
    b.push('')
    b.push(`  /* a link-shaped component: the UA underline is prose dressing,`)
    b.push(`   * not chrome — the ink channels own the presentation. */`)
    b.push(`  text-decoration: none;`)
  }
  // Glyph parts: the ink keeps its full size; the layout footprint is the cap
  // box. The negative margin carries the difference and disappears with the
  // element. Two shapes: plain slots (consumer markup, grouped — identical
  // rules by construction) and emitter-owned masks (the artwork is a
  // build-time data URI, so the markup can never carry the wrong glyph).
  const glyphEntries = Object.entries<any>(c.anatomy).filter(
    ([n, p]) => n !== 'root' && p.glyph && p.footprint,
  )
  const isMaskedChild = (p: any) =>
    !maskControl && (p.swapByProp || p.swap?.icon)
  const plainGlyphs = glyphEntries
    .filter(([, p]) => !isMaskedChild(p))
    .map(([n]) => n)
  if (plainGlyphs.length > 0 && !maskControl) {
    b.push('')
    plainGlyphs.forEach((n, i) =>
      b.push(`  & .${n}${i < plainGlyphs.length - 1 ? ',' : ' {'}`),
    )
    b.push(`    inline-size: var(--_glyph);`)
    b.push(`    block-size: var(--_glyph);`)
    b.push('')
    b.push(`    /* a glyph part: its footprint is the label's cap box; the ink`)
    b.push(
      `     * overflows it like ascenders and descenders. Negative by construction. */`,
    )
    b.push(`    margin: calc((var(--_cap) - var(--_glyph)) / 2);`)
    b.push(`    color: var(--_icon-fg, var(--_fg));`)
    b.push(`  }`)
  }
  for (const [n, p] of glyphEntries) {
    if (!isMaskedChild(p)) continue
    {
      b.push('')
      b.push(`  & .${n} {`)
      b.push(`    /* an empty element has no min-content — pin it, or a`)
      b.push(`     * wrapping message squeezes the glyph to nothing. */`)
      b.push(`    flex: none;`)
      b.push('')
      b.push(`    inline-size: var(--_glyph);`)
      b.push(`    block-size: var(--_glyph);`)
      b.push('')
      b.push(
        `    /* a glyph part: its footprint is the label's cap box; the ink`,
      )
      b.push(
        `     * overflows it like ascenders and descenders. Negative by construction. */`,
      )
      b.push(`    margin: calc((var(--_cap) - var(--_glyph)) / 2);`)
      if (reading && c.anatomy.root.layout?.align === 'start') {
        b.push('')
        b.push(
          `    /* seated on the FIRST LINE: with the trim, cap box top = text`,
        )
        b.push(
          `     * cap top = the inset, exactly; the fallback adds the leading. */`,
        )
        b.push(
          `    margin-block-start: calc((var(--_cap) - var(--_glyph)) / 2 + var(--_trim-lead));`,
        )
      }
      b.push('')
      b.push(
        `    /* emitter-owned artwork: the variant's icon is the mask (a`,
      )
      b.push(
        `     * build-time data URI from @equinor/eds-icons), the background`,
      )
      b.push(
        `     * is the ink — the CSS twin of the Figma mask+tint. An empty`,
      )
      b.push(`     * element can never carry the wrong glyph. */`)
      b.push(`    background-color: var(--_icon-fg, var(--_fg));`)
      b.push('')
      b.push(
        `    mask-image: ${p.swapByProp ? 'var(--_mask)' : iconMaskUri(p.swap.icon)};`,
      )
      b.push(`    mask-repeat: no-repeat;`)
      b.push(`    mask-size: 100% 100%;`)
      b.push(`  }`)
    }
  }

  // Corner flag: the collapsed square's submenu mark — an ::after pseudo
  // (emitter-owned decoration, no markup to get wrong). Gated on the
  // collapsed variant AND the boolean that gates the part.
  for (const [fn, fp] of Object.entries<any>(c.anatomy).filter(
    ([, p]) => p.flag,
  )) {
    const gateProp = c.props.find((p: any) => p.name === fp.when)
    const gateAttr = gateProp ? attrOf(gateProp) : `data-${fp.when}`
    const iconOnly = (c.variants ?? []).find((v: any) => v.structure?.iconOnly)
    const variantSel = iconOnly
      ? Object.entries(iconOnly.when)
          .map(([k, v]) => {
            const prop = c.props.find((p: any) => p.name === k)
            return prop
              ? propSel(prop, v as string)
              : `[data-${k}='${v}']`
          })
          .join('')
      : ''
    b.push('')
    b.push(`  /* the ${fn}: a corner triangle marks the submenu on the`)
    b.push(`   * collapsed square. Legs = the xs rung; ink follows the icon. */`)
    b.push(`  &${variantSel}[${gateAttr}] {`)
    b.push(`    position: relative;`)
    b.push('')
    b.push(`    &::after {`)
    b.push(`      content: '';`)
    b.push('')
    b.push(`      position: absolute;`)
    b.push(`      inset-block-end: 0;`)
    b.push(`      inset-inline-end: 0;`)
    b.push('')
    b.push(`      inline-size: var(--eds-spacing-horizontal-xs);`)
    b.push(`      block-size: var(--eds-spacing-vertical-xs);`)
    b.push('')
    b.push(`      background-color: var(--_icon-fg, var(--_fg));`)
    b.push(`      clip-path: polygon(100% 0, 100% 100%, 0 100%);`)
    b.push(`    }`)
    b.push(`  }`)
  }

  // Clusters: selectables acting as one group sit one rung below the
  // container gap (sm) — the consumer's markup groups them in a wrapper.
  const clusterNames = [
    ...new Set(
      Object.values<any>(c.anatomy)
        .map((p) => p.cluster)
        .filter(Boolean),
    ),
  ]
  for (const cl of clusterNames) {
    b.push('')
    b.push(`  /* the ${cl} cluster: within-group gap = the CLUSTER rung (sm),`)
    b.push(`   * one below the container gap — grouping must read tighter`)
    b.push(`   * than separation. The consumer's markup wraps the group. */`)
    b.push(`  & > .${cl} {`)
    b.push(`    display: flex;`)
    b.push(`    gap: var(--eds-spacing-horizontal-sm);`)
    b.push(`    align-items: center;`)
    b.push(`  }`)
  }

  // Authored width: emitted only when no ELEMENT fill part exists (a fill
  // part means the width is a Figma demo strip, not the component's fact).
  const elementFill = Object.entries<any>(c.anatomy).some(
    ([n, p]) => n !== 'root' && p.fill && !p.figmaSlot,
  )
  if (c.anatomy.root.width && !elementFill) {
    b.push('')
    b.push(`  /* the rail defines its own width — the rare authored dimension;`)
    b.push(`   * constant across densities (content width, not rhythm). */`)
    b.push(`  inline-size: ${c.anatomy.root.width}px;`)
  }
  if (c.anatomy.root.collapsedWidth) {
    const square = r.pairings.find((p) =>
      p.name.startsWith('recipe/square-'),
    )!
    b.push('')
    b.push(
      `  /* collapsed, the rail is exactly as wide as its squares are tall:`,
    )
    b.push(
      `   * ${c.anatomy.root.collapsedWidth.matches}'s edge, composed live. */`,
    )
    const keep = `.eds-${c.anatomy.root.collapsedWidth.matches.replace(/^eds\./, '')}`
    b.push(`  &[data-collapsed='true'] {`)
    b.push(`    inline-size: ${square.codeSyntax};`)
    b.push('')
    b.push(`    /* collapsed, the rail keeps only its squares: anything that`)
    b.push(`     * cannot collapse (sub-items — their submenu floats) leaves.`)
    b.push(`     * Figma's twin: seeds that cannot mirror the axis hide. */`)
    b.push(`    & > :not(${keep}) {`)
    b.push(`      display: none;`)
    b.push(`    }`)
    b.push(`  }`)
  }

  // Instance parts with an AUTHORED width (the top bar's 256 search field —
  // the rail's number, a deliberate rhyme).
  for (const [n, pt] of Object.entries<any>(c.anatomy).filter(
    ([n, p]) => n !== 'root' && p.instance && p.width,
  )) {
    b.push('')
    b.push(`  /* the ${n} field's authored width */`)
    b.push(`  & > .eds-${pt.instance.component.toLowerCase()} {`)
    b.push(`    inline-size: ${pt.width}px;`)
    b.push(`  }`)
  }

  // Fill parts: the contract owns the distribution — the fill part's auto
  // end-margin sends everything after it to the end of the axis, without
  // stretching the part's own box (Figma FILLs instead: same seam,
  // different mechanism, a bounded divergence).
  // (control parts excluded: the control's fill is its flex: 1 1 auto, below)
  for (const [n, p] of Object.entries<any>(c.anatomy).filter(
    ([n, p]) => n !== 'root' && p.fill && !p.control,
  )) {
    b.push('')
    if (p.figmaSlot) {
      // the fill part is a SLOT: in CSS its children sit directly in the
      // root, so the part AFTER the content pins to the end instead.
      b.push(`  /* distribution is the contract's fact: the ${n} area absorbs`)
      b.push(`   * the spare space — the last child (the Collapse item) pins`)
      b.push(`   * to the block end. */`)
      b.push(`  & > :last-child {`)
      b.push(`    margin-block-start: auto;`)
      b.push(`  }`)
      const flip = Object.values<any>(c.anatomy).find(
        (pt) => pt.instance?.collapsedOverrides,
      )
      if (flip) {
        b.push('')
        b.push(`  /* the Collapse control faces the other way when collapsed:`)
        b.push(`   * last_page IS first_page mirrored, so the mirror IS the`)
        b.push(`   * swap — one svg in the markup serves both directions (the`)
        b.push(`   * pinned last item is the Collapse by the same convention`)
        b.push(`   * that pins it; Figma swaps the component instead). */`)
        b.push(`  &[data-collapsed='true'] > :last-child .icon {`)
        b.push(`    scale: -1 1;`)
        b.push(`  }`)
      }
    } else {
      b.push(
        `  /* distribution is the contract's fact: ${n} absorbs the spare`,
      )
      b.push(`   * space; everything after it trails to the inline end. */`)
      b.push(`  & > .${n} {`)
      b.push(`    margin-inline-end: auto;`)
      b.push(`  }`)
    }
  }

  if (controlEntry && controlEntry[1].typography) {
    b.push('')
    b.push(
      `  /* the native control: the wrapper owns the box, the inset and the`,
    )
    b.push(
      `   * channels — the control is reset flat and inherits everything. */`,
    )
    b.push(`  & ${controlCls} {`)
    b.push(`    flex: 1 1 auto;`)
    b.push('')
    b.push(`    min-inline-size: 0;`)
    b.push(`    padding: 0;`)
    b.push(`    border: none;`)
    b.push('')
    b.push(`    font: inherit;`)
    b.push(`    color: inherit;`)
    b.push('')
    b.push(`    background: none;`)
    b.push(`    outline: none;`)
    b.push(`  }`)
  } else if (controlEntry) {
    b.push('')
    b.push(
      `  /* the native control is represented by the glyphs: it covers the`,
    )
    b.push(
      `   * wrapper invisibly, so the whole wrapper is the hit target and the`,
    )
    b.push(`   * platform keeps focus, keyboard and forms behaviour. */`)
    b.push(`  & ${controlCls} {`)
    b.push(`    cursor: inherit;`)
    b.push('')
    b.push(`    position: absolute;`)
    b.push(`    inset: 0;`)
    b.push('')
    b.push(`    margin: 0;`)
    b.push('')
    b.push(`    appearance: none;`)
    b.push(`    opacity: 0;`)
    b.push(`  }`)
  }

  if (has('root/placeholder-color')) {
    b.push('')
    b.push(`  &${controlEntry ? ` ${controlCls}` : ''}::placeholder {`)
    b.push(`    color: var(--_placeholder);`)
    b.push(`  }`)
  }

  if (pointerEntry) {
    b.push('')
    b.push(
      `  /* The pointer: width = the label's cap box, protrusion = half of it —`,
    )
    b.push(
      `   * density-scaling, never authored. It paints with the bubble's own`,
    )
    b.push(
      `   * --_bg; the placement attribute puts it on the edge opposite the`,
    )
    b.push(`   * tooltip, pointing at the anchor. */`)
    b.push(`  &::before {`)
    b.push(`    content: '';`)
    b.push('')
    b.push(`    position: absolute;`)
    b.push(`    rotate: 45deg;`)
    b.push('')
    b.push(`    inline-size: var(--eds-cap-rounded);`)
    b.push(`    block-size: var(--eds-cap-rounded);`)
    b.push('')
    b.push(`    background-color: var(--_bg);`)
    b.push(`  }`)
  }
  // Reading text: the message is a <p> — a semantic descendant (element,
  // not class), the trim's block container, and the filling middle child.
  if (reading) {
    b.push('')
    b.push(`  /* the message is a <p>: the trim needs a block container, and`)
    b.push(`   * the paragraph is the filling middle of the row. Baseline-grid`)
    b.push(`   * alignment (codepen VYmaowY): trim to ex over alphabetic, then`)
    b.push(`   * pad the top by round(1cap,4px) − 1ex — the occupied box is`)
    b.push(`   * exactly the ROUNDED cap (a raw cap trim would miss the grid),`)
    b.push(`   * and the baseline sits on the 4px grid at the box bottom.`)
    b.push(`   * Both declarations self-gate: the tokens only exist under`)
    b.push(`   * @supports, so engines without text-box keep the half-leading`)
    b.push(`   * fallback. */`)
    b.push(`  & > p {`)
    b.push(`    flex: 1 1 auto;`)
    b.push(`    margin: 0;`)
    b.push(`    padding-block: var(--_baseline-pad) 0;`)
    b.push('')
    b.push(`    text-box: var(--eds-text-box);`)
    b.push(`  }`)
  }
  // A corner instance: the part IS another contract's component, seated by
  // its cap box on the upper-right padding corner.
  for (const [cornerName, cornerPart] of Object.entries<any>(c.anatomy)) {
    if (!cornerPart.corner || !cornerPart.instance) continue
    const overhang = pickRef(r.refs, `${cornerName}/overhang`, {})!
    const slot = `.eds-${cornerPart.instance.component.toLowerCase()}`
    b.push('')
    b.push(
      `  /* the ${cornerName} IS the ${cornerPart.instance.component} (composition, not imitation):`,
    )
    b.push(`   * it brings its own plate, ring and name guard. The banner only`)
    b.push(`   * seats its CAP BOX on the corner — the plate overflows by the`)
    b.push(`   * declared overhang, ink not box; you only see the circle on`)
    b.push(`   * hover anyway. The seat follows the trim switch. */`)
    b.push(`  & > ${slot} {`)
    b.push(`    /* pseudo-private channels INHERIT: the banner sets --_border`)
    b.push(`     * for its own frame, and the nested component only sets it in`)
    b.push(`     * some of its variants — clear it, or the ghost grows a ring`)
    b.push(`     * at rest. The container resets what it sets. */`)
    b.push(`    --_border: initial;`)
    b.push('')
    b.push(`    align-self: start;`)
    b.push(
      `    margin-block-start: calc(var(--_trim-lead) - var(${overhang.cssVar}));`,
    )
    b.push(
      `    margin-inline: auto calc(-1 * var(${overhang.cssVar}));`,
    )
    if (cornerPart.instance.icon) {
      b.push('')
      b.push(`    & .icon {`)
      b.push(`      background-color: currentcolor;`)
      b.push(`      mask-image: ${iconMaskUri(cornerPart.instance.icon)};`)
      b.push(`      mask-repeat: no-repeat;`)
      b.push(`      mask-size: 100% 100%;`)
      b.push(`    }`)
    }
    b.push(`  }`)
  }
  b.push(`}`)
  if (reading) {
    b.push('')
    b.push(`/* Trim on: the root padding measures to the message's cap-rounded`)
    b.push(` * box, and the baseline compensation switches in. */`)
    b.push(`@supports (text-box: trim-both ex alphabetic) {`)
    b.push(`  ${cls} {`)
    b.push(`    --_trim-lead: 0px;`)
    b.push(`    --_baseline-pad: var(--eds-padding-top-baseline);`)
    b.push(`  }`)
    b.push(`}`)
  } else if (baselineRoot) {
    b.push('')
    b.push(`/* Trim on: the occupied box becomes the cap cell, baseline at`)
    b.push(` * the bottom edge — form text measures from real glyph boxes. */`)
    b.push(`@supports (text-box: trim-both ex alphabetic) {`)
    b.push(`  ${cls} {`)
    b.push(`    --_baseline-pad: var(--eds-padding-top-baseline);`)
    b.push(`  }`)
    b.push(`}`)
  }

  // Placement rules: position the pointer, nothing else.
  if (pointerEntry && placementProp) {
    for (const value of placementProp.type.enum as string[]) {
      const [side, align = 'center'] = value.split('-')
      const overhang = `calc(var(--eds-cap-rounded) / -2)`
      const lines: string[] = []
      if (side === 'top') lines.push(`inset-block-end: ${overhang};`)
      if (side === 'bottom') lines.push(`inset-block-start: ${overhang};`)
      if (side === 'left') lines.push(`inset-inline-end: ${overhang};`)
      if (side === 'right') lines.push(`inset-inline-start: ${overhang};`)
      if (side === 'top' || side === 'bottom') {
        if (align === 'start')
          lines.push(`inset-inline-start: var(--_inset-h);`)
        if (align === 'end') lines.push(`inset-inline-end: var(--_inset-h);`)
        if (align === 'center') {
          lines.push(`inset-inline-start: 50%;`)
          lines.push(`translate: -50% 0;`)
        }
      } else {
        if (align === 'start') lines.push(`inset-block-start: var(--_inset-v);`)
        if (align === 'end') lines.push(`inset-block-end: var(--_inset-v);`)
        if (align === 'center') {
          lines.push(`inset-block-start: 50%;`)
          lines.push(`translate: 0 -50%;`)
        }
      }
      // clean-order: block insets before inline insets, translate last
      const rank = (l: string) =>
        [
          'inset-block-start',
          'inset-block-end',
          'inset-inline',
          'translate',
        ].findIndex((k) => l.startsWith(k))
      lines.sort((a, b2) => rank(a) - rank(b2))
      b.push('')
      b.push(`${cls}${propSel(placementProp, value)}::before {`)
      for (const l of lines) b.push(`  ${l}`)
      b.push(`}`)
    }
  }

  // Size attribute: overrides the --_ parameters only, never the properties.
  if (r.sizeAxis) {
    const axisProp = c.props.find((p: any) => p.name === r.sizeAxis!.prop)
    for (const value of r.sizeAxis.values) {
      if (value === axisProp.default) continue
      const p = r.sizeAxis.map[value]
      b.push('')
      b.push(`${cls}${propSel(axisProp, value)} {`)
      for (const [k, v] of sizeParams(r, p, inset?.proportion, t?.variant, {
        [r.sizeAxis.prop]: value,
      }))
        b.push(`  ${k}: ${v};`)
      b.push(`}`)
    }
  }

  // Structural variant attributes: anatomy overrides, same mechanism — variables only.
  for (const sv of r.structural) {
    const mods = Object.entries(sv.when)
      .map(([k, v]) =>
        propSel(
          c.props.find((p: any) => p.name === k),
          v,
        ),
      )
      .join('')
    b.push('')
    b.push(`${cls}${mods} {`)
    b.push(
      `  /* icon-only: no text, so no half-leading to compensate — the optical`,
    )
    b.push(
      `   * correction drops out. Padding = inset on all sides, and width =`,
    )
    b.push(`   * height = inset × 2 + cap: a circle under the pill radius. */`)
    if (sv.inset === 'even') {
      b.push(`  --_half-leading: 0px;`)
      b.push(`  --_inset-h: var(--_inset-v);`)
    }
    if (sv.radius) {
      const hit = pickRef(r.refs, 'root/radius', sv.when)!
      b.push(`  --_radius: var(${hit.cssVar});`)
    }
    {
      // attribute-driven icon-only (the collapsed sidebar item): the same
      // markup must collapse, so the label and chevron leave via CSS —
      // button's ghost-icon leaves them out of the markup instead.
      const hideable = Object.entries<any>(c.anatomy)
        .filter(
          ([n, p]) =>
            n !== 'root' &&
            n !== sv.iconOnly &&
            !p.flag &&
            (p.typography || p.glyph),
        )
        .map(([n]) => `.${n}`)
      if (hideable.length > 0) {
        b.push('')
        b.push(`  & > :is(${hideable.join(', ')}) {`)
        b.push(`    display: none;`)
        b.push(`  }`)
      }
    }
    b.push(`}`)

    // The obligation icon-only creates: no text child names the control, so
    // the accessible name must come from the author. The guard paints the
    // omission — silence is never a pass, in the CSS itself. :where() zeroes
    // the guard's specificity so the focus ring still wins while focused.
    if (['button', 'a', 'input'].includes(c.semantics.element)) {
      stateRules.push('')
      stateRules.push(
        `${cls}${mods}:where(:not([aria-label], [aria-labelledby])) {`,
      )
      stateRules.push(
        `  outline: var(--eds-sizing-stroke-thick) dashed var(--eds-color-border-danger-strong);`,
      )
      stateRules.push(`}`)
    }
  }


  // Value-gated DOM parts hidden under every other value of their prop.
  // (Mask controls swap --_mask inside the channel blocks instead.)
  if (!maskControl) {
    for (const [partName, part] of Object.entries<any>(c.anatomy)) {
      if (!part.whenValue) continue
      const prop = c.props.find((p: any) => p.name === part.whenValue.prop)
      for (const value of prop.type.enum as string[]) {
        if (value === part.whenValue.value) continue
        b.push('')
        b.push(`${cls}${propSel(prop, value)} .${partName} {`)
        b.push(`  display: none;`)
        b.push(`}`)
      }
    }
  }

  // One rule per colour-prop combination; interactive states guarded by :not(:disabled).
  const gatedDisabledRules: string[] = []
  // Disabled may be SPLIT: an ungated entry for the inks every variant dims,
  // plus a gated entry (when) for what only some variants change — EDS 1.0's
  // own shape: the gray plate belongs to contained alone; transparent-resting
  // variants stay transparent when disabled.
  for (const disabled of c.states.filter((s: any) => s.name === 'disabled')) {
    const props = new Map<string, string>()
    for (const [key] of Object.entries(disabled.tokens)) {
      // With colour combos, root/border-color is handled per-combo above:
      // --_border may only be set where the variant actually has a border.
      // Without combos (the input) the border is unconditional — fold it in.
      if (key === 'root/border-color' && colorProps.length > 0) continue
      const hit = pickRef(r.refs, `${key}:disabled`, disabled.when ?? {})!
      const part = key.split('/')[0]
      const channel = key.split('/')[1]
      const prop =
        channel === 'background-color'
          ? '--_bg'
          : channel === 'border-bottom-color'
            ? '--_border-bottom'
            : channel === 'border-color'
              ? '--_border'
              : part === 'root' || part === labelName
                ? '--_fg'
                : '--_icon-fg'
      props.set(prop, hit.cssVar)
    }
    if (props.size === 0) continue
    const gate = Object.entries(disabled.when ?? {})
      .map(([k, v]) =>
        propSel(
          c.props.find((p: any) => p.name === k),
          v,
        ),
      )
      .join('')
    // Gated rules out-specify :focus-visible; they emit AFTER the focus block
    // so the file reads in ascending specificity (the emitter is the formatter).
    const bucket = disabled.when ? gatedDisabledRules : stateRules
    bucket.push('')
    bucket.push(
      `${cls}${gate}${controlEntry ? ':has(:disabled)' : ':disabled'} {`,
    )
    if (!disabled.when) bucket.push(`  --_cursor: not-allowed;`)
    for (const [prop, v] of props) bucket.push(`  ${prop}: var(${v});`)
    bucket.push(`}`)
  }

  // Focus: :focus-visible replaces the outline with the ring (the POC mechanism —
  // Secondary's inside border yields to the ring under focus, as upstream does).
  if (ring && maskControl) {
    stateRules.push('')
    stateRules.push(`${cls}:focus-visible {`)
    stateRules.push(
      `  /* a mask clips the outline (measured), and filters apply AFTER`,
    )
    stateRules.push(
      `   * masking — four hard drop-shadows draw a ring hugging the glyph. */`,
    )
    stateRules.push(
      `  filter: drop-shadow(var(--eds-sizing-stroke-thick) 0 0 var(${ring.cssVar}))`,
    )
    stateRules.push(
      `    drop-shadow(calc(-1 * var(--eds-sizing-stroke-thick)) 0 0 var(${ring.cssVar}))`,
    )
    stateRules.push(
      `    drop-shadow(0 var(--eds-sizing-stroke-thick) 0 var(${ring.cssVar}))`,
    )
    stateRules.push(
      `    drop-shadow(0 calc(-1 * var(--eds-sizing-stroke-thick)) 0 var(${ring.cssVar}));`,
    )
    stateRules.push(`}`)
  } else if (ring) {
    stateRules.push('')
    stateRules.push(
      `${cls}${controlEntry ? ':focus-within' : ':focus-visible'} {`,
    )
    stateRules.push(
      `  outline: var(--eds-sizing-stroke-thick) solid var(${ring.cssVar});`,
    )
    stateRules.push(`  outline-offset: var(--eds-sizing-stroke-thin);`)
    stateRules.push(`}`)
  }
  stateRules.push(...gatedDisabledRules)

  for (const ctx of combos) {
    const border = pickRef(r.refs, 'root/border-color', ctx)
    const singleEmpty = combos.length === 1 && Object.keys(ctx).length === 0
    if (!singleEmpty) {
      variantRules.push('')
      variantRules.push(`${selector(ctx)} {`)
      for (const line of channelLines(ctx)) variantRules.push(`  ${line}`)
      variantRules.push(`}`)
    }
    if (border && colorProps.length > 0) {
      const disabledBorder = pickRef(r.refs, 'root/border-color:disabled', ctx)
      if (disabledBorder) {
        stateRules.push('')
        // a control wrapper is never :disabled itself — read through it
        stateRules.push(
          `${selector(ctx)}${controlEntry ? ':has(:disabled)' : ':disabled'} {`,
        )
        stateRules.push(`  --_border: var(${disabledBorder.cssVar});`)
        stateRules.push(`}`)
      }
    }
    // States override whichever channel variables they mention. Selected is an
    // ARIA state, not a pseudo-class; interactive states exclude it — a selected
    // tab is state, not affordance (no selected-hover; it stays focusable).
    // The attribute is what the contract's semantics declare: navigation
    // currents (aria-current, omitted when not current — aria-selected is
    // invalid outside composite-widget roles), toggles press (aria-pressed),
    // composite-widget roles select (aria-selected). Undeclared falls back
    // to role shape: a plain <button> presses, anything roled selects.
    const declared = Object.keys(c.semantics?.aria ?? {})
    const selParts = [
      declared.includes('aria-current') && `[aria-current]`,
      declared.includes('aria-pressed') && `[aria-pressed='true']`,
      declared.includes('aria-selected') && `[aria-selected='true']`,
      declared.includes('aria-checked') && `[aria-checked='true']`,
    ].filter(Boolean) as string[]
    const selAttr =
      selParts.length > 1
        ? `:is(${selParts.join(', ')})`
        : (selParts[0] ??
          (c.semantics.element === 'button' && !c.semantics.role
            ? `[aria-pressed='true']`
            : `[aria-selected='true']`))
    const hasSelected = c.states.some((s: any) => s.name === 'selected')
    const dis = controlEntry ? ':has(:disabled)' : ':disabled'
    const stateSelector = (name: string) =>
      name === 'selected'
        ? `${selAttr}:not(:disabled)`
        : name === 'invalid'
          ? // the platform's own truth: matches only after user interaction
            controlEntry
            ? `:has(:user-invalid):not(${dis})`
            : `:user-invalid:not(:disabled)`
          : `:not(${hasSelected ? `:disabled, ${selAttr}` : dis}):${name}`
    for (const s of c.states.filter(
      (s: any) => s.name !== 'disabled' && s.name !== 'focus',
    )) {
      const overrides: [string, string][] = []
      const sBg = pickRef(r.refs, `root/background-color:${s.name}`, ctx)
      if (sBg) overrides.push(['--_bg', sBg.cssVar])
      const sFg = labelName && pickRef(r.refs, `${fgKey}:${s.name}`, ctx)
      if (sFg) overrides.push(['--_fg', sFg.cssVar])
      const sIcon =
        glyphName && pickRef(r.refs, `${glyphName}/color:${s.name}`, ctx)
      if (sIcon) overrides.push(['--_icon-fg', sIcon.cssVar])
      const sBb = pickRef(r.refs, `root/border-bottom-color:${s.name}`, ctx)
      if (sBb) overrides.push(['--_border-bottom', sBb.cssVar])
      const sElev = pickRef(r.refs, `root/elevation:${s.name}`, ctx)
      if (sElev) overrides.push(['--_elevation', sElev.cssVar])
      const sBorder = pickRef(r.refs, `root/border-color:${s.name}`, ctx)
      if (sBorder) overrides.push(['--_border', sBorder.cssVar])
      if (overrides.length === 0) continue
      // an interactiveOnly state exists only on interactive elements —
      // the markup is the gate, not an attribute
      const gate = s.interactiveOnly ? ':is(a, button)' : ''
      stateRules.push('')
      stateRules.push(`${selector(ctx)}${gate}${stateSelector(s.name)} {`)
      for (const [prop, v] of overrides)
        stateRules.push(`  ${prop}: var(${v});`)
      stateRules.push(`}`)
    }
  }

  // Assemble: sub-layers in declared order — states beat variants beat base,
  // whatever the selector weight.
  const indent = (lines: string[]) =>
    lines.map((line) => (line === '' ? '' : '  ' + line))
  out.push('  @layer base, variants, states;')
  out.push('')
  out.push('  @layer base {')
  out.push(...indent(indent(b)))
  out.push('  }')
  if (variantRules.length > 0) {
    out.push('')
    out.push('  @layer variants {')
    out.push(...indent(indent(variantRules.slice(1))))
    out.push('  }')
  }
  if (stateRules.length > 0) {
    out.push('')
    out.push('  @layer states {')
    out.push(...indent(indent(stateRules.slice(1))))
    out.push('  }')
  }
  out.push('}')
  return out.join('\n') + '\n'
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const r = resolveContract('packages/eds-contracts/contracts/chip.contract.json')
  process.stdout.write(emitCss(r))
}
