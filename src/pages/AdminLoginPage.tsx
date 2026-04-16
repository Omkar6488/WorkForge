import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/appStore'
import { ShieldCheck, Moon, SunMedium, Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '@/context/useTheme'
import { useState } from 'react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function AdminLoginPage() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const loginAdmin = useAppStore((state) => state.loginAdmin)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate login delay
    setTimeout(() => {
      loginAdmin()
      navigate('/admin', { replace: true })
    }, 500)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
              WF
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">WorkForge</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/60 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
            </button>

            <Link to="/login">
              <Button variant="secondary" size="sm">
                Student Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="w-full max-w-md"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {/* Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
            <motion.div variants={item} className="mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900">
                  <ShieldCheck className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">
                Admin Portal
              </h1>
              <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                Sign in with your administrator credentials
              </p>
            </motion.div>

            {/* Email/Password Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div variants={item}>
                <label htmlFor="email" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@workforge.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 dark:focus:ring-brand-400 focus:border-transparent"
                  />
                </div>
              </motion.div>

              <motion.div variants={item}>
                <label htmlFor="password" className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-600 dark:focus:ring-brand-400 focus:border-transparent"
                  />
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-amber-600 dark:text-amber-400 focus:ring-2 focus:ring-amber-600 dark:focus:ring-amber-400"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Secure session</span>
                </label>
                <a href="#" className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                  Forgot password?
                </a>
              </motion.div>

              <motion.div variants={item}>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Signing in...' : 'Sign In as Admin'}
                </Button>
              </motion.div>
            </form>

            {/* Security notice */}
            <motion.div variants={item} className="mt-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3">
                <p className="text-xs text-amber-900 dark:text-amber-300">
                  <strong>Security:</strong> This is a restricted area. Unauthorized access attempts are logged.
                </p>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div variants={item} className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
              <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                Are you a student?{' '}
                <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:underline font-medium">
                  Student login
                </Link>
              </p>
            </motion.div>
          </div>

          {/* Back to landing */}
          <motion.div variants={item} className="mt-6 text-center">
            <Link to="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-2">
              ← Back to WorkForge
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
