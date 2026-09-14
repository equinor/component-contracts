/** The union fingerprint: the token payload (variables.json) plus every
 *  contract-derived recipe variable = the complete expected variable universe
 *  of the Figma file. One canonical line per variable, one hash over all of
 *  them — the same lines are recomputed from the LIVE file by the generated
 *  build/verify-figma.js, so hand-edits, missing ports and stray variables
 *  become a diff, not a feeling. Silence is never a pass, in Figma either. */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import type { PairingVariable } from './resolve.ts'

const root = fileURLToPath(new URL('../../..', import.meta.url))

/** Numbers rounded to 4 decimals, printed without trailing zeros — the same
 *  canon the Figma-side verifier applies to float64 values. */
export const fmtNum = (n: number) => String(Math.round(n * 10000) / 10000)

const fmtValue = (v: any): string => {
  if (typeof v === 'number') return fmtNum(v)
  if (typeof v === 'string') return v
  if (typeof v === 'boolean') return String(v)
  if (v && typeof v === 'object' && 'r' in v)
    return [v.r, v.g, v.b, v.a ?? 1].map(fmtNum).join(',')
  throw new Error(`unfingerprintable value: ${JSON.stringify(v)}`)
}

/** FNV-1a 32-bit — small enough to inline in the Figma sandbox verbatim. */
export function fnv1a(lines: string[]): string {
  let h = 0x811c9dc5
  for (const line of lines) {
    for (let i = 0; i < line.length; i++) {
      h ^= line.charCodeAt(i)
      h = Math.imul(h, 0x01000193) >>> 0
    }
    h ^= 10 // '\n' between lines
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h.toString(16).padStart(8, '0')
}

/** One line per variable: `collection|name|mode=value;…`, aliases as
 *  `alias:<target-name>`, sorted — identical construction on both sides. */
export function unionLines(required: PairingVariable[]): string[] {
  const payload = JSON.parse(
    readFileSync(
      root + 'packages/eds-tokens/build/figma/variables.json',
      'utf8',
    ),
  )
  const lines: string[] = []
  const byName = new Map<string, string>()
  for (const coll of payload.collections) {
    for (const v of coll.variables) {
      const value = v.alias
        ? coll.modes.map((m: string) => `${m}=alias:${v.alias.name}`).join(';')
        : coll.modes
            .map((m: string) => {
              const raw = v.values[m]
              // per-mode alias: a scheme-valued concept following a different
              // palette step per mode (bg-floating)
              return raw && typeof raw === 'object' && 'alias' in raw
                ? `${m}=alias:${raw.alias}`
                : `${m}=${fmtValue(raw)}`
            })
            .join(';')
      lines.push(`${coll.name}|${v.name}|${value}`)
      byName.set(v.name, `${coll.name}|${v.name}|${value}`)
    }
  }
  // Contract-derived recipes: same collection vocabulary, values authored by
  // the resolver. A name the token package ALSO ships must agree exactly —
  // two sources deriving the same number from the same formulas is the point.
  for (const rv of required) {
    const value = Object.entries(rv.values)
      .map(([m, val]) => `${m}=${fmtValue(val as any)}`)
      .join(';')
    const line = `${rv.collection}|${rv.name}|${value}`
    const shipped = byName.get(rv.name)
    if (shipped !== undefined) {
      if (shipped !== line)
        throw new Error(
          `union: ${rv.name} disagrees with the shipped payload:\n  payload:  ${shipped}\n  contract: ${line}`,
        )
      continue
    }
    lines.push(line)
  }
  return lines.sort()
}

/** The standalone Figma-side verifier: recomputes the same canonical lines
 *  from the live file and diffs them against the embedded expectation. */
export function emitVerifier(lines: string[], hash: string): string {
  return `// Generated union verifier — do not edit; run via use_figma in the port file.
// Recomputes one canonical line per LIVE variable and diffs against the
// expected universe: token payload + contract-derived recipe variables.
const EXPECTED = ${JSON.stringify(lines, null, 0)};
const EXPECTED_HASH = '${hash}';

const fmtNum = (n) => String(Math.round(n * 10000) / 10000);
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
const byId = new Map(allVars.map((v) => [v.id, v]));
const actual = [];
for (const coll of collections) {
  for (const id of coll.variableIds) {
    const v = byId.get(id);
    const parts = [];
    for (const mode of coll.modes) {
      const raw = v.valuesByMode[mode.modeId];
      let val;
      if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') {
        const target = byId.get(raw.id) || (await figma.variables.getVariableByIdAsync(raw.id));
        val = 'alias:' + target.name;
      } else if (raw && typeof raw === 'object' && 'r' in raw) {
        val = [raw.r, raw.g, raw.b, raw.a === undefined ? 1 : raw.a].map(fmtNum).join(',');
      } else if (typeof raw === 'number') {
        val = fmtNum(raw);
      } else {
        val = String(raw);
      }
      parts.push(mode.name + '=' + val);
    }
    actual.push(coll.name + '|' + v.name + '|' + parts.join(';'));
  }
}
actual.sort();
let h = 0x811c9dc5;
for (const line of actual) {
  for (let i = 0; i < line.length; i++) {
    h ^= line.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  h ^= 10;
  h = Math.imul(h, 0x01000193) >>> 0;
}
const actualHash = h.toString(16).padStart(8, '0');
const exp = new Set(EXPECTED);
const act = new Set(actual);
const missing = EXPECTED.filter((l) => !act.has(l));
const extra = actual.filter((l) => !exp.has(l));
// Pair drifted lines: same collection|name, different value.
const keyOf = (l) => l.split('|').slice(0, 2).join('|');
const extraByKey = new Map(extra.map((l) => [keyOf(l), l]));
const drifted = missing
  .filter((l) => extraByKey.has(keyOf(l)))
  .map((l) => ({ name: keyOf(l), expected: l.split('|')[2], actual: extraByKey.get(keyOf(l)).split('|')[2] }));
const driftKeys = new Set(drifted.map((d) => d.name));
return {
  match: actualHash === EXPECTED_HASH,
  expectedHash: EXPECTED_HASH,
  actualHash,
  variables: actual.length,
  expectedVariables: EXPECTED.length,
  drifted,
  missing: missing.filter((l) => !driftKeys.has(keyOf(l))).slice(0, 30),
  extra: extra.filter((l) => !driftKeys.has(keyOf(l))).slice(0, 30),
};
`
}
