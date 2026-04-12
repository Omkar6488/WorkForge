import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

type Tone = 'neutral' | 'brand' | 'success' | 'warning'

const tones: Record<Tone, string> = {
  neutral:
    'bg-slate-100 text-slate-700 ring-slate-200/70 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700',
  brand:
    'bg-brand-50 text-brand-800 ring-brand-200/80 dark:bg-brand-900 dark:text-sky-100 dark:ring-brand-500/45',
  success:
    'bg-emerald-50 text-emerald-800 ring-emerald-200/80 dark:bg-emerald-900 dark:text-emerald-50 dark:ring-emerald-600/40',
  warning:
    'bg-amber-50 text-amber-900 ring-amber-200/80 dark:bg-amber-900 dark:text-amber-50 dark:ring-amber-600/40',
}

export function Badge({
  className,
  tone = 'neutral',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        tones[tone],
        className,
      )}
      {...props}
    />
  )
}
