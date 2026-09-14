# Button [EDS] — upstream Figma library spec (measured)

Source of truth for the Button v0.2 contract surface. Measured read-only from the
team's Core Components library (file `dz0XQdc5j7AAtjXr1gTfVR`, component set
`5823:7549`, "Button [EDS]", 270 variants) on 2026-08-27. Their new simplified
tokens, single density.

## Variant axes (6)

| Axis        | Values                                  | Default |
| ----------- | --------------------------------------- | ------- |
| Icon Button | false, true                             | false   |
| Tone        | Neutral, Accent, Danger                 | Accent  |
| Variant     | Primary, Secondary, Ghost               | Primary |
| State       | Default, Hover, Focus, Active, Disabled | Default |
| Size        | Default, Small                          | Default |
| Round       | false, true                             | false   |

270 variants (not 360 — Round=true presumably only exists for Icon Button=true).

## Component properties

| Property          | Type          | Default  |
| ----------------- | ------------- | -------- |
| Text              | TEXT          | "Label"  |
| Has Leading Icon  | BOOLEAN       | **true** |
| Has Trailing Icon | BOOLEAN       | false    |
| ↳ Leading Icon    | INSTANCE_SWAP | 18:102   |
| ↳ Trailing Icon   | INSTANCE_SWAP | 18:102   |

## Measured geometry

|                | Default (36px)                                            | Small (24px)       |
| -------------- | --------------------------------------------------------- | ------------------ |
| padding block  | 8 (`spacing/xs`)                                          | 4 (`spacing/3xs`)  |
| padding inline | 12 (`spacing/sm`)                                         | 8 (`spacing/xs`)   |
| label          | 14px / lh 20, Inter **Medium** (`font-weight/bolder`)     | 12px / lh 16       |
| icon           | 20×20 (= line box)                                        | 16×16 (= line box) |
| gap            | 8 (`spacing/xs`)                                          | 8 (`spacing/xs`)   |
| radius         | 4 (`corner-radius/rounded`); Round → `corner-radius/pill` | same               |

Icon-only: square via padding (8 all sides + 20 icon = 36), no label node.
Height decomposition: honest padding + full (uncompressed) line-height —
8×2 + 20 = 36. No optical anything: padding-inline is a metric 12/12 with a
leading icon (the memo's measurement, confirmed), gap is a flat 8 (not
0.618em), label uses the flat ui line-height (the compressed scale is gone).

## Styling per Variant (accent samples)

|               | fill                                                                             | stroke                                         | label/icon color                                       |
| ------------- | -------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| Primary       | `background/interactive/accent/emphasis/default` (hover/active tokens per state) | —                                              | `icon/on-emphasis`                                     |
| Secondary     | none                                                                             | 1px `border/interactive/accent/emphasis/hover` | `text/interactive/accent/default`                      |
| Ghost         | none                                                                             | —                                              | `text/interactive/accent/default`                      |
| Focus (state) | primary hover fill                                                               | —                                              | + overlay FRAME "Focus" ring, 91×38 (outset ~1px ring) |

Their token surface (simplified set, no density modes): `spacing/{3xs,xs,sm}`,
`corner-radius/{rounded,pill}`, `background|border|text/interactive/{tone}/...`,
`icon/on-emphasis`, `typography/ui/{sm,md}/{font-size,line-height}`, `family/ui`,
`font-weight/bolder`.

## Derivation check against our engine (comfortable)

- Default: our md-squished recipe gives 10+16 = **36** ✓ (same box, different split)
- Small: sm label in sm-squished inset → cap 8, inset 8, pad 6+12 = **24** ✓
- Two-line md label: theirs 8×2+40 = **56** (off the selectable ladder);
  ours 10×2+32 = **52** (on it) — a deliberate, explainable deviation.

## Notes for the v0.2 contract

Same rendered surface, our engine underneath: heights emerge from the recipe at
every density (theirs exist at one), Focus lowers to :focus-visible in CSS and a
ring overlay in Figma, Secondary forces the border channel, Size forces
size-parameterized anatomy, and the icon slots force INSTANCE_SWAP in the builder.
