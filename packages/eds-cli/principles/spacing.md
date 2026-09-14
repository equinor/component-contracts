---
title: The spacing ladder — every relationship one rung
keywords: spacing, gap, padding, margin, ladder, cluster, seat, elements, between, whitespace, layout, rhythm, distance, buttons, group, container, page, inset
---

EDS spacing is one ladder, and the rule for reading it is a single idea:
**the closer the relationship, the smaller the space.**

A page holds sections — 24. A container holds children — 16. A cluster holds
siblings — 12. A selectable holds its own label — the inset. And the closest
relationship in the whole system: a control and the bar it sits in — 8.
Every step down the ladder, one step closer.

The taxonomy has five levels: **page → container → cluster → selectable →
seat**. The page/container/selectable trichotomy is Eric Singhartinger's —
a selectable is the atom, the thing you can press: a button, a chip, a tab.
Cluster and seat are EDS's additions between and below.

| relationship               | rung  | compact / comfortable / relaxed |
| -------------------------- | ----- | ------------------------------- |
| page → sections            | xl    | 20 / 24 / 28                    |
| container → children       | md    | 12 / 16 / 20                    |
| cluster → siblings         | sm    | 8 / 12 / 16                     |
| selectable → its label     | inset | per contract, optically corrected |
| strip → seated control     | xs    | 6 / 8 / 12                      |

(The prose above uses the comfortable-density values — the default. Every
rung scales with density automatically; no rule changes.)

## Cluster

Selectables acting as one group — Save/Cancel, a top bar's action row — are
a **cluster**, and their internal gap sits one rung below their container's
gap. Two reasons:

- Grouping must read tighter than separation, or it does not read at all.
- Boxes that bring their own inset need less air added: two buttons at
  gap 16 have roughly 48px between their *labels*, because each button
  carries its own horizontal padding. The gap measures box-to-box; the eye
  measures ink-to-ink.

## Selectable

The atom of the taxonomy — anything you can press. A selectable's spacing
relationship is its **inset**: box edge to label, the one place optical
compensation applies (the padding subtracts the label's half-leading so the
height lands on `inset × 2 + cap`). Its heights are the selectable ladder
(`sizing/selectable-*`) — a target-size floor, never a menu.

## Seat

A chrome strip that seats controls — a top bar, a toolbar — pads its
cross-axis with the **seat** rung, and pads it **raw**: no optical
compensation.

Why raw? Text boxes lie about their edges; control boxes don't. Text carries
invisible air above and below its letters (the half-leading), so we subtract
that lie from the padding to make text look right. A button or a field is a
box whose edges are real — nothing to subtract. Text gets corrected padding;
controls get honest padding.

The consequence: a strip's height is never authored. It is the tallest
seated control plus a seat of air above and below — 36 / 52 / 68 across
densities, and nobody typed any of them.

## Inside an atom

One rung lives below all of these, inside components themselves: the gap
between a glyph and its label (the icon-gap tokens). That space belongs to
the atom's own anatomy, not to layout — never use icon-gap tokens between
siblings, and never use the ladder rungs inside an atom.

## Sources

- `packages/eds-tokens/DECISIONS.md` — "Two spacing rungs: cluster and seat" (2026-09-04)
- `packages/eds-tokens/build/css/typography.css` — the ladder values per density
- `packages/eds-contracts/contracts/top-bar.contract.json` — the first seated container (v0.4.0)
