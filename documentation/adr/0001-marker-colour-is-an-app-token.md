# Marker colour is an app token, not a system token

- **Status:** Accepted
- **Date:** 2026-09-06
- **Decision makers:** Victor Nystad

## Context

The Component Storefront's live DOM pane highlights state changes in the
serialized markup. The highlight wanted brand Midnight Sun (#FBDD79), a
brand colour that does not exist in the interface palette. The colour was
minted into the system's concept tokens in the morning and the decision
was revisited the same day: should a single visualization colour live in
the design system's tokens, or in the application that uses it?

## Decision Drivers

- A design system token implies a designed family: one lone visualization
  colour begs for the rest of a visualization palette that nobody has
  designed yet
- Ownership should match usage scope: exactly one application uses it
- Dark mode needs a deliberate value either way (a raw brand hex has none)
- The ink on the marker must stay readable (APCA, scanned floor Lc 60)

## Options Considered

### Option 1: System concept token (`concept/bg-marker`)

Mint the marker into the token package beside the other concept colours.

**Pros:**

- One source; any future app reuses the same pairing
- Dark mode is designed once, centrally

**Cons:**

- The system would own brand-colour policy for a single consumer
- A lone visualization colour with no palette around it invites the
  question the team cannot yet answer
- Every future app inherits an undesigned decision

### Option 2: App-local token (`--sf-color-bg-marker`)

The Storefront mints the pair under its own prefix.

**Pros:**

- Scope matches usage; the app owns its own flourish
- The system's token set stays coherent and defensible
- Easy to revisit the day a real visualization palette is designed

**Cons:**

- A second app wanting a marker must re-decide or copy
- No central ruling on the dark-mode pairing

### Option 3: Raw hex inline

Write #FBDD79 where it is used.

**Pros:**

- Zero ceremony

**Cons:**

- No dark-mode hook at all
- Invisible to review; contradicts the token discipline used everywhere
  else in the app

## Decision

Option 2. It is easier to defend a token made especially for this app
than a colour added to the system without spending the time to design the
rest of a visualization palette. Light mode carries the raw brand hex
with dark text ink (a real marker never lightens the text); dark mode
rides the system's ghost-selected step, so the pairing follows the scheme
without inventing a new dark brand value.

```css
:root {
  --sf-color-bg-marker: #fbdd79;
  --sf-color-text-on-marker: var(--eds-color-text-neutral-strong);
}
:root[data-color-scheme='dark'] {
  --sf-color-bg-marker: var(--eds-color-bg-accent-fill-ghost-selected);
  --sf-color-text-on-marker: var(--eds-color-text-accent-strong);
}
```

### Consequences

- Good, because the system's token set carries no undesigned
  visualization colours, and the `--sf-` prefix makes ownership legible
  in the DOM
- Good, because this record plus the token package's DECISIONS entry is
  the starting brief if a visualization palette is ever designed properly
- Bad, because a second application wanting a marker starts from a copy,
  not a shared token

### Confirmation

Measured, not asserted: ink on marker Lc 84.9 in light mode (apca-w3),
above the scanned floor of 60. App tokens are outside the token package's
harness, so the pairing is covered by the Storefront's own accessibility
sweep instead.

## Related

- the project notebook, entry "bg-marker: minted, then
  returned to the app (2026-09-06)"
