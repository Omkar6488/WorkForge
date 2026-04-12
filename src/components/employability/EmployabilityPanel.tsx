import { CircularScore } from '@/components/ui/CircularScore'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { employabilityBreakdown, studentProfile } from '@/data/mock'
import { Badge } from '@/components/ui/Badge'

export function EmployabilityPanel() {
  const { overall, skills, simulations, projects, level } = employabilityBreakdown
  const tier: 'success' | 'brand' | 'neutral' =
    level === 'Industry-Ready' ? 'success' : level === 'Ready' ? 'brand' : 'neutral'

  return (
    <Card className="transition-shadow duration-300 hover:shadow-[var(--shadow-float)]">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Employability score</CardTitle>
          <CardDescription>Weighted mock breakdown — skills, simulations, projects</CardDescription>
        </div>
        <Badge tone={tier}>{level}</Badge>
      </CardHeader>
      <div className="flex flex-col items-center gap-8 px-5 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <CircularScore
          value={overall}
          size={132}
          label="Overall"
          sublabel={`Levels: Beginner · Ready · Industry-Ready — you are mapped to “${level}”.`}
        />
        <div className="w-full max-w-md flex-1 space-y-4">
          <div>
            <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
              <span>Skills evidence</span>
              <span>{skills}%</span>
            </div>
            <ProgressBar value={skills} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
              <span>Simulations depth</span>
              <span>{simulations}%</span>
            </div>
            <ProgressBar value={simulations} />
          </div>
          <div>
            <div className="mb-1 flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300">
              <span>Projects & artifacts</span>
              <span>{projects}%</span>
            </div>
            <ProgressBar value={projects} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Passport owner: {studentProfile.name} · refresh weekly after each simulation block.
          </p>
        </div>
      </div>
    </Card>
  )
}
