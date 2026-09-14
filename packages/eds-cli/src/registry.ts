/** What the CLI can answer from, and nothing else.
 *
 *  Components come from packages/eds-contracts/contracts (scope fence: the components the
 *  intent names). Docs come from packages/eds-cli/principles. Both carry keyword lists
 *  so a designer's phrasing finds the right entry (the Astryx routing idea).
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const repoRoot = fileURLToPath(new URL('../../..', import.meta.url))

/** Scope fence (packages/eds-cli/intent.md): max three components, confirmed by Victor. */
// widened 2026-09-05 (Victor): the menu-label contrast question proved the
// tool — menu and menu-item join the fence.
const COMPONENT_NAMES = ['button', 'banner', 'tooltip', 'menu', 'menu-item'] as const

export type ComponentEntry = {
  name: string
  contractPath: string // repo-relative — doubles as the provenance string
  contract: any
  keywords: string[]
}

export function components(): ComponentEntry[] {
  return COMPONENT_NAMES.map((name) => {
    const contractPath = `packages/eds-contracts/contracts/${name}.contract.json`
    const contract = JSON.parse(readFileSync(repoRoot + contractPath, 'utf8'))
    const keywords = [
      name,
      contract.id,
      ...contract.props.map((p: any) => p.name),
      ...contract.props.flatMap((p: any) => p.type.enum ?? []),
    ]
    return { name, contractPath, contract, keywords }
  })
}

export type DocEntry = {
  topic: string
  title: string
  status: string | null
  keywords: string[]
  body: string
  docPath: string // repo-relative
}

/** Parse a principles doc: an optional leading HTML comment (the DRAFT
 *  marker), then `---` front matter with title/keywords/status, then body. */
export function docs(): DocEntry[] {
  const dir = repoRoot + 'packages/eds-cli/principles/'
  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = readFileSync(dir + file, 'utf8')
      const topic = file.replace(/\.md$/, '')
      let rest = raw
      let status: string | null = null
      const comment = rest.match(/^\s*<!--([\s\S]*?)-->\s*/)
      if (comment) {
        if (/draft/i.test(comment[1])) status = comment[1].trim()
        rest = rest.slice(comment[0].length)
      }
      const meta: Record<string, string> = {}
      const fm = rest.match(/^---\n([\s\S]*?)\n---\n/)
      if (fm) {
        for (const line of fm[1].split('\n')) {
          const m = line.match(/^([a-z]+):\s*(.*)$/)
          if (m) meta[m[1]] = m[2].trim()
        }
        rest = rest.slice(fm[0].length)
      }
      return {
        topic,
        title: meta.title ?? topic,
        status: meta.status ?? status,
        keywords: (meta.keywords ?? '')
          .split(',')
          .map((k) => k.trim().toLowerCase())
          .filter(Boolean),
        body: rest.trim(),
        docPath: `packages/eds-cli/principles/${file}`,
      }
    })
}

// ---- matching ---------------------------------------------------------------------

/** Words that route nowhere — natural phrasing, not signal. */
const STOPWORDS = new Set(
  'a an and are can does do for how i in is it of on or that the this to use uses using we what when where which why with you your'.split(
    ' ',
  ),
)

const tokenize = (s: string) =>
  s
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t))

/** Keyword/name overlap score — enough for routing, not a search engine.
 *  Exact token hits count double; partials only for tokens long enough to
 *  mean something. */
export function score(query: string, name: string, keywords: string[]): number {
  const q = tokenize(query)
  const keys = new Set([...tokenize(name), ...keywords.flatMap(tokenize)])
  let hits = 0
  for (const t of q) {
    if (keys.has(t)) hits += 2
    else if (t.length >= 4)
      for (const k of keys)
        if (k.length >= 4 && (k.includes(t) || t.includes(k))) hits += 1
  }
  return hits
}

/** Character-bigram similarity, for "nearest:" in absence answers. */
export function similarity(a: string, b: string): number {
  const grams = (s: string) => {
    const g = new Set<string>()
    const t = s.toLowerCase()
    for (let i = 0; i < t.length - 1; i++) g.add(t.slice(i, i + 2))
    return g
  }
  const ga = grams(a)
  const gb = grams(b)
  let shared = 0
  for (const g of ga) if (gb.has(g)) shared++
  return shared / Math.max(1, Math.max(ga.size, gb.size))
}
