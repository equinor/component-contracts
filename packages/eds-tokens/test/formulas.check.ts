/** Do the ported formulas reproduce the shipped values? Pure Node, no browser. */
import {
  DENSITIES,
  SIZES,
  fontSizeRem,
  lineHeightPx,
  remToPx,
} from '../src/formulas.ts'
import { ORACLE_LINE_HEIGHT, readOracle, toPx } from './oracle.ts'
import { DEVIATIONS, findDeviation } from './deviations.ts'

const oracle = readOracle()
let checked = 0
const failures: string[] = []
const expected: string[] = []

for (const [density, base] of Object.entries(DENSITIES)) {
  const props = oracle.get(density)
  if (!props) {
    console.log(`  ${density.padEnd(12)} no oracle counterpart — formula-only`)
    continue
  }
  for (const size of SIZES) {
    const fsRem = fontSizeRem(base, size)
    const fsPx = remToPx(fsRem)

    const cases: [string, number][] = [
      [`--eds-typography-ui-body-${size}-font-size`, fsPx],
      [
        `--eds-typography-ui-body-${size}-line-height-default`,
        lineHeightPx(fsPx, size, 'default'),
      ],
      [
        `--eds-typography-ui-body-${size}-line-height-${ORACLE_LINE_HEIGHT.compressed}`,
        lineHeightPx(fsPx, size, 'compressed'),
      ],
    ]

    for (const [prop, ours] of cases) {
      const raw = props.get(prop)
      if (raw === undefined) continue
      const theirs = toPx(raw)
      if (theirs === null) continue
      checked++
      // oracle rem values are printed to 3dp, so allow half a rounded unit
      if (Math.abs(ours - theirs) > 0.01) {
        const known = findDeviation(density, prop)
        if (known && known.ours === ours && known.oracle === theirs) {
          expected.push(
            `${density} ${prop}  ours=${ours} oracle=${theirs}` +
              (known.resolved ? '' : '   [UNRESOLVED]'),
          )
          continue
        }
        failures.push(
          `${density} ${prop}\n    ours=${ours}px  oracle=${theirs}px (${raw})`,
        )
      }
    }
  }
}

console.log(`\nchecked ${checked} values`)
console.log(`  ${checked - expected.length - failures.length} exact matches`)
console.log(`  ${expected.length} known deviations`)
console.log(`  ${failures.length} unexplained\n`)
for (const e of expected) console.log(`  known: ${e}`)
const unresolved = DEVIATIONS.filter((d) => !d.resolved).length
if (unresolved)
  console.log(`\n${unresolved} deviation(s) awaiting a decision — see PLAN.md`)
if (failures.length) {
  console.log('\n' + failures.join('\n'))
  process.exit(1)
}
console.log(
  expected.length
    ? '\nPASS — every difference from the oracle is accounted for.'
    : '\nPASS — formulas reproduce the oracle exactly.',
)

// --- x-height correction: derived and baked, never transcribed --------------------
// This is the check that would have caught the shipped 105.9% error. It now asserts
// two things: that no size-adjust is emitted, and that header font sizes carry the
// correction instead. See DECISIONS.md 5.
import metricsJson from '../src/font-metrics.json' with { type: 'json' }
import {
  DENSITIES as DENS,
  headerFontSizeRem,
  remToPx as toPx2,
  xHeightCorrection,
} from '../src/formulas.ts'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const faces = readFileSync(
  fileURLToPath(new URL('../build/css/font-faces.css', import.meta.url)),
  'utf8',
)
const typo = readFileSync(
  fileURLToPath(new URL('../build/css/typography.css', import.meta.url)),
  'utf8',
)

const xFailures: string[] = []
console.log('\nx-height correction')

// 1. no size-adjust DECLARATION anywhere (comments are fine)
const declared = faces.split('\n').filter((l) => /^\s*size-adjust\s*:/.test(l))
if (declared.length) {
  xFailures.push(
    `size-adjust is still declared:\n    ${declared.join('\n    ')}`,
  )
} else {
  console.log(
    '  no size-adjust declared — correction is baked, not delivered via @font-face  ok',
  )
}

// 2. header font sizes carry the correction, derived from measured metrics
const correction = xHeightCorrection(
  metricsJson.fonts.Inter.xRatio,
  metricsJson.fonts.Equinor.xRatio,
)
console.log(
  `  correction xRatio(Inter) / xRatio(Equinor) = ` +
    `${metricsJson.fonts.Inter.xRatio} / ${metricsJson.fonts.Equinor.xRatio} = ${correction}`,
)

let headerChecked = 0
for (const [density, base] of Object.entries(DENS)) {
  for (const size of SIZES) {
    const want = toPx2(headerFontSizeRem(base, size, correction))
    const m = typo.match(
      new RegExp(
        `\\[data-density='${density}'\\][^}]*?--eds-typography-header-${size}-font-size:\\s*([\\d.]+)rem`,
        's',
      ),
    )
    const found = m ? parseFloat(m[1]) * 16 : null
    headerChecked++
    if (found === null || Math.abs(found - want) > 0.001) {
      xFailures.push(
        `${density} header-${size}: emitted ${found}px, derived ${want}px`,
      )
    }
  }
}
console.log(
  `  ${headerChecked - xFailures.filter((f) => f.includes('header-')).length}/${headerChecked} header sizes match the derivation  ok`,
)

if (xFailures.length) {
  console.log('\nFAIL\n  ' + xFailures.join('\n  ') + '\n')
  process.exit(1)
}
console.log(
  '\nThe 105.9% class of error is now unrepresentable: the correction is computed from',
)
console.log(
  'measured metrics and baked into a token, not transcribed into a font descriptor.\n',
)
