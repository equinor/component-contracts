# eds-tokens

Algorithmic design tokens for EDS. Two runtime axes — `density` and `color-scheme` — with the
typographic algorithms shipped as CSS formulas rather than baked values.

Start with [DECISIONS.md](./DECISIONS.md) — four open choices, with recommendations.
See [PLAN.md](./PLAN.md) for rationale and architecture, and [REVIEW.md](./REVIEW.md) for
the full findings.

## Usage

```bash
npm install
npm run build          # emit tokens/ and build/css/
npm run test:parity    # headless Chrome, computed styles vs the legacy build
node test/formulas.check.ts   # Node-only: formulas + size-adjust derivation
```

Node 24+ required — the `.ts` sources run directly, so there is no build step.

Self-contained: no dependency on the EDS monorepo. The legacy build is pinned as a fixture
(`test/fixtures/legacy-oracle.css`) and the semantic palette mapping is vendored
(`src/semantic-mapping.json`).

## Layout

```
src/formulas.ts        the algorithms; everything derives from these
src/font-metrics.json  measured font metrics (no binaries — Equinor is licence-restricted)
src/build/             DTCG and CSS emitters
tokens/                generated DTCG + resolver
build/css/             generated CSS, formulas intact
test/                  parity harness and the documented deviation list
```

## What is verified

- Every committed `$value` equals what Chrome produces from the shipped expression.
- Generated CSS matches the legacy build for every density that has a counterpart.
- `size-adjust` is derived from measured x-height ratios, not transcribed.

Differences from the legacy build are enumerated in `test/deviations.ts`. Anything not listed
there fails the harness — silence is never a pass.
