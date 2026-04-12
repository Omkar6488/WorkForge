import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { crmCustomers } from '@/data/mock'
import { cn } from '@/lib/cn'
import { Users } from 'lucide-react'
import { useState } from 'react'

export function CrmLabPanel() {
  const [sel, setSel] = useState(0)
  const row = crmCustomers[sel]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <CardTitle className="text-base">Customer list</CardTitle>
          </div>
          <CardDescription>Click a row to inspect status (mock)</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto px-5 pb-5">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
              <tr>
                <th className="pb-2 font-semibold">Account</th>
                <th className="pb-2 font-semibold">Status</th>
                <th className="pb-2 font-semibold">ARR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {crmCustomers.map((c, i) => (
                <tr
                  key={c.id}
                  className={cn(
                    'cursor-pointer transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50',
                    i === sel && 'bg-brand-50/80 dark:bg-brand-950/25',
                  )}
                  onClick={() => setSel(i)}
                >
                  <td className="py-2.5 font-medium text-slate-900 dark:text-white">{c.name}</td>
                  <td className="py-2.5">
                    <Badge tone="brand">{c.status}</Badge>
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-300">{c.arr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Status tracking</CardTitle>
          <CardDescription>Pipeline snapshot for selected account</CardDescription>
        </CardHeader>
        <div className="space-y-4 px-5 pb-5">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">{row.name}</p>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between rounded-xl bg-surface-1/80 px-3 py-2 dark:bg-surface-0/50">
              <dt className="text-slate-500 dark:text-slate-400">Stage</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{row.status}</dd>
            </div>
            <div className="flex justify-between rounded-xl bg-surface-1/80 px-3 py-2 dark:bg-surface-0/50">
              <dt className="text-slate-500 dark:text-slate-400">ARR (mock)</dt>
              <dd className="font-medium text-slate-900 dark:text-white">{row.arr}</dd>
            </div>
            <div className="flex justify-between rounded-xl bg-surface-1/80 px-3 py-2 dark:bg-surface-0/50">
              <dt className="text-slate-500 dark:text-slate-400">Next action</dt>
              <dd className="text-right font-medium text-slate-800 dark:text-slate-100">
                Schedule exec readout + attach simulation artifacts
              </dd>
            </div>
          </dl>
        </div>
      </Card>
    </div>
  )
}
