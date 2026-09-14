/** `eds component <name>` — renders the component's contract.
 *
 *  Substance comes from packages/eds-contracts/contracts/<name>.contract.json, never
 *  paraphrased: props, variants, states and anatomy are the contract's own
 *  vocabulary. Geometry is computed by the contract resolver (the same code
 *  the emitters run), and the disposition ledger (CARRIED / LOWERED /
 *  RESOLVED / REFUSED) is read from the build for provenance.
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolveContract } from '../../eds-contracts/src/resolve.ts'
import { components, repoRoot, similarity } from './registry.ts'
import { blocks, record, section, type Field } from './render.ts'

const propType = (p: any): string =>
  p.type.enum
    ? `enum: ${p.type.enum.join(' | ')}`
    : p.type.boolean
      ? 'boolean'
      : 'text'

const codeBinding = (p: any): string => {
  if (p.bindings.code.attribute) {
    const attr = `data-${p.bindings.figma.property.toLowerCase().replace(/\s+/g, '-')}`
    return p.type.boolean
      ? `${attr} (valueless presence attribute)`
      : `${attr} (absent = ${p.default})`
  }
  if (p.bindings.code.slot) return 'slot (element content)'
  if (p.bindings.code.pseudo) return 'platform pseudo-class'
  return 'none'
}

const overrides = (tokens: Record<string, string>): string =>
  Object.entries(tokens)
    .map(([k, v]) => `${k} → ${v}`)
    .join('\n')

const pins = (when: Record<string, string>): string =>
  Object.entries(when)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ')

export function component(name: string): { out: string; code: number } {
  const entry = components().find((e) => e.name === name.toLowerCase())
  if (!entry) return absence(name)
  const c = entry.contract

  const props = c.props.map((p: any) =>
    record([
      ['prop', p.name],
      ['description', p.description],
      ['type', propType(p)],
      ['default', String(p.default)],
      ['code', codeBinding(p)],
      ['figma', `${p.bindings.figma.property} (${p.bindings.figma.kind})`],
    ]),
  )

  const anatomy = Object.entries<any>(c.anatomy).map(([partName, part]) => {
    const fields: Field[] = [['part', partName]]
    if (part.when) fields.push(['when', part.when])
    if (part.whenValue)
      fields.push(['when', `${part.whenValue.prop}=${part.whenValue.value}`])
    if (part.inset)
      fields.push([
        'inset',
        `${part.inset.size}-${part.inset.proportion}` +
          (part.inset.opticalLabel
            ? ` (vertical padding derived from ${part.inset.opticalLabel})`
            : ''),
      ])
    if (part.typography) {
      const t = part.typography
      fields.push([
        'typography',
        `${t.family} ${t.label} ${t.weight}, ${t.variant} leading`,
      ])
    }
    if (part.glyph) fields.push(['glyph', part.glyph])
    if (part.footprint) fields.push(['footprint', part.footprint])
    if (part.pointer)
      fields.push([
        'pointer',
        `arrow driven by '${part.pointer.prop}' — width = cap box, protrusion = cap/2, never authored`,
      ])
    if (part.instance)
      fields.push(['instance', `an instance of ${part.instance.component}`])
    if (part.corner)
      fields.push(['corner', 'anchors to the upper-right corner'])
    if (part.swapByProp)
      fields.push([
        'glyph by prop',
        `${part.swapByProp.prop} → ${Object.entries<any>(part.swapByProp.glyphs)
          .map(([v, g]) => `${v}: ${g.icon}`)
          .join(', ')}`,
      ])
    if (part.tokens)
      fields.push([
        'tokens',
        Object.entries<string>(part.tokens)
          .map(([ch, ref]) => `${ch} → ${ref}`)
          .join('\n'),
      ])
    return record(fields)
  })

  const variants = (c.variants ?? []).map((v: any) =>
    record([
      ['when', pins(v.when)],
      v.structure
        ? [
            'structure',
            `icon-only (${v.structure.iconOnly})` +
              (v.structure.inset === 'even'
                ? ', padding = inset on all sides — a circle by construction'
                : ''),
          ]
        : ['structure', undefined],
      ['overrides', overrides(v.tokens)],
    ]),
  )

  const states = (c.states ?? []).map((s: any) =>
    record([
      ['state', s.name],
      s.when ? ['gate', `only ${pins(s.when)}`] : ['gate', undefined],
      ['overrides', overrides(s.tokens)],
    ]),
  )

  // Computed, not recalled: the resolver derives heights from inset + cap.
  const resolved = resolveContract(entry.contractPath)
  const geometry = resolved.geometry
    ? record([
        [
          'height',
          `${resolved.geometry.map((g) => g.heightPx).join('/')} px (${resolved.geometry.map((g) => g.density).join('/')}) — inset × 2 + cap(label), never authored`,
        ],
      ])
    : null

  // Ledger verdicts, from the build (trust order #2) — provenance display.
  const ledgerPath = `packages/eds-contracts/build/${entry.name}.ledger.json`
  let ledgerBlock: string | null = null
  if (existsSync(repoRoot + ledgerPath)) {
    const entries = JSON.parse(readFileSync(repoRoot + ledgerPath, 'utf8'))
    const count = (d: string) =>
      entries.filter((e: any) => e.css === d || e.figma === d).length
    ledgerBlock = record([
      [
        'ledger',
        `${entries.length} facts dispositioned — CARRIED ${count('CARRIED')}, LOWERED ${count('LOWERED')}, RESOLVED ${count('RESOLVED')}, REFUSED ${count('REFUSED')} (${ledgerPath})`,
      ],
    ])
  }

  const semantics = record([
    ['element', `<${c.semantics.element}>`],
    ['role', c.semantics.role],
    ...Object.entries<string>(c.semantics.aria ?? {}).map(
      ([k, v]) => [`aria (${k})`, v] as Field,
    ),
  ])

  const out = blocks(
    section(`${c.id} v${c.version}`, c.description),
    section('Props'),
    ...props,
    section('Anatomy', 'Parts and their token channels.'),
    ...anatomy,
    variants.length
      ? section('Variants', 'Token overrides pinned to prop values.')
      : null,
    ...variants,
    states.length ? section('States') : null,
    ...states,
    geometry ? section('Geometry (computed by the resolver)') : null,
    geometry,
    section('Semantics'),
    semantics,
    section('Provenance'),
    record([
      ['source', `${entry.contractPath} (v${c.version})`],
      ['schema', 'packages/eds-contracts/contract.schema.json'],
    ]),
    ledgerBlock,
  )
  return { out, code: 0 }
}

function absence(name: string): { out: string; code: number } {
  const known = components()
  const nearest = known
    .map((e) => ({ e, s: similarity(name, e.name) }))
    .sort((a, b) => b.s - a.s)[0]
  return {
    out: blocks(
      section(`No contract for '${name}'.`),
      record([
        [
          'components',
          known.map((e) => e.name).join(', ') +
            ' — the POC scope (packages/eds-cli/intent.md, widened 2026-09-05)',
        ],
        ['nearest', nearest && nearest.s > 0 ? nearest.e.name : undefined],
        ['source', 'packages/eds-contracts/contracts/*.contract.json'],
      ]),
    ),
    code: 1,
  }
}
