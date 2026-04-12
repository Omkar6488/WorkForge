import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, type ReactNode } from 'react'

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  className?: string
}) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={cn(
              'relative max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200/80 bg-surface-0 p-6 shadow-[var(--shadow-float)] dark:border-slate-700 dark:bg-surface-1',
              className,
            )}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
            <h2 id="modal-title" className="pe-10 text-lg font-semibold text-slate-900 dark:text-white">
              {title}
            </h2>
            {description ? (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
            ) : null}
            <div className="mt-5">{children}</div>
            <div className="mt-6 flex justify-end">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
