import { cn } from '@/lib/cn'

export function SimulationStepper({
  current,
  total,
  className,
}: {
  current: number
  total: number
  className?: string
}) {
  const safeTotal = Math.max(1, total)
  const idx = Math.min(Math.max(0, current), safeTotal - 1)
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-surface-1/80 px-4 py-3 dark:border-slate-800 dark:bg-surface-1/60',
        className,
      )}
    >
      <p className="text-sm font-semibold text-slate-900 dark:text-white">
        Task {idx + 1} of {safeTotal}
      </p>
      <ol className="flex flex-1 flex-wrap items-center justify-end gap-1.5 min-w-[120px]">
        {Array.from({ length: safeTotal }, (_, i) => (
          <li
            key={i}
            className={cn(
              'h-2 w-6 rounded-full transition-all duration-300 ease-out sm:w-8',
              i < idx ? 'bg-emerald-500 dark:bg-emerald-400' : i === idx ? 'bg-brand-600 dark:bg-brand-500' : 'bg-slate-200 dark:bg-slate-700',
            )}
            title={`Step ${i + 1}`}
          />
        ))}
      </ol>
    </div>
  )
}
