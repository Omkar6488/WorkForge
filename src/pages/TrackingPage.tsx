import { ActivityChart } from '@/components/charts/ActivityChart'
import { PerformanceTrendChart } from '@/components/charts/PerformanceTrendChart'
import { SkillGrowthChart } from '@/components/charts/SkillGrowthChart'
import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { skillPassport, studentProfile } from '@/data/mock'
import { useTheme } from '@/context/useTheme'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts'

const radarData = skillPassport.map((s) => ({
  skill: s.label.split(' ')[0],
  level: s.level,
}))

export function TrackingPage() {
  const { theme } = useTheme()
  const stroke = theme === 'dark' ? '#334155' : '#e2e8f0'
  const tick = theme === 'dark' ? '#94a3b8' : '#64748b'

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Skill & employability tracking"
        title="Make progress legible — to you and to hiring teams."
        description="Composite scores blend simulations, artifacts, and mapped skills. This view is optimized for weekly reviews, not vanity metrics."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Employability score</CardTitle>
            <CardDescription>Weighted mock model (skills 45% · simulations 35% · portfolio 20%)</CardDescription>
          </CardHeader>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {studentProfile.employabilityScore}
                <span className="text-xl font-medium text-slate-500">/100</span>
              </p>
              <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">
                Crossing 80 unlocks recruiter visibility in this mock product story — keep shipping simulations with measurable outcomes.
              </p>
            </div>
            <Badge tone="success">Momentum: +6 pts / month</Badge>
          </div>
          <ProgressBar value={studentProfile.employabilityScore} className="mt-6" />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category balance</CardTitle>
            <CardDescription>Radar of mapped skills</CardDescription>
          </CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="78%">
                <PolarGrid stroke={stroke} />
                <PolarAngleAxis dataKey="skill" tick={{ fill: tick, fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: tick, fontSize: 10 }} />
                <Radar
                  name="Level"
                  dataKey="level"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.35}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skill growth</CardTitle>
            <CardDescription>Weekly composite</CardDescription>
          </CardHeader>
          <SkillGrowthChart />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Focused activity</CardTitle>
            <CardDescription>Minutes logged in deep work mode</CardDescription>
          </CardHeader>
          <ActivityChart />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance trend</CardTitle>
          <CardDescription>Simulation vs task scores over recent weeks (mock)</CardDescription>
        </CardHeader>
        <PerformanceTrendChart />
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Per-skill score</CardTitle>
          <CardDescription>Transparent breakdown for mentor conversations</CardDescription>
        </CardHeader>
        <div className="grid gap-5 md:grid-cols-2">
          {skillPassport.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-100 p-4 dark:border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{s.label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.category}</p>
                </div>
                <span className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                  {s.level}%
                </span>
              </div>
              <ProgressBar value={s.level} className="mt-3" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
