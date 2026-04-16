import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/store/appStore'
import {
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  BookOpen,
  Map,
  ArrowRight,
  Check,
  Users,
  User,
  Award,
  Briefcase,
  Moon,
  SunMedium,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useTheme } from '@/context/useTheme'
import { useState } from 'react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export function LandingPage() {
  const { theme, toggleTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      {/* Header */}
      <header className="fixed top-0 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-bold text-white">
              WF
            </div>
            <span className="text-lg font-semibold text-slate-900 dark:text-white">WorkForge</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              Features
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              How It Works
            </a>
            <a href="#benefits" className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
              Benefits
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/60 bg-slate-50 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <SunMedium className="h-4 w-4" />}
            </button>

            <Link to="/login">
              <Button variant="secondary" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/login">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6"
          >
            Get job-ready through <span className="text-brand-600 dark:text-brand-400">real-world practice</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto"
          >
            Experience industry simulations, track your growth, and land your dream role with structured career progression.
          </motion.p>

          <motion.div variants={item} className="flex gap-4 justify-center flex-wrap">
            <Link to="/login">
              <Button size="md" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="secondary" size="md">
                Explore Platform
              </Button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="text-center mb-16"
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Comprehensive tools designed for your career journey
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Zap,
                title: 'Job Simulations',
                description: 'Practice real-world scenarios from leading companies with instant feedback',
              },
              {
                icon: Target,
                title: 'Skill Tracking',
                description: 'Monitor your growth across technical and professional skills in real-time',
              },
              {
                icon: TrendingUp,
                title: 'Employability Score',
                description: 'Get a comprehensive metric of your career readiness compared to industry standards',
              },
              {
                icon: BarChart3,
                title: 'Skill Gap Analysis',
                description: 'Identify what you need to learn to land your target role',
              },
              {
                icon: BookOpen,
                title: 'Learning Resources',
                description: 'Curated courses, articles, and videos from top platforms and creators',
              },
              {
                icon: Map,
                title: 'Career Pathing',
                description: '5-stage progression: Learn → Practice → Build → Intern → Job',
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <feature.icon className="h-8 w-8 text-brand-600 dark:text-brand-400 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-brand-50/30 to-transparent dark:via-brand-900/10">
        <div className="mx-auto max-w-6xl">
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Your structured path to job readiness
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Follow our 5-stage career progression designed with input from hiring managers and top tech companies
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 lg:gap-5"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Timeline connector line (desktop only) */}
            <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-brand-200 via-brand-600 to-brand-200 dark:from-brand-800 dark:via-brand-500 dark:to-brand-800 z-0" />

            {[
              { 
                step: 1, 
                label: 'Learn', 
                icon: BookOpen,
                description: 'Master fundamentals through curated courses and structured lessons'
              },
              { 
                step: 2, 
                label: 'Simulate', 
                icon: Zap,
                description: 'Practice real interview scenarios and technical assessments'
              },
              { 
                step: 3, 
                label: 'Build', 
                icon: Target,
                description: 'Complete hands-on projects that showcase your abilities'
              },
              { 
                step: 4, 
                label: 'Intern', 
                icon: Briefcase,
                description: 'Apply real-world experience through internship opportunities'
              },
              { 
                step: 5, 
                label: 'Job', 
                icon: Award,
                description: 'Land your dream role with proven skills and confidence'
              },
            ].map((stage, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="flex flex-col items-center relative z-10"
              >
                {/* Step card */}
                <motion.div 
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-xs border-2 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-300 group"
                  whileHover={{ y: -4 }}
                >
                  {/* Step number circle */}
                  <div className="flex justify-center mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-brand-600/20 dark:bg-brand-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-500 dark:to-brand-600 text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        {stage.step}
                      </div>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-3">
                    <stage.icon className="h-8 w-8 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white text-center mb-2">
                    {stage.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    {stage.description}
                  </p>

                  {/* Progress indicator on card */}
                  <div className="mt-4 flex gap-1 justify-center">
                    {[...Array(stage.step)].map((_, i) => (
                      <div key={i} className="h-1 w-1 rounded-full bg-brand-600 dark:bg-brand-400" />
                    ))}
                    {[...Array(5 - stage.step)].map((_, i) => (
                      <div key={i} className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                    ))}
                  </div>
                </motion.div>

                {/* Arrow connector (desktop only) */}
                {idx < 4 && (
                  <div className="hidden md:block absolute -right-3 top-20 z-20">
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-brand-600 dark:text-brand-400"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Ready to start your journey?
            </p>
            <Link to="/login">
              <Button className="gap-2">
                Begin Your Path <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100 dark:from-slate-900/30 dark:via-slate-900/30 dark:to-slate-900/50">
        <div className="mx-auto max-w-7xl">
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why students trust WorkForge
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
              Join thousands of students transforming their careers with real-world practice
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Zap,
                title: 'Authentic Interview Prep',
                description: 'Hands-on simulations from real companies give you authentic practice before the actual interviews',
                color: 'from-blue-500/10 to-blue-500/5'
              },
              {
                icon: TrendingUp,
                title: 'Objective Growth Metrics',
                description: 'Track your growth with concrete metrics instead of guessing where you stand',
                color: 'from-green-500/10 to-green-500/5'
              },
              {
                icon: Target,
                title: 'Personalized Learning Paths',
                description: 'Cover skill gaps with customized learning paths matched to your target role',
                color: 'from-purple-500/10 to-purple-500/5'
              },
              {
                icon: Award,
                title: 'Build Real Confidence',
                description: 'Gain confidence by solving real problems and tackling challenges before interviews',
                color: 'from-orange-500/10 to-orange-500/5'
              },
              {
                icon: Users,
                title: 'Join a Community',
                description: 'Be part of thousands of students already landing their first roles in tech',
                color: 'from-pink-500/10 to-pink-500/5'
              },
              {
                icon: Briefcase,
                title: 'Employer-Aligned Skills',
                description: 'Learn exactly what employers look for with guidance from industry professionals',
                color: 'from-indigo-500/10 to-indigo-500/5'
              },
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className={`group relative bg-gradient-to-br ${benefit.color} dark:from-slate-800/40 dark:to-slate-800/20 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:shadow-lg`}
                whileHover={{ y: -4 }}
              >
                {/* Icon container */}
                <div className="mb-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-700 dark:from-brand-500 dark:to-brand-600 text-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                    <benefit.icon className="h-6 w-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
                  {benefit.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                  {benefit.description}
                </p>

                {/* Check mark indicator */}
                <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium text-sm">
                  <Check className="h-4 w-4" />
                  <span>Verified benefit</span>
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-600/0 to-brand-600/0 group-hover:from-brand-600/5 group-hover:to-brand-600/5 transition-all duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 flex flex-wrap justify-center gap-8"
          >
            {[
              { label: '50K+', sublabel: 'Active Students' },
              { label: '200+', sublabel: 'Partner Companies' },
              { label: '95%', sublabel: 'Success Rate' },
            ].map((badge, idx) => (
              <div key={idx} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-brand-600 dark:text-brand-400">
                  {badge.label}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {badge.sublabel}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <motion.h2
            variants={item}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-12 text-center"
          >
            What students say
          </motion.h2>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              {
                name: 'Sarah Chen',
                role: 'Frontend Engineer @ TechCorp',
                quote: 'The simulations were eerily similar to my actual interviews. Felt totally prepared.',
              },
              {
                name: 'Arjun Kumar',
                role: 'Data Analyst @ InsightCo',
                quote: 'The skill gap analysis showed me exactly what to focus on. Landed my role in 3 months.',
              },
              {
                name: 'Maya Patel',
                role: 'Backend Engineer @ CloudSys',
                quote: 'Real-world practice > theoretical learning. This platform actually works.',
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                variants={item}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 font-semibold text-sm">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic">"{testimonial.quote}"</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-600 dark:bg-brand-900">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          variants={item}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to get job-ready?
          </h2>
          <p className="text-brand-100 mb-8 text-lg">
            Join students worldwide who are building their career readiness with real-world practice.
          </p>
          <Link to="/login">
            <Button variant="secondary" size="md" className="gap-2">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                  WF
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">WorkForge</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Career readiness through real-world practice.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Product</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#features" className="hover:text-slate-900 dark:hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white">How It Works</a></li>
                <li><a href="#benefits" className="hover:text-slate-900 dark:hover:text-white">Benefits</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Company</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4 text-sm">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-slate-900 dark:hover:text-white">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
              © 2026 WorkForge. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
