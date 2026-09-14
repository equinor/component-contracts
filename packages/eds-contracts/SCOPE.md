# Presentation scope — base components

Blessed by Victor 2026-08-28. Source of the candidate list: the production
Storybook (storybook.eds.equinor.com) — the original component set. Rule:
original components only; team redesigns are out (e.g. the Tab's added badge).

## Shipped

| Component | Contract                     | Figma set | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------- | ---------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Chip      | eds.chip v0.5.0              | 207:1815  | 60 variants: six tones × muted (wash + tone border) / emphasis (filled, on-emphasis ink) per Component Mocks; dismissible ✕ (the chip IS the dismiss button); real icons; Selectable chip REFUSED (selection = aria-pressed); open decision 6 (label md/sm) carried as data; v0.5.0 (review walk): sm label + xs-squared inset = EDS 1.0’s 24px chip on the shared rhythm, tighter xs sides (decision 6 CLOSED — the team’s 28px chip breaks the rhythm and chip-dense screens pay for it); selected UNGATED — the emphasis-selected rung now exists (step 11, active’s rung) |
| Button    | eds.button v0.8.0            | 80:1300   | 96 variants; real icons (swap-proof mask+tint ink); ghost-icon = EDS 1.x `ghost_icon`, icon-only round via `structure` overrides (padding = inset, a circle by construction); square icon-only REFUSED (no EDS 1.0 provenance); v0.8.0: disabled SPLIT per EDS 1.0 source — the gray plate is primary-only, secondary keeps disabled border, ghosts stay transparent; Focus variants REMOVED (Marco Krenn: the ring is the platform state — refused on canvas, CSS-only) — Focus removed from ALL sets the same day                                                                  |
| Tab       | eds.tab v0.2.0               | 87:471    | selected state, border-bottom channel; v0.2.0 (review walk): lg label — the original 16px tab, 36/44/52 (the team’s 14px tab is a redesign not followed; their badge is a good product call, credit due — still out of scope); resting text = subtle CONFIRMED (tabs are navigation, not content — they must not get in the way)                                                                                                                                                                                                                                              |
| Divider   | eds.divider v0.1.0           | 121:635   | the rule capability (thickness + border-color ink); gutters REFUSED — spacing belongs to the parent                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Label     | eds.label v0.2.1             | 121:661   | the smallest contract: typography only, no box — and ON the baseline grid (2026-09-05, Victor): single line = the cap cell (8/8/12), n lines = cell + (n−1)·lineHeight; CSS text-box trim (@supports, line-box fallback); Figma = Victor's La Dupla mechanism (v0.2.0's height-bound cell was a single-line trap): leadingTrim + FILL width + the FIRST FIGMA-ONLY variable, figma-only/baseline-pad-sm = 4px-grid cap − Figma's pixel-rounded cap (0/−1/+2 — his original −1 was exact; negative padding binds) — the first CARRIED trim, 'Figma cannot trim' disproven (issue #40); TextField stack 8+8+36+8+8=68; meta text is composition                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Card      | eds.card v0.2.0              | 322:853   | THE CONTAINER PRIMITIVE (Victor 2026-08-31, from EDS 1.0 assemble-yourself + the team's own _Card Container): tones DELETED (a danger card was a banner in a costume), elevation DELETED (cards sit; hover lifts); neutral bg-surface + border-neutral-subtle outline (the team's nice touch, on our static tier); hover = elevation-low shadow + border-medium GATED ON :is(a, button) — the markup is the prop, no data-interactive; focus ring self-gates (:focus-visible needs focusability); Figma: State=Default/Hover + a dashed Slot placeholder frame (true SLOT nodes not creatable via Plugin API yet — upgrade by hand when possible); container rule gap vertical-md 16; 12 variants → 2 |
| Tooltip   | eds.tooltip v0.3.0           | 143:695   | NEGATIVE (bg-inverse/text-on-inverse concept tokens, palette steps 13/15 — added 2026-08-29, overruling the v0.1 floating surface); 12 placements restore the EDS 1.0 arrow fan; arrow derives (width = cap box, protrusion = half); 16/20/28 emerges                                                                                                                                                                                                                                                                                                                         ; v0.3.0 (walk, Victor 2026-08-31): xs-SQUARED — squished read too tight; sm-compressed label kept (already 12/12); same pairing as the small chip (heights 20/24/36); the orphaned xs-squished-sm-label pairing deleted from Figma (on-demand rule); Side × Align two-axis Figma picker (the Astryx factoring — one code value data-placement='top-start', two variant axes; live set renamed in place) |
| Input     | eds.input v0.7.0             | 323:929   | THE CLASSIC EDS FIELD (Victor 2026-09-05, mock 345:1023): square corners, bg-input fill, thin BOTTOM border carrying the states (medium rest / strong hover / danger-strong :user-invalid / border-disabled) — the EDS 1.0 identity restored; the v0.4.0 boxed look (rounded + full border, from old Component Mocks 1059:21044) retired; FIELDS SIT ON SURFACES, never the canvas (Victor's rule); wrapper reads disabled through the control (:has(:disabled)) for the underline too; Figma set patched convergently (radii unbound→0, bottom-only stroke); TextField composition follows (323:930); v0.7.0 THE VALUE FILLS (Victor 2026-09-05): trailing icon pins to the end, leading icon keeps the icon gap — one FILL on the value, no nested wrapper groups (= the CSS flex: 1 1 auto); set demos at 256 |
| TextField | eds.text-field (composition) | 323:930   | Label + Input + helper assembled; compositions own LAYOUT only, parts own every box; exposed instances so designers never rebuild from parts; the Input FILLS the field's width (CSS align-items: stretch ↔ Figma FILL, 2026-09-05); stack on the baseline grid: 8+8+36+8+8 = 68                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Checkbox  | eds.checkbox v0.2.0          | 189:1062  | ONE native element: appearance:none + the EDS icon as mask-image (build-time from @equinor/eds-icons) — the CSS twin of the Figma mask+tint; :checked swaps the mask; focus = 4-way drop-shadow ring (a mask clips outlines, measured); EDS 1.0 green both states; v0.2.0: indeterminate promoted from refusal — third pseudo enum value, :indeterminate wins the :checked overlap                                                                                                                                                                                            |
| Radio     | eds.radio v0.1.0             | 156:889   | same machinery, radio_button_(un)selected icons                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Switch    | eds.switch v0.1.0            | 156:1014  | same machinery, switch_on/off icons at icon-2xl; role=switch                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| DESIGN.md | (fourth renderer)            | —         | repo-root DESIGN.md, generated: Google spec-conformant (0 errors from `npx @google/design.md lint`), zudo tone-spec rules folded into the canonical sections, whitelists computed from contract bindings, failure modes from REFUSED ledgers, colors as name/name-dark pairs (the format has no theming), THIN by design (pointers, not payloads)                                                                                                                                                                                                                             |
| Banner    | eds.banner v0.4.0            | 290:931   | the EDS 2.0 mock, refined with Victor (2026-08-31): STATIC = SURFACE TIER: bg-{tone}-surface + border-{tone}-subtle inset outline (ghost hover needs the room above a static tint — Victor found muted-default collides with the dismiss hover; the team minted non-interactive@step-1, near-invisible in dark; surface is one step safer and already exists); message ink text-{tone}-strong; tone-OWNED icons (swapByProp masks, Icon boolean = visibility only) seated on the FIRST LINE (root align start); READING text TRIMMED — text-box: trim-both cap alphabetic (@supports-gated, --_trim-lead switches padding + seats; Figma REFUSES the trim, heights agree at every line count by construction); dismiss IS the Button ghost-icon (instance, "key:" swap to close) — cap box on the corner, plate overflows by the declared overhang, absolute in Figma + in-flow spacer reserve; container gap horizontal-md (16 — selectable/container/page rule); heights 24/36/44; LESSON: pseudo-private channels INHERIT into nested components — the container resets what it sets (--_border: initial on the nested Button) |
| Menu-item | eds.menu-item v0.1.0         | 169:817   | ghost row; SELECTED = the new accent ghost-selected rung (accent step 4) + accent text — December's selected ≡ hover leak closed; [aria-selected] hook                                                                                                                                                                                                                                                                                                                                                                                                                        |
| TopBar    | eds.top-bar v0.6.0           | 380:1723  | seated strip (xs raw, height 36/52/68 emergent); identity leads (Symbol INSTANCE_SWAP + lg title fill); search Input at AUTHORED WIDTH 256 (contract part width → emitted CSS `& > .eds-input` + builder resize; Victor 2026-09-05, mock 345:1023); actions = TRUE SLOT that IS the cluster (sm gap bound on the slot) seeded with account/notifications/tune ghost Buttons — designers add as many as they want (polish item CLOSED); container gap md; thick subtle underline |
| SideBarItem | eds.side-bar-item v0.1.0 | 362:1405 | the navigation row: lg-squared + md compressed (40/52/60); swappable ↳ Icon; ghost ladder + accent selected (fill, label, icon, accent-strong underline); thin subtle underline separators, no gaps; Collapsed axis = iconOnly SQUARE (width=height — the centring identity: (h−glyph)/2 = inset−(glyph−cap)/2); Has Menu boolean gates chevron (expanded) AND corner flag (collapsed, xs legs); chevron key = SET key (builder resolves default variant); v0.4.0 (Victor 2026-09-06): the Collapse control's icon FLIPS when collapsed (collapsedOverrides fact: Figma swaps first_page for last_page per variant; CSS mirrors the one svg with scale -1 1 under data-collapsed — the glyphs are horizontal mirror twins) |
| SideBarSubItem | eds.side-bar-sub-item v0.1.0 | 363:1330 | submenu row: md-squared (32/44/52), no icon; DERIVED indent = parent inset + cap cell + icon gap → recipe/indent-side-bar-sub-item 32/40/46 (mock said 48 — its icon occupied the full glyph box; the alignment RULE survives, the number recomputes) |
| SideBar   | eds.side-bar v0.4.0          | 383:2106  | the rail: surface column, THICK subtle endline OUTSIDE (full-bleed items paint over inside strokes — Victor's catch); items = TRUE SLOT (fill, Collapse pins) seeded with the OPEN SUBMENU (Gas selected + Fields under Edit, derived indent); AXIS MIRRORING + cannot-mirror rule (collapsed hides what can't collapse — CSS `> :not(.eds-side-bar-item)`, Figma seed hiding); collapsed cascade in code (inherit binding: ONE data-collapsed on the nav); width 256 / recipe/square-side-bar-item |
| Table     | eds.table v0.2.0             | 175:817   | the finale: `element` parts (tr/th/td) lower to nested element rules; the invariant holds PER CELL so rows emerge 24/36/44 (verified both surfaces) and density means MORE ROWS, not narrower tables; row hover = neutral ghost, selected row = accent ghost-selected; Figma grid column-major so columns align by construction; v0.2.0 (Victor 2026-09-06): the COMPRESSED size for big data tables (sm cells, sm-squished, rows 20/24/36; the size-axis map gains a per-value proportion override); CSS carries the axis, the canvas set is Default-only for now (ledger LOWERED; per-variant table cells queued below); v0.3.0 (Victor, same day, after measuring Google Sheets' wrapped cells at ~1.35): CELL TEXT IS READ — both sizes move to the default leading (14/20 and 12/16), padding absorbs the larger half-leading, EVERY height stays put (the invariant's own promise); live table rebound (20 boxes, 20 texts, height unchanged at 180), union verified f11b8734/431                                                                                                                                                                                                                                               |

## In scope, build order

All base components shipped 2026-08-30. Optional if time: Badge/Tag (new but
cheap), Avatar, Lists, Dialog, Snackbar, Scrim.

## Polish list


- Figma table Size variants (2026-09-06): the compressed size is CSS-only;
  the table builder builds ONE component with one set of cell bindings.
  Teach it per-variant cells so the canvas set carries Size=Default/
  Compressed and the ledger entry flips LOWERED to RESOLVED.
- Motion tokens (Victor 2026-09-06, from the Storefront's animated
  sidebar): the submenu/rail animation is hand-tuned demo CSS today —
  250ms, cubic-bezier(.2,0,0,1), riding interpolate-size +
  allow-discrete display. Mint duration/easing as real tokens in
  eds-tokens (per density? reduced-motion pair?) and re-point the
  Storefront at them.
- Banner leadingTrim retrofit (2026-09-05): Label v0.2.0 proved Figma CAN
  trim (leadingTrim CAP_HEIGHT + the cap-cell recipe = exact parity with
  text-box). The banner's message still records the trim as a Figma
  divergence (line-box mirror) — retrofit it the Label way and update the
  ledger wording (issue #40 closes on that).
- Input, the shortlist (Victor 2026-09-05, after the Astryx TextInput
  survey; the team's own field confirms all three): read-only as a state
  distinct from disabled (EDS 1.0 had it; :read-only, full opacity, stays
  in tab order); the status trio (error/warning/success + helper message —
  warning/success tones were scoped out earlier, revisit); a clear ✕ for
  search fields. NOT taken: async spinners, labelTooltip, statusVariant
  placement modes — API surface the contract model exists to resist.
- Icon-label gap md reads tight (Victor 2026-08-31; CONFIRMED 2026-09-05 on
  the sidebar item AND the button — the longer nav rows make it plainer):
  8 now, 10 looks better. The formula is the golden ratio —
  round(0.618 × fontSize, grid) = 8.65 → 8 at md/comfortable — so the
  polish session tweaks the ratio or the rounding and re-derives the WHOLE
  gap table (all sizes × densities × both axes); every icon-bearing
  component follows automatically. NOTE the coupling: the sub-item indent
  (recipe/indent-side-bar-sub-item) includes the gap as a term, so the
  indent recomputes with it — alignment survives by construction.
- Ghost-icon Button tones (Victor 2026-08-31): add info/warning/success to
  the tone axis (danger exists) — a tone-matched dismiss ✕ would sit
  beautifully on the banners. The icon-{tone} inks and ghost rungs all
  exist for the six tones already; it's a tone-enum extension on the
  button contract.
- Table sorted header (Victor 2026-08-31): a header the table is sorted by
  should sit on the ghost-selected rung — and the state is the platform's:
  th[aria-sort='ascending'|'descending'], not a class. Not now.
- Banner dismiss seat (Victor 2026-08-31, check tomorrow): nudge the ✕ a
  little further right, and consider the SMALL icon button for the slot.
- TopBar gap: 8 (icon-md-gap) predates the container rule (2026-08-31:
  containers gap 16/horizontal-md) — TopBar is a container of ghost-icon
  atoms; Victor's call whether the rule applies or bars are exempt like
  flush lists (Menu/SideBar/Table gap 0 read as deliberate exemptions).
- Dark FLOATING hover collision (found in the v0.4.0 audit, same disease as
  the banner's): bg-floating dark = neutral-3 = ghost-hover — a menu-item's
  hover plate is INVISIBLE inside a dark menu. Structural: the first
  interactive rung must sit ≥1 step above its backdrop in the same scheme.
  Scale-rework territory (deferred backlog) — do not patch ad hoc.
- Chip dismiss ✕ is consumer markup (svg) while the banner's glyphs are
  emitter-owned masks — a FIXED glyph should arguably be emitter-owned in
  both (the chip ✕ can still carry the wrong glyph). Low stakes.
- Half-leading naming: the unmarked token means compressed
  (--eds-half-leading-md vs -md-default) while line-height marks BOTH
  variants — fold into the optical-pairing naming rethink.
- ~~Icon-only Button: accessible name~~ DONE 2026-08-30: the obligation is
  DERIVED, not authored — every icon-only structure variant on an interactive
  element gets it automatically. Ledger: `requires an accessible name`
  (css RESOLVED / figma LOWERED); CSS emits a zero-specificity guard that
  paints any unnamed icon-only control with a dashed danger outline (verified:
  fires without aria-label, focus ring still wins); Figma: Button set
  description carries the requirement.
- ~~Figma focus rings on selection controls~~ DONE 2026-08-30: 4 drop-shadow
  effects on the root (colour bound to concept/border-focus, offsets = the
  stroke-thick constant), cast by the ink alpha — the ring hugs the glyph on
  both surfaces now, shared artifacts included (shadow bleeds through
  transparent holes identically). emit-builder branches on ring+no-paddings;
  7 Focus variants patched in place (checkbox/radio/switch).
- Warning/success Input tones — Victor's call (scoped out of v0.3.0).
- ~~Indeterminate checkbox~~ DONE 2026-08-30: third value on the pseudo-bound enum (propSel generalized: every non-default value is its own platform pseudo; default = list-form :not() so specificity stays flat); mask swaps to checkbox_indeterminate; overlap with :checked measured in Chrome — indeterminate wins; set rebuilt 189:1062 (9 variants).
- ~~Tab resting text~~ CONFIRMED subtle 2026-08-30 (Victor: "you navigate, and
  you are there" — tabs must not get in the way).
- Optical pairing NAMES need a rethink (Victor 2026-08-30): `recipe/optical-
padding-md-squared-lg-label` doesn't say WHY it exists; candidates like
  `inset-md-vertical-optical` and/or encoding the compressed line-height in
  the name. Rename is cheap (payload + requiredVariables + rebind).
- ~~Chip selected state~~ DONE 2026-08-30: states gained a `when` gate (schema + resolver + both emitters); selected = aria-pressed on the plain chip, muted-selected rung, refused for emphasis; set rebuilt 186:1800 (54 variants), 5 live instances re-pointed.
- ~~Table separator material~~ RESOLVED 2026-08-30 (Victor: rows must land on
  the 4px grid): separators are inset box-shadows overlaying the padding — row
  rhythm exactly 24/36/44 on both surfaces. Known cost, accepted: box-shadows
  drop in forced-colors mode and in print.
- Dark emphasis: text (step 15) vs icon (step 14) on-emphasis inks sit close —
  Victor would like more separation eventually; not now (2026-08-30).
- Token-package CSS stylelint debt (599 in eds-tokens).
- ~~Payload fingerprint union~~ DONE 2026-08-30: unionLines(payload + contract
  recipes) = the complete expected variable universe (410); FNV-1a hash in
  build/figma.fingerprint.json + generated build/verify-figma.js recomputes
  the same canonical lines from the LIVE file and diffs. First run caught two
  real representation drifts in bg-floating (per-mode aliases + semantic
  passthrough the payload could not express) — fixed in the payload EMITTER,
  and the union now closes: expected hash == live hash.

## Out of scope

Typography (decided — replaced by per-component typography), Autocomplete,
Dates, Slider, Progress Indicators, Pagination, Breadcrumbs, TableOfContents,
SideSheet, Accordion, Popover (Tooltip covers the pattern), square icon-only
Button, Tab badges.

## After components

1. **Review gate (Victor 2026-08-30): walk every component and verify it looks
   right — both surfaces, all densities, both schemes — before any demo work.**
2. The HTML gallery (grow preview/index.html per component, or emit-html) and
   the EDS prototyping skill ("build a dashboard with EDS, three alternatives").
