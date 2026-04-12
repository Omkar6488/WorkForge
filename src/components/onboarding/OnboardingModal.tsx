import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'workforge-onboarding-dismissed'

export function OnboardingModal() {
  const [open, setOpen] = useState(() => {
    if (typeof window === 'undefined') return false
    return !window.localStorage.getItem(STORAGE_KEY)
  })

  function dismiss() {
    window.localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="onb-title"
            className="relative w-full max-w-lg rounded-3xl border border-slate-200/80 bg-surface-0 p-8 shadow-[var(--shadow-float)] dark:border-slate-800 dark:bg-surface-1"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <button
              type="button"
              onClick={dismiss}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Close onboarding"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 dark:bg-brand-900 dark:text-sky-100">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2
              id="onb-title"
              className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white"
            >
              Welcome to WorkForge
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              This is your job-readiness cockpit: map skills to real roles, run
              simulations that mirror workplace tasks, and translate outcomes
              into a living skill passport that employers can trust.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li>• Start from the dashboard overview, then pick a target role.</li>
              <li>• Run a simulation end-to-end — evaluation updates your passport.</li>
              <li>• Use opportunities to practice outbound and interview loops.</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button onClick={dismiss}>Begin tour</Button>
              <Button variant="secondary" onClick={dismiss}>
                Skip for now
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
