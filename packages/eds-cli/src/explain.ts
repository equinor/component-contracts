/** `eds explain <topic|question>` — renders a principles doc.
 *
 *  Routing is by keywords (the Astryx idea): each doc carries a synonym list
 *  so "brand", "How does EDS use the Equinor brand guidelines?" and "why
 *  Inter" all land on the same page. If nothing matches, the CLI says so and
 *  names the nearest thing it CAN answer — silence and invention are both
 *  failures.
 */
import { components, docs, score } from './registry.ts'
import { blocks, record, section } from './render.ts'

export function explain(query: string): { out: string; code: number } {
  const all = docs()
  const exact = all.find((d) => d.topic === query.toLowerCase().trim())
  const best = exact
    ? { d: exact, s: Infinity }
    : all
        .map((d) => ({ d, s: score(query, d.topic, [d.title, ...d.keywords]) }))
        .sort((a, b) => b.s - a.s)[0]

  if (best && best.s >= 2) {
    const d = best.d
    return {
      out: blocks(
        section(d.title, d.status ? `Status: ${d.status}` : undefined),
        d.body,
        section('Provenance'),
        record([
          ['source', d.docPath],
          ['keywords', d.keywords.join(', ')],
        ]),
      ),
      code: 0,
    }
  }

  // Honest absence: name what the CLI can explain instead.
  const componentHit = components()
    .map((e) => ({ e, s: score(query, e.name, e.keywords) }))
    .sort((a, b) => b.s - a.s)[0]
  return {
    out: blocks(
      section(`No principles doc answers '${query}'.`),
      record([
        [
          'topics',
          all.map((d) => `${d.topic} — ${d.keywords.join(', ')}`).join('\n'),
        ],
        componentHit && componentHit.s >= 2
          ? ['nearest', `eds component ${componentHit.e.name}`]
          : ['nearest', undefined],
        ['source', 'packages/eds-cli/principles/'],
      ]),
    ),
    code: 1,
  }
}
