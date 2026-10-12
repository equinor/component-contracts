/** `eds register-extension <contract> [--dry-run]` — the feedback loop.
 *
 *  ADR-0007's second obligation, made runnable: an extension's merge diff
 *  is reported back to the system. The command validates the extension by
 *  performing the real merge (loadWithExtends — version pin and dangling
 *  refs fail here, so registering IS validating), renders the diff as
 *  markdown, and posts it as a GitHub issue titled "[extension] …" via
 *  the gh CLI (pre-authenticated in Codespaces). The issue list is the
 *  demand dashboard: who extended what, when, with which deviations.
 *
 *  Target repo: $EDS_REGISTRY_REPO (owner/name), else gh's current repo.
 *  The repo itself stays untouched — this lens reports, it never writes
 *  locally. With --dry-run (or if gh is unavailable) the report prints
 *  to stdout instead, so the loop degrades to copy-paste, never to loss.
 */
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { isAbsolute, relative, resolve } from 'node:path'
import { loadWithExtends, type ExtensionDiff } from '@equinor/eds-contracts/src/extend.ts'
import { repoRoot } from './registry.ts'
import { blocks, record, section } from './render.ts'

export function renderDiffMarkdown(
  contract: any,
  diff: ExtensionDiff,
): string {
  const rows = diff
    .map((d) => `| \`${d.path}\` | ${d.kind} | ${d.detail.replaceAll('|', '\\|')} |`)
    .join('\n')
  return [
    `**Extension:** \`${contract.id}\` v${contract.version ?? '?'}`,
    `**Extends:** \`${contract.extends}\``,
    '',
    '| path | change | detail |',
    '| --- | --- | --- |',
    rows || '| (no differences — pure re-export) | | |',
    '',
    `${diff.length} change(s) against upstream. Recurring changes across`,
    'teams are promotion candidates for the core contract (ADR-0007).',
  ].join('\n')
}

export function register(path: string, dryRun: boolean): string {
  let abs = isAbsolute(path) ? path : resolve(process.cwd(), path)
  if (!existsSync(abs)) {
    const fromRepo = resolve(repoRoot, path)
    if (existsSync(fromRepo)) abs = fromRepo
    else throw new Error(`no contract at ${path} (tried cwd and repo root)`)
  }
  const fromRoot = relative(repoRoot, abs)
  const { contract, diff } = loadWithExtends(fromRoot)
  if (!diff)
    throw new Error(
      `${fromRoot} has no "extends" — register-extension reports extensions; ` +
        'base contracts are proposed upstream instead',
    )
  const body = renderDiffMarkdown(contract, diff)
  const title = `[extension] ${contract.id} extends ${contract.extends}`

  if (!dryRun) {
    const repo = process.env.EDS_REGISTRY_REPO
    const args = ['issue', 'create', '--title', title, '--body', body]
    if (repo) args.push('--repo', repo)
    try {
      const url = execFileSync('gh', args, { encoding: 'utf8' }).trim()
      return blocks(
        section('extension registered', title),
        record([
          ['issue', url],
          ['changes', String(diff.length)],
        ]),
      )
    } catch {
      // fall through to the printed report — the loop never loses data
    }
  }
  return blocks(
    section(
      dryRun ? 'extension report (dry run)' : 'extension report (gh unavailable — post this manually)',
      title,
    ),
    body,
  )
}
