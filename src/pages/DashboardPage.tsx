import React from 'react'
import { SkillGrowthChart } from '@/components/charts/SkillGrowthChart'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useAppStore } from '@/store/appStore'
import { getWeakestSkill, getSkillZone, calculateEmployabilityScore } from '@/selectors'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

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

const SEED_SKILLS = [
  { skillId: 'react', label: 'React', level: 72, category: 'Frontend' as const },
  { skillId: 'ts', label: 'TypeScript', level: 64, category: 'Engineering' as const },
  { skillId: 'sql', label: 'SQL', level: 58, category: 'Data' as const },
  { skillId: 'api', label: 'REST APIs', level: 61, category: 'Backend' as const },
  { skillId: 'seo', label: 'SEO & Analytics', level: 45, category: 'Marketing' as const },
  { skillId: 'comm', label: 'Stakeholder Comms', level: 70, category: 'Professional' as const },
]

export function DashboardPage() {
  // ===== NEW ARCHITECTURE: Read from centralized store =====
  const skills = useAppStore((_state: any) => _state.skills || SEED_SKILLS)

  // ===== DERIVED DATA: Computed from store using selectors =====
  const weakestSkill = getWeakestSkill(skills) || skills[0]
  const employabilityScore = calculateEmployabilityScore(skills)

  const skillsWithZone = React.useMemo(() => 
    skills.map((skill: any) => ({
      ...skill,
      zone: getSkillZone(skill.level),
    })),
    [skills]
  )

  // REMOVED: Opportunity psychology metrics (overly gamified)

  return (
    <motion.div
      className="space-y-8"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* === SECTION 1: HEADLINE & PRIMARY ACTION === */}
      {/* RESTRUCTURED: Compact row-based layout with title/CTA on top and inline status below */}
      <motion.div variants={item}>
        <div className="space-y-3">
          {/* ROW 1: Title (left) + CTA (right) */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Your career readiness at a glance
              </h1>
            </div>
            <div className="shrink-0">
              <Button
                to={`/simulation/run/be-api-hardening`}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-6 py-2.5"
                size="sm"
              >
                Improve {weakestSkill.label}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>

          {/* ROW 2: Inline status + time estimate */}
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600 dark:text-slate-300">
              Score: <span className="font-semibold text-slate-900 dark:text-white">{employabilityScore}</span> / 100
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-600 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">Project stage</span>
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-600 dark:text-slate-300">
              1 project away from internship readiness
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-500 dark:text-slate-400">~30 min to complete</span>
          </div>

          {/* ROW 3: Progression path - compact and scrollable */}
          <div className="mt-1 flex items-center gap-1.5 overflow-x-auto pb-1.5">
            {['Learn', 'Simulate', 'Project', 'Internship', 'Job'].map((stage, idx) => (
              <div key={stage} className="flex items-center gap-1.5 shrink-0">
                <div className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                  idx === 2 // Project is current (index 2)
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                    : idx < 2
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {stage}
                </div>
                {idx < 4 && <div className="text-slate-400 dark:text-slate-500 text-xs shrink-0">→</div>}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* === SECTION 2: READINESS & BLOCKERS === */}
      {/* SIMPLIFIED & RESTRUCTURED: Merged readiness engine into a single, cohesive card */}
      <motion.div variants={item}>
        <Card className="border-slate-200/40 dark:border-slate-700/40">
          <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
            <CardTitle>Readiness summary</CardTitle>
            <CardDescription>Your current gap and path to the next stage</CardDescription>
          </CardHeader>

          <div className="p-5">
            {/* RESTYLED: Clean 2-column layout for primary metrics */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6 pb-6 border-b border-slate-200/50 dark:border-slate-700/50">
              {/* LEFT: Blocker (made neutral, not alarmist) */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                  Primary gap
                </p>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {weakestSkill.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {skills.find((s: any) => s.label === weakestSkill?.label)?.level || 0}%
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Required for next stage: 65%+
                  </p>
                </div>
              </div>

              {/* RIGHT: Next milestone (explicit, user-facing) */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500">
                  To reach: Internship stage
                </p>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    1 project away
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    You'll also need:
                  </p>
                  <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1 mt-2">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 dark:text-slate-500 mt-0.5">•</span>
                      <span>{weakestSkill?.label} at 65%+ (currently {skills.find((s: any) => s.label === weakestSkill?.label)?.level || 0}%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 dark:text-slate-500 mt-0.5">•</span>
                      <span>1 capstone project</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SIMPLIFIED: Skill readiness - top 5 skills only, clean visual */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 mb-3">
                Skill profile
              </p>
              <div className="space-y-2">
                {skillsWithZone.slice(0, 5).map((skill: any) => (
                  <div key={skill.skillId} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {skill.label}
                      </p>
                      <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                        {skill.level}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          skill.level >= 70
                            ? 'bg-emerald-500'
                            : skill.level >= 50
                              ? 'bg-amber-500'
                              : 'bg-slate-400 opacity-60'
                        }`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* === SECTION 3: OPPORTUNITIES === */}
      {/* SIMPLIFIED & REFINED: Professional, outcome-focused. No celebratory tone. */}
      <motion.div variants={item}>
        <Card className="border-slate-200/40 dark:border-slate-700/40">
          <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
            <CardTitle>Active opportunities</CardTitle>
            <CardDescription>What you can apply to right now</CardDescription>
          </CardHeader>

          <div className="p-6">
            <div className="space-y-4">
              {/* REFINED: Clear opportunity summary */}
              <div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">
                  2 matching opportunities available
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  React micro-internships • Avg. time to offer: 2–3 weeks
                </p>
              </div>

              {/* REFINED: Status indicator */}
              <div>
                <Badge tone="success">Qualified</Badge>
              </div>

              {/* POLISHED: Secondary CTA with consistent sizing */}
              <Button
                to="/opportunities"
                className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-4 py-2"
                size="sm"
              >
                Browse opportunities
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* === SECTION 4: PROGRESS TRAJECTORY === */}
      {/* REFINED: Factual progress metrics without motivation language */}
      <motion.div variants={item}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* LEFT: Progress metrics (2-column internal layout) */}
          <Card className="border-slate-200/40 dark:border-slate-700/40">
            <CardHeader>
              <CardTitle className="text-lg">Progress metrics</CardTitle>
              <CardDescription>Activity and growth this month</CardDescription>
            </CardHeader>

            {/* LAYOUT: 2-column internal grid for balanced metrics */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                {/* LEFT COLUMN */}
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Score gain (4 weeks)</p>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">+12</p>
                  </div>
                  <div className="h-0.5 bg-slate-200/50 dark:bg-slate-700/50"></div>
                  <div className="flex flex-col">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Simulations completed</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">8</p>
                  </div>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-3">
                  <div className="flex flex-col">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Active days (this week)</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3 / 7</p>
                  </div>
                  <div className="h-0.5 bg-slate-200/50 dark:bg-slate-700/50"></div>
                  <div className="flex flex-col">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Consistency streak</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">5 days</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* RIGHT: Projection (factual, not hyped) */}
          <Card className="border-slate-200/40 dark:border-slate-700/40">
            <CardHeader>
              <CardTitle className="text-lg">Projected timeline</CardTitle>
              <CardDescription>Based on current velocity</CardDescription>
            </CardHeader>

            <div className="p-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Internship readiness</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">~14 days</p>
                </div>
                <div className="h-0.5 bg-slate-200/50 dark:bg-slate-700/50"></div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Junior role readiness</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">~6–8 weeks</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* === SECTION 5: SKILL GROWTH CHART === */}
      {/* KEPT: Visual progression view */}
      <motion.div variants={item}>
        <Card className="border-slate-200/40 dark:border-slate-700/40">
          <CardHeader className="border-b border-slate-200/50 dark:border-slate-700/50">
            <CardTitle>Skill progression</CardTitle>
            <CardDescription>Weekly growth from projects and simulations</CardDescription>
          </CardHeader>
          <SkillGrowthChart />
        </Card>
      </motion.div>
    </motion.div>
  )
}
