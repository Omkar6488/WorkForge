import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { AlertTriangle, Gauge, MapPin, TrafficCone } from 'lucide-react'

const corridors = [
  { id: 'c1', name: 'Ring Rd E', congestion: 'High', speed: '18 km/h' },
  { id: 'c2', name: 'Harbour Link', congestion: 'Med', speed: '42 km/h' },
  { id: 'c3', name: 'Expo Blvd', congestion: 'Low', speed: '58 km/h' },
]

export function TrafficOpsContext({ stepIndex }: { stepIndex: number }) {
  const alertTone = stepIndex >= 1 ? 'warning' : 'brand'
  return (
    <Card className="mb-6 border-amber-200/60 bg-gradient-to-br from-slate-50 to-amber-50/40 dark:border-amber-900/40 dark:from-slate-900/40 dark:to-amber-950/20">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Live traffic dashboard (mock)</CardTitle>
          <Badge tone={alertTone}>Ops channel · LIVE</Badge>
        </div>
        <CardDescription>Congestion, alerts, and closures for this scenario block.</CardDescription>
      </CardHeader>
      <div className="grid gap-3 px-5 pb-5 sm:grid-cols-3">
        {corridors.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-slate-200/80 bg-surface-0/90 px-3 py-3 text-sm dark:border-slate-700 dark:bg-surface-0/50"
          >
            <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-white">
              <MapPin className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              {c.name}
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span className="inline-flex items-center gap-1">
                <Gauge className="h-3.5 w-3.5" />
                {c.speed}
              </span>
              <Badge tone={c.congestion === 'High' ? 'warning' : 'neutral'}>{c.congestion}</Badge>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-slate-200/60 px-5 py-4 dark:border-slate-700">
        <span className="inline-flex items-center gap-2 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
          <AlertTriangle className="h-3.5 w-3.5" />
          Sensor spike · Ring Rd E
        </span>
        <span className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
          <TrafficCone className="h-3.5 w-3.5" />
          Planned closure · VIP route (northbound)
        </span>
      </div>
    </Card>
  )
}
