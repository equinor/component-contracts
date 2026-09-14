import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { DENSITIES, type Density } from '../formulas.ts'
import { densityTokens, primitiveTokens, resolver } from './tokens.ts'
import { fontFacesCss, typographyCss } from './css.ts'
import {
  colorCss,
  parseOracle,
  schemeTokens,
  semanticColorTokens,
} from './color.ts'
import { opticalPaddingDoc, opticalPaddingSkill } from './docs.ts'
import { figmaVariables } from './figma.ts'

const root = fileURLToPath(new URL('../..', import.meta.url))
const repo = fileURLToPath(new URL('../../../..', import.meta.url))
const write = (rel: string, body: string) => {
  const path = root + rel
  mkdirSync(path.slice(0, path.lastIndexOf('/')), { recursive: true })
  writeFileSync(path, body.endsWith('\n') ? body : body + '\n')
  console.log(`  ${rel}`)
}
const json = (v: unknown) => JSON.stringify(v, null, 2)

console.log('\ntokens')
const primitives = primitiveTokens()
write('tokens/primitives.tokens.json', json(primitives))
const densities = {} as Record<Density, any>
for (const d of Object.keys(DENSITIES) as Density[]) {
  densities[d] = densityTokens(d)
  write(`tokens/density/${d}.tokens.json`, json(densities[d]))
}
const color = parseOracle()
const semantic = semanticColorTokens(color)
write('tokens/semantic-color.tokens.json', json(semantic))
const schemes = {
  light: schemeTokens('light', color),
  dark: schemeTokens('dark', color),
}
for (const scheme of ['light', 'dark'] as const) {
  write(`tokens/color-scheme/${scheme}.tokens.json`, json(schemes[scheme]))
}
write('tokens/eds.resolver.json', json(resolver()))

console.log('\nfigma')
write(
  'build/figma/variables.json',
  json(figmaVariables({ primitives, densities, semantic, schemes })),
)

console.log('\ncss')
write('build/css/typography.css', typographyCss())
write('build/css/font-faces.css', fontFacesCss())
write('build/css/color.css', colorCss(color))
write(
  'build/css/index.css',
  `/* EDS tokens — single entry point.
 * Generated — do not edit.
 *
 *   @import '@equinor/eds-tokens/css';
 *
 * Two runtime axes:
 *   [data-density='compact' | 'comfortable' | 'relaxed']   (default: comfortable)
 *   [data-color-scheme='light' | 'dark']                   (default: light, follows OS if unset)
 *
 * Defaults are declared with \`:where(:root)\` so they carry zero specificity —
 * an explicit attribute always wins regardless of source order, and consumers can
 * override without a specificity fight.
 */
@import './font-faces.css';
@import './typography.css';
@import './color.css';
`,
)
console.log('\ndocs + skill')
write('docs/optical-padding.md', opticalPaddingDoc())
writeFileSync(repo + '.claude/skills/optical-padding/SKILL.md', opticalPaddingSkill())
console.log()
