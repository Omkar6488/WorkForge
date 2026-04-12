import { cn } from '@/lib/cn'

export function CircularScore({
  value,
  size = 120,
  stroke = 8,
  className,
  label,
  sublabel,
}: {
  value: number
  size?: number
  stroke?: number
  className?: string
  label?: string
  sublabel?: string
}) {
  const v = Math.min(100, Math.max(0, value))
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (v / 100) * c

  return (
    <div className={cn('inline-flex flex-col items-center', className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="absolute inset-0 -rotate-90"
          aria-hidden
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            className="stroke-slate-200 dark:stroke-slate-700"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            className="stroke-brand-600 transition-[stroke-dashoffset] duration-500 ease-out dark:stroke-brand-400"
            strokeWidth={stroke}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
            {Math.round(v)}
          </span>
          {label ? (
            <span className="text-[10px] font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              {label}
            </span>
          ) : null}
        </div>
      </div>
      {sublabel ? (
        <p className="mt-2 max-w-[12rem] text-center text-xs text-slate-600 dark:text-slate-400">{sublabel}</p>
      ) : null}
    </div>
  )
}
