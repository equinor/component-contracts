# @equinor/eds-tokens

The token build: DTCG sources under `tokens/`, formulas under `src/`,
generated CSS and the Figma variable payload under `build/`. Line-height
curves, optical padding, x-height-corrected header sizes and stem-matched
weights are all derived, never typed — see `documentation/adr/` at the
repo root for the decisions, and `docs/optical-padding.md` for the
recipe (generated, like the `optical-padding` skill).

```sh
pnpm --filter @equinor/eds-tokens build
pnpm --filter @equinor/eds-tokens test
pnpm --filter @equinor/eds-tokens a11y
```
