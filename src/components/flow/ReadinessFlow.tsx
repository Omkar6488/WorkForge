import { flowSteps } from '@/components/layout/nav'
import { cn } from '@/lib/cn'
import { Check } from 'lucide-react'

export function ReadinessFlow({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-surface-0 p-4 dark:border-slate-800 dark:bg-surface-1">
      <ol className="flex min-w-[720px] items-center gap-2">
        {flowSteps.map((step, idx) => {
          const done = idx < activeIndex
          const current = idx === activeIndex
          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                      done &&
                        'bg-emerald-500 text-white dark:bg-emerald-500',
                      current &&
                        !done &&
                        'bg-brand-600 text-white dark:bg-brand-500',
                      !current &&
                        !done &&
                        'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : idx + 1}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium',
                      current
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-500 dark:text-slate-400',
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                <div
                  className={cn(
                    'ms-4 h-0.5 rounded-full bg-slate-100 dark:bg-slate-800',
                    idx < flowSteps.length - 1 && 'me-2',
                  )}
                >
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      idx < activeIndex
                        ? 'w-full bg-emerald-400/90'
                        : 'w-0 bg-transparent',
                    )}
                  />
                </div>
              </div>
            </li>
          )
        })}
      </ol>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Guided path:{' '}
        <span className="font-medium text-slate-700 dark:text-slate-200">
          Student → Role → Mapping → Simulation → Evaluation → Passport →
          Opportunities → Job ready
        </span>
      </p>
    </div>
  )
}
