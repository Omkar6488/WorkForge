import { cn } from '@/lib/cn'
import { careerPathPhases } from '@/data/mock'
import { Check, ChevronRight } from 'lucide-react'

export function CareerPathTimeline({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-surface-0 p-6 shadow-[var(--shadow-card)] transition-shadow duration-300 dark:border-slate-800 dark:bg-surface-1',
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
        Career path
      </p>
      <h3 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
        Learn → Simulate → Project → Internship → Job
      </h3>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2 md:justify-between">
        {careerPathPhases.map((phase, idx) => (
          <div key={phase.id} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-transform duration-200 hover:scale-105',
                  phase.status === 'done' && 'bg-emerald-500 text-white',
                  phase.status === 'active' &&
                    'bg-brand-600 text-white ring-4 ring-brand-200/70 dark:ring-brand-800/60',
                  phase.status === 'upcoming' && 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
                )}
              >
                {phase.status === 'done' ? <Check className="h-5 w-5" /> : idx + 1}
              </div>
              <span className="max-w-[5.5rem] text-center text-[11px] font-medium leading-tight text-slate-800 dark:text-slate-100">
                {phase.label}
              </span>
            </div>
            {idx < careerPathPhases.length - 1 ? (
              <ChevronRight className="hidden h-5 w-5 shrink-0 text-slate-400 sm:block" aria-hidden />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
