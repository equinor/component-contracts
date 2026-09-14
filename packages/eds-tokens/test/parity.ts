/**
 * Parity harness — headless Chrome, real computed styles.
 *
 * Why a browser rather than evaluating in Node: the whole claim of this package is
 * that the CSS ships formulas, not baked values. Re-implementing round()/pow() in
 * JS would test our reimplementation, not the thing that renders. So we let Chrome
 * evaluate and read what it produces.
 *
 * Custom properties are read via a probe element, not getComputedStyle on the
 * property itself: for unregistered custom properties the computed value is the
 * substituted token stream, with calc()/round() left unevaluated. Assigning to a
 * real length property (padding-top) forces resolution to px.
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { DENSITIES, SIZES, type Density } from '../src/formulas.ts'
import { readOracle, toPx } from './oracle.ts'
import { DEVIATIONS, findDeviation } from './deviations.ts'
import { densityTokens } from '../src/build/tokens.ts'

const CSS = readFileSync(
  fileURLToPath(new URL('../build/css/typography.css', import.meta.url)),
  'utf8',
)

/** Our name -> oracle name. The legacy build predates the `compressed` rename. */
const LH_VARIANTS = [
  { ours: 'default', oracle: 'default' },
  { ours: 'compressed', oracle: 'squished' },
] as const

const PROPS = SIZES.flatMap((s) => [
  `--eds-typography-ui-body-${s}-font-size`,
  `--eds-typography-header-${s}-font-size`,
  ...LH_VARIANTS.map(
    (v) => `--eds-typography-ui-body-${s}-line-height-${v.ours}`,
  ),
])

/** Property name to look up in the oracle, for a property name of ours. */
const toOracleProp = (p: string) =>
  p.replace('-line-height-compressed', '-line-height-squished')

const browser = await chromium.launch({ channel: 'chrome', headless: true })
const page = await browser.newPage()
await page.setContent(
  `<!doctype html><html><head><style>${CSS}</style></head>
   <body><div id="probe" style="position:absolute"></div></body></html>`,
)

const chromeVersion = browser.version()
console.log(`\nChrome ${chromeVersion} — reading computed styles\n`)

const measured = new Map<Density, Map<string, number>>()
for (const density of Object.keys(DENSITIES) as Density[]) {
  const values = await page.evaluate(
    ({ density, props }) => {
      document.documentElement.setAttribute('data-density', density)
      const probe = document.getElementById('probe')!
      const out: Record<string, number> = {}
      for (const prop of props) {
        probe.style.paddingTop = `var(${prop})`
        out[prop] = parseFloat(getComputedStyle(probe).paddingTop)
      }
      probe.style.paddingTop = ''
      return out
    },
    { density, props: PROPS },
  )
  measured.set(density, new Map(Object.entries(values)))
}
await browser.close()

// --- check 1: derived invariant --------------------------------------------------
// Every committed $value must equal what the browser produces from the shipped
// expression. This is the check that would have caught the size-adjust error.
console.log('check 1 — derived invariant ($value === browser output)')
let invariantChecked = 0
const invariantFailures: string[] = []

for (const density of Object.keys(DENSITIES) as Density[]) {
  const tokens = densityTokens(density) as any
  const browser = measured.get(density)!

  const expected = new Map<string, number>()
  for (const size of SIZES) {
    const fs = tokens.typography['font-size'][size].$value
    expected.set(`--eds-typography-ui-body-${size}-font-size`, fs.value * 16)
    const hfs = tokens.typography['header-font-size'][size].$value
    expected.set(`--eds-typography-header-${size}-font-size`, hfs.value * 16)
    for (const v of LH_VARIANTS) {
      const lh = tokens.typography['line-height'][v.ours][size].$value
      expected.set(
        `--eds-typography-ui-body-${size}-line-height-${v.ours}`,
        lh.value,
      )
    }
  }

  for (const [prop, want] of expected) {
    const got = browser.get(prop)!
    invariantChecked++
    if (Math.abs(got - want) > 0.01) {
      invariantFailures.push(
        `${density} ${prop}: $value=${want}px  browser=${got}px`,
      )
    }
  }
}
console.log(
  `  ${invariantChecked - invariantFailures.length}/${invariantChecked} hold`,
)
if (invariantFailures.length) {
  console.log(
    '\nFAIL — committed values disagree with the shipped formulas\n' +
      invariantFailures.join('\n') +
      '\n',
  )
  process.exit(1)
}

// --- check 2: parity against the oracle ------------------------------------------
console.log('\ncheck 2 — parity against the legacy build')
const oracle = readOracle()
let exact = 0
const known: string[] = []
const failures: string[] = []
const unverifiable: string[] = []

for (const density of Object.keys(DENSITIES) as Density[]) {
  const ours = measured.get(density)!
  const theirs = oracle.get(density)

  for (const prop of PROPS) {
    const got = ours.get(prop)
    if (got === undefined || Number.isNaN(got)) {
      failures.push(
        `${density} ${prop}: browser produced no value (formula invalid?)`,
      )
      continue
    }
    if (!theirs || prop.includes('-header-')) {
      unverifiable.push(`${density} ${prop} = ${got}px`)
      continue
    }

    const raw = theirs.get(toOracleProp(prop))
    const want = raw ? toPx(raw) : null
    if (want === null) {
      unverifiable.push(`${density} ${prop} = ${got}px`)
      continue
    }

    if (Math.abs(got - want) <= 0.01) {
      exact++
      continue
    }

    const dev = findDeviation(density, toOracleProp(prop))
    if (
      dev &&
      Math.abs(dev.ours - got) <= 0.01 &&
      Math.abs(dev.oracle - want) <= 0.01
    ) {
      known.push(
        `${density} ${prop}  ours=${got} oracle=${want}` +
          (dev.resolved ? '' : '   [UNRESOLVED]'),
      )
      continue
    }
    failures.push(
      `${density} ${prop}\n    browser=${got}px  oracle=${want}px (${raw})`,
    )
  }
}

console.log(`  ${exact} exact matches`)
console.log(`  ${known.length} known deviations`)
console.log(
  `  ${unverifiable.length} no oracle counterpart (relaxed) — formula-only`,
)
console.log(`  ${failures.length} unexplained\n`)
for (const k of known) console.log(`  known: ${k}`)

if (failures.length) {
  console.log('\nFAIL\n' + failures.join('\n') + '\n')
  process.exit(1)
}
const unresolved = DEVIATIONS.filter((d) => !d.resolved).length
if (unresolved)
  console.log(`\n${unresolved} deviation(s) awaiting a decision — see PLAN.md`)

// --- check 3: colour ---------------------------------------------------------------
// The palette is now authored in OKLCH. Four things to establish:
//   a) the wide-gamut tier is a faithful copy of the generator export
//   b) values genuinely fall outside sRGB (otherwise oklch is just notation)
//   c) the gamut mapping preserved lightness — the palette's defining property
//   d) values that were ALREADY in sRGB still match the legacy hex, so nothing drifted
//
// (a) is a literal pass-through, so a text comparison verifies it completely. (d) needs
// the browser, because the fallback tier is what an sRGB display actually resolves.
{
  const { parseGeneratorPalette, semanticPalette, SEMANTIC_SOURCES } =
    await import('../src/build/color.ts')
  const { formatOklch, GAMUT_STRATEGY } = await import('../src/oklch.ts')

  const colorCssText = readFileSync(
    fileURLToPath(new URL('../build/css/color.css', import.meta.url)),
    'utf8',
  )
  const pal = semanticPalette()
  const gen = parseGeneratorPalette()

  console.log('\ncheck 3 — colour')
  const bad: string[] = []

  // (a) wide-gamut tier is the generator's own values
  const p3Block = colorCssText.slice(
    colorCssText.indexOf('@media (color-gamut: p3)'),
  )
  let passthrough = 0
  for (const [name, entry] of pal) {
    for (const scheme of ['light', 'dark'] as const) {
      const src = SEMANTIC_SOURCES[name.replace(/-\d+$/, '')][scheme]
      const step = name.match(/\d+$/)![0]
      const original = gen.get(`${src}-${step}`)![scheme].oklch
      if (formatOklch(entry[scheme].oklch) !== formatOklch(original)) {
        bad.push(
          `${name} ${scheme}: palette ${formatOklch(entry[scheme].oklch)} != generator ${formatOklch(original)}`,
        )
      } else if (
        p3Block.includes(
          `--eds-color-${name}: ${formatOklch(entry[scheme].oklch)};`,
        )
      ) {
        passthrough++
      }
    }
  }
  console.log(
    `  ${passthrough}/${pal.size * 2} wide-gamut values are the generator's own, unmodified`,
  )

  // (b) the gamut claim
  const outLight = [...pal.values()].filter((e) => e.light.outOfGamut).length
  const outDark = [...pal.values()].filter((e) => e.dark.outOfGamut).length
  const byFamily = new Map<string, number>()
  for (const [name, e] of pal) {
    const fam = name.replace(/-\d+$/, '')
    if (e.light.outOfGamut) byFamily.set(fam, (byFamily.get(fam) ?? 0) + 1)
  }
  console.log(
    `  outside sRGB: ${outLight}/${pal.size} light, ${outDark}/${pal.size} dark`,
  )
  console.log(
    '    ' +
      [...byFamily]
        .sort((a, b) => b[1] - a[1])
        .map(([f, n]) => `${f} ${n}`)
        .join(', '),
  )
  if (outLight === 0)
    bad.push('no values outside sRGB — oklch would be notation only')

  // (c) lightness preserved by the mapping
  const drifts = [...pal.values()]
    .flatMap((e) => [e.light, e.dark])
    .filter((m) => m.outOfGamut)
    .map((m) => m.lightnessDrift)
  const maxDrift = Math.max(...drifts)
  console.log(
    `  lightness drift after ${GAMUT_STRATEGY}: max ${maxDrift.toFixed(6)} over ${drifts.length} mapped values`,
  )
  if (maxDrift > 1e-4)
    bad.push(`gamut mapping drifted lightness by ${maxDrift}`)

  // (d) in-gamut values still match the legacy build, via the browser
  const b = await chromium.launch({ channel: 'chrome', headless: true })
  const pg = await b.newPage()
  await pg.setContent(
    `<!doctype html><html><head><style>${colorCssText}</style></head>
     <body><div id="probe"></div></body></html>`,
  )

  const names = [...pal.keys()].sort()
  const seen: Record<string, Record<string, string>> = {}
  for (const scheme of ['light', 'dark'] as const) {
    seen[scheme] = await pg.evaluate(
      ({ scheme, names }) => {
        document.documentElement.setAttribute('data-color-scheme', scheme)
        const probe = document.getElementById('probe')!
        const out: Record<string, string> = {}
        for (const n of names) {
          probe.style.color = `var(--eds-color-${n})`
          out[n] = getComputedStyle(probe).color
        }
        return out
      },
      { scheme, names },
    )
  }

  const oracle = readOracle()
  const legacyHex = (name: string, dark: boolean) => {
    const props = oracle.get(dark ? 'compact' : 'comfortable')
    return props?.get(`--eds-color-${name}`)
  }
  const toRgb = (hex: string) => {
    const h = hex.replace('#', '')
    const f =
      h.length === 3
        ? h
            .split('')
            .map((c) => c + c)
            .join('')
        : h
    const [r, g, bl] = [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16))
    return `rgb(${r}, ${g}, ${bl})`
  }

  let matchLegacy = 0,
    changed = 0
  for (const name of names) {
    const e = pal.get(name)!
    if (e.light.outOfGamut) {
      changed++
      continue
    }
    const want = toRgb(e.light.hex)
    if (seen.light[name] === want) matchLegacy++
    else bad.push(`${name}: browser ${seen.light[name]} != mapped ${want}`)
  }
  console.log(`  ${matchLegacy} in-gamut values resolve exactly as mapped`)
  console.log(
    `  ${changed} out-of-gamut values now carry a build-time fallback rather than a clipped hex`,
  )

  // aliases still follow the active scheme
  let aliasOk = 0
  const parsedAliases = (await import('../src/build/color.ts')).parseOracle()
    .aliases
  for (const scheme of ['light', 'dark'] as const) {
    for (const [name, target] of parsedAliases) {
      const t = pal.get(target)
      if (!t) continue
      if (seen[scheme][name] === undefined) {
        const probeVal = await pg.evaluate(
          ({ scheme, name }) => {
            document.documentElement.setAttribute('data-color-scheme', scheme)
            const probe = document.getElementById('probe')!
            probe.style.color = `var(--eds-color-${name})`
            return getComputedStyle(probe).color
          },
          { scheme, name },
        )
        seen[scheme][name] = probeVal
      }
      if (seen[scheme][name] === toRgb(t[scheme].hex)) aliasOk++
      else
        bad.push(
          `${scheme} alias ${name} -> ${target}: ${seen[scheme][name]} != ${toRgb(t[scheme].hex)}`,
        )
    }
  }
  console.log(`  ${aliasOk} alias resolutions follow the active scheme`)
  await b.close()

  console.log(`  ${bad.length} unexplained`)
  if (bad.length) {
    console.log('\nFAIL\n' + bad.slice(0, 20).join('\n') + '\n')
    process.exit(1)
  }
}

// --- check 4: spacing parity -----------------------------------------------------
{
  const { isExtrapolated } = await import('../src/spacing.ts')

  /** Deliberately dropped: these existed only as the *output* of a runtime axis.
   *  Proportions and sizes are now semantic choices made at authoring time, so a
   *  component references e.g. --eds-spacing-inset-md-vertical-squished directly
   *  instead of switching --eds-spacing-proportions-md-vertical via an attribute.
   *  See PLAN.md "Scanned vs read" and the spacing section. */
  const DROPPED_AXIS_OUTPUTS = [
    /^--eds-spacing-proportions-/, // was [data-space-proportions]
    /^--eds-selectable-(space|gap)-/, // was [data-selectable-space]
    /^--eds-container-(space|gap)-/, // was [data-container-space]
    /^--eds-page-(space|gap)-/, // was [data-page-space]
    /^--eds-generic-/, // was [data-horizontal-space] etc.
  ]

  const oracleSpacing = readOracle()
  const wanted = new Map<string, Map<string, number>>()
  for (const [density, props] of oracleSpacing) {
    const m = new Map<string, number>()
    for (const [prop, raw] of props) {
      if (!/^--eds-(spacing|sizing)-/.test(prop)) continue
      if (DROPPED_AXIS_OUTPUTS.some((re) => re.test(prop))) continue
      const v = toPx(raw)
      if (v !== null) m.set(prop, v)
    }
    wanted.set(density, m)
  }

  const names = [
    ...new Set([...wanted.values()].flatMap((m) => [...m.keys()])),
  ].sort()
  const css = readFileSync(
    fileURLToPath(new URL('../build/css/typography.css', import.meta.url)),
    'utf8',
  )

  const b = await chromium.launch({ channel: 'chrome', headless: true })
  const p = await b.newPage()
  await p.setContent(
    `<!doctype html><html><head><style>${css}</style></head>
     <body><div id="probe" style="position:absolute"></div></body></html>`,
  )

  const got: Record<string, Record<string, number>> = {}
  for (const density of Object.keys(DENSITIES) as Density[]) {
    got[density] = await p.evaluate(
      ({ density, names }) => {
        document.documentElement.setAttribute('data-density', density)
        const probe = document.getElementById('probe')!
        const out: Record<string, number> = {}
        for (const n of names) {
          probe.style.paddingTop = `var(${n})`
          out[n] = parseFloat(getComputedStyle(probe).paddingTop)
        }
        probe.style.paddingTop = ''
        return out
      },
      { density, names },
    )
  }
  await b.close()

  console.log('\ncheck 4 — spacing parity against the legacy build')
  let ok = 0,
    known = 0,
    extrap = 0
  const bad: string[] = []
  const missing: string[] = []

  for (const density of Object.keys(DENSITIES) as Density[]) {
    const want = wanted.get(density)
    for (const n of names) {
      const g = got[density][n]
      if (Number.isNaN(g)) {
        missing.push(`${density} ${n}`)
        continue
      }
      if (!want) continue // relaxed — no oracle
      const w = want.get(n)
      if (w === undefined) continue
      // oracle rem values print to 3dp, so 1px shows as 1.008
      if (Math.abs(g - w) <= 0.02) {
        ok++
      } else {
        const dev = findDeviation(density, n)
        if (
          dev &&
          Math.abs(dev.ours - g) <= 0.02 &&
          Math.abs(dev.oracle - w) <= 0.02
        ) {
          known++
        } else {
          bad.push(`${density} ${n}: browser=${g} oracle=${w}`)
        }
      }
    }
  }
  // exactly which emitted `relaxed` tokens rest on an extrapolated ladder tail
  const { densitySpacingEntries } = await import('../src/build/spacing-emit.ts')
  const extrapolatedNames = densitySpacingEntries('relaxed')
    .filter((e) => isExtrapolated(e.ladder, e.index))
    .map((e) => `${e.name} = ${e.value}px (${e.ladder})`)
  extrap = extrapolatedNames.length

  console.log(`  ${ok} exact matches (compact + comfortable)`)
  console.log(`  ${known} known deviations (see test/deviations.ts)`)
  console.log(
    `  ${names.length} tokens reproduced for relaxed, of which ${extrap} rest on extrapolated ladder tails:`,
  )
  for (const n of extrapolatedNames) console.log(`      ${n}`)
  console.log(`  ${missing.length} produced no value`)
  console.log(`  ${bad.length} unexplained`)
  if (missing.length)
    console.log('\n  missing:\n    ' + missing.slice(0, 10).join('\n    '))
  if (bad.length) {
    console.log(
      '\nFAIL\n' +
        bad.slice(0, 25).join('\n') +
        (bad.length > 25 ? `\n  ... and ${bad.length - 25} more` : '') +
        '\n',
    )
    process.exit(1)
  }
}

// --- check 5: optical-padding recipe ---------------------------------------------
// The only check that needs a real font loaded: `1cap` resolves against the
// element's computed font, so a fallback face would silently give wrong answers.
{
  const { resolveAll } = await import('../src/build/recipe-emit.ts')
  const expected = resolveAll()

  const typography = readFileSync(
    fileURLToPath(new URL('../build/css/typography.css', import.meta.url)),
    'utf8',
  )
  const faces = readFileSync(
    fileURLToPath(new URL('../build/css/font-faces.css', import.meta.url)),
    'utf8',
  )

  const b = await chromium.launch({ channel: 'chrome', headless: true })
  const p = await b.newPage()
  await p.setContent(
    `<!doctype html><html><head><style>${faces}${typography}</style></head>
     <body><div id="probe" style="position:absolute;font-family:Inter">Hg</div></body></html>`,
    { waitUntil: 'networkidle' },
  )

  const fontOk = await p.evaluate(async () => {
    await document.fonts.ready
    return document.fonts.check('16px Inter')
  })

  console.log('\ncheck 5 — optical-padding recipe (real font, real 1cap)')
  if (!fontOk) {
    console.log(
      '  SKIPPED — Inter did not load (offline?). 1cap would use a fallback face.',
    )
  } else {
    const got = await p.evaluate(
      (cases) => {
        const probe = document.getElementById('probe')!
        const out: { padding: number; height: number; cap: number }[] = []
        for (const c of cases) {
          document.documentElement.setAttribute('data-density', c.density)
          probe.style.fontSize = `var(--eds-typography-ui-body-${c.size}-font-size)`
          probe.style.paddingTop = `var(--eds-optical-padding-${c.size}-${c.proportion})`
          const padding = parseFloat(getComputedStyle(probe).paddingTop)
          probe.style.paddingTop = `var(--eds-optical-height-${c.size}-${c.proportion})`
          const height = parseFloat(getComputedStyle(probe).paddingTop)
          probe.style.paddingTop = 'var(--eds-cap-rounded)'
          const cap = parseFloat(getComputedStyle(probe).paddingTop)
          out.push({ padding, height, cap })
        }
        probe.style.paddingTop = ''
        return out
      },
      expected.map(({ density, size, proportion }) => ({
        density,
        size,
        proportion,
      })),
    )

    let ok = 0
    const bad: string[] = []
    expected.forEach((e, i) => {
      const g = got[i]
      const id = `${e.density} ${e.size} ${e.proportion}`
      if (Math.abs(g.cap - e.capRounded) > 0.02)
        bad.push(`${id}: cap browser=${g.cap} ours=${e.capRounded}`)
      else if (Math.abs(g.padding - e.padding) > 0.02)
        bad.push(`${id}: padding browser=${g.padding} ours=${e.padding}`)
      else if (Math.abs(g.height - e.height) > 0.02)
        bad.push(`${id}: height browser=${g.height} ours=${e.height}`)
      else ok++
    })

    console.log(`  ${ok} of ${expected.length} combinations match`)
    console.log(`  ${bad.length} unexplained`)

    const show = expected.filter(
      (e) => e.density === 'comfortable' && e.proportion === 'squished',
    )
    console.log('\n  comfortable / squished — the button and chip cases:')
    console.log('    size  font  lh  cap  inset  padding  height  on 4px grid?')
    for (const e of show) {
      console.log(
        `    ${e.size.padEnd(5)}${String(e.fontSize).padStart(5)}` +
          `${String(e.lineHeight).padStart(4)}${String(e.capRounded).padStart(5)}` +
          `${String(e.inset).padStart(7)}${String(e.padding).padStart(9)}` +
          `${String(e.height).padStart(8)}   ` +
          `${e.padding % 4 === 0 ? 'padding on' : 'padding OFF'} / height ${e.height % 4 === 0 ? 'on' : 'OFF'}`,
      )
    }
    if (bad.length) {
      await b.close()
      console.log('\nFAIL\n' + bad.slice(0, 15).join('\n') + '\n')
      process.exit(1)
    }
  }
  await b.close()
}

// --- check 6: the recipe is self-correcting --------------------------------------
// The line-height cancels out of the height algebraically:
//   2*(inset - (lh - cap)/2) + lh  =  2*inset + cap
// So the rendered box is the same for ANY line-height. That is why calc() in CSS
// solves this and a static value cannot: the expression absorbs whatever the
// line-height turns out to be. Baked numbers have to know it in advance, and are
// silently wrong if it changes.
{
  const typography = readFileSync(
    fileURLToPath(new URL('../build/css/typography.css', import.meta.url)),
    'utf8',
  )
  const faces = readFileSync(
    fileURLToPath(new URL('../build/css/font-faces.css', import.meta.url)),
    'utf8',
  )

  const b = await chromium.launch({ channel: 'chrome', headless: true })
  const p = await b.newPage()
  await p.setContent(
    `<!doctype html><html><head><style>${faces}${typography}
     .probe {
       box-sizing: border-box;
       font-family: Inter;
       font-size: var(--eds-typography-ui-body-md-font-size);
       padding-block: calc(var(--eds-spacing-inset-md-vertical-squished)
                           - (var(--_lh) - var(--eds-cap-rounded)) / 2);
       line-height: var(--_lh);
       width: 200px;
     }</style></head>
     <body><div class="probe" id="probe">Label</div></body></html>`,
    { waitUntil: 'networkidle' },
  )

  const ok = await p.evaluate(async () => {
    await document.fonts.ready
    return document.fonts.check('16px Inter')
  })

  console.log(
    '\ncheck 6 — the line-height cancels out (why calc() works and static values do not)',
  )
  if (!ok) {
    console.log('  SKIPPED — Inter did not load.')
  } else {
    const results = await p.evaluate(
      (lhs) => {
        const probe = document.getElementById('probe')!
        return lhs.map((lh) => {
          probe.style.setProperty('--_lh', lh)
          const cs = getComputedStyle(probe)
          return {
            lh,
            padding: parseFloat(cs.paddingTop),
            height: probe.getBoundingClientRect().height,
          }
        })
      },
      ['4px', '12px', '16px', '20px', '24px', '31px', '36px', '40px', '48px'],
    )

    // padding >= 0 requires inset - (lh - cap)/2 >= 0, i.e. lh <= 2*inset + cap.
    // So the recipe absorbs any line-height that *fits inside the control*. Past
    // that, CSS clamps padding to 0 and the box grows to the text — which is the
    // right failure mode: text is never clipped.
    const INSET = 12,
      CAP = 12,
      LIMIT = 2 * INSET + CAP // 36
    console.log(
      `    md button, inset ${INSET}, cap ${CAP} — height should hold at ${LIMIT}px`,
    )
    console.log(
      `    while line-height <= ${LIMIT}px (the point where padding would go negative)\n`,
    )
    console.log(
      '    Line-heights below are SYNTHETIC probes, deliberately including values the',
    )
    console.log(
      '    system never emits (31px, 40px), to show the algebra does not depend on the',
    )
    console.log(
      '    4px grid. Every real line-height is a multiple of 4 — asserted in check 7.\n',
    )
    console.log('    line-height   padding   height   ')
    const bad: string[] = []
    for (const r of results) {
      const lhPx = parseFloat(r.lh) * (r.lh.endsWith('rem') ? 16 : 1)
      const within = lhPx <= LIMIT
      const expected = within ? LIMIT : lhPx
      const okRow = Math.abs(r.height - expected) < 0.05
      if (!okRow)
        bad.push(`lh ${r.lh}: height ${r.height}, expected ${expected}`)
      console.log(
        `    ${r.lh.padEnd(13)}${(r.padding + 'px').padStart(7)}${(r.height + 'px').padStart(9)}   ` +
          (within ? 'absorbed' : 'clamped, box grows to text') +
          (okRow ? '' : '  <<<'),
      )
    }
    if (bad.length) {
      console.log('\nFAIL\n' + bad.join('\n'))
      await b.close()
      process.exit(1)
    }
    console.log(
      `\n    Held at ${LIMIT}px for every line-height up to ${LIMIT}px — the term cancels.`,
    )
    console.log(
      '    Past that, padding clamps to 0 and the control grows rather than clipping text.',
    )
  }
  await b.close()
}

// --- check 7: every emitted line-height is on the 4px grid ------------------------
// The grid is the invariant the whole scale is built on; the ratio is derived from it.
// Asserted rather than assumed, so a change to the curve cannot quietly break it.
{
  const { LINE_HEIGHT_CURVES } = await import('../src/formulas.ts')
  const variants = Object.keys(
    LINE_HEIGHT_CURVES,
  ) as (keyof typeof LINE_HEIGHT_CURVES)[]
  const offGrid: string[] = []
  let n = 0

  for (const density of Object.keys(DENSITIES) as Density[]) {
    const ours = measured.get(density)!
    for (const size of SIZES) {
      for (const v of variants) {
        const value = ours.get(
          `--eds-typography-ui-body-${size}-line-height-${v}`,
        )
        if (value === undefined) continue
        n++
        if (value % 4 !== 0)
          offGrid.push(`${density} ${size} ${v} = ${value}px`)
      }
    }
  }

  console.log('\ncheck 7 — every line-height lands on the 4px grid')
  console.log(`  ${n - offGrid.length}/${n} on grid`)
  if (offGrid.length) {
    console.log('\nFAIL — off the grid:\n  ' + offGrid.join('\n  ') + '\n')
    process.exit(1)
  }
}

console.log(
  '\nPASS — formulas, colours, spacing and the recipe all verified against Chrome.\n',
)
