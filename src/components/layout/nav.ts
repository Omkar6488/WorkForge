import {
  Award,
  Briefcase,
  CalendarRange,
  Compass,
  Layers,
  Cpu,
  LayoutDashboard,
  LineChart,
  MonitorDot,
  Shield,
  Sparkles,
  Target,
  UserRound,
} from 'lucide-react'

export const mainNav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/profile', label: 'Skill Passport', icon: UserRound },
  { to: '/careers', label: 'Career Explorer', icon: Compass },
  { to: '/simulation', label: 'Job Simulations', icon: Cpu },
  { to: '/simulation/labs', label: 'Tool labs', icon: MonitorDot },
  { to: '/tracking', label: 'Skill & Employability', icon: LineChart },
  { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { to: '/learning', label: 'Learning Resources', icon: Sparkles },
  { to: '/skill-gap', label: 'Skill Gap Analyzer', icon: Target },
  { to: '/experience', label: 'Experience', icon: Layers },
  { to: '/events', label: 'Event Ops', icon: CalendarRange },
  { to: '/gamification', label: 'Achievements', icon: Award },
] as const

export const adminNav = {
  to: '/admin',
  label: 'Admin',
  icon: Shield,
} as const

export const flowSteps = [
  { id: 'role', label: 'Role selection' },
  { id: 'map', label: 'Skill mapping' },
  { id: 'sim', label: 'Job simulation' },
  { id: 'eval', label: 'Evaluation' },
  { id: 'passport', label: 'Skill passport' },
  { id: 'opp', label: 'Opportunities' },
  { id: 'ready', label: 'Job ready' },
] as const
