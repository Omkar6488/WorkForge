import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { type Simulation } from '@/data/mock'
import {
  X,
  Briefcase,
  Target,
  Zap,
  CheckCircle2,
  Clock,
  Award,
  ChevronRight,
} from 'lucide-react'
import { motion } from 'framer-motion'

const scenarioColors = {
  'Production Issue': 'text-red-600 dark:text-red-400',
  'Campaign Analysis': 'text-blue-600 dark:text-blue-400',
  'Performance Crisis': 'text-orange-600 dark:text-orange-400',
  'Quality Gate': 'text-purple-600 dark:text-purple-400',
  'Customer Issue': 'text-pink-600 dark:text-pink-400',
}

const scenarioBgColors = {
  'Production Issue': 'bg-red-50 dark:bg-red-900/20',
  'Campaign Analysis': 'bg-blue-50 dark:bg-blue-900/20',
  'Performance Crisis': 'bg-orange-50 dark:bg-orange-900/20',
  'Quality Gate': 'bg-purple-50 dark:bg-purple-900/20',
  'Customer Issue': 'bg-pink-50 dark:bg-pink-900/20',
}

export interface SimulationPreviewModalProps {
  simulation: Simulation
  onClose: () => void
  onStart: () => void
  isLoading?: boolean
}

export function SimulationPreviewModal({
  simulation,
  onClose,
  onStart,
  isLoading,
}: SimulationPreviewModalProps) {
  const scenarioTag = simulation.scenarioTag
  const scenarioColor = scenarioTag ? scenarioColors[scenarioTag] : 'text-brand-600'
  const scenarioBgColor = scenarioTag ? scenarioBgColors[scenarioTag] : 'bg-brand-50'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white dark:bg-slate-900"
      >
        {/* Header with close button */}
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg ${scenarioBgColor} p-2`}>
                <Briefcase className={`h-5 w-5 ${scenarioColor}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {simulation.title}
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {simulation.company}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/60 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Scenario tag */}
          {scenarioTag && (
            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <Badge tone={scenarioTag === 'Production Issue' ? 'danger' : 'brand'}>
                {scenarioTag}
              </Badge>
            </motion.div>
          )}

          {/* Problem Context */}
          {simulation.problemContext && (
            <motion.section initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Problem Context
              </h3>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {simulation.problemContext}
              </p>
            </motion.section>
          )}

          {/* Role Description */}
          {simulation.roleDescription && (
            <motion.section
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Award className="h-4 w-4" />
                Your Role
              </h3>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {simulation.roleDescription}
              </p>
            </motion.section>
          )}

          {/* What You'll Do */}
          {simulation.whatYouWillDo && simulation.whatYouWillDo.length > 0 && (
            <motion.section
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <CheckCircle2 className="h-4 w-4" />
                What You'll Do
              </h3>
              <ul className="space-y-2">
                {simulation.whatYouWillDo.map((task, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                    <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-600 dark:text-brand-400" />
                    {task}
                  </li>
                ))}
              </ul>
            </motion.section>
          )}

          {/* Tools You'll Use */}
          {simulation.tools && simulation.tools.length > 0 && (
            <motion.section
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Zap className="h-4 w-4" />
                Tools You'll Use
              </h3>
              <div className="flex flex-wrap gap-2">
                {simulation.tools.map((tool, idx) => (
                  <Badge key={idx} tone="neutral">
                    {tool}
                  </Badge>
                ))}
              </div>
            </motion.section>
          )}

          {/* Expected Outcome */}
          {simulation.expectedOutcome && (
            <motion.section
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                <Target className="h-4 w-4" />
                Expected Outcome
              </h3>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {simulation.expectedOutcome}
              </p>
            </motion.section>
          )}

          {/* Skills Gained */}
          <motion.section initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Skills You'll Build
            </h3>
            <div className="flex flex-wrap gap-2">
              {simulation.skills.map((skill, idx) => (
                <Badge key={idx} tone="brand">
                  {skill}
                </Badge>
              ))}
            </div>
          </motion.section>

          {/* Meta info */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="flex items-center gap-4 border-t border-slate-200 pt-4 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400"
          >
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {simulation.durationMin} minutes
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {simulation.steps.length} steps
            </span>
            <span>
              <Badge tone="brand" className="ml-auto">
                {simulation.difficulty}
              </Badge>
            </span>
          </motion.div>
        </div>

        {/* Footer CTA */}
        <div className="sticky bottom-0 border-t border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800">
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Back
            </Button>
            <Button onClick={onStart} disabled={isLoading} className="flex-1 gap-2">
              {isLoading ? 'Starting...' : 'Start Simulation'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
