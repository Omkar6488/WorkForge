import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { type Simulation, type Role } from '@/data/mock'
import { Clock, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react'

interface PreviewModalProps {
  simulation: Simulation
  role: Role
  isOpen: boolean
  onClose: () => void
}

export function PreviewModal({ simulation, role, isOpen, onClose }: PreviewModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={simulation.title}
      description={simulation.company}
      className="max-w-2xl"
    >
      <div className="space-y-6 pt-4">
        {/* Summary and Difficulty */}
        <div className="space-y-3">
          <p className="text-sm text-slate-700 dark:text-slate-300">{simulation.summary}</p>
          <div className="flex flex-wrap gap-2">
            {simulation.kind === 'traffic' ? (
              <Badge tone="warning">Traffic ops</Badge>
            ) : null}
            <Badge tone="brand">{simulation.difficulty}</Badge>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Duration</div>
            <div className="mt-2 flex items-center gap-2 text-lg font-semibold">
              <Clock className="h-5 w-5 text-brand-600" />
              ~{simulation.durationMin} min
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Tasks</div>
            <div className="mt-2 text-lg font-semibold">{simulation.steps.length} steps</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">Role</div>
            <div className="mt-2 text-lg font-semibold">{role.title}</div>
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Skills Covered</h3>
          <div className="flex flex-wrap gap-2">
            {simulation.skills.map((skill) => (
              <Badge key={skill} tone="neutral">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Task Timeline */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Task Flow</h3>
          <div className="space-y-3">
            {simulation.steps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="relative flex flex-col items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-100">
                    <span className="text-xs font-semibold">{idx + 1}</span>
                  </div>
                  {idx < simulation.steps.length - 1 && (
                    <div className="absolute top-8 h-6 w-0.5 bg-slate-200 dark:bg-slate-700" />
                  )}
                </div>
                <div className="flex-1 pb-2 pt-1">
                  <div className="font-medium text-slate-900 dark:text-white">{step.title}</div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evaluation Criteria */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">What We Evaluate</h3>
          <div className="space-y-2">
            {[
              'Problem-solving approach',
              'Speed and efficiency',
              'Attention to detail',
              'Communication of decisions',
            ].map((criterion, idx) => (
              <div key={idx} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                {criterion}
              </div>
            ))}
          </div>
        </div>

        {/* Prerequisites */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-900/20">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
            <div className="text-sm text-slate-700 dark:text-slate-300">
              <span className="font-semibold text-slate-900 dark:text-white">Prerequisites:</span> Familiarity with{' '}
              {simulation.skills.slice(0, 2).join(', ')}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-3 border-t border-slate-200 pt-6 dark:border-slate-800">
          <Button to={`/simulation/run/${simulation.id}`} className="inline-flex items-center gap-2 flex-1">
            Launch Simulation
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Close Preview
          </Button>
        </div>
      </div>
    </Modal>
  )
}
