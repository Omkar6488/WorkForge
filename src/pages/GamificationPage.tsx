import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { badges, studentProfile } from '@/data/mock'
import { motion } from 'framer-motion'
import { Flame, Trophy } from 'lucide-react'

const nextLevelXp = 5000
const xpIntoLevel = studentProfile.xp % nextLevelXp

export function GamificationPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Gamification"
        title="XP, badges, and streaks — tuned for consistency, not gimmicks."
        description="Rewards reinforce behaviors that recruiters can verify: shipped tasks, reviewed simulations, and documented outcomes."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle>Experience points</CardTitle>
              <CardDescription>Level {studentProfile.level} · mock progression curve</CardDescription>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-800 dark:bg-orange-950/40 dark:text-orange-100">
              <Flame className="h-4 w-4" />
              {studentProfile.streakDays} day streak
            </div>
          </div>
          <p className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {studentProfile.xp.toLocaleString()}
            <span className="text-base font-medium text-slate-500"> XP</span>
          </p>
          <div className="mt-4">
            <div className="mb-2 flex justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Progress to next level</span>
              <span>
                {xpIntoLevel} / {nextLevelXp}
              </span>
            </div>
            <ProgressBar value={(xpIntoLevel / nextLevelXp) * 100} />
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Weekly challenge</CardTitle>
            <CardDescription>Mock rotating objective</CardDescription>
          </CardHeader>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            Complete one intermediate simulation and publish the write-up to your Skill Passport.
          </p>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            Reward: +250 XP · +1 recruiter visibility credit (mock)
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badges & achievements</CardTitle>
          <CardDescription>Collect evidence-linked milestones (mock tiers)</CardDescription>
        </CardHeader>
        <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b, i) => (
            <motion.div
              key={b.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={
                  b.locked
                    ? 'opacity-60 grayscale'
                    : 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)]'
                }
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="rounded-2xl bg-amber-50 p-2 text-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <Badge tone="warning">{b.tier}</Badge>
                </div>
                <CardTitle className="mt-3 text-base">{b.name}</CardTitle>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">+{b.xp} XP on unlock</p>
                {b.locked ? (
                  <p className="mt-3 text-xs font-medium text-slate-500 dark:text-slate-400">Locked</p>
                ) : (
                  <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-300">Unlocked</p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  )
}
