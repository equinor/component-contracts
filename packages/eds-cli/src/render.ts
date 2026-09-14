/** Output blocks, imitating the Astryx CLI's grammar (`astryx --help`):
 *
 *    Record  — aligned "key: value" lines = one item
 *    Section — a header line, optional one-line subtitle, then its records
 *    List    — "- value" lines
 *    Text    — free-form prose
 *
 *  Blocks are separated by a blank line, so `eds … | grep "^key:"` works.
 */

export type Field = [key: string, value: string | number | undefined | null]

/** One record: keys padded so the value column aligns. Multi-line values
 *  continue under the value column. */
export function record(fields: Field[]): string {
  const live = fields.filter(
    ([, v]) => v !== undefined && v !== null && v !== '',
  )
  if (live.length === 0) return ''
  const width = Math.max(...live.map(([k]) => k.length)) + 1
  return live
    .map(([k, v]) => {
      const label = `${k}:`.padEnd(width + 1)
      const pad = ' '.repeat(width + 1)
      const [first, ...rest] = String(v).split('\n')
      return [label + first, ...rest.map((l) => pad + l)].join('\n')
    })
    .join('\n')
}

export function section(header: string, subtitle?: string): string {
  return subtitle ? `${header}\n${subtitle}` : header
}

export function list(items: string[]): string {
  return items.map((i) => `- ${i}`).join('\n')
}

/** Join blocks with blank lines; nulls drop out. Ends with a newline. */
export function blocks(...parts: (string | null | undefined)[]): string {
  return parts.filter((p) => p).join('\n\n') + '\n'
}
