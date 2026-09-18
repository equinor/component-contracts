# Contracts are distributed, not copied; extensions are merged, verified and visible

- **Status:** Proposed
- **Date:** 2026-09-17
- **Decision makers:** Victor Nystad

## Context

The contracts are the source of truth, and the emitters make building a
component on both surfaces cheap. That makes the contracts themselves
the artefact other teams want: a product team building a local design
system on this foundation needs the contracts, the emitters and the
parity harness, not just the emitted CSS. The first consumer repos are
appearing, and the naive move is to copy contracts into them. Copies
diverge silently: three repos with copied contracts is three truths, and
nobody notices until one repo's harness disagrees with another repo's
canvas. Each contract already carries its own semver and notes; what is
missing is distribution and provenance.

## Decision Drivers

- One truth per component, with a recorded version at every consumer
- Consumers need the machinery (emitters, harness), not just the data:
  an extended component that skips the harness is unverified drift
- Teams legitimately need local additions (an extra prop, a variant)
  without forking the system
- Local divergence should be visible to the system, not hidden from it

## Options Considered

### Option 1: Copy contracts into consumer repos

**Pros:**

- Zero infrastructure; works today

**Cons:**

- Silent divergence, no upgrade path, no provenance

### Option 2: Publish the package; consumers install a pinned version

`@equinor/eds-contracts` (name pending, see Consequences) published with
the contracts as package data plus the emitters and harness. Consumers
pin a version; upgrades are explicit and diffable.

**Pros:**

- npm is the central registry; semver is the provenance
- Fixes the CLI's portability in the same motion (it can resolve
  contracts from the package instead of the monorepo root)

**Cons:**

- Requires org npm (GitHub Packages) setup and a naming decision

### Option 3: Git subtree of this repo inside the consumer

The whole repo vendored under a prefix via `git subtree add --squash`,
updated with one `git subtree pull`.

**Pros:**

- Real files agents can read (agents are walled off from node_modules);
  full workbench present: contracts, emitters, harness, Storefront
- Pinned by commit, updated deliberately, no publishing prerequisite

**Cons:**

- Heavier than a package; the consumer carries the whole repo

## Decision

Option 2 is the destination; Option 3 is the sanctioned interim until
the package name and org registry are settled. Option 1 is rejected:
contracts are never copied loose into another repo.

**Extensions** (deferred until the first real need, and designed then
against that need): a consumer contract declares
`"extends": "eds.button@0.8.0"`, and a contract-aware merge (props,
states and variants merged by `name`, never positionally; a generic deep
merge is semantically blind and forbidden) produces the local contract.
Two obligations make extension safe:

- The parity harness runs on the MERGED contract. An extension gets the
  same verification the upstream component gets, or it does not build.
- The merge emits a diff report of everything the extension added or
  changed against upstream. Local divergence is visible by construction,
  and when several teams' diffs add the same prop, that is the system's
  promotion backlog writing itself — decentralisation with a feedback
  channel instead of drift.

### Consequences

- Good, because "which button do you have?" always has an answer:
  component semver via package semver via lockfile
- Good, because local design systems inherit the trust machinery, not
  just the pixels
- Bad, because publishing requires resolving whether this work may carry
  the `eds-` name (the author is a founding member but not the current
  core team; the package name may need to follow the repo's neutral
  `component-contracts` naming instead) — OPEN
- Bad, because subtree consumers carry the full repo until the package
  ships

### Implementation (v1, 2026-09-18)

`packages/eds-contracts/src/extend.ts` + the `extends` field in the
schema. Props and states merge by name, variants by their `when` object,
enum values append; the resolver resolves the MERGE, so the emitters and
their invariants run on it, and `resolveContract` returns the diff.
An unsatisfiable extension is refused with the missing token named (the
fixture pair in `test/fixtures/` pins both paths: a link variant that
builds and verifies, and an info tone the system's token set cannot
satisfy). Not yet done: running the full component harness suite against
consumer extensions in their own repos; today the emit-time invariants
plus the repo's checks carry it.

### Confirmation

A consumer repo's CI runs the harness from the vendored/installed
package against its own (possibly extended) contracts; the extension
diff report is committed alongside the merged output.

## Related

- [ADR-0002](0002-control-heights-are-emergent.md) — why the machinery
  must travel: the numbers are derived, not copied
- Spotify Encore's "local design systems" model — the governance shape
  this decision's diff reports serve
