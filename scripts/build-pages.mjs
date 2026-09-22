// Assembles the GitHub Pages tree in _site/: the Storefront at the root,
// the button demo under /demos/, and the package files both fetch at
// runtime under /packages/. Deterministic: run it, commit _site to the
// www branch, done. Never edit the branch by hand.
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const site = path.join(root, '_site')
rmSync(site, { recursive: true, force: true })
mkdirSync(site)

const rewrite = (file, pairs) => {
  let s = readFileSync(file, 'utf8')
  for (const [a, b] of pairs) s = s.replaceAll(a, b)
  writeFileSync(file, s)
}

// storefront → site root
cpSync(path.join(root, 'apps/storefront'), site, { recursive: true })
rewrite(path.join(site, 'index.html'), [
  ['../../packages/', 'packages/'],
  ['../demos/building-the-button/', 'demos/'],
])

// button demo → /demos
const demoSrc = path.join(root, 'apps/demos/building-the-button')
mkdirSync(path.join(site, 'demos'))
for (const f of readdirSync(demoSrc).filter((f) => f.endsWith('.html'))) {
  cpSync(path.join(demoSrc, f), path.join(site, 'demos', f))
  rewrite(path.join(site, 'demos', f), [['../../../packages/', '../packages/']])
}

// the package files the pages fetch at runtime (relative paths preserved)
for (const p of [
  'packages/eds-tokens/build',
  'packages/eds-tokens/fonts',
  'packages/eds-contracts/build',
  'packages/eds-contracts/contracts',
  'packages/eds-contracts/contract.schema.json',
  'packages/eds-contracts/preview',
])
  cpSync(path.join(root, p), path.join(site, p), { recursive: true })

// the schema at its $id — a versioned path (v0: contracts are pre-1.0) so
// the URL is a deliberate promise, not wherever the file happens to live
const schema = JSON.parse(readFileSync(path.join(root, 'packages/eds-contracts/contract.schema.json'), 'utf8'))
const schemaPath = 'schema/v0/contract.schema.json'
if (schema.$id !== `https://equinor.github.io/component-contracts/${schemaPath}`)
  throw new Error(`contract.schema.json $id does not match the published path ${schemaPath}`)
mkdirSync(path.join(site, path.dirname(schemaPath)), { recursive: true })
cpSync(path.join(root, 'packages/eds-contracts/contract.schema.json'), path.join(site, schemaPath))

// llms.txt: the discovery pointer (Astryx's shape — point at the sources,
// never dump them). Agents in consumer repos fetch this first.
writeFileSync(
  path.join(site, 'llms.txt'),
  `# Equinor Design System — component contracts

One JSON contract per component generates the component in both CSS and
Figma; a parity harness proves the surfaces agree. Everything below is
generated from the contracts and tokens — computed, never recalled.

- DESIGN.md: /DESIGN.md (thin: rules and pointers, ~11 KB)
- DESIGN.verbose.md: /DESIGN.verbose.md (full disclosure: palette, recipes, resolved states)
- Component contracts (the source of truth): /packages/eds-contracts/contracts/<name>.contract.json
- Contract schema (its $id, versioned): /schema/v0/contract.schema.json
- Token CSS (link these, never copy values): /packages/eds-tokens/build/css/index.css
- Component CSS: /packages/eds-contracts/build/<name>.css
- Live component browser with correct markup per component: /storefront/ (the DOM pane shows the exact markup)
- Skills (principles as runnable algorithms): https://github.com/equinor/skills — install: npx skills add equinor/skills
- Source: https://github.com/equinor/component-contracts

Rules for agents: bind tokens, never raw hex or px. Never author a
control height. Variants are data-* attributes; defaults are attribute
absent. Copy markup from the Storefront's DOM pane, not from memory.
`,
)

// the DESIGN docs, readable in a tab
for (const f of ['DESIGN.md', 'DESIGN.verbose.md']) cpSync(path.join(root, f), path.join(site, f))
writeFileSync(path.join(site, '.nojekyll'), '')
console.log('pages tree assembled in _site/')
