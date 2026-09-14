/**
 * Colour, ported from the legacy build.
 *
 * Values are carried across as-is (sRGB hex). They will be regenerated from the
 * palette generator in OKLCH later — see PLAN.md non-goals. Converting the hex to
 * oklch() now would buy the notation without the gamut, since hex is sRGB by
 * definition, so it is deliberately deferred.
 *
 * The legacy build splits colour three ways, and that split maps exactly onto the
 * resolver:
 *   98 hex per scheme   -> colour-scheme contexts   (90 palette steps + 8 concept)
 *  109 var() aliases    -> core set, scheme-independent
 * Aliases are declared once on :root and substitute there, so they follow the
 * root's active palette without being duplicated per scheme. The scheme flips at
 * the root only — an interface is never light and dark at once, so nothing is
 * scoped deeper than that.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
  GAMUT_STRATEGY,
  formatOklch,
  mapToSrgb,
  parseOklch,
  type Mapped,
  type Oklch,
} from '../oklch.ts'
import config from '../semantic-mapping.json' with { type: 'json' }

const ORACLE = fileURLToPath(
  new URL('../../test/fixtures/legacy-oracle.css', import.meta.url),
)
/** OKLCH palette straight from the palette generator, one light/dark pair per step. */
const GENERATOR = fileURLToPath(
  new URL('../palette-generator-export.css', import.meta.url),
)
const NS = 'com.equinor.eds'

/** Cross-cutting tokens that reference the scheme rather than a palette family.
 *  Mirrors `conceptColorGroups` in packages/eds-tokens/token-config.json. */
const CONCEPT = new Set([
  'bg-floating',
  'bg-backdrop',
  'bg-input',
  'border-focus',
  'text-link',
  'bg-disabled',
  'border-disabled',
  'text-disabled',
  // placeholder text (added 2026-09-04 for eds.input): an affordance hint,
  // not an unavailable control. Sits on text-disabled's rung TODAY (Neutral.7)
  // but carries its own name — hand-binding disabled onto placeholders "works,
  // but looks disabled" (Victor); a distinct semantic can diverge if that
  // lookalike risk bites. Floor: Lc 30 against bg-input, and only beside an
  // icon that carries the affordance.
  'text-placeholder',
  // the inverse surface (added 2026-08-29 for eds.tooltip — negative surfaces
  // need the palette extremes; the emphasis fill is step 9, nowhere near black)
  'bg-inverse',
  'text-on-inverse',
])

const PALETTE = /^(accent|neutral|info|success|warning|danger)-(\d+)$/

export type Scheme = 'light' | 'dark'

/** `--eds-color-accent-9` -> `color.palette.accent.9` */
export function pathFor(name: string): string {
  const m = name.match(PALETTE)
  if (m) return `color.palette.${m[1]}.${m[2]}`
  if (CONCEPT.has(name)) return `color.concept.${name}`
  return `color.semantic.${name}`
}

function expandHex(hex: string): string {
  const h = hex.replace('#', '')
  return h.length === 3
    ? h
        .split('')
        .map((c) => c + c)
        .join('')
    : h
}

/** DTCG colour, sRGB — used for the aliases' resolved fallbacks. */
export function dtcgColor(hex: string) {
  const h = expandHex(hex)
  const components = [0, 2, 4].map(
    (i) => Math.round((parseInt(h.slice(i, i + 2), 16) / 255) * 1e4) / 1e4,
  )
  return { colorSpace: 'srgb', components, hex: `#${h}` }
}

/**
 * DTCG colour, OKLCH. `hex` carries the build-time gamut-mapped fallback so a
 * consumer that cannot handle wide gamut still gets the right colour rather than
 * whatever its own mapping would produce.
 */
export function dtcgOklch(m: Mapped) {
  return {
    colorSpace: 'oklch',
    components: [m.oklch.l, m.oklch.c, m.oklch.h],
    hex: m.hex,
  }
}

type Parsed = {
  scheme: Record<Scheme, Map<string, string>>
  aliases: Map<string, string>
  /** Concepts folded from baked hex into aliases, with the original values kept
   *  so the harness can prove the fold was lossless. */
  folded: Map<string, { light: string; dark: string; target: string }>
}

/** generator family slug -> semantic family, per token-config.json. */
const slug = (s: string) => s.toLowerCase().replace(/ /g, '-')
export const SEMANTIC_SOURCES = Object.fromEntries(
  Object.entries(config.colorSchemeConfig).map(([semantic, m]) => [
    semantic.toLowerCase(),
    { light: slug(m.Light), dark: slug(m.Dark) },
  ]),
) as Record<string, { light: string; dark: string }>

export type PaletteEntry = { light: Mapped; dark: Mapped }

/**
 * The generator emits `light-dark(oklch(...), oklch(...))`, so one file carries both
 * schemes. We split the pair and gamut-map each side for the sRGB fallback.
 */
export function parseGeneratorPalette(): Map<string, PaletteEntry> {
  const css = readFileSync(GENERATOR, 'utf8')
  const out = new Map<string, PaletteEntry>()
  const re =
    /--color-([a-z-]+)-(\d+):\s*light-dark\(\s*(oklch\([^)]*\))\s*,\s*(oklch\([^)]*\))\s*\)/g
  for (const [, family, step, l, d] of css.matchAll(re)) {
    out.set(`${family}-${step}`, {
      light: mapToSrgb(parseOklch(l)),
      dark: mapToSrgb(parseOklch(d)),
    })
  }
  return out
}

/** Semantic palette token -> the generator entry backing it, per scheme. */
export function semanticPalette(): Map<string, PaletteEntry> {
  const gen = parseGeneratorPalette()
  const out = new Map<string, PaletteEntry>()
  for (const [semantic, src] of Object.entries(SEMANTIC_SOURCES)) {
    for (let step = 1; step <= 15; step++) {
      const l = gen.get(`${src.light}-${step}`)
      const d = gen.get(`${src.dark}-${step}`)
      if (!l || !d) continue
      out.set(`${semantic}-${step}`, { light: l.light, dark: d.dark })
    }
  }
  return out
}

export function parseOracle(): Parsed {
  const css = readFileSync(ORACLE, 'utf8')
  const out: Parsed = {
    scheme: { light: new Map(), dark: new Map() },
    aliases: new Map(),
    folded: new Map(),
  }

  for (const [, rawSel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = rawSel.trim().replace(/\s+/g, ' ')
    if (!sel.includes('color-scheme')) continue
    // the prefers-color-scheme fallback duplicates the dark block; skip it
    if (sel.includes(':not(')) continue

    const isDark = sel.includes('[data-color-scheme="dark"]')
    const isLight = sel.includes('[data-color-scheme="light"]')
    const bothSchemes = isDark && isLight // the appearance-default block

    for (const [, name, rawValue] of body.matchAll(
      /--eds-color-([\w-]+):\s*([^;]+);/g,
    )) {
      const value = rawValue.trim()

      if (value.startsWith('var(')) {
        const target = value.match(/var\(\s*--eds-color-([\w-]+)/)
        if (target) out.aliases.set(name, target[1])
      } else if (value.startsWith('#')) {
        if (bothSchemes) continue
        out.scheme[isDark ? 'dark' : 'light'].set(name, value)
      }
    }
  }
  foldConceptsToAliases(out)
  addGhostLadder(out)
  liftFloatingSurface(out)
  return out
}

/** bg-floating = the ELEVATED surface (Victor, 2026-08-29): white in light
 *  mode, one ladder step ABOVE surface in dark. In dark mode elevation is
 *  lightness, not shadow — surfaces get lighter as they rise toward the light
 *  source, and shadows are near-invisible (the flashlight principle). The
 *  legacy build never expressed this (floating == surface in both schemes)
 *  and every released token set since lost it; the only place it was ever
 *  mechanical is the unreleased Elevation-as-mode architecture. Restored
 *  here: the alias is lifted back to a scheme-valued concept, emitted per
 *  scheme (see FLOATING_STEP in schemeTokens), so the colour-scheme axis
 *  carries the principle. */
function liftFloatingSurface(parsed: Parsed) {
  parsed.aliases.delete('bg-floating')
}

/** The ghost ladder — recovered December rule, named 2026-08-28.
 *
 *  A state ladder is anchored to the component's RESTING fill. Interactive
 *  surfaces that rest transparent (ghost and secondary buttons, tabs, menu
 *  items) anchor one step lower than the muted ladder, because the jump from
 *  nothing to the muted hover step is perceptually too large. Previously this
 *  existed only as unexplained shifted bindings in next/button.css (ghost
 *  hover bound to fill-muted-DEFAULT). Neutral and accent only — partial tone
 *  coverage is deliberate, the link-only-in-blue philosophy. The ghost Button
 *  variant is the pattern's eponym, not its only member. */
// danger joined 2026-08-28: the Button contract's Tone=Danger × Variant=Ghost
// demands it — coverage grows when a component contract requires it, not before.
export const GHOST_TONES = ['neutral', 'accent', 'danger'] as const
function addGhostLadder(parsed: Parsed) {
  for (const tone of GHOST_TONES) {
    parsed.aliases.set(`bg-${tone}-fill-ghost-hover`, `${tone}-3`)
    parsed.aliases.set(`bg-${tone}-fill-ghost-active`, `${tone}-4`)
  }
  addIconRoles(parsed)
  addInverseSurface(parsed)
  addPlaceholderText(parsed)
  addSelectedRung(parsed)
}

/** The selected rung (Victor, 2026-08-30): selected sits ONE rung above
 *  hover — the same rung as active. Two tokens, one palette step: active is
 *  the split-second press, selected is the persistent state; sharing a value
 *  between two ENGAGED states is coherent (December's trap was hover, a
 *  state, sharing with default, a rest). Without this token a toggled ghost
 *  button or a selected menu item has no honest binding.
 *  Muted: 3 rest / 4 hover / 5 active|selected. Ghost: transparent / 3 / 4.
 *  Emphasis: 9 rest / 10 hover / 11 active|selected (2026-08-30 — same logic,
 *  third tier: a toggled emphasis chip needs an honest binding too). */
function addSelectedRung(parsed: Parsed) {
  for (const tone of GHOST_TONES)
    parsed.aliases.set(`bg-${tone}-fill-ghost-selected`, `${tone}-4`)
  for (const tone of ICON_TONES) {
    parsed.aliases.set(`bg-${tone}-fill-muted-selected`, `${tone}-5`)
    parsed.aliases.set(`bg-${tone}-fill-emphasis-selected`, `${tone}-11`)
  }
}

/** The inverse surface — a negative panel on either scheme (added 2026-08-29).
 *
 *  EDS 1.x tooltips were near-black on light; the December set had no way to
 *  say that (the emphasis fill is step 9 — a mid fill, not an extreme). These
 *  concept tokens name the palette extremes: step 13 is the darkest ink-like
 *  surface and step 15 its on-emphasis text companion, and both flip with the
 *  scheme, so an inverse surface stays inverse in dark mode. Additive, like
 *  the ghost ladder: no existing token changes meaning. */
function addInverseSurface(parsed: Parsed) {
  parsed.aliases.set('bg-inverse', 'neutral-13')
  parsed.aliases.set('text-on-inverse', 'neutral-15')
}

/** Placeholder text (added 2026-09-04 for eds.input).
 *
 *  An affordance hint, not an unavailable control. Hand-binding text-disabled
 *  onto placeholders "works, but looks disabled" (Victor) — a distinct
 *  semantic keeps the meaning honest and can diverge from disabled if the
 *  lookalike risk bites. Sits on disabled's rung TODAY (Neutral.7). Floor:
 *  Lc 30 against bg-input, and only beside an icon carrying the affordance.
 *  Additive: no existing token changes meaning. */
function addPlaceholderText(parsed: Parsed) {
  parsed.aliases.set('text-placeholder', 'neutral-7')
}

/** Icon ink roles — restored original EDS 2.0 intent (2026-08-28).
 *
 *  Icons are graphical objects, not text: WCAG 1.4.11 asks 3:1 (≈ APCA Lc60)
 *  of them, not the Lc90 body text needs. So the icon ink maps to the SUBTLE
 *  text step, one below strong — strong text, subtle icon, on every tone.
 *  The "text doubles as icon" economy made this intent inexpressible; these
 *  aliases make it a one-hop palette mapping like every other semantic role. */
const ICON_TONES = [
  'neutral',
  'accent',
  'info',
  'success',
  'warning',
  'danger',
] as const
function addIconRoles(parsed: Parsed) {
  for (const tone of ICON_TONES) {
    parsed.aliases.set(`icon-${tone}`, `${tone}-12`)
    parsed.aliases.set(`icon-${tone}-on-emphasis`, `${tone}-14`)
  }
}

const GHOST_DEFAULT_DESCRIPTION =
  'Resting fill of ghost interactive surfaces (ghost/secondary buttons, tabs, ' +
  'menu items). Transparent, not white, so it composes on any surface. The ' +
  'ladder anchors one step below muted: transparent -> step 3 (hover) -> step 4 ' +
  '(active), because the jump from nothing to the muted hover step is too large.'

/**
 * The legacy build bakes `conceptColorGroups` (token-config.json) down to hex in
 * every scheme block, even though they are defined as references — e.g.
 * `bg-floating: {Light.Gray.2}` with Neutral mapping to Gray/North sea, which is
 * exactly `neutral-2`.
 *
 * Folding them back to aliases means the colour-scheme axis only swaps the palette
 * and nothing else, and concept colours follow automatically when the palette is
 * regenerated instead of needing to be re-baked. It also removes two tokens
 * (`border-disabled`, `text-disabled`) that the legacy emits *both* ways.
 *
 * Only folds when a palette entry matches in BOTH schemes, so an accidental
 * single-scheme collision cannot silently rewrite a value.
 */
function foldConceptsToAliases(parsed: Parsed): void {
  const palette = [...parsed.scheme.light.keys()]
    .filter((n) => PALETTE.test(n))
    .sort()

  for (const name of [...parsed.scheme.light.keys()]) {
    if (PALETTE.test(name)) continue
    const light = parsed.scheme.light.get(name)
    const dark = parsed.scheme.dark.get(name)
    if (!light || !dark) continue

    const matches = palette.filter(
      (p) =>
        parsed.scheme.light.get(p) === light &&
        parsed.scheme.dark.get(p) === dark,
    )
    if (matches.length === 0) continue

    parsed.aliases.set(name, matches[0])
    parsed.folded.set(name, { light, dark, target: matches[0] })
    parsed.scheme.light.delete(name)
    parsed.scheme.dark.delete(name)
  }
}

/** Nest a flat `a.b.c` path into an object tree. */
function nest(target: Record<string, any>, path: string, leaf: unknown) {
  const parts = path.split('.')
  let node = target
  for (const part of parts.slice(0, -1)) node = node[part] ??= {}
  node[parts.at(-1)!] = leaf
}

export function schemeTokens(scheme: Scheme, _parsed: Parsed) {
  const root: Record<string, any> = {
    $extensions: {
      [`${NS}.context`]: { modifier: 'color-scheme', context: scheme },
    },
  }
  const pal = semanticPalette()
  const f = pal.get(FLOATING_STEP[scheme])![scheme]
  nest(root, 'color.concept.bg-floating', {
    $type: 'color',
    $value: dtcgOklch(f),
    $description:
      'The ELEVATED surface: menus, popovers, dialogs. White in light mode; ' +
      'one ladder step ABOVE surface in dark mode, because in dark mode ' +
      'elevation is lightness, not shadow. Follows neutral-2 (light) / ' +
      'neutral-3 (dark). Restored unreleased December intent, 2026-08-29.',
    $extensions: {
      [`${NS}.css`]: {
        variable: '--eds-color-bg-floating',
        tiers: { srgb: f.hex, p3: formatOklch(f.oklch) },
      },
      // Figma binds this mode as an ALIAS into the palette, so a palette
      // retune propagates — the payload records the same structure the file
      // carries (the union fingerprint compares representation, not just hue).
      [`${NS}.figma`]: {
        alias: `palette/${FLOATING_STEP[scheme].replace('-', '/')}`,
      },
      [`${NS}.source`]: {
        follows: `${FLOATING_STEP[scheme]} (${scheme})`,
        file: 'src/build/color.ts FLOATING_STEP',
      },
    },
  })
  for (const [name, entry] of [...pal].sort()) {
    const m = entry[scheme]
    const family = name.replace(/-\d+$/, '')
    nest(root, pathFor(name), {
      $type: 'color',
      $value: dtcgOklch(m),
      $extensions: {
        [`${NS}.css`]: {
          variable: `--eds-color-${name}`,
          tiers: { srgb: m.hex, p3: formatOklch(m.oklch) },
        },
        [`${NS}.source`]: {
          generator: `${SEMANTIC_SOURCES[family][scheme]}-${name.match(/\d+$/)![0]}`,
          file: 'src/palette-generator-export.css',
        },
        ...(m.outOfGamut
          ? {
              [`${NS}.gamut`]: {
                outsideSrgb: true,
                strategy: GAMUT_STRATEGY,
                fallback: m.hex,
                lightnessDrift: m.lightnessDrift,
                note:
                  'Cannot be expressed in sRGB. The fallback holds lightness and hue and ' +
                  'lowers chroma, so the family keeps a shared lightness at this step.',
              },
            }
          : {}),
      },
    })
  }
  return root
}

/** Intent lives in the contracts that bind a tier, not in the tier's name —
 *  the name says how it looks, the contract says when to use it. These
 *  descriptions state both and point at the binding site. Recorded finding:
 *  DECISIONS.md "Fill-tier naming". */
function tierDescription(name: string): string | undefined {
  if (/^bg-.*-fill-emphasis-/.test(name) || /^bg-fill-emphasis-/.test(name))
    return (
      'The filled call-to-action tier: buttons and form controls. Foregrounds ' +
      'invert via the on-emphasis text/icon tokens. Usage intent lives in the ' +
      'contracts that bind it (eds.button Primary binds this tier).'
    )
  if (/^bg-.*-fill-muted-/.test(name) || /^bg-fill-muted-/.test(name))
    return (
      'The quiet opaque fill tier: chips, toggles, selected rows. Named for its ' +
      'appearance — a recorded finding; usage intent lives in the contracts ' +
      'that bind it (eds.chip binds this tier).'
    )
  if (/^icon-/.test(name))
    return (
      'Icon ink: the SUBTLE text step — icons are graphical objects ' +
      '(WCAG 1.4.11 / APCA Lc60), they do not need text-level contrast. ' +
      'Strong text, subtle icon. Restored original EDS 2.0 intent.'
    )
  if (name === 'bg-inverse' || name === 'text-on-inverse')
    return (
      'The inverse surface: a negative panel on either scheme (near-black on ' +
      'light, near-white on dark). bg-inverse = palette step 13, ' +
      'text-on-inverse = step 15. Bound by eds.tooltip; additive, 2026-08-29.'
    )
  if (name === 'text-placeholder')
    return (
      'Placeholder text: an affordance hint, not an unavailable control — ' +
      'never bind text-disabled here. Disabled’s rung today (step 7); ' +
      'Lc 30 floor against bg-input, only beside an icon carrying the ' +
      'affordance. Bound by eds.input; additive, 2026-09-04.'
    )
  if (/^bg-.*-fill-(ghost|muted)-selected$/.test(name))
    return (
      'The selected rung: one above hover, sharing the ACTIVE step value ' +
      'under its own name — active is the split-second press, selected is ' +
      'the persistent state. Bound by selected menu items and toggled ' +
      'controls. Added 2026-08-30.'
    )
  if (/^bg-.*-fill-ghost-(hover|active)$/.test(name))
    return (
      'Ghost ladder: hover = step 3, active = step 4 — one step below muted, ' +
      'because the resting fill is transparent (see bg-*-fill-ghost-default). ' +
      'Bound by transparent-resting components: eds.button Secondary/Ghost, tabs, menu items.'
    )
  return undefined
}

export function semanticColorTokens(parsed: Parsed) {
  const root: Record<string, any> = {}
  for (const [name, target] of [...parsed.aliases].sort()) {
    const description = tierDescription(name)
    nest(root, pathFor(name), {
      $type: 'color',
      $value: `{${pathFor(target)}}`,
      ...(description ? { $description: description } : {}),
      $extensions: { [`${NS}.css`]: { variable: `--eds-color-${name}` } },
    })
  }
  // Ghost resting fills: the one literal in the semantic layer — transparency is
  // the absence of fill, not a scale value, so opaque-only stands.
  for (const tone of GHOST_TONES) {
    const name = `bg-${tone}-fill-ghost-default`
    nest(root, pathFor(name), {
      $type: 'color',
      $value: { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0 },
      $description: GHOST_DEFAULT_DESCRIPTION,
      $extensions: { [`${NS}.css`]: { variable: `--eds-color-${name}` } },
    })
  }
  return root
}

const rule = (sel: string, body: string, indent = '') =>
  `${indent}${sel} {\n${body}\n${indent}}`

const paletteDecls = (
  pal: Map<string, PaletteEntry>,
  scheme: Scheme,
  as: 'hex' | 'oklch',
  indent = '  ',
) =>
  [...pal.keys()]
    .sort()
    .map((name) => {
      const m = pal.get(name)![scheme]
      const value = as === 'hex' ? m.hex : formatOklch(m.oklch)
      const note = as === 'hex' && m.outOfGamut ? '  /* gamut-mapped */' : ''
      return `${indent}--eds-color-${name}: ${value};${note}`
    })
    .concat(
      // the one scheme-valued concept: the elevated floating surface
      (() => {
        const f = pal.get(FLOATING_STEP[scheme])![scheme]
        const value = as === 'hex' ? f.hex : formatOklch(f.oklch)
        return `${indent}--eds-color-bg-floating: ${value};  /* elevated: follows ${FLOATING_STEP[scheme]} */`
      })(),
    )
    .join('\n')

const aliasDecls = (parsed: Parsed) =>
  [...parsed.aliases]
    .sort()
    .map(([k, v]) => `  --eds-color-${k}: var(--eds-color-${v});`)
    .concat(
      GHOST_TONES.map(
        (tone) =>
          `  /* ghost resting fill — transparent, not white; ladder anchors one step low */\n` +
          `  --eds-color-bg-${tone}-fill-ghost-default: transparent;`,
      ),
    )
    .join('\n')

const LIGHT_SEL = ":where(:root),\n[data-color-scheme='light']"
const DARK_SEL = "[data-color-scheme='dark']"
/** Only when nothing has been set explicitly, so this never depends on source order. */
const OS_DARK_SEL = ':root:not([data-color-scheme])'

/** The elevated floating surface tracks a DIFFERENT ladder step per scheme:
 *  white in light, one step ABOVE surface in dark (see liftFloatingSurface). */
const FLOATING_STEP: Record<Scheme, string> = {
  light: 'neutral-2',
  dark: 'neutral-3',
}

export function colorCss(parsed: Parsed): string {
  const pal = semanticPalette()
  const outOfGamut = [...pal.values()].filter(
    (e) => e.light.outOfGamut || e.dark.outOfGamut,
  ).length

  return `/* EDS colour
 * Generated — do not edit. Palette authored in OKLCH by the palette generator.
 *
 * Two tiers:
 *   base                          sRGB fallback, gamut-mapped at build time
 *   @media (color-gamut: p3)      the OKLCH originals
 *
 * ${outOfGamut} of ${pal.size} palette values fall outside sRGB, concentrated in the alarm hues
 * (red, orange) — exactly the ones hex was clipping hardest. On an sRGB display the
 * browser would gamut-map them itself, and implementations differ, so we map at build
 * time and serve the result explicitly. Strategy: ${GAMUT_STRATEGY} — lightness and hue
 * are held, chroma is lowered until the colour fits, so every family keeps a shared
 * lightness at each step. Clamping would drift lightness by up to 0.017.
 *
 * Aliases are declared once on :root, where var() substitution happens — so they
 * follow the palette active at the root, and only the palette flips per scheme.
 * The scheme is a root-level switch by design: an interface is never light and
 * dark at once. (Custom properties substitute where declared, so a nested
 * [data-color-scheme] would flip only the direct per-scheme values anyway.)
 */

/* Scheme-independent aliases. */
${rule(':where(:root)', aliasDecls(parsed))}

/* --- sRGB fallback ------------------------------------------------------------- */

${rule(LIGHT_SEL, paletteDecls(pal, 'light', 'hex'))}

${rule(DARK_SEL, paletteDecls(pal, 'dark', 'hex'))}

@media (prefers-color-scheme: dark) {
${rule(OS_DARK_SEL, paletteDecls(pal, 'dark', 'hex', '    '), '  ')}
}

/* --- wide gamut ---------------------------------------------------------------- */

@media (color-gamut: p3) {
${rule(LIGHT_SEL.replace('\n', '\n  '), paletteDecls(pal, 'light', 'oklch', '    '), '  ')}

${rule(DARK_SEL, paletteDecls(pal, 'dark', 'oklch', '    '), '  ')}

  @media (prefers-color-scheme: dark) {
${rule(OS_DARK_SEL, paletteDecls(pal, 'dark', 'oklch', '      '), '    ')}
  }
}`
}
