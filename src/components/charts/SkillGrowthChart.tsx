import { skillGrowthSeries } from '@/data/mock'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '@/context/useTheme'

export function SkillGrowthChart() {
  const { theme } = useTheme()
  const axis = theme === 'dark' ? '#94a3b8' : '#64748b'
  const grid = theme === 'dark' ? '#1e293b' : '#e2e8f0'

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={skillGrowthSeries} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
          <XAxis dataKey="week" tick={{ fill: axis, fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis
            domain={[40, 100]}
            tick={{ fill: axis, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgba(148,163,184,0.35)',
              background: theme === 'dark' ? '#0f172a' : '#ffffff',
              color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={2.5}
            dot={{ r: 3, stroke: '#3b82f6', fill: theme === 'dark' ? '#0b1222' : '#fff' }}
            activeDot={{ r: 5 }}
            name="Composite skill score"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
