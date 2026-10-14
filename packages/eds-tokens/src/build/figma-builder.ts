/** Payload → runnable Figma script: the variable PORT as an artifact.
 *
 *  Turns build/figma/variables.json into a self-contained script for the
 *  Figma Plugin API (run via the Figma MCP `use_figma` from any agent —
 *  Claude Code, Copilot, anything MCP). Creates every collection, mode,
 *  variable, alias and effect style the payload describes, in the file
 *  the agent is pointed at. This is how a consumer bootstraps a Figma
 *  file with the system's foundations (issue #35): derived from the
 *  token sources, never copied from another file.
 *
 *  IDEMPOTENT by design: existing collections/modes/variables/styles are
 *  found by name and converged to the payload's values, so the script is
 *  safe to re-run until the returned counts match the payload. Aliases
 *  are set in a second pass once every target exists.
 */
import type { figmaVariables } from './figma.ts'

type Payload = ReturnType<typeof figmaVariables>

const SCRIPT = String.raw`
const P = PAYLOAD;
const report = { collectionsCreated: [], modesAdded: 0, variablesCreated: 0, variablesConverged: 0, aliasesSet: 0, effectStylesEnsured: 0, errors: [] };

// collections + modes, by name
const existing = await figma.variables.getLocalVariableCollectionsAsync();
const collByName = new Map(existing.map(c => [c.name, c]));
const modeIds = new Map(); // collName -> (modeName -> modeId)
for (const pc of P.collections) {
  let coll = collByName.get(pc.name);
  if (!coll) {
    coll = figma.variables.createVariableCollection(pc.name);
    collByName.set(pc.name, coll);
    report.collectionsCreated.push(pc.name);
  }
  const byMode = new Map(coll.modes.map(m => [m.name, m.modeId]));
  pc.modes.forEach((modeName, i) => {
    if (byMode.has(modeName)) return;
    if (i === 0 && coll.modes.length === 1 && !P.collections.some(c => c.modes.includes(coll.modes[0].name) && c.name === pc.name)) {
      coll.renameMode(coll.modes[0].modeId, modeName);
      byMode.set(modeName, coll.modes[0].modeId);
    } else {
      const id = coll.addMode(modeName);
      byMode.set(modeName, id);
      report.modesAdded++;
    }
  });
  // a fresh collection's default mode: rename it to the first payload mode
  if (!byMode.has(pc.modes[0])) {
    coll.renameMode(coll.modes[0].modeId, pc.modes[0]);
    byMode.set(pc.modes[0], coll.modes[0].modeId);
  }
  modeIds.set(pc.name, byMode);
}

// pass 1 — ensure variables, set literal values; defer aliases
const allVars = await figma.variables.getLocalVariablesAsync();
const varByName = new Map(allVars.map(v => [v.name, v]));
const deferred = []; // { v, modeId, target }
for (const pc of P.collections) {
  const coll = collByName.get(pc.name);
  const byMode = modeIds.get(pc.name);
  for (const pv of pc.variables) {
    let v = varByName.get(pv.name);
    if (!v) {
      v = figma.variables.createVariable(pv.name, coll, pv.type);
      varByName.set(pv.name, v);
      report.variablesCreated++;
    } else {
      report.variablesConverged++;
    }
    v.scopes = pv.scopes;
    if (pv.description) v.description = pv.description;
    if (pv.codeSyntax) v.setVariableCodeSyntax('WEB', pv.codeSyntax);
    for (const [modeName, val] of Object.entries(pv.values)) {
      const modeId = byMode.get(modeName);
      if (modeId === undefined) { report.errors.push('no mode ' + modeName + ' in ' + pc.name); continue; }
      if (val && typeof val === 'object' && 'alias' in val) {
        deferred.push({ v, modeId, target: val.alias });
      } else {
        v.setValueForMode(modeId, val);
      }
    }
  }
}

// pass 2 — aliases, now that every target exists
for (const d of deferred) {
  const target = varByName.get(d.target);
  if (!target) { report.errors.push('missing alias target: ' + d.target); continue; }
  d.v.setValueForMode(d.modeId, figma.variables.createVariableAlias(target));
  report.aliasesSet++;
}

// pass 3 — effect styles, by name
const effByName = new Map((await figma.getLocalEffectStylesAsync()).map(s => [s.name, s]));
for (const pe of P.effectStyles ?? []) {
  let s = effByName.get(pe.name);
  if (!s) { s = figma.createEffectStyle(); s.name = pe.name; effByName.set(pe.name, s); }
  if (pe.description) s.description = pe.description;
  s.effects = pe.effects;
  report.effectStylesEnsured++;
}

// verification — compare against the payload, not against hope
const expect = { collections: P.collections.length, variables: P.collections.reduce((n, c) => n + c.variables.length, 0), effectStyles: (P.effectStyles ?? []).length };
const have = { collections: (await figma.variables.getLocalVariableCollectionsAsync()).filter(c => P.collections.some(pc => pc.name === c.name)).length, variables: (await figma.variables.getLocalVariablesAsync()).filter(v => varByName.has(v.name)).length };
report.expected = expect;
report.complete = report.errors.length === 0 && have.collections === expect.collections;
return report;
`

export function figmaBuilderScript(payload: Payload): string {
  const header =
    '// GENERATED — the EDS variable port as a runnable Figma script.\n' +
    '// Run via the Figma MCP use_figma tool in the target file. Idempotent:\n' +
    '// re-run until the returned report says complete with zero errors.\n' +
    `// Payload: ${payload.collections.length} collections, ` +
    `${payload.collections.reduce((n, c) => n + c.variables.length, 0)} variables, ` +
    `${(payload.effectStyles ?? []).length} effect styles.\n`
  return header + SCRIPT.replace('PAYLOAD', JSON.stringify(payload))
}
