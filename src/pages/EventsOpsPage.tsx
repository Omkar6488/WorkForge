import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { eventOpsMetrics, eventOpsTickets } from '@/data/mock'
import { Headphones, LayoutDashboard } from 'lucide-react'

export function EventsOpsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Event operations"
        title="Lightweight monitoring + helpdesk surfaces for IT & event tracks."
        description="Optional module: rehearse how ops desks watch venues, triage incidents, and keep SLAs visible — all mock, no integrations."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {eventOpsMetrics.map((m) => (
          <Card key={m.label} className="transition-transform duration-200 hover:-translate-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {m.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{m.value}</p>
            <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-400">{m.delta} vs shift open</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <CardTitle>Monitoring board</CardTitle>
            </div>
            <CardDescription>Venue health snapshot (static)</CardDescription>
          </CardHeader>
          <ul className="space-y-3 px-5 pb-5">
            {['Stage power', 'Ingress queues', 'Comms mesh', 'Medical tent'].map((row, i) => (
              <li
                key={row}
                className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm dark:border-slate-800"
              >
                <span className="font-medium text-slate-800 dark:text-slate-100">{row}</span>
                <Badge tone={i === 0 ? 'warning' : 'success'}>{i === 0 ? 'Watch' : 'Stable'}</Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <CardTitle>Helpdesk queue</CardTitle>
            </div>
            <CardDescription>Scenario tickets for triage practice</CardDescription>
          </CardHeader>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {eventOpsTickets.map((t) => (
              <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm">
                <span className="font-medium text-slate-900 dark:text-white">{t.title}</span>
                <span className="flex items-center gap-2">
                  <Badge tone="neutral">{t.priority}</Badge>
                  <span className="text-xs text-slate-500">{t.owner}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
