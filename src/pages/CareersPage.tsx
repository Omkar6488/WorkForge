import { CareerPathTimeline } from '@/components/career/CareerPathTimeline'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { roles } from '@/data/mock'
import { motion } from 'framer-motion'

export function CareersPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Career explorer"
        title="Choose a lane. WorkForge maps the execution bar."
        description="Each role card shows the skills hiring managers actually test — then we connect you to simulations, gaps, and opportunities in one flow."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {roles.map((role, idx) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.35 }}
          >
            <Card className="h-full hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] transition-transform duration-300">
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle>{role.title}</CardTitle>
                    <CardDescription className="mt-2">{role.blurb}</CardDescription>
                  </div>
                  <Badge tone="brand">{role.id}</Badge>
                </div>
              </CardHeader>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Required skills
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {role.requiredSkills.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Learning path
                  </p>
                  <ol className="mt-2 list-decimal space-y-1 ps-4 text-slate-700 dark:text-slate-200">
                    {role.learningPath.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-surface-1/80 p-3 dark:bg-surface-0/60">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Salary range
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                      {role.salaryRange}
                    </p>
                  </div>
                  <div className="rounded-xl bg-surface-1/80 p-3 dark:bg-surface-0/60">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Growth path
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">
                      {role.growthPath}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button to={`/skill-gap?role=${role.id}`} size="sm" variant="secondary">
                    Analyze gaps
                  </Button>
                  <Button to={`/simulation?role=${role.id}`} size="sm">
                    Practice simulations
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <CareerPathTimeline />
    </div>
  )
}
