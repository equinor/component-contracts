// Generated builder for eds.button — do not edit; edit the contract.
// Transport-agnostic: Figma MCP use_figma, or figma-console-mcp figma_execute.
const PLAN = {"component":"eds.button","requiredVariables":[{"name":"recipe/optical-padding-md-squished","collection":"density","values":{"compact":6,"comfortable":10,"relaxed":12},"codeSyntax":"calc(var(--eds-spacing-inset-md-vertical-squished) - var(--eds-half-leading-md))","description":"eds.button: md label in the md-squished inset. Resolved because Figma cannot calc; CSS composes it live. Heights land at 24/36/44."},{"name":"recipe/optical-padding-sm-squished","collection":"density","values":{"compact":4,"comfortable":6,"relaxed":10},"codeSyntax":"calc(var(--eds-spacing-inset-sm-vertical-squished) - var(--eds-half-leading-sm))","description":"eds.button: sm label in the sm-squished inset. Resolved because Figma cannot calc; CSS composes it live. Heights land at 20/24/36."}],"componentSet":{"name":"Button","description":"Button — the selectable. Height is never stated: inset × 2 + cap(label) resolves per size and density (default: 24/36/44, small: 20/24/36), with or without an icon. Primary fills; Secondary, Ghost and Ghost-icon rest transparent and bind the ghost ladder. Ghost-icon is EDS 1.x's ghost_icon: icon-only, round — with no text there is no half-leading to compensate, so padding = inset on all sides and the button is a circle by construction.\n\nGenerated from eds.button v0.8.0 — edit the contract, not this component.","axes":{"Tone":["Neutral","Accent","Danger"],"Variant":["Primary","Secondary","Ghost","Ghost-icon"],"Size":["Default","Small"],"State":["Default","Hover","Active","Disabled"]},"textProps":[{"property":"Label","default":"Click me!","part":"label"}],"booleanProps":[{"property":"Has Leading Icon","default":true,"part":"icon"},{"property":"Has Trailing Icon","default":false,"part":"trailing-icon"}],"root":{"layout":"HORIZONTAL","align":"CENTER","radiusVar":"spacing/border-radius-rounded","strokeWeightVar":"sizing/stroke-thin"},"parts":[{"kind":"glyph","name":"icon","swap":{"property":"↳ Leading Icon","componentKey":"99d686d2f9b247ed799e74d7c617798d56602a1b"}},{"kind":"text","name":"label","defaultText":"Click me!"},{"kind":"glyph","name":"trailing-icon","swap":{"property":"↳ Trailing Icon","componentKey":"99d686d2f9b247ed799e74d7c617798d56602a1b"}}],"bySize":{"Default":{"glyphs":{"icon":{"containerVar":"recipe/cap-rounded-md","glyphVar":"sizing/icon-md"},"trailing-icon":{"containerVar":"recipe/cap-rounded-md","glyphVar":"sizing/icon-md"}},"paddingBlock":"recipe/optical-padding-md-squished","paddingInline":"spacing/inset-md-horizontal","insetVar":"spacing/inset-md-vertical-squished","gap":"spacing/icon-md-gap-horizontal","label":{"fontFamily":"typography/font-family/ui","fontWeight":"font-weight/bolder","fontSize":"typography/font-size/md","lineHeight":"typography/line-height/compressed/md"}},"Small":{"glyphs":{"icon":{"containerVar":"recipe/cap-rounded-sm","glyphVar":"sizing/icon-xs"},"trailing-icon":{"containerVar":"recipe/cap-rounded-sm","glyphVar":"sizing/icon-xs"}},"paddingBlock":"recipe/optical-padding-sm-squished","paddingInline":"spacing/inset-sm-horizontal","insetVar":"spacing/inset-sm-vertical-squished","gap":"spacing/icon-sm-gap-horizontal","label":{"fontFamily":"typography/font-family/ui","fontWeight":"font-weight/bolder","fontSize":"typography/font-size/sm","lineHeight":"typography/line-height/compressed/sm"}}},"variants":[{"name":"Tone=Neutral, Variant=Primary, Size=Default, State=Default","size":"Default","bg":"semantic/bg-neutral-fill-emphasis-default","fg":"semantic/text-neutral-strong-on-emphasis","iconFg":"semantic/icon-neutral-on-emphasis"},{"name":"Tone=Neutral, Variant=Primary, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-neutral-fill-emphasis-hover","fg":"semantic/text-neutral-strong-on-emphasis","iconFg":"semantic/icon-neutral-on-emphasis"},{"name":"Tone=Neutral, Variant=Primary, Size=Default, State=Active","size":"Default","bg":"semantic/bg-neutral-fill-emphasis-active","fg":"semantic/text-neutral-strong-on-emphasis","iconFg":"semantic/icon-neutral-on-emphasis"},{"name":"Tone=Neutral, Variant=Primary, Size=Default, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Neutral, Variant=Primary, Size=Small, State=Default","size":"Small","bg":"semantic/bg-neutral-fill-emphasis-default","fg":"semantic/text-neutral-strong-on-emphasis","iconFg":"semantic/icon-neutral-on-emphasis"},{"name":"Tone=Neutral, Variant=Primary, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-neutral-fill-emphasis-hover","fg":"semantic/text-neutral-strong-on-emphasis","iconFg":"semantic/icon-neutral-on-emphasis"},{"name":"Tone=Neutral, Variant=Primary, Size=Small, State=Active","size":"Small","bg":"semantic/bg-neutral-fill-emphasis-active","fg":"semantic/text-neutral-strong-on-emphasis","iconFg":"semantic/icon-neutral-on-emphasis"},{"name":"Tone=Neutral, Variant=Primary, Size=Small, State=Disabled","size":"Small","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Neutral, Variant=Secondary, Size=Default, State=Default","size":"Default","bg":"semantic/bg-neutral-fill-ghost-default","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","border":"semantic/border-neutral-strong"},{"name":"Tone=Neutral, Variant=Secondary, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-neutral-fill-ghost-hover","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","border":"semantic/border-neutral-strong"},{"name":"Tone=Neutral, Variant=Secondary, Size=Default, State=Active","size":"Default","bg":"semantic/bg-neutral-fill-ghost-active","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","border":"semantic/border-neutral-strong"},{"name":"Tone=Neutral, Variant=Secondary, Size=Default, State=Disabled","size":"Default","bg":"semantic/bg-neutral-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Neutral, Variant=Secondary, Size=Small, State=Default","size":"Small","bg":"semantic/bg-neutral-fill-ghost-default","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","border":"semantic/border-neutral-strong"},{"name":"Tone=Neutral, Variant=Secondary, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-neutral-fill-ghost-hover","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","border":"semantic/border-neutral-strong"},{"name":"Tone=Neutral, Variant=Secondary, Size=Small, State=Active","size":"Small","bg":"semantic/bg-neutral-fill-ghost-active","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","border":"semantic/border-neutral-strong"},{"name":"Tone=Neutral, Variant=Secondary, Size=Small, State=Disabled","size":"Small","bg":"semantic/bg-neutral-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Neutral, Variant=Ghost, Size=Default, State=Default","size":"Default","bg":"semantic/bg-neutral-fill-ghost-default","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral"},{"name":"Tone=Neutral, Variant=Ghost, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-neutral-fill-ghost-hover","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral"},{"name":"Tone=Neutral, Variant=Ghost, Size=Default, State=Active","size":"Default","bg":"semantic/bg-neutral-fill-ghost-active","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral"},{"name":"Tone=Neutral, Variant=Ghost, Size=Default, State=Disabled","size":"Default","bg":"semantic/bg-neutral-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Neutral, Variant=Ghost, Size=Small, State=Default","size":"Small","bg":"semantic/bg-neutral-fill-ghost-default","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral"},{"name":"Tone=Neutral, Variant=Ghost, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-neutral-fill-ghost-hover","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral"},{"name":"Tone=Neutral, Variant=Ghost, Size=Small, State=Active","size":"Small","bg":"semantic/bg-neutral-fill-ghost-active","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral"},{"name":"Tone=Neutral, Variant=Ghost, Size=Small, State=Disabled","size":"Small","bg":"semantic/bg-neutral-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Neutral, Variant=Ghost-icon, Size=Default, State=Default","size":"Default","bg":"semantic/bg-neutral-fill-ghost-default","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Neutral, Variant=Ghost-icon, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-neutral-fill-ghost-hover","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Neutral, Variant=Ghost-icon, Size=Default, State=Active","size":"Default","bg":"semantic/bg-neutral-fill-ghost-active","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Neutral, Variant=Ghost-icon, Size=Default, State=Disabled","size":"Default","bg":"semantic/bg-neutral-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Neutral, Variant=Ghost-icon, Size=Small, State=Default","size":"Small","bg":"semantic/bg-neutral-fill-ghost-default","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Neutral, Variant=Ghost-icon, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-neutral-fill-ghost-hover","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Neutral, Variant=Ghost-icon, Size=Small, State=Active","size":"Small","bg":"semantic/bg-neutral-fill-ghost-active","fg":"semantic/text-neutral-strong","iconFg":"semantic/icon-neutral","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Neutral, Variant=Ghost-icon, Size=Small, State=Disabled","size":"Small","bg":"semantic/bg-neutral-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Accent, Variant=Primary, Size=Default, State=Default","size":"Default","bg":"semantic/bg-accent-fill-emphasis-default","fg":"semantic/text-accent-strong-on-emphasis","iconFg":"semantic/icon-accent-on-emphasis"},{"name":"Tone=Accent, Variant=Primary, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-accent-fill-emphasis-hover","fg":"semantic/text-accent-strong-on-emphasis","iconFg":"semantic/icon-accent-on-emphasis"},{"name":"Tone=Accent, Variant=Primary, Size=Default, State=Active","size":"Default","bg":"semantic/bg-accent-fill-emphasis-active","fg":"semantic/text-accent-strong-on-emphasis","iconFg":"semantic/icon-accent-on-emphasis"},{"name":"Tone=Accent, Variant=Primary, Size=Default, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Accent, Variant=Primary, Size=Small, State=Default","size":"Small","bg":"semantic/bg-accent-fill-emphasis-default","fg":"semantic/text-accent-strong-on-emphasis","iconFg":"semantic/icon-accent-on-emphasis"},{"name":"Tone=Accent, Variant=Primary, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-accent-fill-emphasis-hover","fg":"semantic/text-accent-strong-on-emphasis","iconFg":"semantic/icon-accent-on-emphasis"},{"name":"Tone=Accent, Variant=Primary, Size=Small, State=Active","size":"Small","bg":"semantic/bg-accent-fill-emphasis-active","fg":"semantic/text-accent-strong-on-emphasis","iconFg":"semantic/icon-accent-on-emphasis"},{"name":"Tone=Accent, Variant=Primary, Size=Small, State=Disabled","size":"Small","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Accent, Variant=Secondary, Size=Default, State=Default","size":"Default","bg":"semantic/bg-accent-fill-ghost-default","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","border":"semantic/border-accent-strong"},{"name":"Tone=Accent, Variant=Secondary, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-accent-fill-ghost-hover","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","border":"semantic/border-accent-strong"},{"name":"Tone=Accent, Variant=Secondary, Size=Default, State=Active","size":"Default","bg":"semantic/bg-accent-fill-ghost-active","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","border":"semantic/border-accent-strong"},{"name":"Tone=Accent, Variant=Secondary, Size=Default, State=Disabled","size":"Default","bg":"semantic/bg-accent-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Accent, Variant=Secondary, Size=Small, State=Default","size":"Small","bg":"semantic/bg-accent-fill-ghost-default","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","border":"semantic/border-accent-strong"},{"name":"Tone=Accent, Variant=Secondary, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-accent-fill-ghost-hover","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","border":"semantic/border-accent-strong"},{"name":"Tone=Accent, Variant=Secondary, Size=Small, State=Active","size":"Small","bg":"semantic/bg-accent-fill-ghost-active","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","border":"semantic/border-accent-strong"},{"name":"Tone=Accent, Variant=Secondary, Size=Small, State=Disabled","size":"Small","bg":"semantic/bg-accent-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Accent, Variant=Ghost, Size=Default, State=Default","size":"Default","bg":"semantic/bg-accent-fill-ghost-default","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent"},{"name":"Tone=Accent, Variant=Ghost, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-accent-fill-ghost-hover","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent"},{"name":"Tone=Accent, Variant=Ghost, Size=Default, State=Active","size":"Default","bg":"semantic/bg-accent-fill-ghost-active","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent"},{"name":"Tone=Accent, Variant=Ghost, Size=Default, State=Disabled","size":"Default","bg":"semantic/bg-accent-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Accent, Variant=Ghost, Size=Small, State=Default","size":"Small","bg":"semantic/bg-accent-fill-ghost-default","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent"},{"name":"Tone=Accent, Variant=Ghost, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-accent-fill-ghost-hover","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent"},{"name":"Tone=Accent, Variant=Ghost, Size=Small, State=Active","size":"Small","bg":"semantic/bg-accent-fill-ghost-active","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent"},{"name":"Tone=Accent, Variant=Ghost, Size=Small, State=Disabled","size":"Small","bg":"semantic/bg-accent-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Accent, Variant=Ghost-icon, Size=Default, State=Default","size":"Default","bg":"semantic/bg-accent-fill-ghost-default","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Accent, Variant=Ghost-icon, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-accent-fill-ghost-hover","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Accent, Variant=Ghost-icon, Size=Default, State=Active","size":"Default","bg":"semantic/bg-accent-fill-ghost-active","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Accent, Variant=Ghost-icon, Size=Default, State=Disabled","size":"Default","bg":"semantic/bg-accent-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Accent, Variant=Ghost-icon, Size=Small, State=Default","size":"Small","bg":"semantic/bg-accent-fill-ghost-default","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Accent, Variant=Ghost-icon, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-accent-fill-ghost-hover","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Accent, Variant=Ghost-icon, Size=Small, State=Active","size":"Small","bg":"semantic/bg-accent-fill-ghost-active","fg":"semantic/text-accent-strong","iconFg":"semantic/icon-accent","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Accent, Variant=Ghost-icon, Size=Small, State=Disabled","size":"Small","bg":"semantic/bg-accent-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Danger, Variant=Primary, Size=Default, State=Default","size":"Default","bg":"semantic/bg-danger-fill-emphasis-default","fg":"semantic/text-danger-strong-on-emphasis","iconFg":"semantic/icon-danger-on-emphasis"},{"name":"Tone=Danger, Variant=Primary, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-danger-fill-emphasis-hover","fg":"semantic/text-danger-strong-on-emphasis","iconFg":"semantic/icon-danger-on-emphasis"},{"name":"Tone=Danger, Variant=Primary, Size=Default, State=Active","size":"Default","bg":"semantic/bg-danger-fill-emphasis-active","fg":"semantic/text-danger-strong-on-emphasis","iconFg":"semantic/icon-danger-on-emphasis"},{"name":"Tone=Danger, Variant=Primary, Size=Default, State=Disabled","size":"Default","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Danger, Variant=Primary, Size=Small, State=Default","size":"Small","bg":"semantic/bg-danger-fill-emphasis-default","fg":"semantic/text-danger-strong-on-emphasis","iconFg":"semantic/icon-danger-on-emphasis"},{"name":"Tone=Danger, Variant=Primary, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-danger-fill-emphasis-hover","fg":"semantic/text-danger-strong-on-emphasis","iconFg":"semantic/icon-danger-on-emphasis"},{"name":"Tone=Danger, Variant=Primary, Size=Small, State=Active","size":"Small","bg":"semantic/bg-danger-fill-emphasis-active","fg":"semantic/text-danger-strong-on-emphasis","iconFg":"semantic/icon-danger-on-emphasis"},{"name":"Tone=Danger, Variant=Primary, Size=Small, State=Disabled","size":"Small","bg":"concept/bg-disabled","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Danger, Variant=Secondary, Size=Default, State=Default","size":"Default","bg":"semantic/bg-danger-fill-ghost-default","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","border":"semantic/border-danger-strong"},{"name":"Tone=Danger, Variant=Secondary, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-danger-fill-ghost-hover","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","border":"semantic/border-danger-strong"},{"name":"Tone=Danger, Variant=Secondary, Size=Default, State=Active","size":"Default","bg":"semantic/bg-danger-fill-ghost-active","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","border":"semantic/border-danger-strong"},{"name":"Tone=Danger, Variant=Secondary, Size=Default, State=Disabled","size":"Default","bg":"semantic/bg-danger-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Danger, Variant=Secondary, Size=Small, State=Default","size":"Small","bg":"semantic/bg-danger-fill-ghost-default","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","border":"semantic/border-danger-strong"},{"name":"Tone=Danger, Variant=Secondary, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-danger-fill-ghost-hover","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","border":"semantic/border-danger-strong"},{"name":"Tone=Danger, Variant=Secondary, Size=Small, State=Active","size":"Small","bg":"semantic/bg-danger-fill-ghost-active","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","border":"semantic/border-danger-strong"},{"name":"Tone=Danger, Variant=Secondary, Size=Small, State=Disabled","size":"Small","bg":"semantic/bg-danger-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Danger, Variant=Ghost, Size=Default, State=Default","size":"Default","bg":"semantic/bg-danger-fill-ghost-default","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger"},{"name":"Tone=Danger, Variant=Ghost, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-danger-fill-ghost-hover","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger"},{"name":"Tone=Danger, Variant=Ghost, Size=Default, State=Active","size":"Default","bg":"semantic/bg-danger-fill-ghost-active","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger"},{"name":"Tone=Danger, Variant=Ghost, Size=Default, State=Disabled","size":"Default","bg":"semantic/bg-danger-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Danger, Variant=Ghost, Size=Small, State=Default","size":"Small","bg":"semantic/bg-danger-fill-ghost-default","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger"},{"name":"Tone=Danger, Variant=Ghost, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-danger-fill-ghost-hover","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger"},{"name":"Tone=Danger, Variant=Ghost, Size=Small, State=Active","size":"Small","bg":"semantic/bg-danger-fill-ghost-active","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger"},{"name":"Tone=Danger, Variant=Ghost, Size=Small, State=Disabled","size":"Small","bg":"semantic/bg-danger-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled"},{"name":"Tone=Danger, Variant=Ghost-icon, Size=Default, State=Default","size":"Default","bg":"semantic/bg-danger-fill-ghost-default","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Danger, Variant=Ghost-icon, Size=Default, State=Hover","size":"Default","bg":"semantic/bg-danger-fill-ghost-hover","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Danger, Variant=Ghost-icon, Size=Default, State=Active","size":"Default","bg":"semantic/bg-danger-fill-ghost-active","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Danger, Variant=Ghost-icon, Size=Default, State=Disabled","size":"Default","bg":"semantic/bg-danger-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Danger, Variant=Ghost-icon, Size=Small, State=Default","size":"Small","bg":"semantic/bg-danger-fill-ghost-default","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Danger, Variant=Ghost-icon, Size=Small, State=Hover","size":"Small","bg":"semantic/bg-danger-fill-ghost-hover","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Danger, Variant=Ghost-icon, Size=Small, State=Active","size":"Small","bg":"semantic/bg-danger-fill-ghost-active","fg":"semantic/text-danger-strong","iconFg":"semantic/icon-danger","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"},{"name":"Tone=Danger, Variant=Ghost-icon, Size=Small, State=Disabled","size":"Small","bg":"semantic/bg-danger-fill-ghost-default","fg":"concept/text-disabled","iconFg":"concept/text-disabled","border":"concept/border-disabled","iconOnly":"icon","radiusVar":"spacing/border-radius-pill"}]}};

await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVars = await figma.variables.getLocalVariablesAsync();
const byName = new Map(allVars.map(v => [v.name, v]));

// 1. Ensure required variables (pairing values the contract derived).
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
// Import each distinct swap component once (EDS Assets library icons).
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
    // EDS Assets publishes some icons as variant SETS — a set key resolves
    // to its default variant.
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
// Shadows are effect STYLES, not variables — looked up by the plan's name.
const effectByName = new Map((await figma.getLocalEffectStylesAsync()).map(s => [s.name, s]));

// 2. One component per variant; structural binds picked by the variant's size.
// Every bind is a capability: a plan without paddings binds none, one without
// a label builds no text, a rule builds no layout at all.
const cs = PLAN.componentSet;
const maxX = Math.max(0, ...figma.currentPage.children.map(n => n.x + n.width));
const comps = [];
let bindings = 0;
let y = 0;
if (cs.table) {
  // The table grid demo: COLUMN-MAJOR so columns align by construction —
  // each column hugs its widest cell, every cell keeps the invariant
  // (padding = the resolved optical pairing), so density mode flips make
  // the same table shorter per row: MORE ROWS, not narrower tables.
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
  // this variant's axis values — instanced children that SHARE an axis by
  // name mirror it (the collapsed rail collapses its items)
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
    // A rule (divider): a stripe whose thickness is the sizing token and
    // whose ink is the background channel. Width is a canvas convenience —
    // instances stretch or FILL in their parent's auto-layout.
    comp.resize(160, 2);
    comp.setBoundVariable('height', need(cs.root.rule.thicknessVar));
    if (spec.bg) bindFill(comp, spec.bg);
    bindings += 2;
    comps.push(comp);
    continue;
  }
  // A pointer plan wraps the bubble: the COMPONENT is a transparent stack of
  // [bubble, arrow] ordered by the placement side — pure auto-layout, so the
  // arrow re-seats itself on density mode flips (constraints would not).
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
    // tooltip ABOVE the anchor (top/left) = arrow AFTER the bubble
    if (spec.pointer.side === 'top' || spec.pointer.side === 'left') {
      comp.appendChild(root);
      comp.appendChild(arrowRow);
    } else {
      comp.appendChild(arrowRow);
      comp.appendChild(root);
    }
    // NOT a regular polygon: Figma inscribes polygon vertices on the
    // bounding ELLIPSE, so a 3-gon's base sits at 75% of the box height and
    // the empty quarter renders as a gap against the bubble. A hand-authored
    // vector fills its box — the base sits flush.
    const point = figma.createVector();
    point.name = 'point';
    point.vectorPaths = [{ windingRule: 'NONZERO', data: 'M 6 0 L 12 6 L 0 6 Z' }];
    point.strokes = [];
    point.resize(12, 6);
    if (spec.bg) bindFill(point, spec.bg);
    // the triangle points UP by default; rotate it toward the anchor
    point.rotation = spec.pointer.side === 'top' ? 180 : spec.pointer.side === 'left' ? -90 : spec.pointer.side === 'right' ? 90 : 0;
    arrowRow.appendChild(point);
    point.setBoundVariable('width', need(cs.pointer.widthVar));
    point.setBoundVariable('height', need(cs.pointer.heightVar));
    // start/end alignment keeps the arrow an inset away from the bubble corner
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
  // Icon-only variants pad with the RAW inset on all sides: no text, no
  // half-leading to compensate, so width = height = a circle under the pill.
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
  // derived indent: the leading inset aligns this label with another
  // contract's label — the minted recipe value replaces paddingLeft only
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
    // A control glyph (no box of its own): the CSS ring is 4-way drop-shadow
    // filters that hug the GLYPH (a stroke on the cap box hides under the
    // oversized ink). Figma's twin: 4 drop-shadow effects on the root — cast
    // by the ink's alpha, so the ring hugs the glyph here too. Offsets are the
    // stroke-thick constant (density-invariant; effect offsets are not
    // variable-bindable), colour bound per shadow.
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
    // Focus ring as an OUTSIDE stroke: renders regardless of fill (shadows are
    // cast by alpha, so they vanish on transparent ghosts), never affects
    // auto-layout sizing, and REPLACES the secondary border — mirroring CSS,
    // where :focus-visible replaces the outline. Flush against the edge: the
    // CSS offset gap is a recorded, bounded divergence.
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
    // the inline-end edge: the underline, rotated. OUTSIDE — full-bleed slot
    // children paint over an inside stroke (CSS twin: an outer box-shadow).
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
  // Cluster wrappers: selectables acting as one group — gap = the sm rung,
  // one below the container gap. Created on first member, reused by the rest.
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
    // icon-only variants build exactly one part: the icon
    if (spec.iconOnly && !(part.kind === 'glyph' && part.name === spec.iconOnly)) continue;
    if (part.kind === 'glyph') {
      const g = size.glyphs[part.name];
      // swapByProp: the variant's enum value picks the component (resolved
      // into spec.glyphSwaps); a plain swap is the same key everywhere.
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
        // Swap-proof ink — Figma's currentColor. A fill bound on the icon's
        // INTERNALS is an instance override keyed to layer names, so it
        // survives a swap only when the incoming icon names its ink layer the
        // same way (EDS Assets: "icon") and silently drops to raw artwork for
        // anything else. Instead the artwork becomes a MASK and the colour
        // lives on a tint rectangle above it: any swapped-in icon renders in
        // the variant's ink colour. The mask flag sits on a wrapper FRAME,
        // never on the glyph — an instance swap re-bases non-overridable
        // properties (isMask included) onto the swapped-in component, while
        // overrides on the glyph node (size binds, name, the swap propRef)
        // are preserved. The wrapper is component-internal, so no swap can
        // ever touch it.
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
        // Group so auto-layout centers ONE flow child; inside the group all
        // boxes share an origin and the same bound size, so they stay
        // coincident across density mode flips (constraints would not).
        const ink = figma.group([mask, tint], container);
        ink.name = 'ink';
        tint.x = mask.x;
        tint.y = mask.y;
        bindings += 9;
      } else {
        bindFill(glyph, glyphInk);
        bindings += 5;
      }
      // parts gated by a boolean prop that defaults false start hidden
      const bp = cs.booleanProps.find(b => (b.parts || [b.part]).includes(part.name));
      if (bp && bp.default === false) container.visible = false;
      // value-gated parts (control glyphs) hidden where the variant says so
      if (spec.hideParts && spec.hideParts.includes(part.name)) container.visible = false;
    } else if (part.kind === 'instance') {
      // composition-lite: an exposed instance of another generated set
      const src = figma.currentPage.children.find(n =>
        (n.type === 'COMPONENT_SET' || n.type === 'COMPONENT') && n.name === part.component);
      if (!src) throw new Error('missing component for instance part: ' + part.component);
      const inst = (src.type === 'COMPONENT_SET' ? src.defaultVariant : src).createInstance();
      inst.name = part.name;
      seatFor(part).appendChild(inst);
      inst.isExposedInstance = true;
      mirrorAxes(inst);
      if (cs.root.layout === 'VERTICAL') inst.layoutSizingHorizontal = 'FILL';
      // Collapsed variants may re-point overrides (the Collapse control's
      // icon faces the other way: first_page expanded, last_page collapsed)
      const effective = spec.collapsed && part.collapsedOverrides
        ? { ...part.overrides, ...part.collapsedOverrides }
        : part.overrides;
      for (const [prop, value] of Object.entries(effective || {})) {
        const key = Object.keys(inst.componentProperties).find(k => k.split('#')[0] === prop);
        // a "key:<componentKey>" value is an INSTANCE_SWAP target; contract
        // overrides are strings, so booleans travel as 'true'/'false'
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
      // The consumer's content area — a true SLOT (GA June 2026), with the
      // dashed placeholder frame as the fallback where the API is missing.
      // A SlotNode is frame-like: it takes a layoutMode of its own, and only
      // then can its children FILL. Sizing waits for the post-pass (the root
      // must be FIXED before anything can FILL against it).
      if (typeof root.createSlot === 'function') {
        const slot = root.createSlot();
        slot.name = part.name;
        slot.layoutMode = cs.root.layout;
        slot.primaryAxisSizingMode = 'AUTO';
        slot.counterAxisSizingMode = 'AUTO';
        if (part.cluster) {
          // the slot IS a cluster: internal gap = the sm rung
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
            // a "key:<componentKey>" value is an INSTANCE_SWAP target
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
      // baseline-grid text: Figma CAN trim — cap at the top, baseline at the
      // bottom, the same cap metric CSS rounds from (Inter 1490/2048)
      if (part.trim) t.leadingTrim = 'CAP_HEIGHT';
      root.appendChild(t);
      bindings += Object.keys(size.label || {}).length + 1;
    }
  }
  // A baseline-grid caption (Victor's La Dupla mechanism): a leadingTrim
  // text occupies Figma's PIXEL-ROUNDED cap; the FIGMA-ONLY top pad
  // (4px-grid cap − pixel cap, negative where the pixel cap exceeds the
  // cell — Figma binds negative padding) lands it in the grid cell. The root HUGS, so a wrapping caption
  // grows line by line — n lines measure capRounded + (n−1)·lineHeight,
  // exactly what the CSS trim produces. No clipping: the raw cap may
  // overshoot the cell by a fraction, like the CSS ascender overflow.
  if (cs.root.baselinePad) {
    root.setBoundVariable('paddingTop', need(cs.root.baselinePad));
    root.clipsContent = false;
    bindings += 1;
  }
  // A slot needs an edge to FILL to: without an authored width the root gets
  // the card's demo 320 (canvas convenience — instances resize freely).
  if (cs.parts.some(p => p.kind === 'slot') && !cs.root.fixedWidth && !spec.widthVar) {
    root.counterAxisSizingMode = 'FIXED';
    root.resize(320, root.height);
  }
  // A fill part absorbs the spare space on the root's main axis — the
  // contract owns the distribution. The set gets a demo edge to fill to;
  // instances resize freely.
  // (icon-only variants hug: the collapsed square's width IS its height)
  if (cs.root.layout === 'VERTICAL' && (cs.root.fixedHeight || spec.widthVar || cs.root.fixedWidth)) {
    // a column container: width is the COUNTER axis (authored, or bound to
    // the matched square edge when collapsed), height the demo main axis
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
  // Slot post-pass: with the root's edges now FIXED, the slot and its seeded
  // children can FILL the counter axis.
  for (const part of cs.parts) {
    if (part.kind !== 'slot') continue;
    const slot = root.children.find(ch => ch.type === 'SLOT' && ch.name === part.name);
    if (!slot) continue;
    if (cs.root.layout === 'VERTICAL') {
      slot.layoutSizingHorizontal = 'FILL';
      for (const ch of slot.children) ch.layoutSizingHorizontal = 'FILL';
    }
    // horizontal roots: the slot hugs; the root's centering seats it
  }
  // Corner flags: the collapsed square's submenu mark — built ONLY in
  // iconOnly variants, after sizing so the corner offsets can be baked
  // (absolute offsets are not variable-bindable; a bounded divergence).
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
  // A corner part needs an edge to anchor to: the strip gets a fixed width
  // (canvas convenience, like the divider's 160 — instances resize freely)
  // and the message fills the middle so the corner part reaches the end.
  if (cs.parts.some(p => p.corner)) {
    root.primaryAxisSizingMode = 'FIXED';
    root.resize(480, root.height);
    const msg = root.children.find(n => n.type === 'TEXT');
    if (msg) msg.layoutSizingHorizontal = 'FILL';
    for (const part of cs.parts) {
      if (!part.corner) continue;
      const c = root.children.find(n => n.name === part.name);
      if (!c) continue;
      // Upper right corner: Figma auto-layout has no per-child counter
      // alignment (no align-self), so the corner part goes ABSOLUTE with
      // top-right constraints. The SEAT is the part's cap box — for an
      // instance (the dismiss Button) that is its icon container; the rest
      // overflows like ink. Vertically the seat centers on the first LINE
      // BOX, matching the CSS trim seat. Offsets read resolved values at
      // build time — a bounded divergence (absolute offsets are not
      // variable-bindable).
      c.layoutPositioning = 'ABSOLUTE';
      c.constraints = { horizontal: 'MAX', vertical: 'MIN' };
      const seat = c.children && c.children.length === 1 && c.children[0].type === 'FRAME'
        ? c.children[0] : null;
      const sx = seat ? seat.x : 0, sw = seat ? seat.width : c.width;
      const sy = seat ? seat.y : 0, sh = seat ? seat.height : c.height;
      const lh = msg ? msg.height : sh;
      c.x = root.width - root.paddingRight - (sx + sw);
      c.y = root.paddingTop + (lh - sh) / 2 - sy;
      // The absolute part leaves the flow, so the filling message would run
      // under it: an invisible spacer reserves the part's IN-FLOW footprint
      // (box minus the overhang — what the CSS negative margins leave), and
      // rides the same visibility boolean.
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

// 3. Combine, arrange, wire component properties. A plan whose only variant
// carries no axis name ships a plain COMPONENT — no set, no synthetic axis.
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
    // icon-only variants expose only the icon's INSTANCE_SWAP and any
    // visibility toggles whose parts exist there (the flag) — text wiring
    // has nothing to act on and stays unwired.
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
