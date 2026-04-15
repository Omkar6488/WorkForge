import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { badges, studentProfile } from '@/data/mock'
import { motion } from 'framer-motion'
import { Trophy, Zap, ArrowRight } from 'lucide-react'

const nextLevelXp = 5000
const xpIntoLevel = studentProfile.xp % nextLevelXp

export function GamificationPage() {
  return (
    <div className="flex justify-center">
      {/* HEIGHT FIX: Outer container with reduced section gaps */}
      <div className="w-full max-w-5xl space-y-3">
      {/* === ZONE 1: PROGRESS OVERVIEW === */}
      {/* Compact horizontal overview, high density */}
      {/* REFINED SPACING: Tightened header section */}
      <div className="space-y-1">
        <PageHeader title="Career progress" />

        {/* HEADER TIGHTEN: Reduced margin-top to eliminate double-spacing */}
        {/* SPACING REDUCED: Compact XP card */}
        <div className="mt-1.5 space-y-1.5 rounded-lg border border-slate-200/50 bg-slate-50/30 p-3 dark:border-slate-700/50 dark:bg-slate-900/30">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="font-semibold text-slate-900 dark:text-white">
              {studentProfile.xp.toLocaleString()} XP
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-600 dark:text-slate-400">
              Level <span className="font-semibold text-slate-900 dark:text-white">{studentProfile.level}</span>
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-600 dark:text-slate-400">
              {xpIntoLevel.toLocaleString()} / {nextLevelXp.toLocaleString()} to next level
            </span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-600 dark:text-slate-400">
              Streak: <span className="font-semibold text-slate-900 dark:text-white">{studentProfile.streakDays} days</span>
            </span>
          </div>
          <div className="pt-0.5">
            <ProgressBar value={(xpIntoLevel / nextLevelXp) * 100} />
          </div>
        </div>
      </div>

      {/* === ZONE 2: NEXT UNLOCK (PRIMARY) === */}
      {/* REBUILT: Structured, high-impact action card */}
      <Card className="border-blue-200/40 dark:border-blue-800/40 bg-blue-50/20 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Next unlock
          </CardTitle>
        </CardHeader>

        {/* LAYOUT: 2-column grid - left (target + requirements) | right (reward + impact + CTA) */}
        {/* SPACING REDUCED: Tightened gap and padding */}
        <div className="grid grid-cols-1 gap-3 px-6 pb-4 md:grid-cols-2">
          {/* LEFT COLUMN: Target & Requirements */}
          <div className="space-y-2">
            {/* What is being unlocked */}
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                Advanced track access
              </p>
            </div>

            {/* Requirements */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Requirements
              </p>
              {/* SPACING REDUCED: Tightened list */}
              <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-0.5 mt-1">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0">•</span>
                  <span>Reach level 15</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 dark:text-slate-500 mt-0.5 shrink-0">•</span>
                  <span>Complete 1 backend simulation</span>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Reward, Impact, CTA */}
          {/* CARD COMPACTED: Reduced vertical spacing */}
          <div className="flex flex-col space-y-2">
            {/* REFINED: Compact reward & impact stacking */}
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Reward</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">+300 XP</p>
            </div>

            <div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Impact</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Internship eligibility</p>
            </div>

            {/* RESPONSIVE: CTA button at bottom of right column */}
            <div className="pt-0.5">
              <Button to="/simulation" size="sm" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 text-white">
                Start task
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* === ZONE 3: BADGES === */}
      {/* REFINED: Clean badge grid with unlock conditions and proof */}
      <Card>
        <CardHeader>
          <CardTitle>Badges & milestones</CardTitle>
          <CardDescription>Verified achievement tiers</CardDescription>
        </CardHeader>

        <div className="grid gap-2 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b, i) => {
            // REFINED: Minimal metadata for each badge
            const badgeMetadata: Record<
              string,
              {
                unlockCondition: string
                proves: string
              }
            > = {
              b1: {
                unlockCondition: 'Complete first simulation',
                proves: 'Practical readiness',
              },
              b2: {
                unlockCondition: 'Map 2 different roles',
                proves: 'Career clarity',
              },
              b3: {
                unlockCondition: 'Score 85+',
                proves: 'Advanced capability',
              },
              b4: {
                unlockCondition: '14-day streak',
                proves: 'Consistent discipline',
              },
            }
            const meta = badgeMetadata[b.id] || {
              unlockCondition: 'Complete related tasks',
              proves: 'Verified progress',
            }

            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div
                  className={`rounded-lg border p-2.5 transition-all ${
                    b.locked
                      ? 'border-slate-200/20 bg-slate-50/10 opacity-60 dark:border-slate-700/20 dark:bg-slate-900/5'
                      : 'border-slate-200/60 bg-white dark:border-slate-700/60 dark:bg-slate-900/50'
                  }`}
                >
                  {/* Header: Icon + Title + Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className={`rounded-lg p-2 shrink-0 ${
                      b.locked
                        ? 'bg-slate-200/10 text-slate-400 dark:bg-slate-800/20 dark:text-slate-600'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    }`}>
                      <Trophy className="h-4 w-4" />
                    </div>
                    {!b.locked && <Badge tone="success" className="text-xs shrink-0">Earned</Badge>}
                  </div>

                  {/* Title */}
                  <p className={`mt-1 text-sm font-semibold ${
                    b.locked
                      ? 'text-slate-500 dark:text-slate-600'
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {b.name}
                  </p>

                  {/* XP prominently displayed */}
                  <p className={`text-xs font-bold ${
                    b.locked
                      ? 'text-slate-400 dark:text-slate-600'
                      : 'text-amber-700 dark:text-amber-300'
                  } mt-1`}>
                    +{b.xp} XP
                  </p>

                  {/* What it proves */}
                  <p className={`text-xs ${
                    b.locked
                      ? 'text-slate-500 dark:text-slate-600'
                      : 'text-slate-600 dark:text-slate-400'
                  } mt-1`}>
                    {meta.proves}
                  </p>

                  {/* Unlock condition */}
                  <p className={`text-xs mt-1 pt-1 border-t ${
                    b.locked
                      ? 'border-slate-200/10 text-slate-500 dark:border-slate-700/10 dark:text-slate-600'
                      : 'border-slate-200/30 text-slate-600 dark:border-slate-700/30 dark:text-slate-400'
                  }`}>
                    {b.locked ? `Unlock: ${meta.unlockCondition}` : `✓ Unlocked`}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Card>
      </div>
    </div>
  )
}
