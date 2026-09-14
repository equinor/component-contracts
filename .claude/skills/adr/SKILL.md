---
name: adr
description: Author an Architecture Decision Record in the EDS team's format (equinor/design-system documentation/adr). Use when the user asks to write, draft, or supersede an ADR.
---

# Write an ADR (EDS team format)

The EDS Core team uses no ADR tooling — ADRs are Markdown files hand-copied from
`documentation/adr/0000-template.md` in `equinor/design-system`. Their format is a
customized MADR (declared in their ADR-0001): MADR's "Good, because / Bad, because"
consequences and Confirmation section, but bullet-list metadata instead of YAML
frontmatter, per-option Pros/Cons inline under "Options Considered", and a flat
"## Decision" instead of MADR's "Decision Outcome". Match it exactly.

## Workflow

1. **Directory**: `documentation/adr/` in the target repo. Create it if missing.
2. **Number**: next free 4-digit number, following the numbering rule below.
3. **Filename**: `NNNN-short-kebab-title.md` (e.g. `0006-flat-class-names-for-eds-2-components.md`).
4. **Fill the template below.** Delete all guidance comments from the final file.
   The H1 carries NO number — just the short decision title in sentence case.
5. **Immutability**: an accepted ADR is never edited. A new decision supersedes it
   (see status lifecycle below).
6. **Update the index**: add a row to `documentation/adr/README.md` (see below).
   When superseding, also update the old ADR's row.
7. **Public by default** (their rule): decisions about components, tokens, APIs,
   tooling, processes are public. Only sensitive content (security, internal infra)
   goes to an internal repo.
8. If the ADR establishes a pattern agents must follow, add it to the ADR list in
   `AGENTS.md` / `CLAUDE.md` so it's read before that pattern is changed.

## Numbering rule

A number is claimed by the first PR that uses it — but numbering in parallel PRs
has minted duplicates before (two 0004s, two 0005s), so:

- Next number = 1 + the highest number found across **both** existing files in
  `documentation/adr/` **and** open PRs that add ADR files
  (`gh pr list --state open --search "adr"`, check the file lists of hits).
- Never reuse or renumber. A published number is permanent, even for Rejected ADRs.
- Gaps are allowed (a number whose PR was closed unmerged stays unused). Note the
  reason in the index so a gap is distinguishable from a lost record.
- If a collision has already happened (two files sharing a number), leave them —
  renumbering breaks inbound links. Disambiguate in the index instead.

## Status lifecycle

`Proposed → Accepted`, or `Proposed → Rejected`. After acceptance:

- **Full supersession**: new ADR links the old one under `## Related`; the old
  ADR's Status line becomes `Superseded by [ADR-NNNN](NNNN-....md)`. This is the
  one permitted edit to an accepted ADR.
- **Partial supersession** (one aspect replaced, the rest still stands — the
  ADR-0002/0006 case): keep `Accepted` and scope the note, e.g.
  `Accepted (CSS naming convention superseded by [ADR 0006](0006-....md))`.
- **Deprecated**: the decision no longer applies and nothing replaced it.

Update the superseded/deprecated ADR's index row in the same PR.

## Index (`documentation/adr/README.md`)

The directory keeps an index so status is visible at a glance without opening
every file. One row per ADR, newest last; keep it in sync in every ADR PR:

```markdown
# Architecture Decision Records

Decisions follow the format in [0000-template.md](0000-template.md).
See ADR-0001 for when to write one, numbering, and status lifecycle.

| ADR                                | Title                          | Status                            | Date       |
| ---------------------------------- | ------------------------------ | --------------------------------- | ---------- |
| [0001](0001-use-adr-for-....md)    | Use ADR for architecture decisions | Accepted                      | 2026-02-02 |
| [0002](0002-use-vanilla-css-....md)| Use vanilla CSS with design tokens | Accepted (naming → [0006](...)) | 2026-02-02 |
| 0010                               | —                              | Unused (PR closed unmerged)       | —          |
```

## Template

```markdown
# [Short title of the decision]

- **Status:** Proposed | Accepted | Rejected | Deprecated | Superseded by [ADR-NNNN]
- **Date:** YYYY-MM-DD
- **Decision makers:** [people involved]

## Context

[The situation and why a decision is needed. What problem, what triggered it,
relevant background.]

## Decision Drivers

- [Key requirement or constraint the options are evaluated against]
- [Driver 2]

## Options Considered

### Option 1: [Name]

[Brief description]

**Pros:**

- [Advantage]

**Cons:**

- [Disadvantage]

### Option 2: [Name]

...

## Decision

[What was decided and WHY — reference the decision drivers and explain how the
chosen option best satisfies them.]

### Consequences

- Good, because [practical implication after deciding — not a restated pro]
- Bad, because [trade-off or migration cost created]

### Confirmation

[Optional: how adherence is verified — code review checks, lint rules, CI.]

## Related

- [Other ADRs, GitHub discussions/issues, external articles]
```

## Style notes observed in their accepted ADRs

- Consequences are practical implications *after* deciding; Pros/Cons are the
  theoretical arguments *before* — don't duplicate one into the other.
- Rejected options get fair treatment: every option lists real pros.
- Decision sections often include a short code example of the resulting pattern.
- Sources are linked (announcements, issues, docs), not paraphrased from memory.
