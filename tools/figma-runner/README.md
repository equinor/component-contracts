# EDS Contract Runner (Figma development plugin)

Runs emitter-generated builder scripts in the open Figma file, byte for
byte, with no size ceiling and no model typing them out. Use it for the
variables bootstrap (`variables.figma-build.1of3.js` …), single
component builders (`card.figma-build.js`) and builder parts
(`pill.1of5.js` …).

Install once (Figma desktop app): Plugins → Development → Import plugin
from manifest… → choose this folder's `manifest.json`.

Run: open the target file → Plugins → Development → EDS Contract Runner
→ choose the files → Run. Files run in name order and stop at the first
error; each result shows the builder's manifest (variants built against
expected).
