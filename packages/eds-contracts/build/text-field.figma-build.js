// Generated assembly for eds.text-field — do not edit; edit the composition.
const PLAN = {"name":"TextField","description":"Label + Input + helper — the assembled field. A composition owns LAYOUT only: every box belongs to its own contract, and the assembly ships ready-made so designers never rebuild it from parts (EDS 1.0's drawback — the fix is shipping BOTH the parts and the composition). Every part FILLS the field's width (Victor 2026-09-05): the box spans, and the captions wrap at the field's edge instead of stretching it.\n\nGenerated from eds.text-field — edit the composition, not this component.","direction":"VERTICAL","gapVar":"spacing/vertical-xs","parts":[{"component":"Label","overrides":{"Text":"Label"},"fill":true},{"component":"Input","fill":true},{"component":"Label","overrides":{"Text":"Helper text"},"fill":true}]};

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
