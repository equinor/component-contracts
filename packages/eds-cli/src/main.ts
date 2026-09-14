/** eds — a thin CLI lens over the EDS contracts and token build.
 *
 *  Read-only. Every answer names its source file; anything derivable is
 *  computed at runtime (the intent: packages/eds-cli/intent.md). Output follows the
 *  Astryx block grammar: aligned key-value records separated by blank lines,
 *  so `eds … | grep "^key:"` works.
 */
import { component } from './component.ts'
import { contrast } from './contrast.ts'
import { explain } from './explain.ts'
import { search } from './search.ts'
import { SCHEMES, type Scheme } from './colors.ts'
import { blocks, record, section } from './render.ts'

const USAGE = blocks(
  section(
    'eds — Equinor Design System CLI (POC)',
    'A thin rendering layer over the contracts and the token build. Read-only; provenance on everything.',
  ),
  record([['usage', 'eds <command> [arguments]']]),
  record([
    ['command', 'component <name>'],
    ['answers', 'the component contract: props, variants, states, geometry'],
    ['source', 'packages/eds-contracts/contracts/<name>.contract.json'],
  ]),
  record([
    ['command', 'explain <topic | question>'],
    ['answers', 'a principles doc, routed by keywords'],
    ['source', 'packages/eds-cli/principles/'],
  ]),
  record([
    ['command', 'contrast <target> [--scheme light|dark]'],
    [
      'answers',
      'resolved colours, APCA Lc (computed live), threshold, PASS/FAIL',
    ],
    ['source', 'contract + packages/eds-tokens/tokens (scheme-resolved)'],
  ]),
  record([
    ['command', 'search <query>'],
    ['answers', 'one ranked list over components and principles docs'],
  ]),
)

function fail(msg: string): never {
  process.stderr.write(msg + '\n')
  process.exit(2)
}

function main(argv: string[]) {
  const args: string[] = []
  let scheme: Scheme = 'light'
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--scheme') {
      const v = argv[++i]
      if (!SCHEMES.includes(v as Scheme))
        fail(`--scheme takes ${SCHEMES.join('|')}, got '${v ?? ''}'`)
      scheme = v as Scheme
    } else if (a === '-h' || a === '--help') {
      process.stdout.write(USAGE)
      process.exit(0)
    } else {
      args.push(a)
    }
  }

  const [command, ...rest] = args
  if (!command) {
    process.stdout.write(USAGE)
    process.exit(0)
  }

  const query = rest.join(' ').trim()
  let result: { out: string; code: number }
  switch (command) {
    case 'component':
      if (!query) fail('usage: eds component <name>')
      result = component(query)
      break
    case 'explain':
      if (!query) fail('usage: eds explain <topic | question>')
      result = explain(query)
      break
    case 'contrast':
      if (!query) fail('usage: eds contrast <target> [--scheme light|dark]')
      result = contrast(query, scheme)
      break
    case 'search':
      if (!query) fail('usage: eds search <query>')
      result = search(query)
      break
    default:
      fail(
        `unknown command '${command}' — commands: component, explain, contrast, search (eds --help)`,
      )
  }
  process.stdout.write(result.out)
  process.exit(result.code)
}

main(process.argv.slice(2))
