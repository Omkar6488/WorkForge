import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

export type TabItem = { id: string; label: string }

export function TabList({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem[]
  value: string
  onChange: (id: string) => void
  className?: string
}) {
  return (
    <div
      role="tablist"
      className={cn(
        'flex flex-wrap gap-2 rounded-2xl border border-slate-200/80 bg-surface-1/60 p-1 dark:border-slate-800 dark:bg-surface-1/40',
        className,
      )}
    >
      {items.map((tab) => {
        const active = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              'rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ease-out',
              active
                ? 'bg-brand-600 text-white shadow-sm dark:bg-brand-500'
                : 'text-slate-600 hover:bg-surface-0 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-surface-2 dark:hover:text-white',
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export function TabPanel({
  id,
  activeId,
  children,
  className,
}: {
  id: string
  activeId: string
  children: ReactNode
  className?: string
}) {
  if (id !== activeId) return null
  return (
    <div role="tabpanel" className={cn('mt-6 transition-opacity duration-200', className)}>
      {children}
    </div>
  )
}
