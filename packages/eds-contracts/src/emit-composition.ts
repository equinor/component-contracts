/** Composition → CSS layout rule + Figma assembly script.
 *
 *  A composition owns LAYOUT only. Every visible box belongs to a component
 *  contract; the composition arranges ready-made instances so designers never
 *  assemble fields from parts (EDS 1.0's drawback), while developers keep the
 *  parts. In Figma the assembly is a component of exposed instances; in CSS it
 *  is one flex rule plus a documented markup pattern. */
import { cssVar, figmaVarName, stripBraces, tokenUniverse } from './resolve.ts'

export type Composition = {
  id: string
  name: string
  description: string
  layout: { direction: 'column' | 'row'; gap: string }
  parts: {
    component: string
    overrides?: Record<string, string>
    /** the part spans the composition's cross axis (CSS stretch, Figma FILL) */
    fill?: boolean
  }[]
  markup: string[]
}

export function resolveComposition(c: Composition) {
  const universe = tokenUniverse()
  const gapPath = stripBraces(c.layout.gap)
  const gapToken = universe.get(gapPath)
  if (!gapToken) throw new Error(`dangling gap ref in ${c.id}: ${c.layout.gap}`)
  return {
    composition: c,
    gapCssVar: cssVar(gapToken, gapPath),
    gapFigmaVar: figmaVarName(gapPath),
  }
}

export function emitCompositionCss(r: ReturnType<typeof resolveComposition>) {
  const c = r.composition
  const cls = `.eds-${c.id.split('.')[1]}`
  return [
    `/* Generated from compositions/${c.id.split('.')[1]}.json — do not edit. */`,
    '',
    '@layer eds-components {',
    `  /* A composition owns layout only — the parts style themselves. */`,
    `  ${cls} {`,
    `    display: ${c.layout.direction === 'column' ? 'flex' : 'inline-flex'};`,
    ...(c.layout.direction === 'column' ? [`    flex-direction: column;`] : []),
    `    gap: var(${r.gapCssVar});`,
    // a filling part spans the composition's width — the container is the
    // consumer's; everything else keeps its own box (labels stay captions)
    `    align-items: ${c.parts.some((p) => p.fill) ? 'stretch' : 'start'};`,
    `  }`,
    '}',
    '',
  ].join('\n')
}

export function emitCompositionBuilder(
  r: ReturnType<typeof resolveComposition>,
) {
  const c = r.composition
  const plan = {
    name: c.name,
    description: `${c.description}\n\nGenerated from ${c.id} — edit the composition, not this component.`,
    direction: c.layout.direction === 'column' ? 'VERTICAL' : 'HORIZONTAL',
    gapVar: r.gapFigmaVar,
    parts: c.parts,
  }
  return (
    `// Generated assembly for ${c.id} — do not edit; edit the composition.\n` +
    `const PLAN = ${JSON.stringify(plan)};\n` +
    String.raw`
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
const allVars = await figma.variables.getLocalVariablesAsync();
const byName = new Map(allVars.map(v => [v.name, v]));
const need = (n) => { const v = byName.get(n); if (!v) throw new Error('missing variable: ' + n); return v; };
// Source components are the generated sets/components on this page, by name.
const source = (name) => {
  const node = figma.currentPage.children.find(n =>
    (n.type === 'COMPONENT_SET' || n.type === 'COMPONENT') && n.name === name);
  if (!node) throw new Error('missing component: ' + name);
  return node.type === 'COMPONENT_SET' ? node.defaultVariant : node;
};
const maxX = Math.max(0, ...figma.currentPage.children.map(n => n.x + n.width));
const comp = figma.createComponent();
comp.name = PLAN.name;
comp.description = PLAN.description;
comp.layoutMode = PLAN.direction;
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
comp.counterAxisAlignItems = 'MIN';
comp.fills = [];
comp.x = maxX + 100; comp.y = 0;
comp.setBoundVariable('itemSpacing', need(PLAN.gapVar));
const created = [];
for (const part of PLAN.parts) {
  const inst = source(part.component).createInstance();
  comp.appendChild(inst);
  // designers reach the part's own props straight from the assembly
  inst.isExposedInstance = true;
  for (const [prop, value] of Object.entries(part.overrides || {})) {
    const key = Object.keys(inst.componentProperties).find(k => k.split('#')[0] === prop);
    if (key) inst.setProperties({ [key]: value });
  }
  created.push(inst.id);
}
// A filling part spans the composition's cross axis (the CSS twin's
// align-items: stretch). FILL needs a fixed edge: freeze the hugged width
// (the widest part — the Input's own 256 demo edge), then let the part fill.
if (PLAN.parts.some(p => p.fill)) {
  comp.counterAxisSizingMode = 'FIXED';
  comp.resize(comp.width, comp.height);
  for (let i = 0; i < PLAN.parts.length; i++) {
    if (PLAN.parts[i].fill) comp.children[i].layoutSizingHorizontal = 'FILL';
  }
}
return { createdNodeIds: [comp.id], componentId: comp.id, name: PLAN.name, parts: created.length };
`
  )
}
