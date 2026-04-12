import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { adminStudents, opportunities, simulations } from '@/data/mock'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '@/context/useTheme'
import { useState } from 'react'

const tabs = ['Tasks', 'Simulations', 'Opportunities', 'Analytics'] as const
type Tab = (typeof tabs)[number]

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('Simulations')
  const [studentQuery, setStudentQuery] = useState('')
  const { theme } = useTheme()
  const axis = theme === 'dark' ? '#94a3b8' : '#64748b'
  const grid = theme === 'dark' ? '#1e293b' : '#e2e8f0'

  const filteredStudents = adminStudents.filter((u) =>
    u.name.toLowerCase().includes(studentQuery.trim().toLowerCase()),
  )

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Admin (UI only)"
        title="Operate WorkForge like a program team."
        description="No backend is wired here — these screens demonstrate how admins would manage simulations, tasks, and opportunity feeds while monitoring cohort readiness."
      />

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              tab === t
                ? 'rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-slate-900'
                : 'rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Tasks' ? (
        <Card>
          <CardHeader>
            <CardTitle>Task templates</CardTitle>
            <CardDescription>Versioned prompts used inside simulations</CardDescription>
          </CardHeader>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Mock table: 24 active templates · 6 awaiting curriculum review · 3 deprecated.
          </p>
          <div className="mt-4 flex gap-2">
            <Button>New task (mock)</Button>
            <Button variant="secondary">Import JSON pack</Button>
          </div>
        </Card>
      ) : null}

      {tab === 'Simulations' ? (
        <Card>
          <CardHeader>
            <CardTitle>Simulations catalog</CardTitle>
            <CardDescription>Linked to roles and difficulty curve</CardDescription>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="pb-3 pe-4 font-semibold">Title</th>
                  <th className="pb-3 pe-4 font-semibold">Role</th>
                  <th className="pb-3 pe-4 font-semibold">Difficulty</th>
                  <th className="pb-3 font-semibold">Steps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {simulations.map((s) => (
                  <tr key={s.id} className="text-slate-700 dark:text-slate-200">
                    <td className="py-3 pe-4 font-medium text-slate-900 dark:text-white">{s.title}</td>
                    <td className="py-3 pe-4">{s.roleId}</td>
                    <td className="py-3 pe-4">
                      <Badge tone="brand">{s.difficulty}</Badge>
                    </td>
                    <td className="py-3">{s.steps.length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {tab === 'Opportunities' ? (
        <Card>
          <CardHeader>
            <CardTitle>Opportunity feed</CardTitle>
            <CardDescription>Moderation queue (mock counts)</CardDescription>
          </CardHeader>
          <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
            {opportunities.map((o) => (
              <li
                key={o.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 px-3 py-2 dark:border-slate-800"
              >
                <span className="font-medium text-slate-900 dark:text-white">{o.title}</span>
                <span className="text-xs text-slate-500">{o.org}</span>
                <Badge tone="neutral" className="capitalize">
                  {o.type}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {tab === 'Analytics' ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <label className="block max-w-sm text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Filter students
              <input
                value={studentQuery}
                onChange={(e) => setStudentQuery(e.target.value)}
                placeholder="Search by name"
                className="mt-2 w-full rounded-xl border border-slate-200 bg-surface-0 px-3 py-2 text-sm outline-none transition duration-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 dark:border-slate-800 dark:bg-surface-0 dark:text-slate-100"
              />
            </label>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Cohort employability</CardTitle>
              <CardDescription>Mock distribution by active learner</CardDescription>
            </CardHeader>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredStudents} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: axis, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={28}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgba(148,163,184,0.35)',
                      background: theme === 'dark' ? '#0f172a' : '#ffffff',
                      color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
                    }}
                  />
                  <Bar dataKey="employability" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Employability" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Student activity</CardTitle>
              <CardDescription>Simulations completed (mock)</CardDescription>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-slate-500 dark:text-slate-400">
                  <tr>
                    <th className="pb-3 pe-4 font-semibold">Student</th>
                    <th className="pb-3 pe-4 font-semibold">Sims</th>
                    <th className="pb-3 pe-4 font-semibold">Score</th>
                    <th className="pb-3 font-semibold">Last active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.map((u) => (
                    <tr key={u.id} className="text-slate-700 dark:text-slate-200">
                      <td className="py-3 pe-4 font-medium text-slate-900 dark:text-white">{u.name}</td>
                      <td className="py-3 pe-4">{u.simulations}</td>
                      <td className="py-3 pe-4">{u.employability}</td>
                      <td className="py-3 text-xs text-slate-500">{u.lastActive}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  )
}
