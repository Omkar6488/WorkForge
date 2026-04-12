import { adminNav, mainNav } from '@/components/layout/nav'
import { OnboardingModal } from '@/components/onboarding/OnboardingModal'
import { useTheme } from '@/context/useTheme'
import { cn } from '@/lib/cn'
import { Menu, Moon, SunMedium, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

export function AppShell() {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-dvh bg-surface-0 dark:bg-surface-0">
      <OnboardingModal />
      <div className="mx-auto flex max-w-[1440px]">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-40 w-72 border-r border-slate-200/80 bg-surface-0/95 px-4 py-6 backdrop-blur-md transition-transform dark:border-slate-800 dark:bg-surface-0/90',
            mobileOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between gap-2 px-2">
            <Link to="/" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-sm font-bold text-white shadow-sm dark:bg-brand-500">
                WF
              </div>
              <div className="text-left leading-tight">
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  WorkForge
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Learning → Job readiness
                </div>
              </div>
            </Link>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200/60 bg-slate-50 text-slate-600 shadow-xs transition-all duration-200 hover:bg-slate-100 hover:border-slate-300 hover:text-slate-700 active:scale-95 dark:border-slate-700/60 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:border-slate-600 dark:hover:text-slate-100"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-8 space-y-1">
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/' || item.to === '/simulation'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0',
                    isActive
                      ? 'bg-brand-50 text-brand-800 ring-1 ring-brand-200/70 dark:bg-brand-900/90 dark:text-sky-50 dark:ring-brand-500/55 [&>svg]:opacity-100 [&>svg]:text-current'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:hover:text-white [&>svg]:opacity-70',
                  )
                }
              >
                <item.icon aria-hidden />
                {item.label}
              </NavLink>
            ))}
            <NavLink
              to={adminNav.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0',
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 [&>svg]:opacity-100 [&>svg]:text-current'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900/60 dark:hover:text-white [&>svg]:opacity-70',
                )
              }
            >
              <adminNav.icon aria-hidden />
              {adminNav.label}
            </NavLink>
          </nav>

          <div className="mt-10 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 p-[1px] shadow-sm dark:from-brand-500 dark:to-brand-400">
            <div className="rounded-2xl bg-surface-0/95 p-4 dark:bg-surface-0/90">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700 dark:text-sky-300">
                Job-readiness OS
              </p>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                Simulations, skill maps, and opportunities in one disciplined flow
                for IT and digital roles.
              </p>
            </div>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            aria-label="Close overlay"
            className="fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}

        <div className="flex min-h-dvh flex-1 flex-col lg:ml-0">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-slate-200/80 bg-surface-0/90 px-4 py-4 backdrop-blur-md transition-colors duration-300 dark:border-slate-800 dark:bg-surface-0/85 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-surface-0 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-surface-1 dark:text-slate-100"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  You are here
                </p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {routeTitle(location.pathname)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-surface-0 text-slate-700 shadow-sm transition hover:border-brand-300 hover:text-brand-700 dark:border-slate-800 dark:bg-surface-1 dark:text-slate-100 dark:hover:border-brand-700 dark:hover:text-brand-200"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <SunMedium className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </button>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 lg:px-10 lg:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

function routeTitle(pathname: string) {
  if (pathname.startsWith('/simulation/run')) return 'Simulation run'
  const sorted = [...mainNav].sort((a, b) => b.to.length - a.to.length)
  const hit = sorted.find((n) => (n.to === '/' ? pathname === '/' : pathname === n.to || pathname.startsWith(`${n.to}/`)))
  if (hit) return hit.label
  if (pathname.startsWith('/admin')) return 'Admin'
  return 'WorkForge'
}
