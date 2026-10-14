// Generated builder for eds.chip — do not edit; edit the contract.
// Transport-agnostic: Figma MCP use_figma, or figma-console-mcp figma_execute.
const PLAN = {"component":"eds.chip","requiredVariables":[{"name":"recipe/optical-padding-xs-squared-sm-label","collection":"density","values":{"compact":4,"comfortable":6,"relaxed":10},"codeSyntax":"calc(var(--eds-spacing-inset-xs-vertical-squared) - var(--eds-half-leading-sm))","description":"eds.chip: sm label in the xs-squared inset. Resolved because Figma cannot calc; CSS composes it live. Heights land at 20/24/36."}],"componentSet":{"name":"Chip","description":"Chip — a compact selectable. The height is never stated: it is inset × 2 + cap(label), which resolves to 20 / 24 / 36 px across compact / comfortable / relaxed — EDS 1.0’s 24px chip, on the shared rhythm. Two emphasis tiers across all six tones: muted (wash + tone border) and emphasis (filled + on-emphasis ink), per the Component Mocks review (outlined/filled, 2026-08-29).\n\nGenerated from eds.chip v0.5.0 — edit the contract, not this component.","axes":{"Tone":["Neutral","Accent","Danger","Warning","Success","Info"],"Emphasis":["Muted","Emphasis"],"State":["Default","Hover","Active","Selected","Disabled"]},"textProps":[{"property":"Label","default":"Chip","part":"label"}],"booleanProps":[{"property":"Icon","default":false,"part":"icon"},{"property":"Dismissible","default":false,"part":"dismiss"}],"root":{"layout":"HORIZONTAL","align":"CENTER","radiusVar":"spacing/border-radius-pill","strokeWeightVar":"sizing/stroke-thin"},"parts":[{"kind":"glyph","name":"icon","swap":{"property":"↳ Icon","componentKey":"9fd93824c3b0d41f7e1eed3b16fa433589b91874"}},{"kind":"text","name":"label","defaultText":"Chip"},{"kind":"glyph","name":"dismiss","swap":{"property":"↳ Dismiss Icon","componentKey":"3bd72d0a163f1d70993eb1b648540442f161567e"}}],"bySize":{"Default":{"glyphs":{"icon":{"containerVar":"recipe/cap-rounded-sm","glyphVar":"sizing/icon-sm"},"dismiss":{"containerVar":"recipe/cap-rounded-sm","glyphVar":"sizing/icon-sm"}},"paddingBlock":"recipe/optical-padding-xs-squared-sm-label","paddingInline":"spacing/inset-xs-horizontal","insetVar":"spacing/inset-xs-vertical-squared","gap":"spacing/icon-sm-gap-horizontal","label":{"fontFamily":"typography/font-family/ui","fontWeight":"font-weight/normal","fontSize":"typography/font-size/sm","lineHeight":"typography/line-height/compressed/sm"}}},"variants":[{"name":"Tone=Neutral, Emphasis=Muted, State=Default","size":"Default","bg":"semantic/bg-neutral-fill-muted-default","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","border":"semantic/border-neutral-medium"},{"name":"Tone=Neutral, Emphasis=Muted, State=Hover","size":"Default","bg":"semantic/bg-neutral-fill-muted-hover","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","border":"semantic/border-neutral-medium"},{"name":"Tone=Neutral, Emphasis=Muted, State=Active","size":"Default","bg":"semantic/bg-neutral-fill-muted-active","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","border":"semantic/border-neutral-medium"},{"name":"Tone=Neutral, Emphasis=Muted, State=Selected","size":"Default","bg":"semantic/bg-neutral-fill-muted-selected","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","border":"semantic/border-neutral-medium"},{"name":"Tone=Neutral, Emphasis=Muted, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Neutral, Emphasis=Emphasis, State=Default","size":"Default","bg":"semantic/bg-neutral-fill-emphasis-default","fg":"semantic/text-neutral-strong-on-emphasis","iconFg":"semantic/icon-neutral-on-emphasis"},{"name":"Tone=Neutral, Emphasis=Emphasis, State=Hover","size":"Default","bg":"semantic/bg-neutral-fill-emphasis-hover","fg":"semantic/text-neutral-strong-on-emphasis","iconFg":"semantic/icon-neutral-on-emphasis"},{"name":"Tone=Neutral, Emphasis=Emphasis, State=Active","size":"Default","bg":"semantic/bg-neutral-fill-emphasis-active","fg":"semantic/text-neutral-strong-on-emphasis","iconFg":"semantic/icon-neutral-on-emphasis"},{"name":"Tone=Neutral, Emphasis=Emphasis, State=Selected","size":"Default","bg":"semantic/bg-neutral-fill-emphasis-selected","fg":"semantic/text-neutral-strong-on-emphasis","iconFg":"semantic/icon-neutral-on-emphasis"},{"name":"Tone=Neutral, Emphasis=Emphasis, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled"},{"name":"Tone=Accent, Emphasis=Muted, State=Default","size":"Default","bg":"semantic/bg-accent-fill-muted-default","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","border":"semantic/border-accent-medium"},{"name":"Tone=Accent, Emphasis=Muted, State=Hover","size":"Default","bg":"semantic/bg-accent-fill-muted-hover","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","border":"semantic/border-accent-medium"},{"name":"Tone=Accent, Emphasis=Muted, State=Active","size":"Default","bg":"semantic/bg-accent-fill-muted-active","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","border":"semantic/border-accent-medium"},{"name":"Tone=Accent, Emphasis=Muted, State=Selected","size":"Default","bg":"semantic/bg-accent-fill-muted-selected","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","border":"semantic/border-accent-medium"},{"name":"Tone=Accent, Emphasis=Muted, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Accent, Emphasis=Emphasis, State=Default","size":"Default","bg":"semantic/bg-accent-fill-emphasis-default","fg":"semantic/text-accent-strong-on-emphasis","iconFg":"semantic/icon-accent-on-emphasis"},{"name":"Tone=Accent, Emphasis=Emphasis, State=Hover","size":"Default","bg":"semantic/bg-accent-fill-emphasis-hover","fg":"semantic/text-accent-strong-on-emphasis","iconFg":"semantic/icon-accent-on-emphasis"},{"name":"Tone=Accent, Emphasis=Emphasis, State=Active","size":"Default","bg":"semantic/bg-accent-fill-emphasis-active","fg":"semantic/text-accent-strong-on-emphasis","iconFg":"semantic/icon-accent-on-emphasis"},{"name":"Tone=Accent, Emphasis=Emphasis, State=Selected","size":"Default","bg":"semantic/bg-accent-fill-emphasis-selected","fg":"semantic/text-accent-strong-on-emphasis","iconFg":"semantic/icon-accent-on-emphasis"},{"name":"Tone=Accent, Emphasis=Emphasis, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled"},{"name":"Tone=Danger, Emphasis=Muted, State=Default","size":"Default","bg":"semantic/bg-danger-fill-muted-default","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","border":"semantic/border-danger-medium"},{"name":"Tone=Danger, Emphasis=Muted, State=Hover","size":"Default","bg":"semantic/bg-danger-fill-muted-hover","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","border":"semantic/border-danger-medium"},{"name":"Tone=Danger, Emphasis=Muted, State=Active","size":"Default","bg":"semantic/bg-danger-fill-muted-active","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","border":"semantic/border-danger-medium"},{"name":"Tone=Danger, Emphasis=Muted, State=Selected","size":"Default","bg":"semantic/bg-danger-fill-muted-selected","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","border":"semantic/border-danger-medium"},{"name":"Tone=Danger, Emphasis=Muted, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Danger, Emphasis=Emphasis, State=Default","size":"Default","bg":"semantic/bg-danger-fill-emphasis-default","fg":"semantic/text-danger-strong-on-emphasis","iconFg":"semantic/icon-danger-on-emphasis"},{"name":"Tone=Danger, Emphasis=Emphasis, State=Hover","size":"Default","bg":"semantic/bg-danger-fill-emphasis-hover","fg":"semantic/text-danger-strong-on-emphasis","iconFg":"semantic/icon-danger-on-emphasis"},{"name":"Tone=Danger, Emphasis=Emphasis, State=Active","size":"Default","bg":"semantic/bg-danger-fill-emphasis-active","fg":"semantic/text-danger-strong-on-emphasis","iconFg":"semantic/icon-danger-on-emphasis"},{"name":"Tone=Danger, Emphasis=Emphasis, State=Selected","size":"Default","bg":"semantic/bg-danger-fill-emphasis-selected","fg":"semantic/text-danger-strong-on-emphasis","iconFg":"semantic/icon-danger-on-emphasis"},{"name":"Tone=Danger, Emphasis=Emphasis, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled"},{"name":"Tone=Warning, Emphasis=Muted, State=Default","size":"Default","bg":"semantic/bg-warning-fill-muted-default","fg":"semantic/text-warning-strong","iconFg":"semantic/icon-warning","border":"semantic/border-warning-medium"},{"name":"Tone=Warning, Emphasis=Muted, State=Hover","size":"Default","bg":"semantic/bg-warning-fill-muted-hover","fg":"semantic/text-warning-strong","iconFg":"semantic/icon-warning","border":"semantic/border-warning-medium"},{"name":"Tone=Warning, Emphasis=Muted, State=Active","size":"Default","bg":"semantic/bg-warning-fill-muted-active","fg":"semantic/text-warning-strong","iconFg":"semantic/icon-warning","border":"semantic/border-warning-medium"},{"name":"Tone=Warning, Emphasis=Muted, State=Selected","size":"Default","bg":"semantic/bg-warning-fill-muted-selected","fg":"semantic/text-warning-strong","iconFg":"semantic/icon-warning","border":"semantic/border-warning-medium"},{"name":"Tone=Warning, Emphasis=Muted, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Warning, Emphasis=Emphasis, State=Default","size":"Default","bg":"semantic/bg-warning-fill-emphasis-default","fg":"semantic/text-warning-strong-on-emphasis","iconFg":"semantic/icon-warning-on-emphasis"},{"name":"Tone=Warning, Emphasis=Emphasis, State=Hover","size":"Default","bg":"semantic/bg-warning-fill-emphasis-hover","fg":"semantic/text-warning-strong-on-emphasis","iconFg":"semantic/icon-warning-on-emphasis"},{"name":"Tone=Warning, Emphasis=Emphasis, State=Active","size":"Default","bg":"semantic/bg-warning-fill-emphasis-active","fg":"semantic/text-warning-strong-on-emphasis","iconFg":"semantic/icon-warning-on-emphasis"},{"name":"Tone=Warning, Emphasis=Emphasis, State=Selected","size":"Default","bg":"semantic/bg-warning-fill-emphasis-selected","fg":"semantic/text-warning-strong-on-emphasis","iconFg":"semantic/icon-warning-on-emphasis"},{"name":"Tone=Warning, Emphasis=Emphasis, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled"},{"name":"Tone=Success, Emphasis=Muted, State=Default","size":"Default","bg":"semantic/bg-success-fill-muted-default","fg":"semantic/text-success-strong","iconFg":"semantic/icon-success","border":"semantic/border-success-medium"},{"name":"Tone=Success, Emphasis=Muted, State=Hover","size":"Default","bg":"semantic/bg-success-fill-muted-hover","fg":"semantic/text-success-strong","iconFg":"semantic/icon-success","border":"semantic/border-success-medium"},{"name":"Tone=Success, Emphasis=Muted, State=Active","size":"Default","bg":"semantic/bg-success-fill-muted-active","fg":"semantic/text-success-strong","iconFg":"semantic/icon-success","border":"semantic/border-success-medium"},{"name":"Tone=Success, Emphasis=Muted, State=Selected","size":"Default","bg":"semantic/bg-success-fill-muted-selected","fg":"semantic/text-success-strong","iconFg":"semantic/icon-success","border":"semantic/border-success-medium"},{"name":"Tone=Success, Emphasis=Muted, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Success, Emphasis=Emphasis, State=Default","size":"Default","bg":"semantic/bg-success-fill-emphasis-default","fg":"semantic/text-success-strong-on-emphasis","iconFg":"semantic/icon-success-on-emphasis"},{"name":"Tone=Success, Emphasis=Emphasis, State=Hover","size":"Default","bg":"semantic/bg-success-fill-emphasis-hover","fg":"semantic/text-success-strong-on-emphasis","iconFg":"semantic/icon-success-on-emphasis"},{"name":"Tone=Success, Emphasis=Emphasis, State=Active","size":"Default","bg":"semantic/bg-success-fill-emphasis-active","fg":"semantic/text-success-strong-on-emphasis","iconFg":"semantic/icon-success-on-emphasis"},{"name":"Tone=Success, Emphasis=Emphasis, State=Selected","size":"Default","bg":"semantic/bg-success-fill-emphasis-selected","fg":"semantic/text-success-strong-on-emphasis","iconFg":"semantic/icon-success-on-emphasis"},{"name":"Tone=Success, Emphasis=Emphasis, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled"},{"name":"Tone=Info, Emphasis=Muted, State=Default","size":"Default","bg":"semantic/bg-info-fill-muted-default","fg":"semantic/text-info-strong","iconFg":"semantic/icon-info","border":"semantic/border-info-medium"},{"name":"Tone=Info, Emphasis=Muted, State=Hover","size":"Default","bg":"semantic/bg-info-fill-muted-hover","fg":"semantic/text-info-strong","iconFg":"semantic/icon-info","border":"semantic/border-info-medium"},{"name":"Tone=Info, Emphasis=Muted, State=Active","size":"Default","bg":"semantic/bg-info-fill-muted-active","fg":"semantic/text-info-strong","iconFg":"semantic/icon-info","border":"semantic/border-info-medium"},{"name":"Tone=Info, Emphasis=Muted, State=Selected","size":"Default","bg":"semantic/bg-info-fill-muted-selected","fg":"semantic/text-info-strong","iconFg":"semantic/icon-info","border":"semantic/border-info-medium"},{"name":"Tone=Info, Emphasis=Muted, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Info, Emphasis=Emphasis, State=Default","size":"Default","bg":"semantic/bg-info-fill-emphasis-default","fg":"semantic/text-info-strong-on-emphasis","iconFg":"semantic/icon-info-on-emphasis"},{"name":"Tone=Info, Emphasis=Emphasis, State=Hover","size":"Default","bg":"semantic/bg-info-fill-emphasis-hover","fg":"semantic/text-info-strong-on-emphasis","iconFg":"semantic/icon-info-on-emphasis"},{"name":"Tone=Info, Emphasis=Emphasis, State=Active","size":"Default","bg":"semantic/bg-info-fill-emphasis-active","fg":"semantic/text-info-strong-on-emphasis","iconFg":"semantic/icon-info-on-emphasis"},{"name":"Tone=Info, Emphasis=Emphasis, State=Selected","size":"Default","bg":"semantic/bg-info-fill-emphasis-selected","fg":"semantic/text-info-strong-on-emphasis","iconFg":"semantic/icon-info-on-emphasis"},{"name":"Tone=Info, Emphasis=Emphasis, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled"}]}};
await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
const byName = new Map(allVars.map(v => [v.name, v]));
const ensured = [];
for (const rv of PLAN.requiredVariables) {
if (byName.has(rv.name)) continue;
const coll = collections.find(c => c.name === rv.collection);
if (!coll) throw new Error('missing collection: ' + rv.collection);
const v = figma.variables.createVariable(rv.name, coll, 'FLOAT');
v.scopes = ['GAP'];
if (rv.description) v.description = rv.description;
if (rv.codeSyntax) v.setVariableCodeSyntax('WEB', rv.codeSyntax);
for (const m of coll.modes) {
const val = rv.values[m.name];
v.setValueForMode(m.modeId, typeof val === 'object' ? val.value : val);
}
byName.set(rv.name, v);
ensured.push(rv.name);
}
const need = (n) => { const v = byName.get(n); if (!v) throw new Error('missing variable: ' + n); return v; };
const importedByKey = {};
for (const part of PLAN.componentSet.parts) {
const keys = [];
if (part.kind === 'glyph' && part.swap) keys.push(part.swap.componentKey);
if (part.kind === 'glyph' && part.swapByProp) keys.push(...Object.values(part.swapByProp.glyphs).map(g => g.componentKey));
if (part.kind === 'instance') {
for (const v of Object.values({ ...part.overrides, ...part.collapsedOverrides })) {
if (typeof v === 'string' && v.startsWith('key:')) keys.push(v.slice(4));
}
}
if (part.kind === 'slot') {
for (const s of (part.seed || [])) {
for (const v of Object.values(s.overrides || {})) {
if (typeof v === 'string' && v.startsWith('key:')) keys.push(v.slice(4));
}
}
}
for (const k of keys) {
if (importedByKey[k]) continue;
try {
importedByKey[k] = await figma.importComponentByKeyAsync(k);
} catch (e) {
importedByKey[k] = (await figma.importComponentSetByKeyAsync(k)).defaultVariant;
}
}
}
const bindFill = (node, name) => {
node.fills = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', need(name))];
};
const effectByName = new Map((await figma.getLocalEffectStylesAsync()).map(s => [s.name, s]));
const cs = PLAN.componentSet;
const maxX = Math.max(0, ...figma.currentPage.children.map(n => n.x + n.width));
const comps = [];
let bindings = 0;
let y = 0;
if (cs.table) {
const T = cs.table;
const comp = figma.createComponent();
comp.name = cs.name;
comp.description = cs.description;
comp.layoutMode = 'HORIZONTAL';
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
comp.counterAxisAlignItems = 'MIN';
comp.x = maxX + 100; comp.y = 0;
const rootBg = cs.variants[0].bg;
if (rootBg) bindFill(comp, rootBg);
const selectedRow = T.rows.length - 1; // the demo shows the selected rung
const cell = (text, isHeader, rowIndex) => {
const box = figma.createAutoLayout('HORIZONTAL', { name: isHeader ? 'header-cell' : 'cell' });
box.fills = [];
box.counterAxisAlignItems = 'CENTER';
box.setBoundVariable('paddingTop', need(T.cellPadV));
box.setBoundVariable('paddingBottom', need(T.cellPadV));
box.setBoundVariable('paddingLeft', need(T.cellPadH));
box.setBoundVariable('paddingRight', need(T.cellPadH));
box.strokes = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', need(isHeader ? T.headerBorder : T.cellBorder))];
box.strokeAlign = 'INSIDE';
box.strokeTopWeight = 0; box.strokeRightWeight = 0; box.strokeLeftWeight = 0;
box.strokeBottomWeight = isHeader ? 2 : 1;
box.setBoundVariable('strokeBottomWeight', need(isHeader ? 'sizing/stroke-thick' : 'sizing/stroke-thin'));
if (!isHeader && rowIndex === selectedRow) bindFill(box, T.selectedBg);
const t = figma.createText();
t.characters = text;
for (const [field, vn] of Object.entries(isHeader ? T.headerLabel : T.cellLabel)) t.setBoundVariable(field, need(vn));
bindFill(t, isHeader ? T.headerFg : T.cellFg);
box.appendChild(t);
bindings += Object.keys(T.cellLabel).length + 6;
return box;
};
for (let cix = 0; cix < T.columns.length; cix++) {
const col = figma.createAutoLayout('VERTICAL', { name: 'column' });
col.fills = [];
col.itemSpacing = 0;
comp.appendChild(col);
col.appendChild(cell(T.columns[cix], true, -1));
for (let rix = 0; rix < T.rows.length; rix++) col.appendChild(cell(T.rows[rix][cix], false, rix));
for (const c of col.children) c.layoutSizingHorizontal = 'FILL';
}
return {
componentSetId: comp.id,
name: cs.name,
variants: 1,
expectedVariants: 1,
bindings,
ensuredVariables: ensured,
props: [],
};
}
for (const spec of cs.variants) {
const size = cs.bySize[spec.size];
if (!size) throw new Error('no bySize entry for ' + spec.size);
const axisCtx = Object.fromEntries(
spec.name.split(', ').filter(s => s.includes('=')).map(s => s.split('=')));
const mirrorAxes = (inst) => {
for (const [axis, val] of Object.entries(axisCtx)) {
if (inst.componentProperties && inst.componentProperties[axis] !== undefined) {
inst.setProperties({ [axis]: val });
}
}
};
const comp = figma.createComponent();
comp.name = spec.name;
comp.x = maxX + 100; comp.y = y; y += 72;
if (cs.root.rule) {
comp.resize(160, 2);
comp.setBoundVariable('height', need(cs.root.rule.thicknessVar));
if (spec.bg) bindFill(comp, spec.bg);
bindings += 2;
comps.push(comp);
continue;
}
let root = comp;
if (cs.pointer && spec.pointer) {
const vertical = spec.pointer.side === 'top' || spec.pointer.side === 'bottom';
comp.layoutMode = vertical ? 'VERTICAL' : 'HORIZONTAL';
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
comp.counterAxisAlignItems = spec.pointer.align === 'start' ? 'MIN' : spec.pointer.align === 'end' ? 'MAX' : 'CENTER';
comp.itemSpacing = 0;
comp.fills = [];
comp.clipsContent = false;
root = figma.createAutoLayout('HORIZONTAL', { name: 'bubble' });
const arrowRow = figma.createAutoLayout('HORIZONTAL', { name: 'arrow' });
arrowRow.fills = [];
arrowRow.clipsContent = false;
if (spec.pointer.side === 'top' || spec.pointer.side === 'left') {
comp.appendChild(root);
comp.appendChild(arrowRow);
} else {
comp.appendChild(arrowRow);
comp.appendChild(root);
}
const point = figma.createVector();
point.name = 'point';
point.vectorPaths = [{ windingRule: 'NONZERO', data: 'M 6 0 L 12 6 L 0 6 Z' }];
point.strokes = [];
point.resize(12, 6);
if (spec.bg) bindFill(point, spec.bg);
point.rotation = spec.pointer.side === 'top' ? 180 : spec.pointer.side === 'left' ? -90 : spec.pointer.side === 'right' ? 90 : 0;
arrowRow.appendChild(point);
point.setBoundVariable('width', need(cs.pointer.widthVar));
point.setBoundVariable('height', need(cs.pointer.heightVar));
if (spec.pointer.align === 'start')
arrowRow.setBoundVariable(vertical ? 'paddingLeft' : 'paddingTop', need(vertical ? size.paddingInline : size.insetVar));
if (spec.pointer.align === 'end')
arrowRow.setBoundVariable(vertical ? 'paddingRight' : 'paddingBottom', need(vertical ? size.paddingInline : size.insetVar));
bindings += 3;
}
root.layoutMode = cs.root.layout;
root.primaryAxisSizingMode = 'AUTO';
root.counterAxisSizingMode = 'AUTO';
root.counterAxisAlignItems = cs.root.align;
const padV = spec.iconOnly ? size.insetVar : size.paddingBlock;
const padH = spec.iconOnly ? size.insetVar : size.paddingInline;
if (padV) {
root.setBoundVariable('paddingTop', need(padV));
root.setBoundVariable('paddingBottom', need(padV));
}
if (padH) {
root.setBoundVariable('paddingLeft', need(padH));
root.setBoundVariable('paddingRight', need(padH));
}
if (size.indentVar && !spec.iconOnly) {
root.setBoundVariable('paddingLeft', need(size.indentVar));
bindings += 1;
}
if (size.gap) root.setBoundVariable('itemSpacing', need(size.gap));
const radiusVar = spec.radiusVar || cs.root.radiusVar;
if (radiusVar)
for (const c of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius'])
root.setBoundVariable(c, need(radiusVar));
if (spec.bg) bindFill(root, spec.bg); else root.fills = [];
if (spec.effect) {
const st = effectByName.get(spec.effect);
if (!st) throw new Error('missing effect style: ' + spec.effect);
await root.setEffectStyleIdAsync(st.id);
}
if (spec.ring && !size.paddingBlock) {
const ringVar = need(spec.ring.colorVar);
root.effects = [[2, 0], [-2, 0], [0, 2], [0, -2]].map(([x, y]) => ({
type: 'DROP_SHADOW',
color: { r: 0, g: 0, b: 0, a: 1 },
boundVariables: { color: { type: 'VARIABLE_ALIAS', id: ringVar.id } },
offset: { x, y },
radius: 0,
visible: true,
blendMode: 'NORMAL',
}));
bindings += 4;
} else if (spec.ring) {
root.strokes = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', need(spec.ring.colorVar))];
root.setBoundVariable('strokeWeight', need(spec.ring.widthVar));
root.strokeAlign = 'OUTSIDE';
bindings += 2;
} else if (spec.border) {
root.strokes = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', need(spec.border))];
root.setBoundVariable('strokeWeight', need(cs.root.strokeWeightVar));
root.strokeAlign = 'INSIDE';
bindings += 2;
}
if (spec.borderBottom && !spec.ring) {
root.strokes = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', need(spec.borderBottom))];
root.strokeAlign = 'INSIDE';
root.strokeTopWeight = 0;
root.strokeRightWeight = 0;
root.strokeLeftWeight = 0;
root.strokeBottomWeight = 2;
root.setBoundVariable('strokeBottomWeight', need(cs.root.underlineVar || 'sizing/stroke-thick'));
bindings += 2;
}
if (spec.borderRight && !spec.ring) {
root.strokes = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', need(spec.borderRight))];
root.strokeAlign = 'OUTSIDE';
root.strokeTopWeight = 0;
root.strokeBottomWeight = 0;
root.strokeLeftWeight = 0;
root.strokeRightWeight = 2;
root.setBoundVariable('strokeRightWeight', need(cs.root.endlineVar || 'sizing/stroke-thick'));
bindings += 2;
}
bindings += 9;
const clusterFrames = {};
const seatFor = (part) => {
if (!part.cluster) return root;
if (!clusterFrames[part.cluster]) {
const w = figma.createAutoLayout('HORIZONTAL', { name: part.cluster });
w.fills = [];
w.counterAxisAlignItems = 'CENTER';
root.appendChild(w);
w.setBoundVariable('itemSpacing', need('spacing/horizontal-sm'));
bindings += 1;
clusterFrames[part.cluster] = w;
}
return clusterFrames[part.cluster];
};
for (const part of cs.parts) {
if (part.kind === 'pointer') continue; // built with the wrapper above
if (part.kind === 'flag') continue; // built after sizing, below
if (spec.iconOnly && !(part.kind === 'glyph' && part.name === spec.iconOnly)) continue;
if (part.kind === 'glyph') {
const g = size.glyphs[part.name];
const swapKey = (spec.glyphSwaps && spec.glyphSwaps[part.name]) ||
(part.swap && part.swap.componentKey);
const glyphInk = (spec.glyphFg && spec.glyphFg[part.name]) || spec.iconFg || spec.fg;
const container = figma.createAutoLayout('HORIZONTAL', { name: part.name });
container.fills = [];
container.clipsContent = false;
root.appendChild(container);
container.layoutSizingHorizontal = 'FIXED';
container.layoutSizingVertical = 'FIXED';
container.resize(12, 12);
container.setBoundVariable('width', need(g.containerVar));
container.setBoundVariable('height', need(g.containerHVar || g.containerVar));
container.primaryAxisAlignItems = 'CENTER';
container.counterAxisAlignItems = 'CENTER';
let glyph;
if (swapKey) {
glyph = importedByKey[swapKey].createInstance();
} else {
glyph = figma.createEllipse();
glyph.resize(16, 16);
}
glyph.name = 'glyph';
container.appendChild(glyph);
glyph.setBoundVariable('width', need(g.glyphVar));
glyph.setBoundVariable('height', need(g.glyphVar));
if (swapKey) {
const mask = figma.createFrame();
mask.name = 'mask';
mask.fills = [];
mask.clipsContent = false;
mask.isMask = true;
mask.resize(12, 12);
mask.setBoundVariable('width', need(g.glyphVar));
mask.setBoundVariable('height', need(g.glyphVar));
container.appendChild(mask);
mask.appendChild(glyph);
glyph.x = 0;
glyph.y = 0;
const tint = figma.createRectangle();
tint.name = 'tint';
container.appendChild(tint);
tint.setBoundVariable('width', need(g.glyphVar));
tint.setBoundVariable('height', need(g.glyphVar));
bindFill(tint, glyphInk);
const ink = figma.group([mask, tint], container);
ink.name = 'ink';
tint.x = mask.x;
tint.y = mask.y;
bindings += 9;
} else {
bindFill(glyph, glyphInk);
bindings += 5;
}
const bp = cs.booleanProps.find(b => (b.parts || [b.part]).includes(part.name));
if (bp && bp.default === false) container.visible = false;
if (spec.hideParts && spec.hideParts.includes(part.name)) container.visible = false;
} else if (part.kind === 'instance') {
const src = figma.currentPage.children.find(n =>
(n.type === 'COMPONENT_SET' || n.type === 'COMPONENT') && n.name === part.component);
if (!src) throw new Error('missing component for instance part: ' + part.component);
const inst = (src.type === 'COMPONENT_SET' ? src.defaultVariant : src).createInstance();
inst.name = part.name;
seatFor(part).appendChild(inst);
inst.isExposedInstance = true;
mirrorAxes(inst);
if (cs.root.layout === 'VERTICAL') inst.layoutSizingHorizontal = 'FILL';
const effective = spec.collapsed && part.collapsedOverrides
? { ...part.overrides, ...part.collapsedOverrides }
: part.overrides;
for (const [prop, value] of Object.entries(effective || {})) {
const key = Object.keys(inst.componentProperties).find(k => k.split('#')[0] === prop);
const v = typeof value === 'string' && value.startsWith('key:')
? importedByKey[value.slice(4)].id
: value === 'true' ? true : value === 'false' ? false : value;
if (key) inst.setProperties({ [key]: v });
}
const bp = cs.booleanProps.find(b => b.part === part.name);
if (bp && bp.default === false) inst.visible = false;
if (part.width) inst.resize(part.width, inst.height);
bindings += 1;
} else if (part.kind === 'slot') {
if (typeof root.createSlot === 'function') {
const slot = root.createSlot();
slot.name = part.name;
slot.layoutMode = cs.root.layout;
slot.primaryAxisSizingMode = 'AUTO';
slot.counterAxisSizingMode = 'AUTO';
if (part.cluster) {
slot.setBoundVariable('itemSpacing', need('spacing/horizontal-sm'));
slot.counterAxisAlignItems = 'CENTER';
bindings += 1;
} else {
slot.itemSpacing = 0;
}
for (const s of (part.seed || [])) {
const src = figma.currentPage.children.find(n =>
(n.type === 'COMPONENT_SET' || n.type === 'COMPONENT') && n.name === s.component);
if (!src) throw new Error('missing component for slot seed: ' + s.component);
const inst = (src.type === 'COMPONENT_SET' ? src.defaultVariant : src).createInstance();
slot.appendChild(inst);
for (const [prop, value] of Object.entries(s.overrides || {})) {
const key = Object.keys(inst.componentProperties).find(k => k.split('#')[0] === prop);
const v = typeof value === 'string' && value.startsWith('key:')
? importedByKey[value.slice(4)].id
: value === 'true' ? true : value === 'false' ? false : value;
if (key) inst.setProperties({ [key]: v });
}
mirrorAxes(inst);
}
} else {
const slot = figma.createFrame();
slot.name = 'Slot';
slot.fills = [];
slot.strokes = [figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', need('semantic/border-neutral-subtle'))];
slot.dashPattern = [4, 4];
root.appendChild(slot);
slot.layoutSizingHorizontal = 'FILL';
slot.layoutSizingVertical = 'FIXED';
slot.resize(slot.width, 48);
}
bindings += 1;
} else if (part.kind === 'text') {
const t = figma.createText();
t.name = part.name;
t.characters = part.defaultText;
for (const [field, vn] of Object.entries(size.label || {})) t.setBoundVariable(field, need(vn));
if (spec.fg) bindFill(t, spec.fg);
if (part.trim) t.leadingTrim = 'CAP_HEIGHT';
root.appendChild(t);
bindings += Object.keys(size.label || {}).length + 1;
}
}
if (cs.root.baselinePad) {
root.setBoundVariable('paddingTop', need(cs.root.baselinePad));
root.clipsContent = false;
bindings += 1;
}
if (cs.parts.some(p => p.kind === 'slot') && !cs.root.fixedWidth && !spec.widthVar) {
root.counterAxisSizingMode = 'FIXED';
root.resize(320, root.height);
}
if (cs.root.layout === 'VERTICAL' && (cs.root.fixedHeight || spec.widthVar || cs.root.fixedWidth)) {
root.counterAxisSizingMode = 'FIXED';
if (spec.widthVar) {
root.setBoundVariable('width', need(spec.widthVar));
bindings += 1;
} else if (cs.root.fixedWidth) {
root.resize(cs.root.fixedWidth, root.height);
}
if (cs.root.fixedHeight) {
root.primaryAxisSizingMode = 'FIXED';
root.resize(root.width, cs.root.fixedHeight);
for (const part of cs.parts) {
if (!part.fill) continue;
const n = root.children.find(ch => ch.name === part.name);
if (n) n.layoutSizingVertical = 'FILL';
}
}
} else if (cs.root.fixedWidth && !spec.iconOnly) {
root.primaryAxisSizingMode = 'FIXED';
root.resize(cs.root.fixedWidth, root.height);
for (const part of cs.parts) {
if (!part.fill) continue;
const n = root.children.find(ch => ch.name === part.name);
if (n) n.layoutSizingHorizontal = 'FILL';
}
}
for (const part of cs.parts) {
if (part.kind !== 'slot') continue;
const slot = root.children.find(ch => ch.type === 'SLOT' && ch.name === part.name);
if (!slot) continue;
if (cs.root.layout === 'VERTICAL') {
slot.layoutSizingHorizontal = 'FILL';
for (const ch of slot.children) ch.layoutSizingHorizontal = 'FILL';
}
}
for (const part of cs.parts) {
if (part.kind !== 'flag' || !spec.iconOnly) continue;
const tri = figma.createVector();
tri.name = part.name;
tri.vectorPaths = [{ windingRule: 'NONZERO', data: 'M 8 0 L 8 8 L 0 8 Z' }];
tri.strokes = [];
tri.resize(8, 8);
bindFill(tri, spec.iconFg || spec.fg);
root.appendChild(tri);
tri.layoutPositioning = 'ABSOLUTE';
tri.constraints = { horizontal: 'MAX', vertical: 'MAX' };
tri.setBoundVariable('width', need('spacing/horizontal-xs'));
tri.setBoundVariable('height', need('spacing/vertical-xs'));
tri.x = root.width - tri.width;
tri.y = root.height - tri.height;
const fbp = cs.booleanProps.find(b => (b.parts || [b.part]).includes(part.name));
if (fbp && fbp.default === false) tri.visible = false;
bindings += 3;
}
if (cs.parts.some(p => p.corner)) {
root.primaryAxisSizingMode = 'FIXED';
root.resize(480, root.height);
const msg = root.children.find(n => n.type === 'TEXT');
if (msg) msg.layoutSizingHorizontal = 'FILL';
for (const part of cs.parts) {
if (!part.corner) continue;
const c = root.children.find(n => n.name === part.name);
if (!c) continue;
c.layoutPositioning = 'ABSOLUTE';
c.constraints = { horizontal: 'MAX', vertical: 'MIN' };
const seat = c.children && c.children.length === 1 && c.children[0].type === 'FRAME'
? c.children[0] : null;
const sx = seat ? seat.x : 0, sw = seat ? seat.width : c.width;
const sy = seat ? seat.y : 0, sh = seat ? seat.height : c.height;
const lh = msg ? msg.height : sh;
c.x = root.width - root.paddingRight - (sx + sw);
c.y = root.paddingTop + (lh - sh) / 2 - sy;
const spacer = figma.createFrame();
spacer.name = part.name + '-spacer';
spacer.fills = [];
root.appendChild(spacer);
spacer.layoutSizingHorizontal = 'FIXED';
spacer.layoutSizingVertical = 'FIXED';
spacer.resize(sx + sw, 1);
spacer.visible = c.visible;
}
}
comps.push(comp);
}
let set;
if (comps.length === 1 && !cs.variants[0].name) {
set = comps[0];
set.name = cs.name;
set.x = maxX + 100; set.y = 0;
} else {
set = figma.combineAsVariants(comps, figma.currentPage);
set.name = cs.name;
set.layoutMode = 'VERTICAL';
set.primaryAxisSizingMode = 'AUTO';
set.counterAxisSizingMode = 'AUTO';
set.itemSpacing = 24;
set.paddingTop = set.paddingBottom = set.paddingLeft = set.paddingRight = 32;
set.x = maxX + 100; set.y = 0;
}
set.description = cs.description;
const variantNodes = set.type === 'COMPONENT_SET' ? set.children : [set];
const propRefs = {};
for (const tp of cs.textProps) propRefs[tp.property] = { id: set.addComponentProperty(tp.property, 'TEXT', tp.default), part: tp.part, field: 'characters' };
for (const bp of cs.booleanProps) propRefs[bp.property] = { id: set.addComponentProperty(bp.property, 'BOOLEAN', bp.default), part: bp.part, parts: bp.parts, field: 'visible' };
for (const part of cs.parts) {
if (part.kind === 'glyph' && part.swap && part.swap.property) {
propRefs[part.swap.property] = {
id: set.addComponentProperty(part.swap.property, 'INSTANCE_SWAP', importedByKey[part.swap.componentKey].id),
part: part.name,
field: 'mainComponent',
inner: true,
};
}
}
const specByName = new Map(cs.variants.map(v => [v.name, v]));
for (const comp of variantNodes) {
const spec = specByName.get(comp.name);
for (const p of Object.values(propRefs)) {
if (spec && spec.iconOnly && !p.inner && p.field !== 'visible') continue;
for (const partName of (p.parts || [p.part])) {
let node = comp.findOne(n => n.name === partName); // parts may sit inside the bubble wrapper
if (node && p.inner) node = node.findOne(n => n.type === 'INSTANCE'); // the glyph, now nested in the ink group
if (node) node.componentPropertyReferences = { [p.field]: p.id };
if (p.field === 'visible') {
const spacer = comp.findOne(n => n.name === partName + '-spacer');
if (spacer) spacer.componentPropertyReferences = { visible: p.id };
}
}
}
}
return {
componentSetId: set.id,
name: cs.name,
variants: variantNodes.length,
expectedVariants: cs.variants.length,
bindings,
ensuredVariables: ensured,
props: Object.keys(set.componentPropertyDefinitions),
};