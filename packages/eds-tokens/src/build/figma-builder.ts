/** Payload → runnable Figma scripts: the variable PORT as artifacts.
 *
 *  Turns build/figma/variables.json into self-contained scripts for the
 *  Figma Plugin API (run via the Figma MCP `use_figma` from any agent).
 *  Together they create every collection, mode, variable, alias and
 *  effect style the payload describes — how a consumer bootstraps a
 *  Figma file with the system's foundations (issue #35): derived from
 *  the token sources, never copied from another file.
 *
 *  Emitted as PARTS because `use_figma` accepts at most ~50k characters
 *  per call (first live run, 2026-10-14: one 90k script is unrunnable).
 *  Variables are packed greedily into parts under the budget; every
 *  part is IDEMPOTENT (converges by collection+name — names are NOT
 *  unique across collections: concept/bg-floating exists twice). Both
 *  alias forms are honoured: per-mode `{ alias: "name" }` (same
 *  collection) and top-level `{ alias: { collection, name } }` applied
 *  to every mode. Aliases whose target lives in a later part are
 *  reported, not fatal — the FINAL part re-applies the complete alias
 *  map and verifies the whole file against the full payload's counts.
 *  Run the parts in order; re-run any that reports errors.
 */
import type { FigmaPayload, FigmaVariable } from './figma.ts'

const MAX_SCRIPT = 50_000
const BUDGET = 40_000 // payload budget per part; runner adds ~5k

const RUNNER = String.raw`
const P = PART;
const report = { part: P.part, of: P.of, collectionsEnsured: 0, variablesCreated: 0, variablesConverged: 0, aliasesSet: 0, aliasesDeferred: [], effectStylesEnsured: 0, errors: [] };

// collections + modes (idempotent; renames a fresh collection's default mode)
const colls = await figma.variables.getLocalVariableCollectionsAsync();
const collByName = new Map(colls.map(c => [c.name, c]));
const modeIds = new Map();
for (const pc of P.collections) {
  let coll = collByName.get(pc.name);
  if (!coll) { coll = figma.variables.createVariableCollection(pc.name); collByName.set(pc.name, coll); }
  report.collectionsEnsured++;
  const byMode = new Map(coll.modes.map(m => [m.name, m.modeId]));
  for (const modeName of pc.modes) {
    if (byMode.has(modeName)) continue;
    const unclaimed = coll.modes.find(m => !pc.modes.includes(m.name));
    if (unclaimed) { coll.renameMode(unclaimed.modeId, modeName); byMode.set(modeName, unclaimed.modeId); }
    else byMode.set(modeName, coll.addMode(modeName));
  }
  modeIds.set(pc.name, byMode);
}

// variables, keyed by collection + name (names repeat across collections)
const collNameById = new Map((await figma.variables.getLocalVariableCollectionsAsync()).map(c => [c.id, c.name]));
const freshVars = await figma.variables.getLocalVariablesAsync();
const key = (collName, varName) => collName + '\u0000' + varName;
const varByKey = new Map(freshVars.map(v => [key(collNameById.get(v.variableCollectionId), v.name), v]));
const pending = []; // { v, modeId, targetKey }
for (const pc of P.collections) {
  const coll = collByName.get(pc.name);
  const byMode = modeIds.get(pc.name);
  for (const pv of pc.variables) {
    const k = key(pc.name, pv.name);
    let v = varByKey.get(k);
    if (!v) { v = figma.variables.createVariable(pv.name, coll, pv.type); varByKey.set(k, v); report.variablesCreated++; }
    else report.variablesConverged++;
    v.scopes = pv.scopes;
    if (pv.description) v.description = pv.description;
    if (pv.codeSyntax) v.setVariableCodeSyntax('WEB', pv.codeSyntax);
    if (pv.alias) { // top-level form: alias for EVERY mode of this collection
      for (const modeId of byMode.values()) pending.push({ v, modeId, targetKey: key(pv.alias.collection, pv.alias.name) });
    }
    for (const [modeName, val] of Object.entries(pv.values ?? {})) {
      const modeId = byMode.get(modeName);
      if (modeId === undefined) { report.errors.push('no mode ' + modeName + ' in ' + pc.name); continue; }
      if (val && typeof val === 'object' && 'alias' in val) pending.push({ v, modeId, targetKey: key(pc.name, val.alias) });
      else v.setValueForMode(modeId, val);
    }
  }
}
// the final part re-applies EVERY alias in the payload, cross-part targets included
for (const a of P.aliasMap ?? []) {
  const v = varByKey.get(key(a.inCollection, a.varName));
  if (!v) { report.errors.push('alias source missing: ' + a.inCollection + '/' + a.varName); continue; }
  const byMode = new Map(collByName.get(a.inCollection).modes.map(m => [m.name, m.modeId]));
  const modes = a.mode ? [byMode.get(a.mode)] : [...byMode.values()];
  for (const modeId of modes) pending.push({ v, modeId, targetKey: key(a.collection, a.name) });
}
for (const d of pending) {
  const target = varByKey.get(d.targetKey);
  if (!target) { report.aliasesDeferred.push(d.targetKey.replace('\u0000', '/')); continue; }
  d.v.setValueForMode(d.modeId, figma.variables.createVariableAlias(target));
  report.aliasesSet++;
}

for (const pe of P.effectStyles ?? []) {
  const styles = await figma.getLocalEffectStylesAsync();
  let s = styles.find(x => x.name === pe.name);
  if (!s) { s = figma.createEffectStyle(); s.name = pe.name; }
  if (pe.description) s.description = pe.description;
  s.effects = pe.effects;
  report.effectStylesEnsured++;
}

// verification: parts verify themselves; the final part verifies the WHOLE file
const expect = P.expect; // { collName: variableCount } (+ __effectStyles)
if (expect) {
  const collsNow = await figma.variables.getLocalVariableCollectionsAsync();
  const nameById = new Map(collsNow.map(c => [c.id, c.name]));
  const counts = {};
  for (const v of await figma.variables.getLocalVariablesAsync()) {
    const cn = nameById.get(v.variableCollectionId);
    counts[cn] = (counts[cn] ?? 0) + 1;
  }
  report.verified = {};
  for (const [cn, n] of Object.entries(expect)) {
    if (cn === '__effectStyles') continue;
    report.verified[cn] = { expected: n, actual: counts[cn] ?? 0 };
    if ((counts[cn] ?? 0) < n) report.errors.push('collection ' + cn + ' has ' + (counts[cn] ?? 0) + ' of ' + n + ' variables');
  }
  const styleNames = new Set((await figma.getLocalEffectStylesAsync()).map(x => x.name));
  const missingStyles = (P.effectStyles ?? []).filter(e => !styleNames.has(e.name)).map(e => e.name);
  report.verified.effectStyles = { expected: (P.effectStyles ?? []).length, missing: missingStyles };
  if (missingStyles.length) report.errors.push('missing effect styles: ' + missingStyles.join(', '));
}
report.complete = report.errors.length === 0 && report.aliasesDeferred.length === 0;
return report;
`

type Alias = { inCollection: string; varName: string; mode?: string; collection: string; name: string }

function allAliases(payload: FigmaPayload): Alias[] {
  const out: Alias[] = []
  for (const pc of payload.collections) {
    for (const pv of pc.variables) {
      if (pv.alias) out.push({ inCollection: pc.name, varName: pv.name, collection: pv.alias.collection, name: pv.alias.name })
      for (const [mode, val] of Object.entries(pv.values ?? {})) {
        if (val && typeof val === 'object' && 'alias' in val)
          out.push({ inCollection: pc.name, varName: pv.name, mode, collection: pc.name, name: (val as { alias: string }).alias })
      }
    }
  }
  return out
}

export function figmaBuilderScripts(payload: FigmaPayload): { file: string; script: string }[] {
  // pack variables greedily into parts under the budget, payload order kept
  type Part = { collections: { name: string; modes: string[]; variables: FigmaVariable[] }[] }
  const parts: Part[] = []
  let current: Part = { collections: [] }
  let size = 0
  for (const pc of payload.collections) {
    for (const pv of pc.variables) {
      const chunk = JSON.stringify(pv).length
      if (size + chunk > BUDGET && size > 0) {
        parts.push(current)
        current = { collections: [] }
        size = 0
      }
      let slot = current.collections.find((c) => c.name === pc.name)
      if (!slot) {
        slot = { name: pc.name, modes: pc.modes, variables: [] }
        current.collections.push(slot)
        size += JSON.stringify({ name: pc.name, modes: pc.modes }).length
      }
      slot.variables.push(pv)
      size += chunk
    }
  }
  parts.push(current)

  const expect: Record<string, number> = {}
  for (const pc of payload.collections) expect[pc.name] = pc.variables.length
  expect['__effectStyles'] = (payload.effectStyles ?? []).length

  const total = parts.length
  return parts.map((part, i) => {
    const last = i === total - 1
    const embedded = {
      part: i + 1,
      of: total,
      collections: part.collections,
      effectStyles: last ? payload.effectStyles : undefined,
      aliasMap: last ? allAliases(payload) : undefined,
      expect: last ? expect : undefined,
    }
    const header =
      `// GENERATED — EDS variable port, part ${i + 1} of ${total}. Run the parts in\n` +
      `// order via the Figma MCP use_figma tool in the target file; idempotent,\n` +
      `// re-run any part whose report shows errors. The final part re-applies all\n` +
      `// aliases and verifies the whole file (expect: ` +
      `${Object.entries(expect).filter(([k]) => k !== '__effectStyles').map(([k, v]) => `${k} ${v}`).join(', ')}).\n`
    const script = header + RUNNER.replace('PART', JSON.stringify(embedded))
    if (script.length > MAX_SCRIPT)
      throw new Error(`figma-builder part ${i + 1} is ${script.length} chars (max ${MAX_SCRIPT})`)
    return { file: `build/figma/variables.figma-build.${i + 1}of${total}.js`, script }
  })
}
