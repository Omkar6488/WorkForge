import { activitySeries } from '@/data/mock'
import { useTheme } from '@/context/useTheme'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function ActivityChart() {
  const { theme } = useTheme()
  const axis = theme === 'dark' ? '#94a3b8' : '#64748b'
  const grid = theme === 'dark' ? '#1e293b' : '#e2e8f0'

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={activitySeries} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey="day" tick={{ fill: axis, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            tick={{ fill: axis, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={32}
            label={{ value: 'min', angle: -90, position: 'insideLeft', fill: axis, fontSize: 11 }}
          />
          <Tooltip
            cursor={{ fill: theme === 'dark' ? 'rgba(148,163,184,0.08)' : 'rgba(15,23,42,0.06)' }}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgba(148,163,184,0.35)',
              background: theme === 'dark' ? '#0f172a' : '#ffffff',
              color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
            }}
          />
          <Bar dataKey="minutes" fill="#60a5fa" radius={[6, 6, 0, 0]} name="Focused minutes" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
