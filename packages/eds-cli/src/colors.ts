/** Scheme-aware colour resolution over the token sources.
 *
 *  packages/eds-contracts/src/resolve.ts resolves a contract's token REFS (paths,
 *  CSS variables) against the token universe; this module resolves the same
 *  paths to VALUES for a given colour scheme, by walking the alias chain the
 *  same way: a `{…}` string recurses, a literal ends the walk, a dangling
 *  ref is an error — never a guess. The scheme file is loaded last, so its
 *  per-scheme values win, exactly like the [data-color-scheme] cascade in
 *  build/css/color.css.
 */
import { readFileSync } from 'node:fs'
import { repoRoot } from './registry.ts'

export type Scheme = 'light' | 'dark'
export const SCHEMES: Scheme[] = ['light', 'dark']

export type ResolvedColor = {
  path: string // the path asked for
  chain: string[] // alias chain, path → … → literal holder
  hex: string // #rrggbb (build's gamut-mapped sRGB value)
  alpha: number
  sourceFile: string // repo-relative file the literal came from
}

type Holder = { value: any; file: string }

const universes = new Map<Scheme, Map<string, Holder>>()

function universe(scheme: Scheme): Map<string, Holder> {
  const cached = universes.get(scheme)
  if (cached) return cached
  const files = [
    'packages/eds-tokens/tokens/semantic-color.tokens.json',
    `packages/eds-tokens/tokens/color-scheme/${scheme}.tokens.json`,
  ]
  const map = new Map<string, Holder>()
  for (const file of files) {
    const walk = (node: any, path: string[]) => {
      if (node === null || typeof node !== 'object') return
      if ('$value' in node) {
        map.set(path.join('.'), { value: node.$value, file })
        return
      }
      for (const [k, v] of Object.entries(node))
        if (!k.startsWith('$')) walk(v, [...path, k])
    }
    walk(JSON.parse(readFileSync(repoRoot + file, 'utf8')), [])
  }
  universes.set(scheme, map)
  return map
}

const toHexByte = (c: number) =>
  Math.round(c * 255)
    .toString(16)
    .padStart(2, '0')

function literalColor(v: any): { hex: string; alpha: number } {
  if (v.hex) return { hex: v.hex, alpha: v.alpha ?? 1 }
  if (v.colorSpace === 'srgb') {
    const [r, g, b] = v.components
    return {
      hex: `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`,
      alpha: v.alpha ?? 1,
    }
  }
  throw new Error(`token value has no sRGB form: ${JSON.stringify(v)}`)
}

export function resolveColor(path: string, scheme: Scheme): ResolvedColor {
  const map = universe(scheme)
  const chain = [path]
  let holder = map.get(path)
  if (!holder) throw new Error(`dangling token ref: ${path} (${scheme})`)
  while (typeof holder.value === 'string') {
    const next = holder.value.slice(1, -1)
    chain.push(next)
    holder = map.get(next)
    if (!holder)
      throw new Error(`dangling token ref: ${next} via ${path} (${scheme})`)
  }
  const { hex, alpha } = literalColor(holder.value)
  return { path, chain, hex, alpha, sourceFile: holder.file }
}

// ---- compositing ------------------------------------------------------------------

export const hexToRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
]

/** Source-over blend of a translucent colour onto an opaque one (gamma
 *  space, like the browser). alpha 0 — the ghost resting fill — returns the
 *  backdrop exactly. */
export function composite(
  fg: { hex: string; alpha: number },
  bg: { hex: string },
): string {
  if (fg.alpha >= 1) return fg.hex
  const f = hexToRgb(fg.hex)
  const b = hexToRgb(bg.hex)
  const out = f.map((c, i) => Math.round(c * fg.alpha + b[i] * (1 - fg.alpha)))
  return `#${out.map((c) => c.toString(16).padStart(2, '0')).join('')}`
}
