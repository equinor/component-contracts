/** `eds search <query>` — one ranked list over component names, prop
 *  vocabulary and principles-doc keywords. In scope because it is cheap:
 *  the registries already carry the keywords. */
import { components, docs, score } from './registry.ts'
import { blocks, record, section } from './render.ts'

export function search(query: string): { out: string; code: number } {
  const hits = [
    ...components().map((e) => ({
      name: e.name,
      kind: 'component',
      run: `eds component ${e.name}`,
      source: e.contractPath,
      s: score(query, e.name, [...e.keywords, e.contract.description]),
    })),
    ...docs().map((d) => ({
      name: d.topic,
      kind: 'principles',
      run: `eds explain ${d.topic}`,
      source: d.docPath,
      s: score(query, d.topic, [d.title, ...d.keywords]),
    })),
  ]
    .filter((h) => h.s >= 2)
    .sort((a, b) => b.s - a.s)

  if (hits.length === 0) {
    return {
      out: blocks(
        section(`Nothing matches '${query}'.`),
        record([
          [
            'components',
            components()
              .map((e) => e.name)
              .join(', '),
          ],
          [
            'topics',
            docs()
              .map((d) => d.topic)
              .join(', '),
          ],
          [
            'note',
            'the CLI answers only from its sources — no match means no answer, not a guess',
          ],
        ]),
      ),
      code: 1,
    }
  }

  return {
    out: blocks(
      section(`Search — '${query}'`, `${hits.length} match(es), ranked.`),
      ...hits.map((h) =>
        record([
          ['result', h.name],
          ['kind', h.kind],
          ['run', h.run],
          ['source', h.source],
        ]),
      ),
    ),
    code: 0,
  }
}
