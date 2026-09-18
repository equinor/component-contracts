/** Contract harness. Same philosophy as the token package: every number the
 *  emitters produce is recomputed from the source formulas, every name they
 *  reference must exist in the artefacts the token package actually shipped.
 *  Silence is never a pass. */
import { strict as assert } from 'node:assert'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  ledger,
  opticalGeometry,
  pickRef,
  resolveContract,
  UI_CAP,
} from '../src/resolve.ts'
import {
  DENSITIES,
  fontSizeRem,
  remToPx,
  capHeightPx,
} from '../../eds-tokens/src/formulas.ts'
import { emitCss } from '../src/emit-css.ts'
import { emitFigmaPlan } from '../src/emit-figma.ts'
import { emitBuilder } from '../src/emit-builder.ts'
import {
  emitCompositionBuilder,
  emitCompositionCss,
  resolveComposition,
} from '../src/emit-composition.ts'
import { emitDesignMd } from '../src/emit-designmd.ts'
import { emitVerifier, fnv1a, unionLines } from '../src/fingerprint.ts'

const root = fileURLToPath(new URL('../../..', import.meta.url))
let checks = 0
const ok = (cond: boolean, msg: string) => {
  assert.ok(cond, msg)
  checks++
}

const shippedCss = ['typography.css', 'color.css']
  .map((f) => readFileSync(root + 'packages/eds-tokens/build/css/' + f, 'utf8'))
  .join('\n')
const payload = JSON.parse(
  readFileSync(root + 'packages/eds-tokens/build/figma/variables.json', 'utf8'),
)
const knownVars = new Set<string>(
  payload.collections.flatMap((c: any) => c.variables.map((v: any) => v.name)),
)

// ---- 1. geometry: the two pairings and the one-line chip flip ---------------------
{
  const md = opticalGeometry('md', 'sm', 'squished')
  assert.deepEqual(
    md.map((g) => g.heightPx),
    [20, 28, 36],
  )
  checks++
  const sm = opticalGeometry('sm', 'sm', 'squished')
  assert.deepEqual(
    sm.map((g) => g.heightPx),
    [20, 24, 36],
  )
  checks++
  const btn = opticalGeometry('md', 'md', 'squished')
  assert.deepEqual(
    btn.map((g) => g.heightPx),
    [24, 36, 44],
  )
  checks++
  assert.deepEqual(
    btn.map((g) => g.paddingPx),
    [6, 10, 12],
  )
  checks++
  for (const g of [...md, ...sm, ...btn]) {
    ok(
      2 * g.paddingPx + g.lineHeightPx === g.heightPx,
      `invariant holds for ${g.density}`,
    )
  }
}

// ---- 2. per-contract: resolve, emit, verify ---------------------------------------
const EXPECT: Record<
  string,
  { refs: number; variants: number; heights: number[] | null }
> = {
  // v0.5.0 (2026-08-30, review walk): sm label + xs-squared inset — EDS 1.0's
  // 24px chip on the shared rhythm (decision 6 CLOSED); selected UNGATED now
  // that the emphasis-selected rung exists (step 11, active's rung)
  chip: { refs: 101, variants: 60, heights: [20, 24, 36] }, // no focus state authored
  // v0.8.0 (2026-08-30): disabled SPLIT per EDS 1.0 source — the gray plate
  // is primary-only (+border-disabled ref); focus REFUSED on canvas: the
  // State axis loses Focus everywhere (Marco Krenn's point)
  button: { refs: 75, variants: 96, heights: [24, 36, 44] },
  // disabled underline falls back to the resting subtle border (2026-08-29:
  // border-disabled read STRONGER than idle — states only state what changes)
  // v0.2.0 (2026-08-30, review walk): lg label — the original 16px tab
  // (the team's 14px tab is a redesign we don't follow); 36/44/52
  tab: { refs: 8, variants: 4, heights: [36, 44, 52] },
  // v0.2.0 (2026-08-29): negative surface, 12 placements, cap-derived arrow
  // v0.3.0 (2026-08-31, review walk): xs-SQUARED — the squished bubble read
  // too tight (Victor); same pairing as the small chip, heights 20/24/36
  tooltip: { refs: 4, variants: 12, heights: [20, 24, 36] },
  // v0.1.0 (2026-08-29): the field box only — :user-invalid, underline, bg-input
  // v0.3.0: wrapper + native control (:has), icon slots, xs-stretched inset
  // v0.4.0 (2026-08-31, walk): THE BOXED FIELD — the long-planned redesign
  // (old mocks 1059:21044, continued by the team): radius + full border
  // (medium at rest, strong hover, danger-strong invalid, disabled ref);
  // the underline is gone; fields sit on surfaces, never the canvas
  input: { refs: 22, variants: 4, heights: [24, 36, 44] },
  // selection controls (2026-08-29): icon glyphs swapped by the platform's
  // :checked, native input covering the wrapper; EDS 1.0 green in both states
  // checkbox v0.2.0 (2026-08-30): + indeterminate — a third pseudo enum value
  checkbox: { refs: 13, variants: 6, heights: null },
  radio: { refs: 9, variants: 4, heights: null },
  switch: { refs: 9, variants: 4, heights: null },
  // v0.1.0 (2026-08-30): tone strip; the action part was a Button instance
  // v0.2.0 (2026-08-31): the EDS 2.0 mock restored — muted fill, no underline,
  // tone-owned icons (swapByProp), dismiss <button>, READING line-height
  // v0.3.0 (2026-08-31): text-box trim (Figma REFUSES, heights agree anyway);
  // dismiss IS the ghost icon-Button, cap box on the corner; first-line icon;
  // container gap (horizontal-md, Victor's selectable/container/page rule);
  // message ink text-{tone}-strong
  // v0.4.0 (2026-08-31): STATIC = SURFACE TIER — the ghost hover (step 3)
  // needs room above a static tint, so the strip drops to bg-{tone}-surface
  // (step 2); + the subtle tone border (the team's nice touch)
  banner: { refs: 20, variants: 4, heights: [24, 36, 44] },
  // v0.1.0 (2026-08-30): ghost row; selected = the accent ghost-selected rung
  'menu-item': { refs: 14, variants: 5, heights: [24, 36, 44] },
  // the floating panel — first bg-floating consumer; three exposed item instances
  menu: { refs: 3, variants: 1, heights: null },
  // v0.1.0 (2026-08-30): the app chrome — tab-rung geometry, ghost-icon actions
  // v0.2.0 (2026-08-30): underline weight is a contract fact — a hairline
  // seated container: no pairing, no derived text geometry — the bar's height
  // is the tallest seated control + 2×seat (input 24/36/44 + xs 6/8/12 ×2 =
  // 36/52/68), asserted below via the plan's raw seat paddings.
  'top-bar': { refs: 6, variants: 1, heights: null },
  // v0.2.0 (2026-09-05): the rail — surface column, thick subtle endline,
  // items = a true SLOT (fill), Collapse pinned; width 256 / square-edge
  'side-bar': { refs: 3, variants: 2, heights: null },
  // v0.1.0 (2026-09-05): the navigation row — lg-squared, md compressed label;
  // collapsed = iconOnly square (width = height, the centring identity)
  'side-bar-item': { refs: 19, variants: 8, heights: [40, 52, 60] },
  // v0.1.0 (2026-09-05): submenu row — md-squared + DERIVED indent (aligns
  // with the parent's label: parent inset + cap cell + icon gap = 32/40/46)
  'side-bar-sub-item': { refs: 10, variants: 4, heights: [32, 44, 52] },
  // v0.1.0 (2026-08-30): the finale — rows emerge per CELL; density = more rows
  // v0.2.0 (2026-09-06, Victor): + the COMPRESSED size for big data tables
  // (sm cells, sm-squished, rows 20/24/36) — the Size axis doubles the plan's
  // variants; the canvas set stays Default-only for now (ledger: LOWERED)
  table: { refs: 8, variants: 6, heights: [24, 36, 44] },
  // no optical label, no geometry — heights are not this component's fact
  // v0.2.0 (2026-08-31, walk): THE CONTAINER PRIMITIVE — tones and elevation
  // DELETED (neutral surface + subtle outline, the banner rule); hover =
  // elevation-low + border-medium gated on :is(a, button) (the markup is
  // the prop); Figma gets a Slot placeholder; State=Default/Hover only
  card: { refs: 7, variants: 2, heights: null },
  divider: { refs: 3, variants: 2, heights: null },
  label: { refs: 1, variants: 1, heights: null },
}

for (const [name, exp] of Object.entries(EXPECT)) {
  const r = resolveContract(`packages/eds-contracts/contracts/${name}.contract.json`)
  ok(
    r.refs.length === exp.refs,
    `${name}: ${exp.refs} expanded refs (got ${r.refs.length})`,
  )
  if (exp.heights) {
    ok(r.pairings.length > 0, `${name}: pairing derived`)
    assert.deepEqual(
      r.geometry!.map((g) => g.heightPx),
      exp.heights,
    )
    checks++
  } else {
    // derived pairings without own geometry are allowed: the indent and the
    // square-edge recipes borrow ANOTHER contract's facts, and the
    // baseline pad is computed from the same cap formulas (nothing
    // invented, everything computed)
    const borrowed = r.pairings.every(
      (p) =>
        p.name.startsWith('recipe/indent-') ||
        p.name.startsWith('recipe/square-') ||
        p.name.startsWith('figma-only/baseline-pad-'),
    )
    ok(
      r.geometry === null && borrowed,
      `${name}: no optical label, no geometry — nothing invented`,
    )
  }

  // every CSS var the emitter writes exists in the token package's CSS
  const css = emitCss(r)
  const used = [
    ...new Set(
      [...css.matchAll(/var\((--eds-[a-z0-9-]+)\)/g)].map((m) => m[1]),
    ),
  ]
  for (const v of used)
    ok(shippedCss.includes(v + ':'), `${name}: CSS var shipped: ${v}`)
  // 0px is the semantic zero (calc() rejects unitless 0 in subtraction), not a
  // baked design value — everything non-zero must come from a variable.
  // the root's AUTHORED width (the sidebar's 256) is the one sanctioned
  // literal: an owned design fact, constant across densities by decision
  const authoredWidths = [
    r.contract.anatomy.root.width,
    ...Object.values<any>(r.contract.anatomy)
      .filter((p) => p.instance && p.width)
      .map((p) => p.width),
  ].filter(Boolean)
  let cssForPxGuard = css
  for (const w of authoredWidths)
    cssForPxGuard = cssForPxGuard.replaceAll(`inline-size: ${w}px;`, '')
  cssForPxGuard = cssForPxGuard.replace(/\/\*[\s\S]*?\*\//g, '')
  ok(
    !/\b(?!0px\b)\d+(\.\d+)?px\b/.test(cssForPxGuard),
    `${name}: no baked px outside comments`,
  )
  // Variants are data-* attributes (ADR-0006 rule 3, adopted 2026-08-30 —
  // the earlier 'no data-attributes, ADR-0016' rule was a mis-citation).
  // Only the contract's own axes may appear; the token layer's ancestor
  // mode scopes must never leak to component level.
  const allowedAttrs = new Set(
    r.contract.props.map(
      (p: any) =>
        'data-' +
        p.bindings.figma.property.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ),
  )
  for (const m of css.matchAll(/\[(data-[a-z0-9-]+)/g))
    ok(
      allowedAttrs.has(m[1]),
      `${name}: data attribute is a contract axis: ${m[1]}`,
    )
  ok(
    !css.includes('[data-density') && !css.includes('[data-color-scheme'),
    `${name}: ancestor mode scopes stay in the token layer`,
  )

  // every Figma variable the plan binds exists in the ported payload (or is required)
  const plan = emitFigmaPlan(r)
  const known = new Set(knownVars)
  for (const rv of plan.requiredVariables) known.add(rv.name)
  const cs = plan.componentSet
  const bound = [
    ...(cs.root.radiusVar ? [cs.root.radiusVar] : []),
    ...(cs.root.rule ? [cs.root.rule.thicknessVar] : []),
    ...Object.values(cs.bySize).flatMap((s: any) => [
      s.paddingBlock,
      s.paddingInline,
      s.gap,
      ...Object.values(s.label ?? {}),
      ...Object.values(s.glyphs).flatMap((g: any) => [
        g.containerVar,
        g.glyphVar,
      ]),
    ]),
    ...cs.variants.flatMap((v) => [
      v.bg,
      v.fg,
      ...(v.border ? [v.border] : []),
      ...(v.borderBottom ? [v.borderBottom] : []),
    ]),
  ].filter(Boolean)
  for (const vn of bound)
    ok(known.has(vn), `${name}: Figma variable known: ${vn}`)
  ok(
    cs.variants.length === exp.variants,
    `${name}: ${exp.variants} variants (got ${cs.variants.length})`,
  )

  // the ledger accounts for every prop, state, glyph rule and the semantics
  const l = ledger(r)
  const facts = l.map((e) => e.fact)
  for (const p of r.contract.props)
    ok(
      facts.some((f) => f.includes(`prop ${p.name}`)),
      `${name}: ledger covers prop ${p.name}`,
    )
  for (const s of r.contract.states)
    ok(
      facts.some((f) => f === `state ${s.name}`),
      `${name}: ledger covers state ${s.name}`,
    )
  ok(
    l.some((e) => e.figma === 'REFUSED'),
    `${name}: semantics refused on canvas, recorded`,
  )

  // build artefacts are current (regenerate and compare)
  const dir = fileURLToPath(new URL('../build/', import.meta.url))
  for (const [file, fresh] of [
    [`${name}.css`, css],
    [`${name}.figma-plan.json`, JSON.stringify(plan, null, 2) + '\n'],
    [`${name}.figma-build.js`, emitBuilder(plan)],
    [`${name}.ledger.json`, JSON.stringify(ledger(r), null, 2) + '\n'],
  ] as const) {
    let disk = ''
    try {
      disk = readFileSync(dir + file, 'utf8')
    } catch {
      /* not built yet */
    }
    ok(
      disk === fresh,
      `build/${file} matches a fresh generation (run npm run build)`,
    )
  }
}

// ---- 3. contract-specific spot checks ---------------------------------------------
{
  const chip = resolveContract('packages/eds-contracts/contracts/chip.contract.json')
  // v0.5.0: xs-squared + sm label — EDS 1.0's 24px chip on the shared rhythm
  assert.equal(
    chip.pairings[0].name,
    'recipe/optical-padding-xs-squared-sm-label',
  )
  checks++
  assert.deepEqual(chip.pairings[0].values, {
    compact: 4,
    comfortable: 6,
    relaxed: 10,
  })
  checks++
  ok(
    chip.refs.some(
      (x) => x.key === 'icon/glyph' && x.figmaVar === 'sizing/icon-sm',
    ),
    'chip: icon glyph = icon-sm (follows the sm label down)',
  )
  ok(
    chip.refs.some(
      (x) =>
        x.key === 'icon/footprint' && x.figmaVar === 'recipe/cap-rounded-sm',
    ),
    'chip: icon footprint = cap box',
  )
  // v0.3.0: muted chips carry a tone border; emphasis chips flip to on-emphasis ink
  assert.equal(
    pickRef(chip.refs, 'root/border-color', {
      tone: 'warning',
      emphasis: 'muted',
    })!.figmaVar,
    'semantic/border-warning-medium',
  )
  checks++
  assert.equal(
    pickRef(chip.refs, 'label/color', {
      tone: 'success',
      emphasis: 'emphasis',
    })!.figmaVar,
    'semantic/text-success-strong-on-emphasis',
  )
  checks++
  ok(
    pickRef(chip.refs, 'root/border-color', {
      tone: 'success',
      emphasis: 'emphasis',
    }) === undefined,
    'chip: emphasis tier carries no border',
  )
  // v0.5.0: selected UNGATED — both tiers ride their own selected rung
  // (muted step 5, emphasis step 11 — active's rung, its own token)
  ok(
    pickRef(chip.refs, 'root/background-color:selected', {
      tone: 'accent',
      emphasis: 'muted',
    })?.cssVar === '--eds-color-bg-accent-fill-muted-selected' &&
      pickRef(chip.refs, 'root/background-color:selected', {
        tone: 'accent',
        emphasis: 'emphasis',
      })?.cssVar === '--eds-color-bg-accent-fill-emphasis-selected',
    'chip: selected resolves on both tiers',
  )
  const chipCss = emitCss(chip)
  ok(
    chipCss.includes(
      `.eds-chip[data-tone='accent']:is([data-emphasis='muted'], :not([data-emphasis]))[aria-pressed='true']:not(:disabled)`,
    ) &&
      chipCss.includes(
        `.eds-chip[data-tone='accent'][data-emphasis='emphasis'][aria-pressed='true']:not(:disabled)`,
      ),
    'chip: aria-pressed selectors on both tiers',
  )
  ok(
    emitFigmaPlan(chip).componentSet.variants.filter((v) =>
      v.name.includes('State=Selected'),
    ).length === 12 &&
      !ledger(chip).some((e) => e.fact.startsWith('state selected for')),
    'chip: 12 Selected variants — the gate (and its refusal) is gone',
  )

  const btn = resolveContract('packages/eds-contracts/contracts/button.contract.json')
  // both size pairings are same-size cases: already-ported optical tokens
  assert.deepEqual(
    btn.pairings.map((p) => p.name),
    [
      'recipe/optical-padding-md-squished',
      'recipe/optical-padding-sm-squished',
    ],
  )
  checks++
  // pairings live as requiredVariables since the optical grid left the payload
  // (2026-08-30): the builders ensure them on demand, the union accounts them
  for (const p of btn.pairings)
    ok(
      emitFigmaPlan(btn).requiredVariables.some((rv) => rv.name === p.name),
      `button: pairing carried as a required variable: ${p.name}`,
    )
  // the size axis derives small geometry: their 24px button at comfortable
  assert.deepEqual(
    btn.geometryBySize.small.map((g) => g.heightPx),
    [20, 24, 36],
  )
  checks++
  // per-size icon refs: small buttons carry the xs glyph in the sm cap box
  const smallGlyph = pickRef(btn.refs, 'icon/glyph', { size: 'small' })!
  assert.equal(smallGlyph.figmaVar, 'sizing/icon-xs')
  checks++
  // variant overrides: on-emphasis text only for primary; ghost ladder for
  // transparent-resting variants (incl. danger, which joined the ladder for this)
  const on = pickRef(btn.refs, 'label/color', {
    tone: 'accent',
    variant: 'primary',
  })!
  const ghostFg = pickRef(btn.refs, 'label/color', {
    tone: 'accent',
    variant: 'ghost',
  })!
  assert.equal(on.figmaVar, 'semantic/text-accent-strong-on-emphasis')
  checks++
  assert.equal(ghostFg.figmaVar, 'semantic/text-accent-strong')
  checks++
  const dangerGhostHover = pickRef(btn.refs, 'root/background-color:hover', {
    tone: 'danger',
    variant: 'ghost',
  })!
  assert.equal(dangerGhostHover.figmaVar, 'semantic/bg-danger-fill-ghost-hover')
  checks++
  const secondaryBorder = pickRef(btn.refs, 'root/border-color', {
    tone: 'accent',
    variant: 'secondary',
  })!
  assert.equal(secondaryBorder.figmaVar, 'semantic/border-accent-strong')
  checks++
  // secondary and ghost rest transparent — the ghost ladder's literal
  const rest = pickRef(btn.refs, 'root/background-color', {
    tone: 'accent',
    variant: 'ghost',
  })!
  assert.equal(rest.figmaVar, 'semantic/bg-accent-fill-ghost-default')
  checks++
  // focus: ring only — Figma Focus variants keep the resting fill
  const ring = pickRef(btn.refs, 'root/focus-ring:focus')!
  assert.equal(ring.figmaVar, 'concept/border-focus')
  checks++
  const btnPlan = emitFigmaPlan(btn)
  // Focus is REFUSED on canvas (2026-08-30): no State=Focus variant anywhere —
  // the ring is the platform's, carried by :focus-visible in CSS alone.
  ok(
    btnPlan.componentSet.variants.every(
      (v) => !v.name.includes('State=Focus'),
    ) &&
      btnPlan.componentSet.axes.State.includes('Focus') === false &&
      emitCss(btn).includes(':focus-visible'),
    'focus: refused on canvas, carried in CSS',
  )
  ok(
    ledger(btn).some((e) => e.fact === 'state focus' && e.figma === 'REFUSED'),
    'focus refusal is a recorded ledger fact',
  )
  // disabled SPLIT (v0.8.0, per EDS 1.0 source): the gray plate is
  // primary-only; transparent-resting variants stay transparent when disabled
  const disPrimary = btnPlan.componentSet.variants.find(
    (v) =>
      v.name === 'Tone=Accent, Variant=Primary, Size=Default, State=Disabled',
  )!
  assert.equal(disPrimary.bg, 'concept/bg-disabled')
  checks++
  const disGhost = btnPlan.componentSet.variants.find(
    (v) =>
      v.name === 'Tone=Accent, Variant=Ghost, Size=Default, State=Disabled',
  )!
  assert.equal(disGhost.bg, 'semantic/bg-accent-fill-ghost-default')
  checks++
  const disSec = btnPlan.componentSet.variants.find(
    (v) =>
      v.name === 'Tone=Accent, Variant=Secondary, Size=Default, State=Disabled',
  )!
  ok(
    disSec.bg === 'semantic/bg-accent-fill-ghost-default' &&
      disSec.border === 'concept/border-disabled',
    'disabled secondary: transparent with the disabled border, as EDS 1.0',
  )
  ok(
    /\.eds-button:is\(\[data-variant='primary'\], :not\(\[data-variant\]\)\):disabled \{[^}]*--_bg: var\(--eds-color-bg-disabled\);/s.test(
      emitCss(btn),
    ) && !/\.eds-button:disabled \{[^}]*--_bg:/s.test(emitCss(btn)),
    'disabled CSS: the plate is gated to primary; the global rule dims inks only',
  )
  // real icons: both glyph parts carry INSTANCE_SWAP bindings to EDS Assets
  const glyphs = btnPlan.componentSet.parts.filter((p) => p.kind === 'glyph')
  ok(glyphs.length === 2, 'leading and trailing glyph parts')
  ok(
    glyphs.every((g) => g.kind === 'glyph' && g.swap !== undefined),
    'both glyphs carry swap bindings',
  )
  ok(
    btnPlan.componentSet.booleanProps.length === 2,
    'Has Leading Icon + Has Trailing Icon',
  )
  // icon ink = subtle step, decoupled from the label's strong step
  const primaryVariant = btnPlan.componentSet.variants.find(
    (v) =>
      v.name === 'Tone=Accent, Variant=Primary, Size=Default, State=Default',
  )!
  assert.equal(primaryVariant.iconFg, 'semantic/icon-accent-on-emphasis')
  checks++
  const ghostVariant = btnPlan.componentSet.variants.find(
    (v) => v.name === 'Tone=Accent, Variant=Ghost, Size=Default, State=Default',
  )!
  assert.equal(ghostVariant.iconFg, 'semantic/icon-accent')
  checks++

  // ghost-icon: icon-only, even inset, pill radius — EDS 1.x ghost_icon.
  // The optical correction drops out with the text: padding = inset, a circle.
  const gi = btnPlan.componentSet.variants.find(
    (v) =>
      v.name === 'Tone=Accent, Variant=Ghost-icon, Size=Default, State=Default',
  )!
  assert.equal(gi.iconOnly, 'icon')
  checks++
  assert.equal(gi.radiusVar, 'spacing/border-radius-pill')
  checks++
  assert.equal(gi.bg, 'semantic/bg-accent-fill-ghost-default')
  checks++
  assert.equal(gi.iconFg, 'semantic/icon-accent')
  checks++
  assert.equal(
    btnPlan.componentSet.bySize.Default.insetVar,
    'spacing/inset-md-vertical-squished',
  )
  checks++
  // labelled variants carry no structural override
  const labelled = btnPlan.componentSet.variants.find(
    (v) =>
      v.name === 'Tone=Accent, Variant=Primary, Size=Default, State=Default',
  )!
  ok(
    labelled.iconOnly === undefined && labelled.radiusVar === undefined,
    'structure pins to ghost-icon only',
  )
  // in CSS, the modifier squares the insets and zeroes the half-leading
  const btnCss = emitCss(btn)
  ok(
    /\.eds-button\[data-variant='ghost-icon'\] \{[^}]*--_half-leading: 0px;[^}]*--_inset-h: var\(--_inset-v\);[^}]*\}/s.test(
      btnCss,
    ),
    'ghost-icon CSS modifier: even inset via variables only',
  )
  ok(
    btnCss.includes('--_radius: var(--eds-spacing-border-radius-pill);'),
    'ghost-icon CSS modifier: pill radius channel',
  )
  // icon-only creates an obligation: the accessible name must come from the
  // author, and the CSS makes the omission visible (zero-specificity guard so
  // the focus ring, emitted later in the same layer, still wins on focus)
  ok(
    btnCss.includes(
      `.eds-button[data-variant='ghost-icon']:where(:not([aria-label], [aria-labelledby]))`,
    ) &&
      ledger(btn).some(
        (e) =>
          e.fact === 'variant=ghost-icon requires an accessible name' &&
          e.css === 'RESOLVED' &&
          e.figma === 'LOWERED',
      ),
    'ghost-icon: accessible name is a contract obligation — guard + ledger',
  )
}

// ---- 4. the cheap sweep: optional capabilities stay absent, not defaulted ---------
{
  // Divider: a rule — thickness token, border-color ink, no layout, no text.
  const divider = resolveContract(
    'packages/eds-contracts/contracts/divider.contract.json',
  )
  const dPlan = emitFigmaPlan(divider)
  assert.equal(dPlan.componentSet.root.rule?.thicknessVar, 'sizing/stroke-thin')
  checks++
  const dCss = emitCss(divider)
  ok(
    dCss.includes('block-size: var(--eds-sizing-stroke-thin);'),
    'divider: thickness is the stroke token',
  )
  ok(
    !dCss.includes('font:') && !dCss.includes('padding'),
    'divider: no typography, no inset — absent, not defaulted',
  )

  // Card v0.2.0: the container primitive — hover IS the elevation now,
  // and interactivity is the markup's fact.
  const card = resolveContract('packages/eds-contracts/contracts/card.contract.json')
  const cPlan = emitFigmaPlan(card)
  const cHover = cPlan.componentSet.variants.find(
    (v) => v.name === 'State=Hover',
  )!
  assert.equal(cHover.effect, 'elevation/low')
  checks++
  assert.equal(cHover.border, 'semantic/border-neutral-medium')
  checks++
  const cRest = cPlan.componentSet.variants.find(
    (v) => v.name === 'State=Default',
  )!
  ok(
    cRest.effect === undefined &&
      cRest.border === 'semantic/border-neutral-subtle' &&
      cRest.bg === 'semantic/bg-surface',
    'card: resting = neutral surface + subtle outline, no shadow',
  )
  ok(
    cPlan.componentSet.parts.some((p) => p.kind === 'slot'),
    'card: the content area is a Figma slot placeholder',
  )
  assert.equal(
    cPlan.componentSet.bySize.Default.paddingBlock,
    'spacing/inset-md-vertical-squared',
  )
  checks++
  const cCss = emitCss(card)
  ok(
    cCss.includes('padding-block: var(--_inset-v);') &&
      !cCss.includes('--_half-leading'),
    'card: plain inset — no optical correction to drop',
  )
  ok(
    cCss.includes('box-shadow: var(--_elevation, none);'),
    'card: elevation lowers to a shadow with none as the resting fallback',
  )
  ok(
    cCss.includes(':is(a, button):not(:disabled):hover') &&
      !cCss.includes('data-interactive'),
    'card: the markup is the interactivity prop — no attribute invented',
  )

  // Tooltip: NEGATIVE (bg-inverse/text-on-inverse — the December set lacked
  // the words; added as concept tokens), 12 placements, cap-derived arrow.
  const tooltip = resolveContract(
    'packages/eds-contracts/contracts/tooltip.contract.json',
  )
  const tPlan = emitFigmaPlan(tooltip)
  ok(
    tPlan.componentSet.variants.length === 12,
    'tooltip: the EDS 1.0 placement fan, restored',
  )
  const tTop = tPlan.componentSet.variants.find(
    (v) => v.name === 'Side=Top, Align=Start',
  )!
  assert.equal(tTop.bg, 'concept/bg-inverse')
  checks++
  assert.equal(tTop.fg, 'concept/text-on-inverse')
  checks++
  assert.equal(tTop.effect, 'elevation/low')
  checks++
  // placement=top → the arrow sits on the BOTTOM edge, pointing at the anchor
  assert.deepEqual(tTop.pointer, { side: 'top', align: 'start' })
  checks++
  assert.equal(tPlan.componentSet.pointer?.heightVar, 'recipe/pointer-sm')
  checks++
  // The Astryx factoring: one code value (data-placement='top-start'), two
  // Figma axes — Side × Align — same 12 variants, friendlier picker.
  assert.deepEqual(tPlan.componentSet.axes['Side'], [
    'Top',
    'Bottom',
    'Left',
    'Right',
  ])
  checks++
  assert.deepEqual(tPlan.componentSet.axes['Align'], [
    'Start',
    'Center',
    'End',
  ])
  checks++
  ok(
    !('Placement' in tPlan.componentSet.axes),
    'tooltip: the 12-value single axis is gone from the picker',
  )
  assert.deepEqual(tPlan.requiredVariables.map((v) => v.name).sort(), [
    'recipe/optical-padding-xs-squared-sm-label',
    'recipe/pointer-sm',
  ])
  checks++
  // the protrusion derives: half the sm cap box, per density
  assert.deepEqual(
    tPlan.requiredVariables.find((v) => v.name === 'recipe/pointer-sm')!.values,
    { compact: 4, comfortable: 4, relaxed: 6 },
  )
  checks++
  const tCss = emitCss(tooltip)
  ok(
    tCss.includes(`rotate: 45deg;`) &&
      tCss.includes(`.eds-tooltip[data-placement='right-end']::before`),
    'tooltip CSS: pointer pseudo-element + placement attributes',
  )

  // Input: the field box — platform-truth validation, underline, I-beam cursor.
  const input = resolveContract('packages/eds-contracts/contracts/input.contract.json')
  const iCss = emitCss(input)
  ok(
    iCss.includes(':has(:user-invalid):not(:has(:disabled))'),
    'input: invalid reads THROUGH the control — the platform, not a class',
  )
  ok(
    iCss.includes(':focus-within') && iCss.includes(':has(:disabled)'),
    'input: wrapper states via :focus-within / :has(:disabled)',
  )
  ok(
    iCss.includes('font: inherit;') &&
      iCss.includes('& > :is(input, select, textarea) {'),
    'input: the control is an ELEMENT selector, reset flat (accordion.css precedent)',
  )
  ok(
    iCss.includes('cursor: var(--_cursor, text);'),
    'input: resting cursor is the I-beam',
  )
  ok(
    iCss.includes('--_placeholder: var(--eds-color-text-placeholder);') &&
      iCss.includes('& > :is(input, select, textarea)::placeholder'),
    'input: placeholder has its own channel (concept token, not subtle, NEVER disabled)',
  )
  // v0.6.0: BACK TO THE EDS 1.0 FIELD — square, filled, the thin bottom
  // border carries the states (Victor, from his mock 345:1023)
  assert.equal(
    pickRef(input.refs, 'root/border-bottom-color:invalid')!.figmaVar,
    'semantic/border-danger-strong',
  )
  checks++
  assert.equal(
    pickRef(input.refs, 'root/border-bottom-color:hover')!.figmaVar,
    'semantic/border-neutral-strong',
  )
  checks++
  assert.equal(
    pickRef(input.refs, 'root/border-bottom-color:disabled')!.figmaVar,
    'concept/border-disabled',
  )
  checks++
  ok(
    pickRef(input.refs, 'root/border-bottom-color')!.figmaVar ===
      'semantic/border-neutral-medium' &&
      pickRef(input.refs, 'root/border-color') === undefined &&
      pickRef(input.refs, 'root/radius') === undefined &&
      iCss.includes('box-shadow: inset 0'),
    'input: the underline is BACK (EDS 1.0) — square, filled, bottom border carries the states',
  )
  ok(
    iCss.includes(':has(:disabled)') &&
      iCss.match(/:has\(:disabled\)[^{]*\{[^}]*--_border-bottom/s) !== null,
    'input: the wrapper reads disabled THROUGH the control for the underline too',
  )
  // v0.7.0: the value FILLS — trailing icon pins to the end, leading icon
  // keeps the icon gap; one fact, both surfaces (no nested wrapper groups).
  const iPlan = emitFigmaPlan(input)
  ok(
    iPlan.componentSet.parts.some(
      (p) => p.kind === 'text' && p.name === 'value' && p.fill === true,
    ) &&
      iPlan.componentSet.root.fixedWidth === 256 &&
      iCss.includes('flex: 1 1 auto'),
    'input: the value fills on both surfaces — 256 demo edge, control flex',
  )
  ok(
    ledger(input).some(
      (e) => e.fact === 'placeholder ink' && e.figma === 'LOWERED',
    ) &&
      emitFigmaPlan(input).componentSet.variants.every((v) =>
        v.name.includes('Disabled')
          ? v.fg === 'concept/text-disabled'
          : v.fg === 'concept/text-placeholder',
      ),
    'input: canvas presents the EMPTY field — value text wears placeholder ink (LOWERED), disabled keeps its own',
  )

  // Selection controls: platform-truth checkedness, value-gated glyphs.
  const checkbox = resolveContract(
    'packages/eds-contracts/contracts/checkbox.contract.json',
  )
  const cbCss = emitCss(checkbox)
  ok(
    cbCss.includes('appearance: none;') &&
      cbCss.includes('mask-image: var(--_mask);') &&
      cbCss.includes('.eds-checkbox:checked {'),
    'checkbox: ONE native element — the EDS icon is the mask, :checked swaps it',
  )
  ok(
    cbCss.includes('data:image/svg%2Bxml') ||
      cbCss.includes('data:image/svg+xml'),
    'checkbox: icon resolved from @equinor/eds-icons at build time',
  )
  ok(
    cbCss.includes('drop-shadow('),
    'checkbox: focus ring survives the mask via drop-shadow filters',
  )
  ok(
    cbCss.includes('cursor: var(--_cursor, pointer);'),
    'checkbox: pointer cursor (I-beam is for text-entry controls only)',
  )
  ok(
    cbCss.includes('margin: calc((var(--_cap) - var(--_glyph)) / 2);'),
    'checkbox: the control is a glyph — cap-box footprint on the element itself',
  )
  const cbPlan = emitFigmaPlan(checkbox)
  const cbOff = cbPlan.componentSet.variants.find(
    (v) => v.name === 'Checked=Unchecked, State=Default',
  )!
  assert.deepEqual(cbOff.hideParts, ['glyph-on', 'glyph-mixed'])
  checks++
  const cbOn = cbPlan.componentSet.variants.find(
    (v) => v.name === 'Checked=Checked, State=Default',
  )!
  assert.deepEqual(cbOn.hideParts, ['glyph-off', 'glyph-mixed'])
  checks++
  // v0.2.0: indeterminate — its own pseudo-class, emitted last so it wins the
  // overlap (:checked and :indeterminate can be true at once)
  const cbMixed = cbPlan.componentSet.variants.find(
    (v) => v.name === 'Checked=Indeterminate, State=Default',
  )!
  assert.deepEqual(cbMixed.hideParts, ['glyph-off', 'glyph-on'])
  checks++
  ok(
    cbCss.includes('.eds-checkbox:not(:checked, :indeterminate)') &&
      cbCss.indexOf('.eds-checkbox:indeterminate') >
        cbCss.indexOf('.eds-checkbox:checked'),
    'checkbox: indeterminate is a platform pseudo and wins the cascade overlap',
  )
  assert.equal(cbOn.iconFg, 'semantic/icon-accent')
  checks++
  ok(
    cbPlan.componentSet.textProps.length === 0 &&
      cbPlan.componentSet.booleanProps.length === 0,
    'checkbox: no text, no toggles — checkedness is the only axis',
  )

  // Banner v0.2.0: the EDS 2.0 mock — muted fill, tone-owned icons, a real
  // dismiss <button>, and the first READING (default-leading) text.
  const banner = resolveContract('packages/eds-contracts/contracts/banner.contract.json')
  const bPlan = emitFigmaPlan(banner)
  const bIcon = bPlan.componentSet.parts.find(
    (p: any) => p.name === 'icon',
  ) as any
  assert.equal(Object.keys(bIcon.swapByProp.glyphs).length, 4)
  checks++
  assert.equal(bIcon.swapByProp.glyphs.danger.icon, 'error_outlined')
  checks++
  const bDismiss = bPlan.componentSet.parts.find(
    (p: any) => p.name === 'dismiss',
  ) as any
  ok(
    bDismiss.kind === 'instance' &&
      bDismiss.corner === true &&
      bDismiss.component === 'Button' &&
      bDismiss.overrides['Variant'] === 'Ghost-icon' &&
      bDismiss.overrides['↳ Leading Icon'].startsWith('key:'),
    'banner: dismiss IS the ghost icon-Button, corner-anchored, close swapped',
  )
  ok(
    ledger(banner).some(
      (e) =>
        e.fact ===
          'dismiss IS the Button — cap box on the corner, plate overflows like ink' &&
        e.css === 'CARRIED' &&
        e.figma === 'LOWERED',
    ) &&
      ledger(banner).some(
        (e) =>
          e.fact === 'read text is trimmed to the cap box (text-box)' &&
          e.css === 'CARRIED' &&
          e.figma === 'REFUSED',
      ),
    'banner: composition and trim are dispositioned',
  )
  const bWarn = bPlan.componentSet.variants.find(
    (v) => v.name === 'Tone=Warning',
  )!
  assert.equal(bWarn.bg, 'semantic/bg-warning-surface')
  checks++
  assert.equal(bWarn.border, 'semantic/border-warning-subtle')
  checks++
  ok(!bWarn.borderBottom, 'banner: the underline is gone (flat strip)')
  assert.equal(bWarn.fg, 'semantic/text-warning-strong')
  checks++
  assert.equal(bWarn.iconFg, 'semantic/icon-warning')
  checks++
  assert.equal(
    bWarn.glyphSwaps!.icon,
    'e64c0cf5114185fee9676e7b695d947081bbab77',
  )
  checks++
  // container, not atom: the gap is horizontal-md (16), never the icon gap
  assert.equal(bPlan.componentSet.bySize.Default.gap, 'spacing/horizontal-md')
  checks++
  // first-line seat in Figma: the icon container is the LINE BOX tall
  assert.equal(
    bPlan.componentSet.bySize.Default.glyphs.icon.containerHVar,
    'typography/line-height/default/md',
  )
  checks++
  const bBools = bPlan.componentSet.booleanProps
  ok(
    bBools.some((b) => b.property === 'Icon' && b.default === true && b.part === 'icon') &&
      bBools.some(
        (b) =>
          b.property === 'Dismissible' && b.default === false && b.part === 'dismiss',
      ),
    'banner: Icon defaults on, Dismissible defaults off, both bound to their parts',
  )
  // Reading text: default leading changes the padding, never the height.
  const bannerCss = emitCss(banner)
  ok(
    bannerCss.includes('line-height-default') &&
      bannerCss.includes('--eds-half-leading-md-default'),
    'banner: message reads at the default leading with its own half-leading',
  )
  ok(
    bannerCss.includes('text-box: var(--eds-text-box);') &&
      bannerCss.includes('@supports (text-box: trim-both ex alphabetic)') &&
      bannerCss.includes('--_trim-lead: 0px;') &&
      bannerCss.includes('--_baseline-pad: var(--eds-padding-top-baseline);') &&
      bannerCss.includes('padding-block: var(--_baseline-pad) 0;') &&
      bannerCss.includes(
        'padding-block: calc(var(--_inset-v) - var(--_trim-lead));',
      ),
    'banner: baseline-grid trim — ex + rounded-cap compensation, one switch',
  )
  ok(
    bannerCss.includes('& > .eds-button {') &&
      bannerCss.includes(
        'margin-block-start: calc(var(--_trim-lead) - var(--eds-spacing-inset-md-vertical-squished));',
      ) &&
      !bannerCss.includes('.eds-dismiss'),
    'banner: the dismiss is the Button slot seated by the declared overhang',
  )
  ok(
    bannerCss.includes('gap: var(--_gap);') &&
      bannerCss.includes('--_gap: var(--eds-spacing-horizontal-md);'),
    'banner: container gap — horizontal-md, not the icon gap',
  )
  // Four tone rules, four DISTINCT masks — identity is the variant's fact.
  const bMasks = bannerCss.match(/--_mask: url\("[^"]+"\);/g) ?? []
  ok(
    bMasks.length === 4 && new Set(bMasks).size === 4,
    'banner: every tone carries its own distinct mask',
  )
  const bPair = bPlan.requiredVariables.find(
    (v) => v.name === 'recipe/optical-padding-md-squished-default-leading',
  )!
  const bGeo = opticalGeometry('md', 'md', 'squished', 'default')
  for (const g of bGeo)
    assert.equal(
      bPair.values[g.density],
      g.paddingPx,
      `banner pairing ${g.density}`,
    )
  checks += bGeo.length

  // Menu: the selected rung closes December's selected ≡ hover leak.
  const menuItem = resolveContract(
    'packages/eds-contracts/contracts/menu-item.contract.json',
  )
  assert.equal(
    pickRef(menuItem.refs, 'root/background-color:selected')!.figmaVar,
    'semantic/bg-accent-fill-ghost-selected',
  )
  checks++
  assert.equal(
    pickRef(menuItem.refs, 'root/background-color:hover')!.figmaVar,
    'semantic/bg-neutral-fill-ghost-hover',
  )
  checks++
  const miCss = emitCss(menuItem)
  ok(
    miCss.includes(`:is([aria-selected='true'], [aria-checked='true']):not(:disabled)`),
    'menu-item: selection is ARIA, not a class — selected for option, checked for menuitemradio',
  )
  // navigation is CURRENT, not selected: aria-selected is invalid outside
  // composite-widget roles (axe: aria-allowed-attr), so the side-bar items
  // honour their declared semantics.aria and style [aria-current]
  for (const id of ['side-bar-item', 'side-bar-sub-item']) {
    const css = emitCss(resolveContract(`packages/eds-contracts/contracts/${id}.contract.json`))
    ok(
      css.includes(`[aria-current]:not(:disabled)`) && !css.includes('aria-selected'),
      `${id}: selected styles [aria-current], never aria-selected`,
    )
    checks++
  }
  const menu = resolveContract('packages/eds-contracts/contracts/menu.contract.json')
  const mPlan = emitFigmaPlan(menu)
  ok(
    mPlan.componentSet.variants[0].bg === 'concept/bg-floating' &&
      mPlan.componentSet.variants[0].effect === 'elevation/low',
    'menu: the floating panel — elevated surface in dark for free',
  )
  ok(
    mPlan.componentSet.parts.length === 1 &&
      mPlan.componentSet.parts[0].kind === 'slot' &&
      (mPlan.componentSet.parts[0] as any).seed?.length === 3 &&
      mPlan.componentSet.root.bleedGuard === true &&
      mPlan.componentSet.bySize['Default'].paddingBlock ===
        'spacing/border-radius-rounded',
    'menu: a true SLOT seeded with three items; bleed guard = its own radius',
  )

  // Chrome pieces: composition-lite of existing contracts.
  const topBar = resolveContract(
    'packages/eds-contracts/contracts/top-bar.contract.json',
  )
  const tbPlan = emitFigmaPlan(topBar)
  ok(
    tbPlan.componentSet.parts.filter((p) => p.kind === 'instance').length ===
      1 &&
      topBar.geometry === null,
    'top-bar: one search instance; no text-derived geometry (seated)',
  )
  ok(
    tbPlan.componentSet.bySize['Default'].paddingBlock ===
      'spacing/vertical-xs' &&
      tbPlan.componentSet.parts.some(
        (p) =>
          p.kind === 'slot' &&
          (p as any).cluster === 'actions' &&
          (p as any).seed?.length === 3,
      ),
    'top-bar: seat rung (xs, raw) + the actions are an OPEN cluster-slot, seeded with three',
  )
  ok(
    tbPlan.componentSet.root.fixedWidth === 1200 &&
      tbPlan.componentSet.parts.some(
        (p) => p.kind === 'text' && (p as any).fill === true,
      ),
    'top-bar: the contract owns the distribution — title fills a fixed-width strip',
  )
  const tbCss = emitCss(topBar)
  ok(
    tbCss.includes('margin-inline-end: auto;') &&
      tbCss.includes('var(--eds-spacing-horizontal-md)') &&
      tbCss.includes(
        'inset 0 calc(-1 * var(--eds-sizing-stroke-thick)) 0',
      ),
    'top-bar: fill margin, container gap 16, thick subtle underline',
  )
  // The sidebar rows: the collapsed square + the derived indent.
  const sbi = resolveContract(
    'packages/eds-contracts/contracts/side-bar-item.contract.json',
  )
  const sbiPlan = emitFigmaPlan(sbi)
  ok(
    sbiPlan.componentSet.variants.filter((v) => (v as any).iconOnly).length ===
      4 &&
      sbiPlan.componentSet.parts.some((p) => p.kind === 'flag') &&
      (sbiPlan.componentSet.booleanProps[0] as any).parts?.length === 2,
    'side-bar-item: collapsed = iconOnly square; hasMenu gates chevron AND flag',
  )
  const sbiCss = emitCss(sbi)
  ok(
    sbiCss.includes(
      "&:is([data-collapsed='true'], [data-collapsed='true'] *)[data-has-menu]",
    ) &&
      sbiCss.includes('clip-path: polygon(100% 0, 100% 100%, 0 100%);') &&
      sbiCss.includes(
        "--_border-bottom: var(--eds-color-border-accent-strong);",
      ),
    'side-bar-item: flag pseudo gated on both facts; selected re-inks the underline',
  )
  const sbs = resolveContract(
    'packages/eds-contracts/contracts/side-bar-sub-item.contract.json',
  )
  const indent = sbs.pairings.find((p) =>
    p.name.startsWith('recipe/indent-'),
  )!
  assert.deepEqual(indent.values, { compact: 32, comfortable: 40, relaxed: 46 })
  checks++
  ok(
    emitCss(sbs).includes(
      'padding-inline-start: calc(var(--eds-spacing-inset-lg-horizontal) + var(--eds-cap-rounded-md) + var(--eds-spacing-icon-md-gap-horizontal));',
    ),
    'side-bar-sub-item: the indent is the alignment rule, composed live',
  )
  const sideBar = resolveContract(
    'packages/eds-contracts/contracts/side-bar.contract.json',
  )
  const sbPlan = emitFigmaPlan(sideBar)
  ok(
    sbPlan.componentSet.parts.some(
      (p) => p.kind === 'slot' && (p as any).fill && (p as any).seed?.length === 5,
    ) &&
      sbPlan.componentSet.parts.some(
        (p) => p.kind === 'instance' && (p as any).component === 'Side-bar-item',
      ) &&
      sbPlan.componentSet.root.endlineVar === 'sizing/stroke-thick' &&
      sbPlan.componentSet.variants.find((v) => v.name.includes('Collapsed=True'))!
        .widthVar === 'recipe/square-side-bar-item',
    'side-bar: filling item SLOT + pinned Collapse; thick endline; collapsed width = the square edge',
  )
  const sbCss = emitCss(sideBar)
  ok(
    sbCss.includes('inline-size: 256px;') &&
      sbCss.includes(
        "inline-size: calc(var(--eds-spacing-inset-lg-vertical-squared) * 2 + var(--eds-cap-rounded-md));",
      ) &&
      sbCss.includes('margin-block-start: auto;'),
    'side-bar: authored width, live collapsed calc, Collapse pinned',
  )

  // Table: the density centerpiece — the invariant holds per CELL.
  const table = resolveContract('packages/eds-contracts/contracts/table.contract.json')
  const tblCss = emitCss(table)
  ok(
    tblCss.includes('& th,') &&
      tblCss.includes(
        'padding-block: calc(var(--_inset-v) - var(--_half-leading));',
      ),
    'table: cells keep the invariant — row heights emerge',
  )
  ok(
    !tblCss.includes('border-block-end') &&
      tblCss.includes(
        'box-shadow: inset 0 calc(-1 * var(--eds-sizing-stroke-thick))',
      ) &&
      tblCss.includes(
        'box-shadow: inset 0 calc(-1 * var(--eds-sizing-stroke-thin))',
      ),
    'table: separators overlay the padding (inset shadow) — rows stay on the 4px grid',
  )
  ok(
    tblCss.includes(`tbody tr[aria-selected='true']`) &&
      tblCss.includes('bg-accent-fill-ghost-selected'),
    'table: the selected row binds the selected rung',
  )
  const tblPlan = emitFigmaPlan(table)
  ok(
    tblPlan.componentSet.table !== undefined &&
      tblPlan.componentSet.table!.columns.length === 4 &&
      tblPlan.componentSet.table!.selectedBg ===
        'semantic/bg-accent-fill-ghost-selected',
    'table: the Figma grid plan carries demo data + the selected rung',
  )

  // Label: typography only — no box at all.
  const label = resolveContract('packages/eds-contracts/contracts/label.contract.json')
  const lPlan = emitFigmaPlan(label)
  const lSize = lPlan.componentSet.bySize.Default
  ok(
    lSize.paddingBlock === undefined && lSize.label !== undefined,
    'label: text binds without a box',
  )
  const lCss = emitCss(label)
  ok(
    !lCss.includes('background-color') && !lCss.includes('padding-inline'),
    'label: no background, no inset — the smallest contract',
  )
  // v0.2.0: the caption sits ON the baseline grid — and BOTH surfaces trim.
  ok(
    lCss.includes('text-box: var(--eds-text-box)') &&
      lCss.includes('padding-block: var(--_baseline-pad) 0') &&
      lCss.includes('@supports (text-box: trim-both ex alphabetic)'),
    'label: baseline trim is @supports-gated — the line box is the fallback',
  )
  ok(
    lPlan.componentSet.root.baselinePad === 'figma-only/baseline-pad-sm' &&
      lPlan.componentSet.root.fixedWidth === 256 &&
      lPlan.componentSet.parts.some(
        (p) => p.kind === 'text' && p.trim === true && p.fill === true,
      ),
    'label: Figma trims too — leadingTrim + the figma-only pad, text FILLs to wrap (issue #40)',
  )
  // the pad is RECOMPUTED: capRounded − rawCap per density — the value CSS
  // must never read (CSS pads round(1cap,4px) − 1ex from the ex line, live)
  const pad = label.pairings.find(
    (p) => p.name === 'figma-only/baseline-pad-sm',
  )!
  for (const [density, v] of Object.entries(pad.values)) {
    const fontPx = remToPx(fontSizeRem(DENSITIES[density], 'sm'))
    ok(
      v === capHeightPx(fontPx, UI_CAP) - Math.round(fontPx * UI_CAP),
      `label: the ${density} baseline pad is grid cap − Figma's pixel cap, recomputed`,
    )
  }
  ok(
    pad.codeSyntax.includes('FIGMA-ONLY') && pad.description.includes('never be read in code'),
    'label: the figma-only value confesses itself — code syntax and description both warn',
  )
  ok(
    ledger(label).some(
      (f) => f.fact.includes('baseline grid') && f.figma === 'CARRIED' && f.css === 'CARRIED',
    ),
    'label: the trim is CARRIED on both surfaces — a fact, not a divergence',
  )
}

// ---- 5. compositions: layout only — every box belongs to a contract ---------------
{
  const spec = JSON.parse(
    readFileSync(root + 'packages/eds-contracts/compositions/text-field.json', 'utf8'),
  )
  const r = resolveComposition(spec)
  const css = emitCompositionCss(r)
  ok(
    shippedCss.includes(r.gapCssVar + ':'),
    'text-field: gap var shipped: ' + r.gapCssVar,
  )
  ok(
    !/color|font|background/.test(css),
    'text-field: the composition owns layout only',
  )
  ok(
    css.includes('align-items: stretch') &&
      spec.parts.some((p) => p.component === 'Input' && p.fill === true),
    'text-field: the Input fills the container — labels caption, the box spans',
  )
  // the markup pattern only uses classes the contracts (or this composition) emit
  const markup = spec.markup.join('\n')
  for (const cls of ['eds-text-field', 'eds-label', 'eds-input'])
    ok(markup.includes(cls), `text-field markup uses ${cls}`)
  ok(
    markup.includes('<input id=') && !markup.includes('eds-value'),
    'text-field markup: the control is a bare element (element selector, not class)',
  )
  // every Figma part names a generated component
  const generated = new Set([
    'Label',
    'Input',
    'Button',
    'Chip',
    'Tab',
    'Card',
    'Divider',
    'Tooltip',
  ])
  for (const part of spec.parts)
    ok(
      generated.has(part.component),
      `text-field part exists: ${part.component}`,
    )
  // artefact freshness
  const dir = fileURLToPath(new URL('../build/', import.meta.url))
  for (const [file, fresh] of [
    ['text-field.css', css],
    ['text-field.figma-build.js', emitCompositionBuilder(r)],
  ] as const) {
    let disk = ''
    try {
      disk = readFileSync(dir + file, 'utf8')
    } catch {
      /* not built yet */
    }
    ok(disk === fresh, `build/${file} matches a fresh generation`)
  }
}

// ---- 6. the union fingerprint: the Figma file's expected variable universe --------
{
  const req = new Map<string, any>()
  for (const name of Object.keys(EXPECT)) {
    const plan = emitFigmaPlan(
      resolveContract(`packages/eds-contracts/contracts/${name}.contract.json`),
    )
    for (const rv of plan.requiredVariables) {
      const prev = req.get(rv.name)
      ok(
        !prev || JSON.stringify(prev.values) === JSON.stringify(rv.values),
        `union: ${rv.name} agrees across contracts`,
      )
      if (!prev) req.set(rv.name, rv)
    }
  }
  const lines = unionLines([...req.values()])
  const hash = fnv1a(lines)
  const dir = fileURLToPath(new URL('../build/', import.meta.url))
  const fp = JSON.parse(readFileSync(dir + 'figma.fingerprint.json', 'utf8'))
  ok(
    fp.hash === hash && fp.variables === lines.length,
    `union fingerprint is current: ${hash} over ${lines.length} variables`,
  )
  ok(
    readFileSync(dir + 'verify-figma.js', 'utf8') === emitVerifier(lines, hash),
    'build/verify-figma.js matches a fresh generation',
  )
  // every variable either came from the token payload or was minted by a
  // contract: recipe/* (CSS composes the same value live) or figma-only/*
  // (the value exists ONLY to make Figma converge — code must never read it)
  ok(
    fp.payloadVariables + fp.recipeVariables === fp.variables &&
      [...req.keys()].every(
        (n) => n.startsWith('recipe/') || n.startsWith('figma-only/'),
      ),
    'union: payload + recipe/* + figma-only/* is exhaustive — nothing else is expected in the file',
  )
}

// ---- 6b. contract extension (ADR-0007): merged, verified, refused ----------------
{
  // the success path: a local system's button gains a link variant
  const ext = resolveContract(
    'packages/eds-contracts/test/fixtures/example-link.button.contract.json',
  )
  ok(ext.contract.id === 'example.button', 'extension keeps its own id')
  ok(ext.contract.extends === 'eds.button@0.8.0', 'provenance is recorded on the merge')
  assert.deepEqual(
    ext.contract.props.find((p: any) => p.name === 'variant').type.enum,
    ['primary', 'secondary', 'ghost', 'ghost-icon', 'link'],
    'enum values append, base order kept',
  )
  ok(
    (ext.extensionDiff ?? []).length === 5,
    `the diff reports every divergence (${ext.extensionDiff?.length} entries: enum + 4 variant blocks)`,
  )
  const extCss = emitCss(ext)
  ok(extCss.includes('.example-button'), 'a local component carries its local class name')
  ok(!extCss.includes('.eds-button'), 'the extension does not squat on the upstream class')
  ok(
    extCss.includes(`[data-variant='link']`) && extCss.includes('--eds-color-text-link'),
    'the link variant emits, bound to existing tokens only',
  )
  // the base contract is untouched by the merge
  const base = resolveContract('packages/eds-contracts/contracts/button.contract.json')
  ok(
    base.contract.props.find((p: any) => p.name === 'variant').type.enum.length === 4 &&
      base.extensionDiff === null,
    'the upstream contract is unchanged and carries no diff',
  )
  checks += 7

  // the refusal path: an info tone needs a ghost ladder the system lacks
  let refused = ''
  try {
    resolveContract('packages/eds-contracts/test/fixtures/example-info.button.contract.json')
  } catch (e: any) {
    refused = e.message
  }
  ok(
    refused.includes('bg-info-fill-ghost'),
    'an unsatisfiable extension is REFUSED with the missing token named — the gap becomes an upstream request, never a broken component',
  )
  checks++
}

// ---- 7. DESIGN.md: the fourth renderer --------------------------------------------
{
  const md = emitDesignMd()
  const disk = readFileSync(root + 'DESIGN.md', 'utf8')
  ok(disk === md, 'DESIGN.md matches a fresh generation (run pnpm run build)')
  ok(
    md.startsWith('---\nversion: alpha\nname: EDS'),
    'DESIGN.md: spec frontmatter (version, required name)',
  )
  // the eight canonical sections, in spec order, no duplicates
  const sections = [...md.matchAll(/^## (.+)$/gm)].map((m) => m[1])
  const canonical = [
    'Overview',
    'Modes',
    'Colors',
    'Typography',
    'Layout',
    'Elevation & Depth',
    'Shapes',
    'Components',
    "Do's and Don'ts",
  ]
  assert.deepEqual(sections, canonical)
  checks++
  ok(
    new Set(sections).size === sections.length,
    'DESIGN.md: no duplicate sections (linter error otherwise)',
  )
  // whitelists are computed, not asserted: every family row names its binders
  ok(
    md.includes(
      '| `bg-*-fill-emphasis-*` | the filled call-to-action tier | eds.button, eds.chip |',
    ),
    'DESIGN.md: whitelist computed from contract bindings',
  )
  ok(
    md.includes('eds.tooltip') && md.includes('bg-inverse'),
    'DESIGN.md: inverse surface whitelist present',
  )
  // failure modes come from the ledgers (placeholder ink left this list on
  // 2026-09-04 when it became LOWERED — the canvas presents the empty field)
  ok(
    md.includes('read text is trimmed to the cap box') &&
      !md.includes('placeholder ink'),
    'DESIGN.md: REFUSED ledger entries surface as failure modes',
  )
  // thin-file rule: points at artifacts rather than inlining the token set
  ok(
    md.length < 12000,
    `DESIGN.md stays thin (${md.length} chars — pointers, not payloads)`,
  )
  // the VERBOSE variant: the fairness experiment's input — nothing held back
  const vb = emitDesignMd(true)
  ok(
    readFileSync(
      root + 'DESIGN.verbose.md',
      'utf8',
    ) === vb,
    'DESIGN.verbose.md matches a fresh generation',
  )
  ok(
    vb.length > 4 * md.length &&
      vb.includes('bg-accent-fill-ghost-hover:') &&
      vb.includes('button-neutral-ghost-default:') &&
      vb.includes('light-dark('),
    `DESIGN.verbose.md discloses everything (${vb.length} chars: full palette, per-variant recipes, resolved states)`,
  )
}

console.log(
  `\nPASS — ${checks} checks, contracts resolved, emitters verified against shipped tokens.`,
)
