import {
  Award,
  Briefcase,
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

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> }

type NavGroup = {
  section: string
  items: NavItem[]
}

export const mainNav: NavGroup[] = [
  {
    section: 'Core path',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/careers', label: 'Career Explorer', icon: Compass },
      { to: '/simulation', label: 'Job Simulations', icon: Cpu },
      { to: '/simulation/labs', label: 'Tool labs', icon: MonitorDot },
      { to: '/skill-gap', label: 'Skill Gap Analyzer', icon: Target },
    ],
  },
  {
    section: 'Evidence & progress',
    items: [
      { to: '/profile', label: 'Skill Passport', icon: UserRound },
      { to: '/tracking', label: 'Skill & Employability', icon: LineChart },
      { to: '/gamification', label: 'Achievements', icon: Award },
    ],
  },
  {
    section: 'Growth',
    items: [
      { to: '/opportunities', label: 'Opportunities', icon: Briefcase },
      { to: '/learning', label: 'Learning Resources', icon: Sparkles },
      { to: '/experience', label: 'Experience', icon: Layers },
    ],
  },
]

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
