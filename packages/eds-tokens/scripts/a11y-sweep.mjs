// Accessibility sweep: axe-core (full rule set) against every Storefront
// page, the button demo rungs, and the LOB shell, in the same headless
// Chrome the parity measurements use. Light and dark schemes both.
//
//   node scripts/a11y-sweep.mjs
//
// Exit code 1 if any violation is found. Colour-contrast is checked by
// axe here as a floor (WCAG 2.x luminance); the system's own APCA
// verdicts in the harness remain the authority above that floor.
import { chromium } from 'playwright-core'
import { AxeBuilder } from '@axe-core/playwright'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')
const url = (p, hash = '') => 'file://' + path.join(repo, p) + hash

const browser = await chromium.launch({ channel: 'chrome' })
// axe-core/playwright requires a page from an explicit context
const context = await browser.newContext()
const page = await context.newPage()

async function scan(name, target, prepare, opts = {}) {
  await page.goto(target)
  await page.waitForTimeout(300)
  if (prepare) {
    await prepare(page)
    await page.waitForTimeout(300)
  }
  let builder = new AxeBuilder({ page })
  for (const sel of opts.exclude ?? []) builder = builder.exclude(sel)
  const { violations } = await builder.analyze()
  return { name, violations, exhibit: opts.exhibit ?? false }
}

// every Storefront entry, read from the page's own nav
await page.goto(url('apps/storefront/index.html'))
await page.waitForTimeout(300)
const ids = await page.$$eval('[data-nav]', (as) => as.map((a) => a.dataset.nav))

const results = []
for (const scheme of ['light', 'dark']) {
  const setScheme = (p) =>
    p.evaluate((s) => (document.documentElement.dataset.colorScheme = s), scheme)
  results.push(await scan(`storefront home (${scheme})`, url('apps/storefront/index.html'), setScheme))
  for (const id of ids)
    results.push(await scan(`storefront #${id} (${scheme})`, url('apps/storefront/index.html', '#' + id), setScheme))
  // chrome states the hash routes cannot reach: collapsed rail + floating submenu
  results.push(
    await scan(`storefront collapsed rail + float (${scheme})`, url('apps/storefront/index.html'), async (p) => {
      await setScheme(p)
      await p.click('#nav-collapse')
      await p.click('[data-group]')
    }),
  )
}

// ours: the compare page (exhibit iframes excluded, scanned below on their
// own), the contract-built attempt, and the LOB shell
results.push(
  await scan('demos compare page', url('apps/demos/building-the-button/index.html'), null, {
    exclude: ['iframe'],
  }),
)
for (const f of ['apps/demos/building-the-button/attempt-3.html', 'packages/eds-contracts/preview/lob.html'])
  results.push(await scan(f, url(f)))

// exhibits: sandboxed-agent artifacts, presented as produced. Their flaws
// are DATA (the teaching arc includes page structure), so they are
// reported but never edited and never fail the sweep.
for (const f of ['apps/demos/building-the-button/attempt-1.html', 'apps/demos/building-the-button/attempt-2.html'])
  results.push(await scan(f + ' (exhibit)', url(f), null, { exhibit: true }))

await browser.close()

let total = 0
for (const { name, violations, exhibit } of results) {
  if (!violations.length) {
    console.log(`  ok        ${name}`)
    continue
  }
  for (const v of violations) {
    if (!exhibit) total += v.nodes.length
    console.log(`\n  ${exhibit ? 'exhibit  ' : v.impact?.toUpperCase().padEnd(9)} ${name}`)
    console.log(`            ${v.id}: ${v.help}`)
    for (const n of v.nodes.slice(0, 6)) console.log(`            → ${n.target.join(' ')}`)
    if (v.nodes.length > 6) console.log(`            … and ${v.nodes.length - 6} more nodes`)
  }
}
console.log(`\n${total === 0 ? 'PASS: no axe violations on system surfaces' : `FAIL: ${total} violating nodes`} across ${results.length} scans`)
process.exit(total === 0 ? 0 : 1)
