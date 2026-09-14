/** Build every contract: emit CSS + Figma plan + the disposition ledger. */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { ledger, resolveContract } from './resolve.ts'
import { emitCss } from './emit-css.ts'
import { emitFigmaPlan } from './emit-figma.ts'
import { emitBuilder } from './emit-builder.ts'
import {
  emitCompositionBuilder,
  emitCompositionCss,
  resolveComposition,
} from './emit-composition.ts'
import { emitDesignMd } from './emit-designmd.ts'
import { emitVerifier, fnv1a, unionLines } from './fingerprint.ts'
import type { PairingVariable } from './resolve.ts'

const pkg = fileURLToPath(new URL('..', import.meta.url))
const repoRel = (abs: string) =>
  abs.replace(fileURLToPath(new URL('../../..', import.meta.url)), '')
mkdirSync(pkg + 'build', { recursive: true })

const requiredUnion = new Map<string, PairingVariable>()

for (const file of readdirSync(pkg + 'contracts').filter((f) =>
  f.endsWith('.contract.json'),
)) {
  const name = file.replace('.contract.json', '')
  const r = resolveContract(repoRel(pkg + 'contracts/' + file))

  const plan = emitFigmaPlan(r)
  for (const rv of plan.requiredVariables) {
    const prev = requiredUnion.get(rv.name)
    if (prev && JSON.stringify(prev.values) !== JSON.stringify(rv.values))
      throw new Error(`required variable ${rv.name} disagrees across contracts`)
    if (!prev) requiredUnion.set(rv.name, rv)
  }
  writeFileSync(pkg + `build/${name}.css`, emitCss(r))
  writeFileSync(
    pkg + `build/${name}.figma-plan.json`,
    JSON.stringify(plan, null, 2) + '\n',
  )
  writeFileSync(pkg + `build/${name}.figma-build.js`, emitBuilder(plan))
  writeFileSync(
    pkg + `build/${name}.ledger.json`,
    JSON.stringify(ledger(r), null, 2) + '\n',
  )

  console.log(`${r.contract.id} v${r.contract.version}`)
  if (r.geometry) {
    for (const g of r.geometry) {
      console.log(
        `  ${g.density.padEnd(11)} font ${g.fontPx}  lh ${g.lineHeightPx}  cap ${g.capPx}` +
          `  inset ${g.insetPx}  padding ${g.paddingPx}  height ${g.heightPx}`,
      )
    }
  }
  console.log(`  refs ${r.refs.length} resolved, 0 dangling`)
  for (const e of ledger(r)) {
    console.log(
      `  ${e.fact.padEnd(46)} css:${e.css.padEnd(8)} figma:${e.figma}`,
    )
  }
  console.log(
    `  → build/${name}.{css, figma-plan.json, figma-build.js, ledger.json}`,
  )
}

// Compositions: layout-only assemblies of ready-made component instances.
for (const file of readdirSync(pkg + 'compositions').filter((f) =>
  f.endsWith('.json'),
)) {
  const name = file.replace('.json', '')
  const r = resolveComposition(
    JSON.parse(readFileSync(pkg + 'compositions/' + file, 'utf8')),
  )
  writeFileSync(pkg + `build/${name}.css`, emitCompositionCss(r))
  writeFileSync(pkg + `build/${name}.figma-build.js`, emitCompositionBuilder(r))
  console.log(
    `${r.composition.id} (composition, ${r.composition.parts.length} parts)` +
      ` → build/${name}.{css, figma-build.js}`,
  )
}

// The union fingerprint: token payload + contract-derived recipes = the full
// expected variable universe of the Figma file, one hash + a live verifier.
{
  const lines = unionLines([...requiredUnion.values()])
  const hash = fnv1a(lines)
  writeFileSync(
    pkg + 'build/figma.fingerprint.json',
    JSON.stringify(
      {
        hash,
        variables: lines.length,
        payloadVariables: lines.length - requiredUnion.size,
        recipeVariables: requiredUnion.size,
      },
      null,
      2,
    ) + '\n',
  )
  writeFileSync(pkg + 'build/verify-figma.js', emitVerifier(lines, hash))
  console.log(
    `union fingerprint ${hash} (${lines.length} variables, ` +
      `${requiredUnion.size} contract-derived) → build/verify-figma.js`,
  )
}

// DESIGN.md: the fourth renderer — repo root, per the convention agents look for.
writeFileSync(
  fileURLToPath(new URL('../../../DESIGN.md', import.meta.url)),
  emitDesignMd(),
)
// The VERBOSE variant: Atlassian-grade disclosure for the fairness experiment
// (demos/building-the-button) — same generation, nothing held back.
writeFileSync(
  fileURLToPath(new URL('../../../DESIGN.verbose.md', import.meta.url)),
  emitDesignMd(true),
)
console.log('DESIGN.md + DESIGN.verbose.md (fourth renderer) → repo root')
