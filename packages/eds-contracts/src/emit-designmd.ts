/** Contracts → DESIGN.md: the fourth renderer.
 *
 *  Conforms to Google Labs' design.md spec (github.com/google-labs-code/
 *  design.md, docs/spec.md, version alpha) — verifiable with their own
 *  linter: `npx @google/design.md lint DESIGN.md`. The emitter is the
 *  formatter, again.
 *
 *  Atlassian's instrumented test found the format's failure modes: no
 *  on-demand loading, lossy compression, component recreation over reuse.
 *  This file answers them: it is THIN (rules and pointers; the artifacts are
 *  loaded on demand), DERIVED (whitelists computed from which contracts bind
 *  a token; failure modes are the ledgers' REFUSED entries; numbers from the
 *  same formulas the harness checks against Chrome), and it carries MODES —
 *  the spec's flat token set cannot express density or color-scheme, so
 *  colors ship as light-dark() pairs (a valid CSS color string) and the
 *  dimensions are the comfortable-density digest with the loss declared.
 *
 *  The prose follows zudo-css-wisdom's eight tone-spec rules (numbers not
 *  adjectives, whitelists not vibes, state defaults first, contrastive
 *  examples, rules co-located with tables, named failure modes, measured
 *  anchors, front-loaded non-negotiables), folded into the spec's canonical
 *  sections. "A token table without adjacent usage rules reads to an LLM as
 *  an all-you-can-eat menu" — here the usage rules are generated, so they
 *  cannot drift from the system they describe. */
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  ledger,
  pickRef,
  propCombos,
  resolveContract,
  tokenUniverse,
  type ResolvedContract,
} from './resolve.ts'

const pkg = fileURLToPath(new URL('..', import.meta.url))
const repo = fileURLToPath(new URL('../../..', import.meta.url))
const loadJson = (rel: string) => JSON.parse(readFileSync(repo + rel, 'utf8'))

/** Resolve a semantic/concept color name to per-scheme hex via the alias. */
function schemeHex(): (name: string) => string {
  return schemeColors().byName as any
}

/** Full color machinery: by friendly-inference name, by DTCG path, and the
 *  complete enumeration (for the verbose variant's Atlassian-grade dump). */
function schemeColors() {
  const semantic = loadJson(
    'packages/eds-tokens/tokens/semantic-color.tokens.json',
  ).color
  const schemes = {
    light: loadJson('packages/eds-tokens/tokens/color-scheme/light.tokens.json')
      .color,
    dark: loadJson('packages/eds-tokens/tokens/color-scheme/dark.tokens.json')
      .color,
  }
  // The authored value is oklch (components); hex is the derived sRGB
  // projection. The doc states the authored truth.
  const cssColor = (v: any): string | undefined =>
    v?.colorSpace === 'oklch' && Array.isArray(v.components)
      ? `oklch(${v.components.join(' ')})`
      : v?.hex
  const paletteHex = (scheme: 'light' | 'dark', path: string) => {
    // {color.palette.family.step} or {color.concept.name}
    const parts = path.replace(/[{}]/g, '').split('.').slice(1)
    let node: any = schemes[scheme]
    for (const p of parts) node = node?.[p]
    return cssColor(node?.$value)
  }
  const byGroup = (
    group: 'semantic' | 'concept',
    name: string,
  ): { light: string; dark: string } => {
    const token = semantic[group]?.[name]
    if (!token) {
      // scheme-valued concept (bg-floating lives in the scheme files)
      const l = cssColor(schemes.light.concept?.[name]?.$value)
      const d = cssColor(schemes.dark.concept?.[name]?.$value)
      if (l && d) return { light: l, dark: d }
      throw new Error(`designmd: unknown color ${name}`)
    }
    const v = token.$value
    if (typeof v === 'string') {
      const light = paletteHex('light', v)
      const dark = paletteHex('dark', v)
      if (!light || !dark)
        throw new Error(`designmd: unresolved alias for ${name}`)
      return { light, dark }
    }
    return { light: 'transparent', dark: 'transparent' }
  }
  const byName = (name: string) => {
    const group =
      name.startsWith('bg-inverse') ||
      name.startsWith('text-on-inverse') ||
      name.startsWith('bg-floating') ||
      name.endsWith('-disabled') ||
      name === 'border-focus'
        ? 'concept'
        : 'semantic'
    return byGroup(group as 'semantic', name)
  }
  const byPath = (path: string) => {
    const parts = path.replace(/[{}]/g, '').split('.')
    return byGroup(parts[1] as 'semantic', parts[2])
  }
  const all = (): { name: string; light: string; dark: string }[] => {
    const out: { name: string; light: string; dark: string }[] = []
    for (const group of ['semantic', 'concept'] as const) {
      // concepts may live only in the scheme files (bg-floating) — a recipe
      // that references one needs it defined, or the linter reports broken-ref
      const names = new Set([
        ...Object.keys(semantic[group] ?? {}),
        ...(group === 'concept' ? Object.keys(schemes.light.concept ?? {}) : []),
      ])
      for (const name of names) {
        if (name.startsWith('$')) continue
        try {
          out.push({ name, ...byGroup(group, name) })
        } catch {
          /* interpolated or unresolved entries stay out of the dump */
        }
      }
    }
    return out
  }
  return { byName, byPath, all }
}

/** Token families whose USAGE the whitelist explains — co-located with the table. */
const FAMILIES: { key: string; test: RegExp; intent: string }[] = [
  {
    key: 'bg-*-fill-emphasis-*',
    test: /^color\.semantic\.bg-.*-fill-emphasis-/,
    intent: 'the filled call-to-action tier',
  },
  {
    key: 'bg-*-fill-muted-*',
    test: /^color\.semantic\.bg-.*-fill-muted-/,
    intent: 'the quiet opaque fill tier',
  },
  {
    key: 'bg-*-fill-ghost-*',
    test: /^color\.semantic\.bg-.*-fill-ghost-/,
    intent:
      'the ghost ladder — transparent-resting surfaces (hover = step 3, active = step 4)',
  },
  {
    key: 'bg-*-surface / bg-*-canvas',
    test: /^color\.semantic\.bg-.*-(surface|canvas)$/,
    intent: 'tone surfaces; canvas sits below surface in BOTH schemes',
  },
  {
    key: 'icon-*',
    test: /^color\.semantic\.icon-/,
    intent:
      'icon ink — the SUBTLE step (icons are graphical objects: APCA Lc60, not Lc90)',
  },
  {
    key: 'text-*-strong / *-on-emphasis',
    test: /^color\.semantic\.text-/,
    intent: 'text ink; on-emphasis variants invert on filled tiers',
  },
  {
    key: 'bg-inverse + text-on-inverse',
    test: /^color\.concept\.(bg-inverse|text-on-inverse)$/,
    intent: 'the inverse surface — a negative panel on either scheme',
  },
  {
    key: 'bg-floating',
    test: /^color\.concept\.bg-floating$/,
    intent:
      'the ELEVATED surface: white in light; one step ABOVE surface in dark',
  },
  {
    key: 'border-focus',
    test: /^color\.concept\.border-focus$/,
    intent: 'the focus ring — it REPLACES the border, mirroring :focus-visible',
  },
  {
    key: '*-disabled',
    test: /^color\.concept\.(bg|text|border)-disabled$/,
    intent: 'disabled ink and fill; states only state what changes',
  },
]

/** verbose=false: the production file — deliberately THIN (rules and
 *  pointers; the harness pins the size). verbose=true: the Atlassian-grade
 *  variant for the fairness experiment (demos/building-the-button): every
 *  color value, the full scales, per-variant recipes with resolved values —
 *  same sources, same generation, different disclosure. */
export function emitDesignMd(verbose = false): string {
  const resolved: ResolvedContract[] = readdirSync(pkg + 'contracts')
    .filter((f) => f.endsWith('.contract.json'))
    .map((f) => resolveContract(`packages/eds-contracts/contracts/${f}`))
  const compositions = readdirSync(pkg + 'compositions')
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(pkg + 'compositions/' + f, 'utf8')))

  const colors = schemeColors()
  const hex = colors.byName
  const uni = tokenUniverse()
  const comfy = loadJson(
    'packages/eds-tokens/tokens/density/comfortable.tokens.json',
  )

  const whitelist = FAMILIES.map((fam) => ({
    ...fam,
    boundBy: resolved
      .filter((r) => r.refs.some((x) => fam.test.test(x.path)))
      .map((r) => r.contract.id),
  }))

  const refused = new Map<string, string>()
  for (const r of resolved) {
    for (const e of ledger(r)) {
      if (e.figma === 'REFUSED' && !e.fact.startsWith('semantics'))
        refused.set(e.fact, e.note)
    }
  }

  const payload = loadJson('packages/eds-tokens/build/figma/variables.json')
  const varCount = payload.collections.reduce(
    (n: number, c: any) => n + c.variables.length,
    0,
  )

  const heights = resolved
    .filter((r) => r.geometry)
    .map(
      (r) =>
        `| ${r.contract.id} | ${r.geometry!.map((g) => g.heightPx).join(' / ')} |`,
    )

  const inventory = resolved.map((r) => {
    const c = r.contract
    const axes = c.props
      .filter((p: any) => p.type.enum)
      .map((p: any) => `${p.name}(${p.type.enum.length})`)
      .join(' × ')
    const states = c.states.map((s: any) => s.name).join(', ') || '—'
    return `| ${c.id} | ${c.version} | ${axes || '—'} | ${states} |`
  })

  const fs = (size: string) =>
    comfy.typography['font-size'][size].$value.value + 'rem'

  /** Resolve any ref path to a printable value: colors as light-dark() pairs,
   *  dimensions at comfortable density (the declared digest loss). */
  const refValue = (path: string): string => {
    if (path.startsWith('color.')) {
      const v = colors.byPath(path)
      return v.light === v.dark
        ? v.light
        : `light-dark(${v.light}, ${v.dark})`
    }
    const t = uni.get(path)
    const v = t?.$value
    if (v && typeof v === 'object' && 'value' in v) return `${v.value}${v.unit}`
    if (typeof v === 'number' || typeof v === 'string') return String(v)
    return `{${path}}`
  }

  const out: string[] = []
  out.push('---')
  out.push('version: alpha')
  out.push('name: EDS')
  out.push('description: >-')
  out.push(
    '  Equinor Design System, December architecture — contract-driven. GENERATED',
  )
  out.push(
    '  from eds-contracts (the fourth renderer, beside CSS and Figma); edit the',
  )
  out.push(
    '  contracts, not this file. The format has no theming, so colors ship as',
  )
  out.push(
    '  paired tokens (name + name-dark); dimensions are the comfortable-density',
  )
  out.push(
    '  digest — the normative values are the DTCG tokens (see Overview).',
  )
  out.push('colors:')
  const colorPairs: [string, string][] = [
    ['primary', 'bg-accent-fill-emphasis-default'],
    ['on-primary', 'text-accent-strong-on-emphasis'],
    ['canvas', 'bg-canvas'],
    ['surface', 'bg-surface'],
    ['floating', 'bg-floating'],
    ['inverse', 'bg-inverse'],
    ['on-inverse', 'text-on-inverse'],
    ['text', 'text-neutral-strong'],
    ['text-subtle', 'text-neutral-subtle'],
    ['danger', 'bg-danger-fill-emphasis-default'],
    ['focus', 'border-focus'],
    ['disabled', 'bg-disabled'],
  ]
  for (const [name, token] of colorPairs) {
    const v = hex(token)
    out.push(`  ${name}: "${v.light}"`)
    if (v.dark !== v.light) out.push(`  ${name}-dark: "${v.dark}"`)
  }
  if (verbose) {
    // the full palette-resolved set, both schemes — nothing held back.
    // The friendly aliases above own their names: a semantic token that
    // happens to share one (text-subtle) would be a duplicate YAML key.
    const taken = new Set(colorPairs.map(([name]) => name))
    for (const c of colors.all()) {
      if (taken.has(c.name)) continue
      out.push(`  ${c.name}: "${c.light}"`)
      if (c.dark !== c.light) out.push(`  ${c.name}-dark: "${c.dark}"`)
    }
  }
  out.push('typography:')
  out.push('  body:')
  out.push('    fontFamily: "Inter"')
  out.push(`    fontSize: "${fs('md')}"`)
  out.push('    lineHeight: 1.429')
  out.push('  label:')
  out.push('    fontFamily: "Inter"')
  out.push(`    fontSize: "${fs('sm')}"`)
  out.push('    lineHeight: 1.334')
  if (verbose) {
    // the full scale, both families, both leading curves (comfortable digest)
    const lh = comfy.typography['line-height']
    for (const size of Object.keys(comfy.typography['font-size'])) {
      if (size.startsWith('$')) continue
      out.push(`  body-${size}:`)
      out.push('    fontFamily: "Inter"')
      out.push(`    fontSize: "${fs(size)}"`)
      for (const curve of ['compressed', 'default']) {
        const v = lh?.[curve]?.[size]?.$value
        if (v) out.push(`    lineHeight-${curve}: "${v.value}${v.unit}"`)
      }
      const h = comfy.typography['header-font-size']?.[size]?.$value
      if (h) {
        out.push(`  header-${size}:`)
        out.push('    fontFamily: "Equinor"')
        out.push(`    fontSize: "${h.value}${h.unit}"`)
      }
    }
  }
  out.push('rounded:')
  out.push('  none: "0px"')
  out.push('  md: "4px"')
  out.push('  pill: "1000px"')
  out.push('spacing:')
  out.push('  xs: "8px"')
  out.push('  sm: "12px"')
  out.push('  md: "16px"')
  out.push('  lg: "24px"')
  if (verbose) {
    // every spacing token at comfortable — insets, gaps, strokes, radii, icons
    for (const [name, t] of Object.entries<any>(comfy.spacing)) {
      if (name.startsWith('$')) continue
      const v = t?.$value
      if (v && typeof v === 'object' && 'value' in v)
        out.push(`  ${name}: "${v.value}${v.unit}"`)
    }
  }
  out.push('components:')
  if (verbose) {
    // per-variant recipes, resolved and deduped — generated from the refs
    const CHANNELS: [string, string][] = [
      ['root/background-color', 'backgroundColor'],
      ['root/border-color', 'borderColor'],
      ['root/border-bottom-color', 'borderBottomColor'],
      ['icon/color', 'iconColor'],
    ]
    for (const r of resolved) {
      const c = r.contract
      const short = c.id.replace(/^eds\./, '')
      const textPart = Object.entries<any>(c.anatomy).find(
        ([n, p]) => n !== 'root' && p.typography,
      )?.[0]
      const combos = propCombos(c.props)
      const seen = new Set<string>()
      for (const combo of combos) {
        const recipe: [string, string][] = []
        for (const [key, prop] of CHANNELS) {
          const ref = pickRef(r.refs, key, combo)
          if (ref) recipe.push([prop, `"{colors.${ref.path.split('.')[2]}}"`])
        }
        if (textPart) {
          const ref = pickRef(r.refs, `${textPart}/color`, combo)
          if (ref) recipe.push(['textColor', `"{colors.${ref.path.split('.')[2]}}"`])
        }
        const radius = pickRef(r.refs, 'root/radius', combo)
        if (radius)
          recipe.push([
            'rounded',
            radius.path.includes('pill') ? '"{rounded.pill}"' : '"{rounded.md}"',
          ])
        if (recipe.length === 0) continue
        const sig = JSON.stringify(recipe)
        if (seen.has(sig)) continue
        seen.add(sig)
        const name =
          Object.values(combo).length === 0
            ? short
            : `${short}-${Object.values(combo).join('-')}`
        out.push(`  ${name}:`)
        for (const [prop, v] of recipe) out.push(`    ${prop}: ${v}`)
      }
    }
  }
  out.push('  button-primary:')
  out.push('    backgroundColor: "{colors.primary}"')
  out.push('    textColor: "{colors.on-primary}"')
  out.push('    rounded: "{rounded.md}"')
  out.push('  chip-muted:')
  out.push('    rounded: "{rounded.pill}"')
  out.push('  tooltip:')
  out.push('    backgroundColor: "{colors.inverse}"')
  out.push('    textColor: "{colors.on-inverse}"')
  out.push('    rounded: "{rounded.md}"')
  out.push('---')
  out.push('')
  out.push('# EDS — design context for agents')
  out.push('')
  out.push('## Overview')
  out.push('')
  out.push(
    'EDS is calm, dense-capable and engineered: a working-tool aesthetic for energy-',
  )
  out.push(
    'industry applications, not a marketing site. Neutral surfaces carry the work;',
  )
  out.push('the moss-green accent is spent, not sprinkled.')
  out.push('')
  out.push('**Non-negotiables (read these even if you read nothing else):**')
  out.push('')
  out.push(
    '1. **Never author a control height.** Heights emerge: `inset × 2 + cap(label)`.',
  )
  out.push(
    '2. **Bind tokens, never raw hex or px** — the only literal allowed is the semantic `0px`.',
  )
  out.push(
    '3. **States change only what they declare**; everything else falls back to resting.',
  )
  out.push(
    '4. **Variants are `data-*` attributes** named after the axis (ADR-0006); omit the attribute for the default value. ARIA attributes carry state',
  )
  out.push(
    '   state and the ancestor mode scopes `data-density` / `data-color-scheme`.',
  )
  out.push(
    '5. **Accent is budgeted**: primary CTA, checked/selected state, focus ring — nothing',
  )
  out.push('   else. When in doubt: neutral, subtle, flat.')
  out.push('')
  out.push(
    verbose
      ? 'This is the VERBOSE variant — every value inlined (the production file is deliberately thin; this one exists so no experiment can be accused of holding back). The normative sources remain:'
      : 'This file is deliberately THIN — rules and pointers, loaded details on demand:',
  )
  out.push('')
  out.push(
    '- tokens (normative): `packages/eds-tokens/tokens/` (DTCG; density + color-scheme modes)',
  )
  out.push(
    '- CSS: `packages/eds-tokens/build/css/` + `packages/eds-contracts/build/*.css`',
  )
  out.push(
    '- contracts (component truth): `packages/eds-contracts/contracts/*.contract.json`',
  )
  out.push(
    `- Figma: ${varCount} variables in 4 collections + generated component sets`,
  )
  out.push('- measured preview: `packages/eds-contracts/preview/index.html`')
  out.push('')
  out.push('## Modes')
  out.push('')
  out.push(
    'Two runtime axes the flat token digest above cannot express (colors ship as',
  )
  out.push(
    '`name` + `name-dark` pairs; dimensions are the comfortable-density values):',
  )
  out.push('')
  out.push(
    '- **density** `compact | comfortable | relaxed` — an application-level USER choice;',
  )
  out.push(
    '  never mix densities in one view. Set `data-density` on an ancestor.',
  )
  out.push(
    '- **color-scheme** `light | dark` — the palette flips, aliases are scheme-independent.',
  )
  out.push(
    '  Dark is NOT inverted light: canvas sits below surface in both schemes, and',
  )
  out.push('  elevation becomes lightness (see Elevation & Depth).')
  out.push('')
  out.push('## Colors')
  out.push('')
  out.push(
    'Usage rules sit NEXT to the families, and the “bound by” column is computed from',
  )
  out.push(
    'which contracts actually reference each family — this whitelist cannot go stale.',
  )
  out.push('A family bound by nothing is not yet licensed for use.')
  out.push('')
  out.push('| family | intent | bound by |')
  out.push('| --- | --- | --- |')
  for (const w of whitelist) {
    out.push(
      `| \`${w.key}\` | ${w.intent} | ${w.boundBy.join(', ') || '*(none yet)*'} |`,
    )
  }
  out.push('')
  out.push('## Typography')
  out.push('')
  out.push(
    'One UI family (Inter). Sizes come from a modular scale per density; controls use',
  )
  out.push(
    'the COMPRESSED line-height variant so the optical-padding recipe holds. Icons are',
  )
  out.push(
    'glyphs: their layout footprint is the label’s cap box and the ink overflows it',
  )
  out.push('like ascenders and descenders — never resize an icon to “fit”.')
  out.push('')
  out.push('## Layout')
  out.push('')
  out.push(
    'Numbers, not adjectives. Control heights per density (compact/comfortable/relaxed),',
  )
  out.push(
    'all derived — if you are typing a pixel height you are in the wrong layer:',
  )
  out.push('')
  out.push('| contract | heights (px) |')
  out.push('| --- | --- |')
  out.push(...heights)
  out.push('')
  out.push(
    '- Spacing is a golden-ratio ladder; inter-element space belongs to the PARENT',
  )
  out.push('  (gap), never to component margins.')
  out.push(
    '- The selectable ladder is a target-size floor (WCAG 2.5.8: 24px min), not a menu.',
  )
  out.push('')
  out.push('## Elevation & Depth')
  out.push('')
  out.push(
    'The flashlight principle: in light mode elevation is shadow size (`elevation-low`',
  )
  out.push(
    'for tooltips/menus/popovers, `elevation-high` for dialogs); in dark mode elevation',
  )
  out.push(
    'is surface LIGHTNESS — raised surfaces get lighter (`bg-floating` sits one ladder',
  )
  out.push(
    'step above `surface`) and shadows nearly vanish. Never fake depth with borders.',
  )
  out.push('')
  out.push('## Shapes')
  out.push('')
  out.push(
    'Default is `border-radius-rounded` (4px). Pill is EARNED, not decorative: chips,',
  )
  out.push(
    'and the round ghost-icon button, where the circle falls out of the geometry',
  )
  out.push(
    '(padding = inset when there is no text). Never round a card corner past `rounded`.',
  )
  out.push('')
  out.push('## Components')
  out.push('')
  out.push(
    '**Reuse these — do not recreate.** Each exists as generated, dependency-free CSS',
  )
  out.push(
    '(class-based, `@layer eds-components`) and as a generated Figma component set;',
  )
  out.push('both render the same contract:')
  out.push('')
  out.push('| contract | version | axes | states |')
  out.push('| --- | --- | --- | --- |')
  out.push(...inventory)
  out.push('')
  if (verbose) {
    out.push('### Recipes — resolved state values (comfortable density digest)')
    out.push('')
    out.push(
      'Default-variant channels per state; colors as light-dark() pairs. Rest',
    )
    out.push(
      'values for every variant are in the frontmatter recipes above. States',
    )
    out.push('change only what they declare — blank cells fall back to rest.')
    out.push('')
    for (const r of resolved) {
      const c = r.contract
      const stateNames: string[] = c.states.map((st: any) => st.name)
      const baseKeys = [
        ...new Set(
          r.refs
            .filter((x) => !x.key.includes(':'))
            .map((x) => x.key),
        ),
      ]
      if (baseKeys.length === 0) continue
      out.push(`**${c.id}** (v${c.version})`)
      out.push('')
      out.push(`| channel | rest | ${stateNames.join(' | ')} |`)
      out.push(`| --- | --- | ${stateNames.map(() => '---').join(' | ')} |`)
      for (const key of baseKeys) {
        const rest = pickRef(r.refs, key, {})
        const cells = stateNames.map((st) => {
          const ref = pickRef(r.refs, `${key}:${st}`, {})
          return ref ? refValue(ref.path) : ''
        })
        out.push(
          `| \`${key}\` | ${rest ? refValue(rest.path) : ''} | ${cells.join(' | ')} |`,
        )
      }
      out.push('')
    }
  }
  out.push('Compositions own LAYOUT only — every box belongs to a contract:')
  out.push('')
  for (const comp of compositions) {
    out.push(
      `- **${comp.id}** — ${comp.parts.map((p: any) => p.component).join(' + ')}`,
    )
  }
  out.push('')
  out.push(
    'States come from the platform, not classes: `:checked`, `[aria-selected]`,',
  )
  out.push(
    '`:user-invalid`, `:focus-visible`, `:disabled`. Disabled replaces ink and fill',
  )
  out.push('with the `*-disabled` concepts and nothing else.')
  out.push('')
  out.push("## Do's and Don'ts")
  out.push('')
  out.push('```css')
  out.push("/* DON'T — authored height, baked color, class-driven state */")
  out.push('.my-button { height: 36px; background: #007079; }')
  out.push('.my-button.is-hovered { background: #004f55; }')
  out.push('')
  out.push(
    '/* DO — emergent height, bound channel, platform state flips the variable */',
  )
  out.push('.eds-button {')
  out.push('  min-height: calc(var(--_inset-v) * 2 + var(--eds-cap-rounded));')
  out.push('  background-color: var(--_bg);')
  out.push('}')
  out.push(
    '.eds-button:not(:disabled):hover { --_bg: var(--eds-color-bg-accent-fill-emphasis-hover); }',
  )
  out.push('```')
  out.push('')
  out.push('```html')
  out.push("<!-- DON'T — rebuild a field from raw elements -->")
  out.push(
    '<div class="field"><span>Label</span><input style="border:1px solid gray"></div>',
  )
  out.push('')
  out.push('<!-- DO — the shipped parts and the shipped composition -->')
  out.push('<div class="eds-text-field">')
  out.push('  <label class="eds-label" for="x">Label</label>')
  out.push('  <div class="eds-input"><input class="eds-value" id="x"></div>')
  out.push('</div>')
  out.push('```')
  out.push('')
  out.push(
    'Known drift: generated output comes back saturated, rounded and shadowed.',
  )
  out.push('When in doubt: neutral, subtle, flat.')
  out.push('')
  out.push(
    'Facts a canvas refuses (from the disposition ledgers — recorded, not dropped):',
  )
  out.push('')
  for (const [fact, note] of refused) {
    out.push(`- **${fact}** — ${note.split('. ')[0]}.`)
  }
  out.push('')
  return out.join('\n') + '\n'
}
