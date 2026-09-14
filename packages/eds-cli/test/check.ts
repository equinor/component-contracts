/** eds CLI harness — the three acceptance questions from packages/eds-cli/intent.md
 *  as real tests, in the spirit of packages/eds-contracts/test/check.ts: every
 *  expectation is recomputed from the sources the CLI claims to answer from
 *  (the contract JSON, the token files, apca-w3 itself) — never copied from
 *  the CLI's own output. Silence is never a pass.
 */
import { strict as assert } from 'node:assert'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
// @ts-ignore — apca-w3 ships no types; see src/apca-w3.d.ts
import { APCAcontrast, sRGBtoY } from 'apca-w3'

const root = fileURLToPath(new URL('../../..', import.meta.url))
const bin = fileURLToPath(new URL('../bin/eds.js', import.meta.url))

let checks = 0
const ok = (cond: boolean, msg: string) => {
  assert.ok(cond, msg)
  checks++
}

/** Run the real CLI surface — the bin, not the internals. */
function eds(...args: string[]): { out: string; code: number } {
  const r = spawnSync(process.execPath, [bin, ...args], { encoding: 'utf8' })
  assert.equal(r.error, undefined, `spawn failed: ${r.error}`)
  return { out: r.stdout + r.stderr, code: r.status ?? -1 }
}

const has = (out: string, needle: string, msg: string) =>
  ok(out.includes(needle), `${msg}\n  missing: ${JSON.stringify(needle)}`)

// ---- acceptance 1: recall structured data — `eds component button` ----------------
{
  const contract = JSON.parse(
    readFileSync(root + 'packages/eds-contracts/contracts/button.contract.json', 'utf8'),
  )
  const { out, code } = eds('component', 'button')
  ok(code === 0, 'component button exits 0')
  has(out, contract.id, 'renders the contract id')
  has(out, `v${contract.version}`, 'renders the contract version')
  for (const p of contract.props) {
    has(out, p.name, `renders prop ${p.name}`)
    for (const v of p.type.enum ?? [])
      has(out, v, `renders enum value ${p.name}=${v}`)
  }
  // tones and variants are enum values — asserted above; states by name:
  has(out, 'state:', 'states are rendered as records')
  for (const s of contract.states) has(out, s.name, `renders state ${s.name}`)
  // data-* attributes per ADR-0006 (the code binding of every enum prop)
  has(out, 'data-tone', 'renders the tone data attribute')
  has(out, 'data-variant', 'renders the variant data attribute')
  // provenance: source path + version — never paraphrased from memory
  has(
    out,
    'packages/eds-contracts/contracts/button.contract.json',
    'names the contract as source',
  )
  // ledger vocabulary reused, not reinvented
  for (const d of ['CARRIED', 'LOWERED', 'RESOLVED', 'REFUSED'])
    has(out, d, `ledger verdict ${d} appears`)
}

// ---- acceptance 2: explain a decision — `eds explain brand` -----------------------
{
  const { out, code } = eds('explain', 'brand')
  ok(code === 0, 'explain brand exits 0')
  has(out, 'Energy Red', 'names Energy Red')
  has(out, 'energetic', 'branding reading: energetic')
  has(out, 'danger', 'interface reading: danger')
  ok(
    /refus\w*\s+Energy Red for primary actions/i.test(out),
    'states the refusal for primary actions',
  )
  has(out, 'Inter', 'answers why Inter')
  has(out, 'Equinor', 'names the Equinor typeface')
  has(out, 'APCA', 'covers APCA over WCAG 2.x')
  has(out, 'DRAFT', 'the page is marked DRAFT pending review')
  has(out, 'packages/eds-cli/principles/brand.md', 'names the doc as source')

  // routing: the designer's phrasing must land on the same page
  const routed = eds(
    'explain',
    'How',
    'does',
    'EDS',
    'use',
    'the',
    'Equinor',
    'brand',
    'guidelines?',
  )
  ok(routed.code === 0, 'natural question routes to a doc')
  has(routed.out, 'Energy Red', 'natural question reaches the brand doc')

  // and an unanswerable question is an honest absence, not an invention
  const absent = eds('explain', 'why is the sky blue')
  ok(absent.code !== 0, 'unanswerable explain exits non-zero')
  ok(
    /No principles doc answers/.test(absent.out),
    'unanswerable explain says so',
  )
  has(absent.out, 'brand', 'absence answer names what it CAN answer')
}

// ---- acceptance 3: compute a verdict — `eds contrast ghost-button` ----------------
// The expectation is recomputed here from the token files + apca-w3 directly,
// so a cached or hand-typed value in the CLI would fail the comparison.
{
  const tokenFile = (rel: string) =>
    JSON.parse(readFileSync(root + 'packages/eds-tokens/tokens/' + rel, 'utf8'))
  const flat = (files: any[]) => {
    const map = new Map<string, any>()
    const walk = (n: any, p: string[]) => {
      if (n === null || typeof n !== 'object') return
      if ('$value' in n) return void map.set(p.join('.'), n.$value)
      for (const [k, v] of Object.entries(n))
        if (!k.startsWith('$')) walk(v, [...p, k])
    }
    for (const f of files) walk(f, [])
    return map
  }
  const hexOf = (map: Map<string, any>, path: string): any => {
    let v = map.get(path)
    while (typeof v === 'string') v = map.get(v.slice(1, -1))
    assert.ok(v, `token ${path} resolves`)
    return v
  }
  const rgb = (hex: string): [number, number, number] => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ]

  // The pairing itself comes from the contract — if the button contract
  // changes its ghost inks, this test follows it, same as the CLI must.
  const contract = JSON.parse(
    readFileSync(root + 'packages/eds-contracts/contracts/button.contract.json', 'utf8'),
  )
  const tone = contract.props.find((p: any) => p.name === 'tone').default
  const ghost = (contract.variants ?? []).find(
    (v: any) => v.when.variant === 'ghost',
  )
  assert.ok(ghost, 'button contract still has a ghost variant')
  const bgPath = ghost.tokens['root/background-color']
    .slice(1, -1)
    .replaceAll('{tone}', tone)
  const label = contract.anatomy.root.inset.opticalLabel
  const textPath = contract.anatomy[label].tokens.color
    .slice(1, -1)
    .replaceAll('{tone}', tone)

  for (const scheme of ['light', 'dark'] as const) {
    const map = flat([
      tokenFile('semantic-color.tokens.json'),
      tokenFile(`color-scheme/${scheme}.tokens.json`),
    ])
    const bgVal = hexOf(map, bgPath)
    ok(
      (bgVal.alpha ?? 1) === 0,
      `ghost resting fill is transparent (${scheme})`,
    )
    const canvas = hexOf(map, 'color.semantic.bg-canvas').hex
    const text = hexOf(map, textPath).hex
    const expectedLc = APCAcontrast(sRGBtoY(rgb(text)), sRGBtoY(rgb(canvas)))

    const { out, code } = eds('contrast', 'ghost-button', '--scheme', scheme)
    ok(code === 0, `contrast ghost-button --scheme ${scheme} exits 0 (PASS)`)
    has(out, scheme, `names the ${scheme} scheme`)
    has(out, text, `resolves the ${scheme} text colour ${text}`)
    has(out, 'transparent', 'shows the transparent resting fill')
    has(out, canvas, `resolves the ${scheme} canvas backdrop ${canvas}`)
    has(out, expectedLc.toFixed(1), `Lc matches apca-w3 (${scheme})`)
    has(out, 'threshold', 'names the threshold the pairing must clear')
    ok(/Lc 60/.test(out), 'label text is held to the spot-readable target')
    has(out, 'PASS', `verdict is PASS (${scheme})`)
    has(
      out,
      'packages/eds-contracts/contracts/button.contract.json',
      'contrast names the contract as source',
    )
    has(
      out,
      `color-scheme/${scheme}.tokens.json`,
      'contrast names the scheme token file as source',
    )
    ok(
      Math.abs(expectedLc) >= 60,
      `recomputed Lc actually clears the threshold (${scheme})`,
    )
  }

  // icon-only variant: the measured ink is the contract's structure.iconOnly
  // part, not the label the variant removed (found by a fresh agent on the
  // well-insight desk, 2026-09-08)
  const gi = eds('contrast', 'ghost-icon-button')
  ok(gi.code === 0, 'contrast ghost-icon-button exits 0 (PASS)')
  has(gi.out, 'icon/color on root/background-color', 'icon-only measures the icon ink')
  has(gi.out, 'icon-accent', 'icon-only resolves the icon token, not the label token')
  ok(!gi.out.includes('text-accent-strong'), 'the removed label ink is not reported')
  has(gi.out, 'graphical object', 'icon ink is held to the graphical-object floor')

  // absence: a target the CLI cannot answer is named, not invented
  const absent = eds('contrast', 'toolbar')
  ok(absent.code !== 0, 'unknown contrast target exits non-zero')
  ok(/No contrast target/.test(absent.out), 'unknown target says so')
  has(absent.out, 'nearest', 'unknown target offers the nearest thing')
}

// ---- honest absence + search (behaviours that are the point) ----------------------
{
  const absent = eds('component', 'date-picker')
  ok(absent.code !== 0, 'component date-picker exits non-zero')
  ok(/No contract for 'date-picker'/.test(absent.out), 'absence is explicit')
  has(absent.out, 'nearest', 'absence names the nearest thing')
  has(absent.out, 'button, banner, tooltip', 'absence lists what it CAN answer')

  const search = eds('search', 'red')
  ok(search.code === 0, 'search red finds something')
  has(search.out, 'eds explain brand', 'search routes red to the brand doc')
}

console.log(`eds-cli checks passed: ${checks}`)
