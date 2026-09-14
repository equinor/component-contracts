/** `eds contrast <target>` — a verdict, not a number.
 *
 *  The pairing is READ from the contract at runtime (root background channel
 *  vs the optical-label part's ink, resolved with the contract's own resolver
 *  and pickRef — most specific wins), the colours are resolved per scheme
 *  from the token sources, and the APCA Lc is computed live by apca-w3.
 *  Nothing here stores a colour or a verdict — the answer survives a contract
 *  change because it is derived from the contract.
 */
// @ts-ignore — apca-w3 ships no types; see src/apca-w3.d.ts
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { pickRef, resolveContract } from '../../eds-contracts/src/resolve.ts'
import {
  composite,
  hexToRgb,
  resolveColor,
  type ResolvedColor,
  type Scheme,
} from './colors.ts'
import { components, similarity, type ComponentEntry } from './registry.ts'
import { blocks, record, section } from './render.ts'

/** APCA targets as this repo states them (packages/eds-tokens/PLAN.md:
 *  "APCA contrast targets (LC90 body / LC60 spot-readable)"; icons are
 *  WCAG 1.4.11 ≈ Lc60 per src/build/color.ts). The token package's own
 *  distinction maps typography variants: default leading = read text,
 *  compressed = scanned. */
const THRESHOLDS = {
  read: {
    lc: 90,
    use: 'body text (read)',
  },
  scanned: {
    lc: 60,
    use: 'label text (scanned, spot-readable)',
  },
  icon: {
    lc: 60,
    use: 'icon ink (graphical object, WCAG 1.4.11 ≈ Lc 60)',
  },
} as const

export type Target = {
  entry: ComponentEntry
  when: Record<string, string> // the prop values the target name pinned
}

/** `ghost-button` → button with variant=ghost; `button` → the defaults.
 *  The variant prefix is matched against the contract's own enum values —
 *  never a hard-coded list. */
export function parseTarget(target: string): Target | null {
  const t = target.toLowerCase()
  for (const entry of components()) {
    if (t === entry.name) return { entry, when: {} }
    for (const prop of entry.contract.props) {
      for (const value of prop.type.enum ?? []) {
        if (t === `${value}-${entry.name}` || t === `${entry.name}-${value}`)
          return { entry, when: { [prop.name]: value } }
      }
    }
  }
  return null
}

const chainNote = (c: ResolvedColor) =>
  c.chain.length > 1 ? `  (${c.chain.join(' → ')})` : `  (${c.chain[0]})`

export function contrast(
  targetName: string,
  scheme: Scheme,
): { out: string; code: number } {
  const target = parseTarget(targetName)
  if (!target) return absence(targetName)
  const { entry, when } = target

  const contract = entry.contract
  const ctx: Record<string, string> = {}
  for (const p of contract.props)
    if (p.type.enum) ctx[p.name] = p.default as string
  Object.assign(ctx, when)

  // The contract names its own measured ink. Normally the text part (the
  // one whose typography corrects the root inset); an icon-only variant
  // declares structure.iconOnly, the label is gone, and the surviving
  // glyph's ink is what the eye gets — a graphical object, not text.
  const iconOnlyPart = (contract.variants ?? []).find(
    (v: any) =>
      v.structure?.iconOnly &&
      Object.entries(v.when ?? {}).every(([k, val]) => ctx[k] === String(val)),
  )?.structure.iconOnly as string | undefined
  const textPart = iconOnlyPart ?? contract.anatomy.root.inset?.opticalLabel
  if (!textPart) {
    return {
      out: blocks(
        section(`No text/background pairing in ${contract.id}.`),
        record([
          ['reason', 'the contract declares no optical label part'],
          ['source', entry.contractPath],
        ]),
      ),
      code: 1,
    }
  }

  const resolved = resolveContract(entry.contractPath)
  const textRef = pickRef(resolved.refs, `${textPart}/color`, ctx)
  const bgRef = pickRef(resolved.refs, 'root/background-color', ctx)
  if (!textRef || !bgRef) {
    return {
      out: blocks(
        section(`No colour pairing resolvable for ${contract.id}.`),
        record([
          ['missing', !textRef ? `${textPart}/color` : 'root/background-color'],
          ['source', entry.contractPath],
        ]),
      ),
      code: 1,
    }
  }

  const text = resolveColor(textRef.path, scheme)
  const bg = resolveColor(bgRef.path, scheme)

  // A transparent resting fill (the ghost ladder) shows the surface beneath;
  // the honest measurement is against the canvas the component sits on.
  let backdrop: ResolvedColor | null = null
  let bgHex = bg.hex
  if (bg.alpha < 1) {
    backdrop = resolveColor('color.semantic.bg-canvas', scheme)
    bgHex = composite(bg, backdrop)
  }
  const textHex = text.alpha < 1 ? composite(text, { hex: bgHex }) : text.hex

  // Computed live — never a stored value.
  const lc = APCAcontrast(sRGBtoY(hexToRgb(textHex)), sRGBtoY(hexToRgb(bgHex)))
  const leading =
    contract.anatomy[textPart]?.typography?.variant ?? 'compressed'
  const threshold = iconOnlyPart
    ? THRESHOLDS.icon
    : THRESHOLDS[leading === 'default' ? 'read' : 'scanned']
  const pass = Math.abs(lc) >= threshold.lc

  const pinned = Object.entries(ctx)
    .map(([k, v]) => `${k}=${v}`)
    .join(', ')

  const out = blocks(
    section(
      `Contrast — ${contract.id} (${pinned}), ${scheme} scheme`,
      'APCA Lc, computed live from the token sources via apca-w3.',
    ),
    record([
      ['pair', `${textPart}/color on root/background-color`],
      ['text', `${textHex}${chainNote(text)}`],
      [
        'background',
        bg.alpha === 0
          ? `transparent  (${bg.chain[0]})`
          : `${bg.hex}${chainNote(bg)}${bg.alpha < 1 ? ` @ alpha ${bg.alpha}` : ''}`,
      ],
      backdrop
        ? [
            'backdrop',
            `${backdrop.hex}${chainNote(backdrop)} — the resting fill is transparent, so the measurement is against the canvas beneath`,
          ]
        : ['backdrop', undefined],
      backdrop
        ? ['measured', `${textHex} on ${bgHex}`]
        : ['measured', undefined],
    ]),
    record([
      ['lc', `${lc.toFixed(1)}  (signed: positive = dark text on light)`],
      [
        'threshold',
        `Lc ${threshold.lc} — ${threshold.use}; targets per documentation/adr/0005-apca-contrast-targets.md (Lc 90 read / Lc 60 scanned)`,
      ],
      ['verdict', pass ? 'PASS' : 'FAIL'],
    ]),
    record([
      [
        'source',
        `${entry.contractPath} (${contract.id} v${contract.version})\n` +
          `packages/eds-tokens/tokens/semantic-color.tokens.json\n` +
          `packages/eds-tokens/tokens/color-scheme/${scheme}.tokens.json`,
      ],
    ]),
  )
  return { out, code: pass ? 0 : 1 }
}

function absence(targetName: string): { out: string; code: number } {
  const candidates = components().flatMap((entry) => [
    entry.name,
    ...(
      entry.contract.props.find((p: any) => p.name === 'variant')?.type.enum ??
      []
    ).map((v: string) => `${v}-${entry.name}`),
  ])
  const nearest = candidates
    .map((c) => ({ c, s: similarity(targetName, c) }))
    .sort((a, b) => b.s - a.s)[0]
  return {
    out: blocks(
      section(`No contrast target '${targetName}'.`),
      record([
        [
          'targets',
          'a component, optionally variant-pinned: ' +
            "e.g. 'button', 'ghost-button', 'banner', 'tooltip'",
        ],
        ['nearest', nearest?.c],
        ['source', 'packages/eds-contracts/contracts/*.contract.json'],
      ]),
    ),
    code: 1,
  }
}
