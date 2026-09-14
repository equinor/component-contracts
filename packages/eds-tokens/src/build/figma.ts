/** Figma emitter — PLAN.md item 13.
 *
 *  Reads the emitted DTCG token structures (the contract, not the formulas) and
 *  produces one payload describing every variable collection, mode, variable,
 *  alias and effect style the Figma file should contain.
 *
 *  Contract rules honoured:
 *    - `com.equinor.eds.figma.emit: "value"`    → port the $value
 *    - `com.equinor.eds.figma.emit: "resolved"` → port the per-density `resolved` map
 *    - tokens with neither but a plain $value   → port the $value
 *    - alias $values ({path.to.token})          → VARIABLE_ALIAS across collections
 *    - `size-adjust` is already baked into header-font-size — nothing multiplies here
 *    - colors use the build-time sRGB fallback (hex), never the OKLCH components
 *    - rem values become px via ROOT_PX — Figma variables are unitless numbers
 *
 *  Skipped by design: `ladder.*` (model internals, fully resolved into the density
 *  tokens) and `recipe.cap-rounded` (varies by size as well as density, so it has
 *  no single per-mode value — the docs table carries it).
 */
import { DENSITIES, ROOT_PX, type Density } from '../formulas.ts'

const NS = 'com.equinor.eds'
const DENSITY_MODES = Object.keys(DENSITIES) as Density[]

type Dim = { value: number; unit: string }
type FigmaValue =
  number | string | { r: number; g: number; b: number; a: number }
export type FigmaVariable = {
  name: string
  type: 'FLOAT' | 'STRING' | 'COLOR'
  scopes: string[]
  codeSyntax?: string
  description?: string
  values?: Record<string, FigmaValue>
  alias?: { collection: string; name: string }
}
export type FigmaPayload = {
  collections: { name: string; modes: string[]; variables: FigmaVariable[] }[]
  effectStyles: { name: string; description?: string; effects: unknown[] }[]
}

const toPx = (v: Dim | number): number =>
  // fontWeight tokens are unitless numbers already (the matched weights)
  typeof v === 'number' ? v : v.unit === 'rem' ? v.value * ROOT_PX : v.value

const hexToRgba = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return {
    r: ((n >> 16) & 255) / 255,
    g: ((n >> 8) & 255) / 255,
    b: (n & 255) / 255,
    a: 1,
  }
}

/** DTCG path → Figma variable name. One deterministic rule: the spacing group's
 *  key echo ("spacing.spacing-…", "spacing.sizing-…") collapses into the group;
 *  every other path maps segment-per-segment onto "/" groups. */
export function figmaName(path: string[]): string {
  if (path[0] === 'spacing') {
    const k = path[1]
    if (k.startsWith('spacing-')) return 'spacing/' + k.slice('spacing-'.length)
    if (k.startsWith('sizing-')) return 'sizing/' + k.slice('sizing-'.length)
  }
  return path.join('/')
}

/** Same rule applied to an alias target path inside a {reference}. */
const refToName = (ref: string) => figmaName(ref.slice(1, -1).split('.'))

function scopesFor(name: string): string[] {
  if (
    name.startsWith('typography/font-size') ||
    name.startsWith('typography/header-font-size')
  )
    return ['FONT_SIZE']
  // Line boxes double as frame heights (icon containers size to the line box),
  // so line-heights must appear in width/height pickers too.
  if (name.startsWith('typography/line-height'))
    return ['LINE_HEIGHT', 'WIDTH_HEIGHT']
  if (name.startsWith('typography/font-family')) return ['FONT_FAMILY']
  if (name.startsWith('font-weight/')) return ['FONT_WEIGHT']
  if (name.startsWith('typography/header-font-weight')) return ['FONT_WEIGHT']
  if (name.includes('border-radius')) return ['CORNER_RADIUS']
  if (name.startsWith('sizing/stroke')) return ['STROKE_FLOAT']
  if (name.startsWith('sizing/')) return ['WIDTH_HEIGHT']
  if (name.startsWith('recipe/optical-height')) return ['WIDTH_HEIGHT']
  if (name.startsWith('recipe/cap-rounded')) return ['WIDTH_HEIGHT'] // icon containers
  if (name.startsWith('recipe/optical-padding')) return ['GAP']
  if (name.startsWith('spacing/')) return ['GAP']
  if (name.startsWith('palette/')) return [] // primitives — reached through the semantic layer
  if (name.startsWith('density/') || name.startsWith('grid/')) return []
  const leaf = name.slice(name.indexOf('/') + 1)
  if (leaf.startsWith('bg-')) return ['FRAME_FILL', 'SHAPE_FILL']
  if (leaf.startsWith('text-')) return ['TEXT_FILL']
  if (leaf.startsWith('border-')) return ['STROKE_COLOR']
  return []
}

type Leaf = { path: string[]; token: any }
function leaves(node: any, path: string[] = []): Leaf[] {
  if (node === null || typeof node !== 'object') return []
  if (
    '$value' in node ||
    (`$extensions` in node && node.$extensions?.[`${NS}.figma`])
  )
    return [{ path, token: node }]
  return Object.entries(node)
    .filter(([k]) => !k.startsWith('$'))
    .flatMap(([k, v]) => leaves(v, [...path, k]))
}

const css = (token: any): string | undefined => {
  const v = token.$extensions?.[`${NS}.css`]?.variable
  return v ? `var(${v})` : undefined
}

export function figmaVariables(inputs: {
  primitives: any
  densities: Record<Density, any>
  semantic: any
  schemes: { light: any; dark: any }
}): FigmaPayload {
  const { primitives, densities, semantic, schemes } = inputs

  // ---- density collection: everything that moves with density -------------------
  const densityVars = new Map<string, FigmaVariable>()
  for (const d of DENSITY_MODES) {
    for (const { path, token } of leaves(densities[d])) {
      if (!('$value' in token)) continue
      const name = figmaName(path)
      const v = densityVars.get(name) ?? {
        name,
        type: 'FLOAT' as const,
        scopes: scopesFor(name),
        codeSyntax: css(token),
        values: {},
      }
      v.values![d] = toPx(token.$value)
      densityVars.set(name, v)
    }
  }
  // resolved-per-density tokens from primitives (icon gaps, cap boxes).
  // The optical-padding/height recipe grid (5 sizes × 3 proportions × 2) is
  // NOT ported wholesale (Victor, 2026-08-30): the contracts require exactly
  // the pairings their components bind, and the builders create those on
  // demand — 30 speculative variables were picker noise. CSS keeps the full
  // grid as live calc()s; the union fingerprint accounts for the required set.
  for (const { path, token } of leaves(primitives)) {
    const fig = token.$extensions?.[`${NS}.figma`]
    if (fig?.emit !== 'resolved' || !fig.resolved) continue
    if (path[0] === 'recipe' && path[1].startsWith('optical-')) continue
    const name = figmaName(path)
    densityVars.set(name, {
      name,
      type: 'FLOAT',
      scopes: scopesFor(name),
      codeSyntax: css(token),
      values: Object.fromEntries(
        DENSITY_MODES.map((d) => [d, toPx(fig.resolved[d])]),
      ),
    })
  }

  // ---- color-scheme collection: the palette, one value per scheme ---------------
  const paletteVars = new Map<string, FigmaVariable>()
  for (const [scheme, tokens] of Object.entries(schemes)) {
    for (const { path, token } of leaves(tokens)) {
      const name = figmaName(path.slice(1)) // drop the "color" root: palette/accent/1
      const v = paletteVars.get(name) ?? {
        name,
        type: 'COLOR' as const,
        scopes: scopesFor(name),
        codeSyntax: css(token),
        values: {},
      }
      // A scheme-valued concept may alias a DIFFERENT palette step per mode
      // (bg-floating: neutral-2 light / neutral-3 dark) — carried as a
      // per-mode alias so the file structure survives palette retunes.
      const modeAlias = token.$extensions?.[`${NS}.figma`]?.alias
      v.values![scheme] = modeAlias
        ? { alias: modeAlias }
        : hexToRgba(token.$value.hex)
      paletteVars.set(name, v)
    }
  }

  // ---- semantic-color collection: aliases into the palette ----------------------
  // (plus the ghost resting fills — the semantic layer's only literals)
  const semanticVars: FigmaVariable[] = leaves(semantic).map(
    ({ path, token }) => {
      const name = figmaName(path.slice(1)) // semantic/bg-canvas, concept/text-link
      const base = {
        name,
        type: 'COLOR' as const,
        scopes: scopesFor(name),
        codeSyntax: css(token),
      }
      if (typeof token.$value === 'string') {
        return {
          ...base,
          alias: {
            collection: 'color-scheme',
            name: refToName(token.$value).replace(/^color\//, ''),
          },
        }
      }
      const [r, g, b] = token.$value.components
      return {
        ...base,
        description: token.$description,
        values: { default: { r, g, b, a: token.$value.alpha ?? 1 } },
      }
    },
  )

  // The scheme-valued concepts get a semantic-collection passthrough, so the
  // consumer surface stays uniform: every concept/* binds in semantic-color.
  for (const v of paletteVars.values()) {
    if (!v.name.startsWith('concept/')) continue
    semanticVars.push({
      name: v.name,
      type: 'COLOR',
      scopes: v.scopes,
      codeSyntax: v.codeSyntax,
      alias: { collection: 'color-scheme', name: v.name },
    })
  }

  // ---- primitives collection: single mode ----------------------------------------
  const primitiveVars: FigmaVariable[] = []
  for (const { path, token } of leaves(primitives)) {
    const fig = token.$extensions?.[`${NS}.figma`]
    if (fig?.emit === 'resolved') continue // ported into density (or skipped: cap-rounded)
    if (path[0] === 'ladder' || path[0] === 'elevation') continue
    if (path[0] === 'recipe') continue
    if (!('$value' in token)) continue
    const name = figmaName(path)
    const value = token.$value
    if (typeof value === 'string' && value.startsWith('{')) {
      primitiveVars.push({
        name,
        type: 'FLOAT',
        scopes: scopesFor(name),
        codeSyntax: css(token),
        alias: { collection: 'density', name: refToName(value) },
      })
    } else if (typeof value === 'string') {
      primitiveVars.push({
        name,
        type: 'STRING',
        scopes: scopesFor(name),
        codeSyntax: css(token),
        description: token.$description,
        values: { default: value },
      })
    } else if (typeof value === 'number') {
      primitiveVars.push({
        name,
        type: 'FLOAT',
        scopes: scopesFor(name),
        codeSyntax: css(token),
        values: { default: value },
      })
    } else {
      primitiveVars.push({
        name,
        type: 'FLOAT',
        scopes: scopesFor(name),
        codeSyntax: css(token),
        description: token.$description,
        values: { default: toPx(value) },
      })
    }
  }

  // ---- elevation → effect styles (shadows are not a Figma variable type) --------
  const effectStyles = Object.entries(primitives.elevation ?? {})
    .filter(([k]) => !k.startsWith('$'))
    .map(([k, t]: [string, any]) => ({
      name: `elevation/${k}`,
      description: t.$description,
      effects: t.$value.map((s: any) => ({
        type: 'DROP_SHADOW',
        color: {
          r: s.color.components[0],
          g: s.color.components[1],
          b: s.color.components[2],
          a: s.color.alpha,
        },
        offset: { x: s.offsetX.value, y: s.offsetY.value },
        radius: s.blur.value,
        spread: s.spread.value,
        visible: true,
        blendMode: 'NORMAL',
      })),
    }))

  return {
    collections: [
      {
        name: 'density',
        modes: [...DENSITY_MODES],
        variables: [...densityVars.values()],
      },
      {
        name: 'color-scheme',
        modes: ['light', 'dark'],
        variables: [...paletteVars.values()],
      },
      { name: 'semantic-color', modes: ['default'], variables: semanticVars },
      { name: 'primitives', modes: ['default'], variables: primitiveVars },
    ],
    effectStyles,
  }
}
