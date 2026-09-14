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

// the DESIGN docs, readable in a tab
for (const f of ['DESIGN.md', 'DESIGN.verbose.md']) cpSync(path.join(root, f), path.join(site, f))
writeFileSync(path.join(site, '.nojekyll'), '')
console.log('pages tree assembled in _site/')
