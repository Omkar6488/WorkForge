import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { analyticsLabSeries, performanceTrend } from '@/data/mock'
import { useTheme } from '@/context/useTheme'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BarChart3 } from 'lucide-react'

export function AnalyticsLabPanel() {
  const { theme } = useTheme()
  const axis = theme === 'dark' ? '#94a3b8' : '#64748b'
  const grid = theme === 'dark' ? '#1e293b' : '#e2e8f0'
  const tip = {
    borderRadius: 12,
    border: '1px solid rgba(148,163,184,0.35)',
    background: theme === 'dark' ? '#0f172a' : '#ffffff',
    color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-brand-600 dark:text-brand-400" />
            <CardTitle className="text-base">Conversion vs bounce</CardTitle>
          </div>
          <CardDescription>Interactive chart (mock cohort)</CardDescription>
        </CardHeader>
        <div className="h-64 px-2 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsLabSeries} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: axis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axis, fontSize: 11 }} axisLine={false} tickLine={false} width={32} />
              <Tooltip contentStyle={tip} />
              <Legend />
              <Bar dataKey="conv" name="Conv %" fill="#2563eb" radius={[6, 6, 0, 0]} />
              <Bar dataKey="bounce" name="Bounce %" fill="#94a3b8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance trend</CardTitle>
          <CardDescription>Sim vs task composite (mock)</CardDescription>
        </CardHeader>
        <div className="h-64 px-2 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceTrend} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
              <XAxis dataKey="week" tick={{ fill: axis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fill: axis, fontSize: 11 }} axisLine={false} tickLine={false} width={28} />
              <Tooltip contentStyle={tip} />
              <Legend />
              <Line type="monotone" dataKey="simScore" name="Sim score" stroke="#2563eb" strokeWidth={2} dot />
              <Line type="monotone" dataKey="taskScore" name="Task score" stroke="#38bdf8" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
