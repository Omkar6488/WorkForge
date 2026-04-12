import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { getRoleSkillGap, roles, skillPassport, type RoleId } from '@/data/mock'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export function SkillGapPage() {
  const [params, setParams] = useSearchParams()
  const roleParam = (params.get('role') as RoleId | null) ?? 'frontend'

  const selected = roles.find((r) => r.id === roleParam) ?? roles[0]
  const analysis = useMemo(() => getRoleSkillGap(selected.id), [selected.id])
  const levels = useMemo(() => new Map(skillPassport.map((s) => [s.label, s.level])), [])

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Skill gap analyzer"
        title="Pick a target role — WorkForge surfaces missing execution skills."
        description="This analyzer compares your passport to role requirements (mock thresholds). Pair the output with simulations and micro-internships for fastest closure."
      />

      <Card>
        <CardHeader>
          <CardTitle>Selected role</CardTitle>
          <CardDescription>Synced from Career Explorer via query string when linked</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setParams({ role: r.id })}
              className={
                selected.id === r.id
                  ? 'rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white dark:bg-brand-500'
                  : 'rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
              }
            >
              {r.title}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Required skills · coverage</CardTitle>
          <CardDescription>Passport level per required skill (mock alignment)</CardDescription>
        </CardHeader>
        <div className="grid gap-4 px-5 pb-5 md:grid-cols-2">
          {selected.requiredSkills.map((skill) => {
            const lvl = levels.get(skill) ?? 0
            const gap = lvl < 60
            return (
              <div
                key={skill}
                className={
                  gap
                    ? 'rounded-xl border border-rose-200/80 bg-rose-50/40 p-3 dark:border-rose-900/40 dark:bg-rose-950/20'
                    : 'rounded-xl border border-slate-100 bg-surface-1/60 p-3 dark:border-slate-800 dark:bg-surface-0/50'
                }
              >
                <div className="flex justify-between text-sm font-medium text-slate-900 dark:text-white">
                  <span>{skill}</span>
                  <span className={gap ? 'text-rose-700 dark:text-rose-300' : 'text-emerald-600 dark:text-emerald-400'}>
                    {lvl}%
                  </span>
                </div>
                <ProgressBar value={lvl} className="mt-2" />
                {gap ? (
                  <p className="mt-1 text-xs font-medium text-rose-800 dark:text-rose-200">Gap · prioritize evidence</p>
                ) : null}
              </div>
            )
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Missing or under-leveled skills</CardTitle>
            <CardDescription>Threshold mock: passport level below 60</CardDescription>
          </CardHeader>
          <ul className="space-y-3">
            {analysis.missing.map((m) => (
              <li
                key={m}
                className="rounded-xl border border-rose-100 bg-rose-50/60 px-3 py-2 text-sm font-medium text-rose-950 dark:border-rose-900/40 dark:bg-rose-950/25 dark:text-rose-50"
              >
                {m}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recommended actions</CardTitle>
            <CardDescription>Sequenced for compounding evidence</CardDescription>
          </CardHeader>
          <ol className="list-decimal space-y-3 ps-5 text-sm text-slate-700 dark:text-slate-200">
            {analysis.actions.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button to={`/simulation?role=${selected.id}`}>Jump to simulations</Button>
            <Button to="/learning" variant="secondary">
              Open learning paths
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
