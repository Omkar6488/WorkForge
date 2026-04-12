import { cn } from '@/lib/cn'

export function ProgressBar({
  value,
  className,
  trackClassName,
}: {
  value: number
  className?: string
  trackClassName?: string
}) {
  const v = Math.min(100, Math.max(0, value))
  return (
    <div
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800',
        trackClassName,
      )}
    >
      <div
        className={cn(
          'h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500 ease-out dark:from-brand-400 dark:to-brand-300',
          className,
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  )
}
