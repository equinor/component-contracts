/**
 * Reads the legacy Style Dictionary output as a verification oracle.
 *
 * The oracle predates the density rename, so its selectors map:
 *   [data-density="comfortable"]        -> compact
 *   :root, [data-density="spacious"]    -> comfortable
 *   (no counterpart)                    -> relaxed
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const ORACLE = fileURLToPath(
  new URL('fixtures/legacy-oracle.css', import.meta.url),
)

/** Oracle selector -> our density name. */
export const ORACLE_DENSITY: Record<string, string> = {
  '[data-density="comfortable"]': 'compact',
  ':root, [data-density="light"]': 'comfortable',
}

export function readOracle(): Map<string, Map<string, string>> {
  const css = readFileSync(ORACLE, 'utf8')
  const byDensity = new Map<string, Map<string, string>>()

  for (const [, rawSel, body] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const sel = rawSel.trim().replace(/\s+/g, ' ')
    let density: string | undefined
    if (sel === '[data-density="comfortable"]') density = 'compact'
    else if (sel.includes('[data-density="spacious"]')) density = 'comfortable'
    if (!density) continue

    const props = byDensity.get(density) ?? new Map<string, string>()
    for (const [, prop, value] of body.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
      props.set(prop, value.trim())
    }
    byDensity.set(density, props)
  }
  return byDensity
}

/** Our line-height variants renamed; the legacy build still uses the old word. */
export const ORACLE_LINE_HEIGHT: Record<string, string> = {
  default: 'default',
  compressed: 'squished',
}

/** Oracle values are rem or px strings; normalise to px numbers. */
export function toPx(value: string): number | null {
  const v = value.trim()
  if (v.endsWith('rem')) return parseFloat(v) * 16
  if (v.endsWith('px')) return parseFloat(v)
  return null
}
