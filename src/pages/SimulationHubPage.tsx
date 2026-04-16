import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { roles, simulations, type RoleId } from '@/data/mock'
import { Clock, Cpu, MonitorDot, Eye } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { PreviewModal } from '@/components/SimulationPreviewModal'

export function SimulationHubPage() {
  const [params] = useSearchParams()
  const roleFilter = (params.get('role') as RoleId | null) ?? null
  const [previewingId, setPreviewingId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!roleFilter) return simulations
    return simulations.filter((s) => s.roleId === roleFilter)
  }, [roleFilter])

  const previewingSim = previewingId ? simulations.find((s) => s.id === previewingId) : null

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Job simulation module"
        title="Practice like it is Monday at work — not Monday at lectures."
        description="Pick a scenario aligned to your target role. Each simulation is a guided task flow with evaluation tuned to hiring signals."
        action={
          <Button to="/tracking" variant="secondary">
            View skill impact
          </Button>
        }
      />

      <Card className="transition-shadow duration-300 hover:shadow-[var(--shadow-float)]">
        <CardHeader>
          <CardTitle>Tool-based labs</CardTitle>
          <CardDescription>GitHub, CRM, and analytics surfaces — interactive mock UIs</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap items-center gap-3 px-5 pb-5">
          <Button to="/simulation/labs" className="inline-flex items-center gap-2">
            <MonitorDot className="h-4 w-4" />
            Open simulation labs
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role focus</CardTitle>
          <CardDescription>Filter scenarios (query preserved in URL)</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-2">
          <FilterChip to="/simulation" active={!roleFilter}>
            All roles
          </FilterChip>
          {roles.map((r) => (
            <FilterChip key={r.id} to={`/simulation?role=${r.id}`} active={roleFilter === r.id}>
              {r.title}
            </FilterChip>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {filtered.map((sim) => {
          const role = roles.find((r) => r.id === sim.roleId)
          return (
            <Card
              key={sim.id}
              className="group relative flex flex-col border-slate-200/80 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] dark:border-slate-800"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-brand-50 p-3 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-brand-900 dark:text-sky-100 dark:group-hover:bg-brand-500 dark:group-hover:text-white">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{sim.title}</CardTitle>
                    <CardDescription>{sim.company}</CardDescription>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sim.kind === 'traffic' ? (
                    <Badge tone="warning">Traffic ops</Badge>
                  ) : null}
                  <Badge tone="brand">{sim.difficulty}</Badge>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">{sim.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sim.skills.map((sk) => (
                  <Badge key={sk} tone="neutral">
                    {sk}
                  </Badge>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  ~{sim.durationMin} min · {sim.steps.length} steps
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {role?.title}
                </span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button to={`/simulation/run/${sim.id}`} className="flex-1 sm:flex-none">
                  Launch simulation
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewingId(sim.id)}
                  className="opacity-0 transition group-hover:opacity-100"
                  aria-label="Preview simulation"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {previewingSim && (
        <PreviewModal
          simulation={previewingSim}
          role={roles.find((r) => r.id === previewingSim.roleId)!}
          isOpen={!!previewingId}
          onClose={() => setPreviewingId(null)}
        />
      )}
    </div>
  )
}

function FilterChip({
  to,
  active,
  children,
}: {
  to: string
  active: boolean
  children: string
}) {
  return (
    <Link
      to={to}
      className={
        active
          ? 'rounded-full bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm dark:bg-brand-500'
          : 'rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'
      }
    >
      {children}
    </Link>
  )
}
