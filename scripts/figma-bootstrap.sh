#!/usr/bin/env bash
# Build the whole design system into a Figma file with design-bridge:
# all variables (3 parts), then every component, dependencies first.
#
#   bash scripts/figma-bootstrap.sh <figma-file-key>
#
# Every script is the emitted artifact, piped from disk byte-for-byte.
# One checkpoint (a named Figma version) is saved before the first step;
# the run stops at the first failure.
set -uo pipefail
KEY="${1:?usage: bash scripts/figma-bootstrap.sh <figma-file-key>}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VARS="$ROOT/packages/eds-tokens/build/figma"
COMP="$ROOT/packages/eds-contracts/build"

STEPS=(
  "$VARS/variables.figma-build.1of3.js"
  "$VARS/variables.figma-build.2of3.js"
  "$VARS/variables.figma-build.3of3.js"
)
# standalone components first, then the ones that instance others
for c in button card checkbox chip divider input label menu-item radio \
         side-bar-item side-bar-sub-item switch tab table tooltip \
         banner menu side-bar top-bar text-field; do
  STEPS+=("$COMP/$c.figma-build.js")
done

start=$(date +%s)
first=1
for f in "${STEPS[@]}"; do
  name="$(basename "$f" .js)"
  t0=$(date +%s)
  if [ $first -eq 1 ]; then
    out=$(design-bridge eval --file "$KEY" --checkpoint 'before bootstrap' --select result - < "$f" 2>&1)
    first=0
  else
    out=$(design-bridge eval --file "$KEY" --select result - < "$f" 2>&1)
  fi
  rc=$?
  t1=$(date +%s)
  if [ $rc -ne 0 ]; then
    printf '%-40s FAILED after %ss\n%s\n' "$name" "$((t1 - t0))" "$out"
    exit $rc
  fi
  summary=$(printf '%s' "$out" | grep -v '^hint:' | tr -d '\n' | cut -c1-140)
  printf '%-40s %3ss  %s\n' "$name" "$((t1 - t0))" "$summary"
done
printf '\nAll %d steps done in %ss.\n' "${#STEPS[@]}" "$(( $(date +%s) - start ))"
