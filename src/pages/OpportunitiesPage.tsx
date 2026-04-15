import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageHeader } from '@/components/ui/PageHeader'
import { opportunities, roles, type OpportunityType, type RoleId } from '@/data/mock'
import { useAppStore } from '@/store/appStore'
import { Briefcase, MapPin, Radio, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

export function OpportunitiesPage() {
  const [skillQ, setSkillQ] = useState('')
  const [roleId, setRoleId] = useState<RoleId | 'all'>('all')
  const [type, setType] = useState<OpportunityType | 'all'>('all')

  // Get completion tracking from store
  const currentUser = useAppStore((s: any) => s.currentUser)
  const applications = useAppStore((s: any) => s.applications ?? [])

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      if (roleId !== 'all' && o.roleId !== roleId) return false
      if (type !== 'all' && o.type !== type) return false
      if (skillQ.trim()) {
        const q = skillQ.toLowerCase()
        if (!o.skills.some((s) => s.toLowerCase().includes(q))) return false
      }
      return true
    })
  }, [skillQ, roleId, type])

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => (b.matchPct ?? 0) - (a.matchPct ?? 0)),
    [filtered],
  )

  const handleApply = (opportunityId: string) => {
    if (currentUser) {
      useAppStore.getState().applyToOpportunity(currentUser.id, opportunityId)
    }
  }

  const hasApplied = (opportunityId: string) => {
    if (!currentUser) return false
    return applications.some(
      (a: any) => a.studentId === currentUser.id && a.opportunityId === opportunityId
    )
  }

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Opportunities"
        title="Internships, roles, and micro-internships — filtered by skills you can prove."
        description="Browse real opportunities from verified employers. Your match score shows how well your current skills align with role requirements."
      />

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Skill-based, role-based, opportunity type</CardDescription>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Skill contains
            <span className="relative mt-2 block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={skillQ}
                onChange={(e) => setSkillQ(e.target.value)}
                placeholder="e.g. React"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-surface-0 py-2.5 pl-9 pr-3 text-sm outline-none ring-brand-500/0 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 dark:border-slate-800 dark:bg-surface-0 dark:text-slate-100"
              />
            </span>
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Role
            <select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value as RoleId | 'all')}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-surface-0 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 dark:border-slate-800 dark:bg-surface-0 dark:text-slate-100"
            >
              <option value="all">All roles</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Type
            <select
              value={type}
              onChange={(e) => setType(e.target.value as OpportunityType | 'all')}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-surface-0 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 dark:border-slate-800 dark:bg-surface-0 dark:text-slate-100"
            >
              <option value="all">All types</option>
              <option value="internship">Internship</option>
              <option value="job">Job</option>
              <option value="micro">Micro-internship</option>
            </select>
          </label>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No matches for this filter mix"
          description="Adjust your skill search, role, or type filter to discover more opportunities that align with your profile."
          actionLabel="Reset filters"
          onAction={() => {
            setSkillQ('')
            setRoleId('all')
            setType('all')
          }}
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {sorted.map((o) => (
            <Card
              key={o.id}
              className="flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Badge tone="brand" className="capitalize">
                      {o.type.replace('-', ' ')}
                    </Badge>
                    {typeof o.matchPct === 'number' ? (
                      <Badge tone="success">Match {o.matchPct}%</Badge>
                    ) : null}
                  </div>
                  <CardTitle className="text-lg">{o.title}</CardTitle>
                  <CardDescription className="mt-1">{o.org}</CardDescription>
                </div>
                <span className="text-right text-xs text-slate-500 dark:text-slate-400">
                  Posted {o.posted}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {o.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Radio className="h-3.5 w-3.5" />
                  {o.mode}
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {o.skills.map((s) => (
                  <Badge key={s}>{s}</Badge>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">
                {o.stipendOrSalary}
              </p>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                {currentUser && (
                  <Button
                    onClick={() => handleApply(o.id)}
                    disabled={hasApplied(o.id)}
                  >
                    {hasApplied(o.id) ? 'Applied ✓' : 'Apply now'}
                  </Button>
                )}
                <Button variant="secondary">View details</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
