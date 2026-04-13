import { Badge } from '@/components/ui/Badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Button } from '@/components/ui/Button'
import { badges, studentProfile } from '@/data/mock'
import { motion } from 'framer-motion'
import { Flame, Trophy, Zap } from 'lucide-react'

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

      {/* === A. IMPROVEMENT: Enhanced XP section with employability connection === */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <CardTitle>Experience points</CardTitle>
              <CardDescription>Level {studentProfile.level} · mock progression curve</CardDescription>
            </div>
            {/* === E. IMPROVEMENT: Enhanced streak display with urgency messaging === */}
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

          {/* === A. IMPROVEMENT: Added explanatory microcopy connecting XP to employability === */}
          <div className="mt-6 space-y-2 border-t border-slate-100 pt-6 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              How XP impacts your readiness
            </p>
            <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
              <li>
                • <span className="font-medium">XP reflects effort:</span> Completing simulations, shipping tasks, and maintaining streaks earns points.
              </li>
              <li>
                • <span className="font-medium">Higher level = recruiter credibility:</span> Your XP level signals sustained, hands-on work.
              </li>
              <li>
                • <span className="font-medium">Visible benefit:</span> Level 15+ unlocks "Advanced track" opportunities on WorkForge.
              </li>
            </ul>
          </div>
        </Card>

        {/* === B. IMPROVEMENT: Rewritten weekly challenge with outcome-driven messaging === */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Weekly challenge
            </CardTitle>
            <CardDescription>Action-driven, high-impact</CardDescription>
          </CardHeader>
          <div className="space-y-4 px-5 pb-6">
            {/* Challenge: Outcome-driven title */}
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                Boost Backend Readiness
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Complete 1 backend simulation and submit write-up
              </p>
            </div>

            {/* Why it matters */}
            <div className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 dark:border-slate-700/60 dark:bg-slate-900/30">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Why it matters
              </p>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                Backend is your weakest area (currently 61/100). Closing this gap unlocks internship eligibility.
              </p>
            </div>

            {/* Reward */}
            <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-2 dark:bg-emerald-950/30">
              <span className="text-xs text-emerald-900 dark:text-emerald-100">Reward</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                +300 XP · Unlock advanced track
              </span>
            </div>

            {/* CTA */}
            <Button to="/simulation" size="sm" variant="secondary" className="w-full">
              Start challenge
            </Button>
          </div>
        </Card>
      </div>

      {/* === D. IMPROVEMENT: Added employability relevance context section === */}
      <Card className="border-blue-200 bg-blue-50/40 dark:border-blue-900/50 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="text-sm">Gamification for career outcomes</CardTitle>
        </CardHeader>
        <p className="px-5 pb-5 text-xs text-slate-700 dark:text-slate-300">
          Badges, XP, and streaks are designed to reinforce <span className="font-semibold">consistent effort</span>, 
          <span className="font-semibold"> practical proof</span>, and <span className="font-semibold">job-readiness</span>. 
          Every reward unlocks real opportunities—internships, mentorship priority, and recruiter visibility. 
          Progress here translates directly to your employability score.
        </p>
      </Card>

      {/* === C. IMPROVEMENT: Enhanced badge cards with unlock conditions and practical benefits === */}
      <Card>
        <CardHeader>
          <CardTitle>Badges & achievements</CardTitle>
          <CardDescription>Collect evidence-linked milestones (mock tiers)</CardDescription>
        </CardHeader>
        <div className="grid gap-4 px-5 pb-5 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b, i) => {
            // === C. IMPROVEMENT: Added unlock conditions and practical benefits metadata ===
            const badgeMetadata: Record<
              string,
              {
                unlockCondition: string
                benefit: string
              }
            > = {
              b1: {
                unlockCondition: 'Complete your first simulation',
                benefit: 'Signals hands-on readiness to recruiters',
              },
              b2: {
                unlockCondition: 'Map skills for 2 different roles',
                benefit: 'Shows career clarity and role exploration',
              },
              b3: {
                unlockCondition: 'Reach employability score 85+',
                benefit:
                  'Qualifies you for senior-tier internship opportunities',
              },
              b4: {
                unlockCondition: 'Maintain 14-day focus streak',
                benefit: 'Demonstrates consistent discipline and commitment',
              },
            }
            const meta = badgeMetadata[b.id] || {
              unlockCondition: 'Complete related tasks',
              benefit: 'Unlock career opportunities',
            }

            return (
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

                  {/* === C. IMPROVEMENT: Enhanced badge info: unlock condition, benefit, XP === */}
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Unlock:</span> {meta.unlockCondition}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-medium">Benefit:</span> {meta.benefit}
                    </p>
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                      +{b.xp} XP on unlock
                    </p>
                  </div>

                  {/* Status: Unlocked or locked with next action hint */}
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                    {b.locked ? (
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Locked · Work toward the unlock condition above
                      </p>
                    ) : (
                      <p className="text-xs font-medium text-emerald-600 dark:text-emerald-300">
                        ✓ Unlocked
                      </p>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </Card>

      {/* === E. IMPROVEMENT: Streak maintenance section with urgency/supportive messaging === */}
      <Card className="border-orange-200 bg-orange-50/40 dark:border-orange-900/50 dark:bg-orange-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Flame className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            Keep your streak alive
          </CardTitle>
        </CardHeader>
        <div className="space-y-3 px-5 pb-5">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            You're on a <span className="font-semibold text-orange-700 dark:text-orange-300">{studentProfile.streakDays}-day streak</span>. 
            Maintain it tomorrow with one 10-minute task to stay focused.
          </p>
          <div className="pt-2">
            <Button
              to="/learning"
              size="sm"
              className="bg-orange-700 hover:bg-orange-800 dark:bg-orange-600 dark:hover:bg-orange-700"
            >
              Continue streak
            </Button>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Hint: A short daily task counts. Focus over hours.
          </p>
        </div>
      </Card>
    </div>
  )
}
