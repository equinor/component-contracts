/*  Contract extension — ADR-0007's mechanism, v1.
 *
 *  A consumer contract declares `"extends": "eds.button"` (optionally
 *  `eds.button@0.8.0` to pin) and the merge produces the local contract.
 *  Two obligations, fixed by the ADR:
 *
 *  1. The MERGED contract is what gets emitted and verified — an
 *     extension inherits the machinery, or it does not build.
 *  2. The merge emits a diff of everything added or changed against
 *     upstream. Local divergence is visible by construction.
 *
 *  Merge semantics (v1, additive-first):
 *  - props, states: merged by `name` — never positionally
 *  - variants: merged by their `when` object (canonical JSON)
 *  - enum props EXTEND: base values keep their order, new values append
 *  - objects (anatomy, semantics, tokens) deep-merge; scalar conflicts
 *    take the extension's value and are reported as `changed`
 *  - id, version, description, notes are the EXTENSION's own
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../../..', import.meta.url))

export type ExtensionDiff = {
  path: string
  kind: 'added' | 'changed'
  detail: string
}[]

const isObj = (v: any) => v && typeof v === 'object' && !Array.isArray(v)
const show = (v: any) => JSON.stringify(v)?.slice(0, 60)

function deepMerge(base: any, ext: any, path: string, diff: ExtensionDiff): any {
  const out = { ...base }
  for (const [k, v] of Object.entries(ext)) {
    const p = `${path}/${k}`
    if (!(k in base)) {
      out[k] = v
      diff.push({ path: p, kind: 'added', detail: show(v) })
    } else if (isObj(base[k]) && isObj(v)) {
      out[k] = deepMerge(base[k], v, p, diff)
    } else if (Array.isArray(base[k]?.enum ?? base[k]) && Array.isArray(v)) {
      // plain arrays inside objects: extension wins, reported
      if (JSON.stringify(base[k]) !== JSON.stringify(v)) {
        out[k] = v
        diff.push({ path: p, kind: 'changed', detail: `${show(base[k])} → ${show(v)}` })
      }
    } else if (JSON.stringify(base[k]) !== JSON.stringify(v)) {
      out[k] = v
      diff.push({ path: p, kind: 'changed', detail: `${show(base[k])} → ${show(v)}` })
    }
  }
  return out
}

function mergeProp(base: any, ext: any, path: string, diff: ExtensionDiff): any {
  // enum props extend: base order kept, new values appended
  if (base.type?.enum && ext.type?.enum) {
    const added = ext.type.enum.filter((v: string) => !base.type.enum.includes(v))
    if (added.length)
      diff.push({ path: `${path}/type/enum`, kind: 'added', detail: added.join(', ') })
    const rest = deepMerge(
      { ...base, type: undefined },
      { ...ext, type: undefined },
      path,
      diff,
    )
    return { ...rest, type: { enum: [...base.type.enum, ...added] } }
  }
  return deepMerge(base, ext, path, diff)
}

function mergeNamed(
  base: any[] | undefined,
  ext: any[] | undefined,
  keyOf: (x: any) => string,
  path: string,
  diff: ExtensionDiff,
  mergeOne: (b: any, e: any, p: string, d: ExtensionDiff) => any = deepMerge,
): any[] {
  const out = (base ?? []).map((x) => ({ ...x }))
  const idx = new Map(out.map((x, i) => [keyOf(x), i]))
  for (const e of ext ?? []) {
    const k = keyOf(e)
    const i = idx.get(k)
    if (i === undefined) {
      out.push(e)
      diff.push({ path: `${path}/${k}`, kind: 'added', detail: 'new entry' })
    } else {
      out[i] = mergeOne(out[i], e, `${path}/${k}`, diff)
    }
  }
  return out
}

/** Locate the base contract for an `extends` reference like `eds.button`
 *  or `eds.button@0.8.0` in this repo's contracts directory. */
export function baseContractPath(ref: string): { path: string; pinned?: string } {
  const [id, pinned] = ref.split('@')
  const name = id.split('.').slice(1).join('.')
  return { path: `packages/eds-contracts/contracts/${name}.contract.json`, pinned }
}

export function mergeContracts(
  base: any,
  ext: any,
): { contract: any; diff: ExtensionDiff } {
  const diff: ExtensionDiff = []
  const merged: any = { ...base }

  // identity is the extension's own; provenance is recorded
  for (const k of ['id', 'version', 'description', 'notes', '$schema']) {
    if (ext[k] !== undefined) merged[k] = ext[k]
  }
  merged.extends = `${base.id}@${base.version}`

  merged.props = mergeNamed(base.props, ext.props, (p) => p.name, 'props', diff, mergeProp)
  merged.states = mergeNamed(base.states, ext.states, (s) => s.name, 'states', diff)
  merged.variants = mergeNamed(
    base.variants,
    ext.variants,
    (v) => JSON.stringify(v.when ?? {}),
    'variants',
    diff,
  )
  if (ext.anatomy) merged.anatomy = deepMerge(base.anatomy ?? {}, ext.anatomy, 'anatomy', diff)
  if (ext.semantics)
    merged.semantics = deepMerge(base.semantics ?? {}, ext.semantics, 'semantics', diff)

  return { contract: merged, diff }
}

/** Load a contract file; if it extends another, return the verified merge. */
export function loadWithExtends(pathFromRoot: string): {
  contract: any
  diff: ExtensionDiff | null
} {
  const ext = JSON.parse(readFileSync(root + pathFromRoot, 'utf8'))
  if (!ext.extends) return { contract: ext, diff: null }
  const { path, pinned } = baseContractPath(ext.extends)
  const base = JSON.parse(readFileSync(root + path, 'utf8'))
  if (pinned && pinned !== base.version)
    throw new Error(
      `${ext.id} extends ${ext.extends}, but the base is at ${base.version} — ` +
        `re-verify the extension against the new base, then update the pin`,
    )
  const merged = mergeContracts(base, ext)
  return { contract: merged.contract, diff: merged.diff }
}
