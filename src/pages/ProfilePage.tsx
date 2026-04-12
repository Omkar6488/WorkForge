import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import {
  achievements,
  certifications,
  completedSimulationsForPortfolio,
  portfolioItems,
  skillCategories,
  skillPassport,
  studentProfile,
} from '@/data/mock'
import { Briefcase, Map, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

const achievementIcon = {
  zap: Zap,
  map: Map,
  briefcase: Briefcase,
}

export function ProfilePage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Student profile"
        title="Skill Passport"
        description="Your employability story: verified skills, artifacts from simulations, and proof of execution — not just coursework."
      />

      <Card className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-xl font-semibold text-white dark:bg-brand-500">
            {studentProfile.avatarInitials}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              {studentProfile.name}
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {studentProfile.degree} · {studentProfile.college} · {studentProfile.year}
            </p>
            <p className="mt-3 max-w-2xl text-sm text-slate-700 dark:text-slate-200">
              {studentProfile.headline}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {studentProfile.interests.map((tag) => (
                <Badge key={tag} tone="brand">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="grid w-full max-w-sm gap-3 rounded-2xl bg-surface-1/80 p-4 dark:bg-surface-0/60 lg:w-auto">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">XP</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {studentProfile.xp.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Level</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {studentProfile.level}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Employability</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-300">
              {studentProfile.employabilityScore}/100
            </span>
          </div>
          <Link
            to="/gamification"
            className="text-center text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300"
          >
            View achievements →
          </Link>
        </div>
      </Card>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mapped skills</CardTitle>
            <CardDescription>Levels inferred from tasks & simulations</CardDescription>
          </CardHeader>
          <div className="space-y-4">
            {skillPassport.map((s) => (
              <div key={s.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-800 dark:text-slate-100">
                    {s.label}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400">{s.level}%</span>
                </div>
                <ProgressBar value={s.level} />
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{s.category}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Signals of consistency and depth</CardDescription>
            </CardHeader>
            <ul className="space-y-3">
              {achievements.map((a) => {
                const Icon = achievementIcon[a.icon]
                return (
                  <li
                    key={a.id}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-surface-1/60 p-3 dark:border-slate-800 dark:bg-surface-0/50"
                  >
                    <div className="mt-0.5 rounded-lg bg-brand-50 p-2 text-brand-700 dark:bg-brand-900 dark:text-sky-100">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {a.title}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{a.desc}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certifications</CardTitle>
              <CardDescription>Micro-credentials issued on-platform</CardDescription>
            </CardHeader>
            <ul className="space-y-3">
              {certifications.map((c) => (
                <li
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm dark:border-slate-800"
                >
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{c.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{c.issuer}</p>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{c.date}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Skill categories</CardTitle>
          <CardDescription>Grouped view of passport tags</CardDescription>
        </CardHeader>
        <div className="flex flex-wrap gap-2 px-5 pb-5">
          {skillCategories.map((cat) => {
            const inCat = skillPassport.filter((s) => s.category === cat)
            if (!inCat.length) return null
            return (
              <div
                key={cat}
                className="min-w-[140px] flex-1 rounded-xl border border-slate-100 bg-surface-1/60 px-3 py-2 dark:border-slate-800 dark:bg-surface-0/50"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {cat}
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{inCat.length}</p>
                <p className="text-[11px] text-slate-500">skills mapped</p>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Portfolio highlights</CardTitle>
          <CardDescription>Artifacts generated from simulations (mock)</CardDescription>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-3">
          {portfolioItems.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border border-slate-100 bg-surface-1/60 p-4 transition-shadow duration-200 hover:shadow-[var(--shadow-card)] dark:border-slate-800 dark:bg-surface-0/50"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{p.title}</p>
              <p className="mt-1 text-xs text-brand-700 dark:text-brand-300">{p.role}</p>
              <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">{p.impact}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Completed simulations</CardTitle>
          <CardDescription>Outputs you can attach to applications (mock)</CardDescription>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-3">
          {completedSimulationsForPortfolio.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-slate-100 bg-surface-1/60 p-4 dark:border-slate-800 dark:bg-surface-0/50"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{c.title}</p>
              <p className="mt-2 text-xs text-slate-500">{c.date}</p>
              <p className="mt-3 text-2xl font-semibold text-brand-700 dark:text-brand-300">{c.score}</p>
              <p className="text-xs text-slate-500">composite score</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
