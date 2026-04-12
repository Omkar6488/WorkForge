import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { githubMockCommits, githubMockIssues, githubMockRepos } from '@/data/mock'
import { cn } from '@/lib/cn'
import { GitBranch } from 'lucide-react'
import { useState } from 'react'

export function GitHubLabPanel() {
  const [repoIdx, setRepoIdx] = useState(0)
  const [issueIdx, setIssueIdx] = useState(0)
  const repo = githubMockRepos[repoIdx]

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-base">Repositories</CardTitle>
          <CardDescription>Select a repo (mock)</CardDescription>
        </CardHeader>
        <ul className="space-y-2 px-5 pb-5">
          {githubMockRepos.map((r, i) => (
            <li key={r.name}>
              <button
                type="button"
                onClick={() => setRepoIdx(i)}
                className={cn(
                  'flex w-full flex-col rounded-xl border px-3 py-2 text-left text-sm transition-all duration-200',
                  i === repoIdx
                    ? 'border-brand-500 bg-brand-50 dark:border-brand-500 dark:bg-brand-950/30'
                    : 'border-transparent hover:border-slate-200 hover:bg-slate-50 dark:hover:border-slate-700 dark:hover:bg-slate-900/40',
                )}
              >
                <span className="font-medium text-slate-900 dark:text-white">{r.name}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  ★ {r.stars} · {r.issuesOpen} open issues
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <CardTitle className="text-base">Commit history · {repo.name}</CardTitle>
          </div>
          <CardDescription>Last activity (static mock)</CardDescription>
        </CardHeader>
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {githubMockCommits.map((c) => (
            <li key={c.sha} className="flex flex-wrap items-baseline justify-between gap-2 px-5 py-3 text-sm">
              <span className="font-mono text-xs text-slate-500">{c.sha}</span>
              <span className="flex-1 text-slate-800 dark:text-slate-100">{c.msg}</span>
              <span className="text-xs text-slate-500">{c.time}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-slate-100 px-5 py-4 dark:border-slate-800">
          <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">Issues</p>
          <ul className="mt-2 space-y-2">
            {githubMockIssues.map((iss, i) => (
              <li key={iss.id}>
                <button
                  type="button"
                  onClick={() => setIssueIdx(i)}
                  className={cn(
                    'flex w-full items-start justify-between gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-all duration-200',
                    i === issueIdx ? 'border-brand-400 bg-surface-1 dark:border-brand-600 dark:bg-surface-0/50' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-900/40',
                  )}
                >
                  <span className="font-medium text-slate-900 dark:text-white">#{iss.id} {iss.title}</span>
                  <span className="flex flex-wrap gap-1">
                    {iss.labels.map((l) => (
                      <Badge key={l} tone="neutral">
                        {l}
                      </Badge>
                    ))}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  )
}
