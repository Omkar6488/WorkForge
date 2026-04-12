import { performanceTrend } from '@/data/mock'
import { useTheme } from '@/context/useTheme'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export function PerformanceTrendChart() {
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
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={performanceTrend} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey="week" tick={{ fill: axis, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis domain={[40, 100]} tick={{ fill: axis, fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
          <Tooltip contentStyle={tip} />
          <Legend />
          <Line type="monotone" dataKey="simScore" name="Simulation score" stroke="#2563eb" strokeWidth={2.5} dot />
          <Line type="monotone" dataKey="taskScore" name="Task score" stroke="#38bdf8" strokeWidth={2} dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
