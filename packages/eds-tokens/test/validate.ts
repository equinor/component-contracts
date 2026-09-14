/** DTCG structural validity + resolver reference integrity. */
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const dir = fileURLToPath(new URL('../tokens/', import.meta.url))
const read = (rel: string) => JSON.parse(readFileSync(dir + rel, 'utf8'))
const errors: string[] = []
const stats = { tokens: 0, refs: 0, files: 0 }

/** Walk a token tree, tracking inherited $type per DTCG group inheritance. */
function walk(
  node: any,
  path: string[],
  inherited: string | undefined,
  file: string,
  collect: (p: string, t: any) => void,
) {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) return
  const type = node.$type ?? inherited

  if ('$value' in node) {
    stats.tokens++
    const p = path.join('.')
    if (!type) errors.push(`${file}: ${p} has no resolvable $type`)
    collect(p, { ...node, $type: type })
    return
  }
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith('$')) continue
    if (/[{}.]/.test(key))
      errors.push(`${file}: name "${key}" contains {, } or .`)
    walk(child, [...path, key], type, file, collect)
  }
}

const all = new Map<string, any>()
const files = [
  'primitives.tokens.json',
  'semantic-color.tokens.json',
  'density/compact.tokens.json',
  'density/comfortable.tokens.json',
  'density/relaxed.tokens.json',
  'color-scheme/light.tokens.json',
  'color-scheme/dark.tokens.json',
]
for (const f of files) {
  if (!existsSync(dir + f)) {
    errors.push(`missing file: ${f}`)
    continue
  }
  stats.files++
  walk(read(f), [], undefined, f, (p, t) => all.set(p, t))
}

// reference resolution + cycle detection
const REF = /^\{([^}]+)\}$/
function resolve(path: string, seen: Set<string>): void {
  const token = all.get(path)
  if (!token) return
  const m = typeof token.$value === 'string' && token.$value.match(REF)
  if (!m) return
  stats.refs++
  const target = m[1]
  if (seen.has(target)) {
    errors.push(`circular reference: ${[...seen, target].join(' -> ')}`)
    return
  }
  if (!all.has(target)) {
    errors.push(`unresolved reference: ${path} -> {${target}}`)
    return
  }
  resolve(target, new Set([...seen, target]))
}
for (const path of all.keys()) resolve(path, new Set([path]))

// resolver integrity
const resolver = read('eds.resolver.json')
if (resolver.version !== '2025.10')
  errors.push(`resolver version must be "2025.10", got "${resolver.version}"`)
if (!Array.isArray(resolver.resolutionOrder))
  errors.push('resolver has no resolutionOrder')

const refsIn = (o: any): string[] =>
  typeof o !== 'object' || o === null
    ? []
    : Object.entries(o).flatMap(([k, v]) =>
        k === '$ref' ? [v as string] : refsIn(v),
      )

for (const ref of refsIn({
  sets: resolver.sets,
  modifiers: resolver.modifiers,
})) {
  if (!existsSync(dir + ref))
    errors.push(`resolver references missing file: ${ref}`)
}
for (const ref of refsIn(resolver.resolutionOrder)) {
  if (!ref.startsWith('#/')) {
    errors.push(`resolutionOrder ref must be same-document: ${ref}`)
    continue
  }
  const [, kind, name] = ref.split('/')
  if (!resolver[kind]?.[name])
    errors.push(`resolutionOrder points at missing ${kind}/${name}`)
}
// sets may not reference modifiers
for (const [name, set] of Object.entries<any>(resolver.sets ?? {})) {
  if (refsIn(set).some((r) => r.includes('/modifiers/'))) {
    errors.push(`set "${name}" references a modifier — not permitted`)
  }
}

console.log(`\nDTCG validation`)
console.log(
  `  ${stats.files} files, ${stats.tokens} tokens, ${stats.refs} references`,
)
console.log(`  modifiers: ${Object.keys(resolver.modifiers ?? {}).join(', ')}`)
console.log(`  ${errors.length} problems\n`)
if (errors.length) {
  console.log(errors.slice(0, 25).join('\n') + '\n')
  process.exit(1)
}
console.log('PASS — structure, references and resolver are valid.\n')
