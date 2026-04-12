import { ActivityChart } from '@/components/charts/ActivityChart'
import { SkillGrowthChart } from '@/components/charts/SkillGrowthChart'
import { CareerPathTimeline } from '@/components/career/CareerPathTimeline'
import { EmployabilityPanel } from '@/components/employability/EmployabilityPanel'
import { ReadinessFlow } from '@/components/flow/ReadinessFlow'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import {
  recentActivity,
  skillPassport,
  studentProfile,
  suggestedActions,
} from '@/data/mock'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

const container = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, staggerChildren: 0.06 },
  },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export function DashboardPage() {
  const avgSkill =
    skillPassport.reduce((acc, s) => acc + s.level, 0) / skillPassport.length

  return (
    <motion.div
      className="space-y-10"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <PageHeader
          eyebrow="Job readiness cockpit"
          title={`Hi ${studentProfile.name.split(' ')[0]} — stay hire-ready, not just exam-ready.`}
          description="Track how your skills translate to real delivery. Simulations update your passport; opportunities turn practice into momentum."
          action={
            <div className="flex flex-wrap gap-2">
              <div className="hidden lg:block">
                <Button to="/simulation">Run simulation</Button>
              </div>
            </div>
          }
        />
      </motion.div>

      <motion.div variants={item}>
        <ReadinessFlow activeIndex={2} />
      </motion.div>

      <motion.div variants={item} className="grid gap-6 lg:grid-cols-2">
        <EmployabilityPanel />
        <CareerPathTimeline />
      </motion.div>

      <motion.section variants={item} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-500 via-sky-400 to-brand-600" />
          <CardHeader>
            <CardTitle>Skill level (avg)</CardTitle>
            <CardDescription>Composite across mapped skills</CardDescription>
          </CardHeader>
          <p className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {avgSkill.toFixed(0)}
            <span className="text-lg font-medium text-slate-500">/100</span>
          </p>
          <ProgressBar value={avgSkill} className="mt-4" />
        </Card>

        <Card className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
          <CardHeader>
            <CardTitle>Employability score</CardTitle>
            <CardDescription>Weighted: skills · simulations · portfolio</CardDescription>
          </CardHeader>
          <div className="flex items-end justify-between gap-3">
            <p className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
              {studentProfile.employabilityScore}
            </p>
            <Badge tone="success">Top quartile (mock)</Badge>
          </div>
          <ProgressBar value={studentProfile.employabilityScore} className="mt-4" />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulations completed</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <p className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
            6
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            +2 vs prior month · strongest in frontend scenarios
          </p>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Practice streak</CardTitle>
            <CardDescription>Daily focused minutes</CardDescription>
          </CardHeader>
          <p className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {studentProfile.streakDays}
            <span className="text-lg font-medium text-slate-500"> days</span>
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Keep the chain — next milestone at 14 days unlocks bonus XP.
          </p>
        </Card>
      </motion.section>

      <motion.section variants={item} className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Skill growth</CardTitle>
            <CardDescription>Weekly composite from tasks + simulations</CardDescription>
          </CardHeader>
          <SkillGrowthChart />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity heat</CardTitle>
            <CardDescription>Focused minutes / day</CardDescription>
          </CardHeader>
          <ActivityChart />
        </Card>
      </motion.section>

      <motion.section variants={item} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Audit trail of readiness work</CardDescription>
          </CardHeader>
          <ul className="space-y-4">
            {recentActivity.map((ev) => (
              <li
                key={ev.id}
                className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0 dark:border-slate-800"
              >
                <p className="text-sm text-slate-800 dark:text-slate-100">{ev.text}</p>
                <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                  {ev.time}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-300" />
              <CardTitle>Suggested next actions</CardTitle>
            </div>
            <CardDescription>Prioritized for impact this week</CardDescription>
          </CardHeader>
          <ul className="space-y-4">
            {suggestedActions.map((s) => (
              <li
                key={s.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-surface-1/60 px-3 py-3 dark:border-slate-800 dark:bg-surface-0/40"
              >
                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                  {s.title}
                </p>
                <Button
                  to={s.href}
                  size="sm"
                  variant="secondary"
                  className="inline-flex items-center gap-1"
                >
                  {s.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      </motion.section>
    </motion.div>
  )
}
