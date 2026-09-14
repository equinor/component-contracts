# Intent: `eds` CLI (POC)

Captured 2026-09-03 by Victor Nystad + Claude, following the capture-intent
practice (academy.claude.com/courses/ai-native-sdlc-playbook/capture-intent).
This file is the contract between the humans who want the tool and the Claude
who builds it. Build what this file says; where it is silent, prefer the
smallest honest thing.

## What and why

A minimal, Astryx-inspired design-system CLI for the Equinor Design System —
a **POC for the talk "Teach AI your design system"** (Into Design Systems,
Oslo, 2026-09-09). The point it exists to prove: because EDS components are
defined by machine-readable contracts and computed tokens, a useful CLI is a
*thin rendering layer* over data that already exists — not a documentation
project. Astryx hand-authors `.doc.mjs` files; we generate answers from the
same source of truth that generates the components.

Audience: product designers and their agents. Tone of output: factual,
provenance-shown, honest about absence.

## The three acceptance questions

The CLI ships when these three, asked in natural CLI form, return correct and
complete answers. They are chosen to prove three different capabilities:

1. **Recall structured data** — `eds component button`
   → Renders the Button contract: variants, tones, props/attributes, states,
   with provenance (contract version, source path). Substance from
   `packages/eds-contracts/contracts/button.contract.json` — never paraphrased from
   memory.

2. **Explain a decision** — `eds explain brand` (routing must also catch
   "How does EDS use the Equinor brand guidelines?")
   → Renders the principles doc (see "Authored content" below). Must include
   the Energy Red rule: *energetic* in branding, *danger* in an interface —
   which is why EDS refuses it for primary actions. Should also answer "why
   Inter" from the same doc.

3. **Compute a verdict** — `eds contrast ghost-button`
   → Resolves the ghost button's text and background tokens for the active
   colour scheme, computes the APCA Lc **live** (never a stored value), and
   returns: the two resolved colours, the Lc, the threshold that pairing must
   clear for its use, and **PASS/FAIL**. A verdict, not a number. Support
   `--scheme light|dark` (default light).

## Data sources (in trust order)

1. `packages/eds-contracts/contracts/*.contract.json` + `contract.schema.json` — component truth
2. `packages/eds-contracts/build/` — emitted CSS and ledgers (CARRIED/LOWERED/RESOLVED/REFUSED), if useful for provenance display
3. `packages/eds-tokens/build/` — token values, colour scales, typography recipes; scheme resolution happens against these
4. `packages/eds-tokens/DECISIONS.md` — decision provenance, quotable rationale
5. One **authored** principles doc (below)

**Explicitly excluded:** the EDS documentation markdown in
`equinor/design-system` under `apps/` (2.0-beta docs). Maintained on a
different cadence and diverging from this repo's sources. Pulling it in
would make the CLI confidently wrong —
the one failure mode a trust-building POC cannot afford.

## Authored content (part of this build)

Write `packages/eds-cli/principles/brand.md` (~1 page): how EDS uses the Equinor brand
guidelines. Must cover: Energy Red (branding=energetic vs interface=danger,
therefore refused for primary actions); why Inter for UI text (and Equinor
typeface for headings); APCA over WCAG 2.x ratios for contrast. Victor
reviews this page before the CLI is considered done — it speaks for the
design system. Give it a `keywords` list for routing (see below).

## Behaviours that are the point

- **Never fabricate.** If the CLI can't answer from its sources, it says so
  and names the nearest thing it *can* answer ("no date picker; nearest:
  Input + Menu"). A good absence answer builds more trust than ten presence
  answers. Silence or invention are both failures.
- **Compute, don't recall.** Anything derivable (Lc, resolved token values)
  is derived at runtime from the token build. No cached verdicts.
- **Provenance on everything.** Each answer names its source file. The CLI is
  a lens, not an oracle.
- **Keyword routing** (stolen from Astryx): docs and components carry
  synonym lists — "brand", "colors", "red", "fonts", "Inter", "accessibility",
  "contrast" — so a designer's phrasing finds the right entry. `eds search
  <query>` over names + keywords + descriptions is in scope if cheap.

## Scope fence

- Components: Button, Banner, Tooltip (original three) + Menu, Menu-item (widened 2026-09-05)
- Commands: `component`, `explain`, `contrast`, optionally `search`. Nothing else.
- **No MCP server.** CLI only. (The talk's point: transport is a separate
  decision from content.)
- **No writes.** Read-only over this repo.
- Not published to npm. Runs via `pnpm exec eds` / a bin in this repo.
- POC quality is fine; *dishonest output is not*. Rough edges allowed,
  wrong answers not.

## Conventions

- pnpm only (never npm/yarn; `pnpm dlx` not `npx` in any script or doc)
- Node + TypeScript, matching the repo's existing style (see
  `packages/eds-contracts/src/` for the emitters' idiom); prettier + editorconfig
- APCA: use an established implementation (e.g. `apca-w3`) — do not hand-port
  the algorithm
- Output style: aligned key-value records like Astryx (`astryx --help` shows
  the block grammar); `--json` envelope is a stretch goal, not required

## Decisions (ruled by Victor, 2026-09-03)

1. **Name**: `eds`
2. **Location**: this repo, `packages/eds-cli/`
3. **Components**: Button + Banner + Tooltip (widened 2026-09-05, Victor:
   + Menu + Menu-item — the menu-label contrast question proved the tool;
   `eds contrast menu-item` computed the subtle-ink verdict that decided a
   design change the same morning)
4. **Data coupling**: read the repo live
5. **Deadline**: stage-ready by **Sun 2026-09-07** — a *stretch* demo beat
   for the talk on the 9th, never a gate. If it slips, the talk works
   without it.

## Builder notes

- Read `packages/eds-contracts/AGENTS.md` / `CLAUDE.md` and `contract.schema.json`
  first; the contract vocabulary (variants, parts, states, ledger verdicts)
  is the domain language — reuse it in output, don't invent parallel terms.
- Token resolution for schemes: `packages/eds-tokens/build/` CSS declares
  per-scheme values; resolve references the way `packages/eds-contracts/src/resolve.ts`
  does rather than re-implementing.
- The ghost button's text/bg pairing must be read from the button contract +
  token build, not hard-coded — the whole demo is that the answer survives a
  future contract change.
- Test the three acceptance questions as actual automated tests, in the
  spirit of `packages/eds-contracts/test/check.ts`: silence is never a pass.
