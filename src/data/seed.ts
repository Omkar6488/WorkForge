/**
 * Seed data for the application.
 * This replaces mock.ts and provides structured initial data for the store.
 */

import type {
  StudentProfile,
  RoleTrack,
  Task,
  Simulation,
  Opportunity,
  LearningResource,
  Badge,
  Certificate,
  Achievement,
  SkillLevel,
  MicroInternship,
  LiveProject,
  Mentor,
} from '@/domain/types'

// ============================================================================
// STUDENT PROFILE
// ============================================================================

export const seedCurrentUser: StudentProfile = {
  id: 'student-1',
  name: 'Omkar Sharma',
  college: 'MIT ADT University',
  degree: 'B.Tech Computer Science',
  year: '3rd Year',
  interests: ['Web platforms', 'Data storytelling', 'Product growth'],
  headline: 'Aspiring Frontend Engineer · Design systems enthusiast',
  avatarInitials: 'OS',
  xp: 4280,
  level: 12,
  streakDays: 9,
}

// ============================================================================
// ROLE TRACKS
// ============================================================================

export const seedRoles: RoleTrack[] = [
  {
    id: 'frontend',
    title: 'Frontend Developer',
    blurb: 'Ship accessible, performant interfaces that users trust.',
    requiredSkills: ['HTML/CSS', 'JavaScript', 'React', 'Testing', 'Web performance'],
    learningPath: ['UI foundations', 'Component systems', 'Data fetching', 'Production readiness'],
    salaryRange: '₹6–18 LPA (India, early career)',
    growthPath: 'Engineer → Senior → Staff / Frontend Architect',
  },
  {
    id: 'backend',
    title: 'Backend Developer',
    blurb: 'Design reliable services, APIs, and data flows at scale.',
    requiredSkills: ['Programming', 'REST/GraphQL', 'Databases', 'Auth', 'Observability'],
    learningPath: ['API design', 'Persistence', 'Security', 'Scaling basics'],
    salaryRange: '₹7–20 LPA (India, early career)',
    growthPath: 'Engineer → Senior → Platform / SRE leaning roles',
  },
  {
    id: 'data',
    title: 'Data Analyst',
    blurb: 'Turn raw signals into decisions stakeholders act on.',
    requiredSkills: ['SQL', 'Excel/Sheets', 'Visualization', 'Statistics', 'Storytelling'],
    learningPath: ['Data cleaning', 'Dashboards', 'Experimentation', 'Stakeholder reviews'],
    salaryRange: '₹5–14 LPA (India, early career)',
    growthPath: 'Analyst → Senior Analyst → Analytics Manager',
  },
  {
    id: 'marketing',
    title: 'Digital Marketing Executive',
    blurb: 'Grow acquisition loops with measurable creative execution.',
    requiredSkills: ['SEO/SEM', 'Content', 'Analytics', 'CRM basics', 'Experiment design'],
    learningPath: ['Funnel basics', 'Channel strategy', 'Attribution', 'Reporting cadence'],
    salaryRange: '₹4–12 LPA (India, early career)',
    growthPath: 'Executive → Growth Lead → Head of Demand Gen',
  },
]

// ============================================================================
// SKILL LEVELS (STUDENT PROFICIENCY)
// ============================================================================

export const seedSkillPassport: SkillLevel[] = [
  { skillId: 'react', label: 'React', level: 72, category: 'Frontend' },
  { skillId: 'ts', label: 'TypeScript', level: 64, category: 'Engineering' },
  { skillId: 'sql', label: 'SQL', level: 58, category: 'Data' },
  { skillId: 'api', label: 'REST APIs', level: 61, category: 'Backend' },
  { skillId: 'comm', label: 'Stakeholder Comms', level: 70, category: 'Professional' },
  { skillId: 'seo', label: 'SEO & Analytics', level: 45, category: 'Marketing' },
]

// ============================================================================
// TASKS (ADMIN-CREATED)
// ============================================================================

export const seedTasks: Task[] = [
  {
    id: 't1',
    title: 'API Rate Limiting Review',
    role: 'backend',
    skill: 'REST APIs',
    difficulty: 'Intermediate',
    status: 'Active',
    stage: 'simulate',
    lastUpdated: '2 days ago',
  },
  {
    id: 't2',
    title: 'React Suspense Patterns',
    role: 'frontend',
    skill: 'React',
    difficulty: 'Advanced',
    status: 'Active',
    stage: 'project',
    lastUpdated: '1 week ago',
  },
  {
    id: 't3',
    title: 'SQL Window Functions Deep Dive',
    role: 'data',
    skill: 'SQL',
    difficulty: 'Intermediate',
    status: 'Pending Review',
    stage: 'simulate',
    lastUpdated: '3 days ago',
  },
  {
    id: 't4',
    title: 'Incident Communication Templates',
    role: 'backend',
    skill: 'Stakeholder Comms',
    difficulty: 'Beginner',
    status: 'Draft',
    stage: 'learn',
    lastUpdated: '5 days ago',
  },
  {
    id: 't5',
    title: 'Legacy Database Migration',
    role: 'backend',
    skill: 'Databases',
    difficulty: 'Advanced',
    status: 'Deprecated',
    stage: 'internship',
    lastUpdated: '2 weeks ago',
  },
  {
    id: 't6',
    title: 'CSS Grid vs Flexbox Mastery',
    role: 'frontend',
    skill: 'Web Design',
    difficulty: 'Beginner',
    status: 'Active',
    stage: 'learn',
    lastUpdated: '1 day ago',
  },
]

// ============================================================================
// SIMULATIONS (ADMIN-CREATED)
// ============================================================================

export const seedSimulations: Simulation[] = [
  {
    id: 'fe-release-readiness',
    roleId: 'frontend',
    title: 'Release readiness review',
    company: 'Northwind Commerce',
    summary: 'You are the FE owner for a checkout release. Prioritize risks, validate telemetry, and unblock QA.',
    difficulty: 'Intermediate',
    durationMin: 25,
    skills: ['React', 'Testing', 'Web performance'],
    stage: 'simulate',
    steps: [
      {
        id: 'fe-1',
        type: 'mcq',
        title: 'Regression triage',
        prompt: 'A payment SDK upgrade is behind schedule. What is the best immediate move before code freeze?',
        options: [
          'Ship without QA sign-off to meet the date',
          'Scope-cut non-critical checkout experiments and freeze risky paths',
          'Disable analytics to reduce bundle size',
          'Rewrite checkout in a new framework over the weekend',
        ],
        correctIndex: 1,
        rubricHint: 'Hiring managers reward risk reduction and clear tradeoffs.',
      },
      {
        id: 'fe-2',
        type: 'text',
        title: 'Stakeholder update',
        prompt: 'Write a 3–4 sentence Slack update to PM + QA about the scope-cut and the new test plan focus.',
        placeholder: 'Hi team — …',
        rubricHint: 'Clarity, owners, next steps, and timelines score highest.',
      },
      {
        id: 'fe-3',
        type: 'code',
        title: 'Guardrail snippet',
        prompt: 'Sketch a tiny React pattern (pseudo-code ok) that prevents double-submit on a payment button.',
        placeholder: '// e.g., disabled state + in-flight flag',
        rubricHint: 'Idempotency + UX states matter more than perfect syntax.',
      },
    ],
  },
  {
    id: 'be-api-hardening',
    roleId: 'backend',
    title: 'API hardening under load',
    company: 'HelioBank',
    summary: 'Peak traffic is coming. Harden auth middleware, caching, and error contracts without breaking clients.',
    difficulty: 'Advanced',
    durationMin: 30,
    skills: ['REST APIs', 'Auth', 'Observability'],
    stage: 'internship',
    steps: [
      {
        id: 'be-1',
        type: 'mcq',
        title: 'Caching decision',
        prompt: 'User profile reads spike 40×. What is the safest first lever?',
        options: [
          'Cache per-user profile JSON at the edge with a short TTL + explicit invalidation',
          'Store profiles only in browser localStorage',
          'Turn off logging to save CPU',
          'Increase DB connection pool to unlimited',
        ],
        correctIndex: 0,
      },
      {
        id: 'be-2',
        type: 'text',
        title: 'Error contract',
        prompt: 'Describe how you would standardize error payloads for mobile clients while preserving backwards compatibility.',
        placeholder: 'Versioning approach, fields, examples…',
      },
      {
        id: 'be-3',
        type: 'code',
        title: 'Rate limit note',
        prompt: 'Outline pseudo-code for a token-bucket limiter keyed by userId + route.',
        placeholder: '// buckets[userId][route] …',
      },
    ],
  },
  {
    id: 'da-campaign-review',
    roleId: 'data',
    title: 'Weekly campaign attribution review',
    company: 'Lumen Ads',
    summary: 'Reconcile channel performance, spot anomalies, and recommend budget shifts for Monday leadership sync.',
    difficulty: 'Intermediate',
    durationMin: 22,
    skills: ['SQL', 'Visualization', 'Storytelling'],
    stage: 'project',
    steps: [
      {
        id: 'da-1',
        type: 'mcq',
        title: 'Metric sanity',
        prompt: 'Paid social clicks are up 300% but conversions are flat. What do you check first?',
        options: [
          'Declare victory and request more budget',
          'Validate tracking, landing page match, and audience overlap / fraud signals',
          'Change the color of the CTA button',
          'Remove organic traffic from the model',
        ],
        correctIndex: 1,
      },
      {
        id: 'da-2',
        type: 'text',
        title: 'Executive takeaway',
        prompt: 'Write two bullet insights + one recommended action for the leadership deck.',
        placeholder: '• Insight …\n• Insight …\nAction: …',
      },
      {
        id: 'da-3',
        type: 'code',
        title: 'SQL sketch',
        prompt: 'Write pseudo-SQL to compute weekly CPA by channel from events + spend tables.',
        placeholder: 'SELECT …',
      },
    ],
  },
]

// ============================================================================
// OPPORTUNITIES (ADMIN-CREATED)
// ============================================================================

export const seedOpportunities: Opportunity[] = [
  {
    id: 'o1',
    type: 'internship',
    title: 'Frontend Engineering Intern',
    org: 'Aurora Labs',
    location: 'Bengaluru',
    mode: 'Hybrid',
    roleId: 'frontend',
    skills: ['React', 'TypeScript', 'Testing'],
    stipendOrSalary: '₹35k / month',
    posted: '3d ago',
    status: 'Approved',
    matchPct: 91,
    eligibilityRequirements: ['React 70%+', 'TypeScript 60%+'],
  },
  {
    id: 'o2',
    type: 'job',
    title: 'Junior Backend Engineer',
    org: 'RiverStack',
    location: 'Remote',
    mode: 'Remote',
    roleId: 'backend',
    skills: ['REST APIs', 'Databases', 'Auth'],
    stipendOrSalary: '₹9.5 LPA',
    posted: '1w ago',
    status: 'Pending',
    matchPct: 74,
  },
  {
    id: 'o3',
    type: 'micro',
    title: '2-week dashboard sprint',
    org: 'CivicData Co-op',
    location: 'Remote',
    mode: 'Remote',
    roleId: 'data',
    skills: ['SQL', 'Visualization'],
    stipendOrSalary: '₹18k stipend',
    posted: '5d ago',
    status: 'Approved',
    matchPct: 86,
  },
  {
    id: 'o4',
    type: 'internship',
    title: 'Growth Marketing Intern',
    org: 'NimbusPay',
    location: 'Mumbai',
    mode: 'On-site',
    roleId: 'marketing',
    skills: ['Analytics', 'SEO/SEM'],
    stipendOrSalary: '₹30k / month',
    posted: '2d ago',
    status: 'Approved',
    matchPct: 62,
  },
  {
    id: 'o5',
    type: 'job',
    title: 'React Native Engineer I',
    org: 'Hopscotch Health',
    location: 'Pune',
    mode: 'Hybrid',
    roleId: 'frontend',
    skills: ['React', 'JavaScript', 'Web performance'],
    stipendOrSalary: '₹12 LPA',
    posted: '4d ago',
    status: 'Closing Soon',
    matchPct: 88,
  },
  {
    id: 'o6',
    type: 'micro',
    title: 'API documentation refresh',
    org: 'LedgerAPI',
    location: 'Remote',
    mode: 'Remote',
    roleId: 'backend',
    skills: ['REST APIs', 'Programming'],
    stipendOrSalary: '₹12k stipend',
    posted: 'Today',
    status: 'Approved',
    matchPct: 79,
  },
]

// ============================================================================
// LEARNING RESOURCES
// ============================================================================

export const seedLearningResources: LearningResource[] = [
  {
    id: 'l1',
    title: 'Shipping resilient React components',
    kind: 'Video',
    provider: 'WorkForge Studio',
    duration: '18 min',
    roleIds: ['frontend'],
    skills: ['React', 'Testing'],
    href: '#',
  },
  {
    id: 'l2',
    title: 'SQL patterns for analysts in product companies',
    kind: 'Course',
    provider: 'WorkForge Paths',
    duration: '4h',
    roleIds: ['data'],
    skills: ['SQL'],
    href: '#',
  },
  {
    id: 'l3',
    title: 'Designing error contracts that mobile teams love',
    kind: 'Article',
    provider: 'WorkForge Essays',
    duration: '12 min read',
    roleIds: ['backend'],
    skills: ['REST APIs'],
    href: '#',
  },
  {
    id: 'l4',
    title: 'Attribution without the drama',
    kind: 'Article',
    provider: 'WorkForge Essays',
    duration: '9 min read',
    roleIds: ['marketing', 'data'],
    skills: ['Analytics'],
    href: '#',
  },
]

// ============================================================================
// BADGES
// ============================================================================

export const seedBadges: Badge[] = [
  { id: 'b1', name: 'First Simulation', tier: 'Bronze', xp: 200, locked: false },
  { id: 'b2', name: 'Role Mapper', tier: 'Silver', xp: 350, locked: false },
  { id: 'b3', name: 'Offer Ready', tier: 'Gold', xp: 800, locked: true },
  { id: 'b4', name: 'Streak: 14 days', tier: 'Silver', xp: 400, locked: true },
]

// ============================================================================
// CERTIFICATES
// ============================================================================

export const seedCertificates: Certificate[] = [
  { id: 'c1', name: 'Job-Ready Frontend Foundations', issuer: 'WorkForge', date: 'Mar 2026' },
  { id: 'c2', name: 'API Integration Lab', issuer: 'WorkForge', date: 'Feb 2026' },
]

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export const seedAchievements: Achievement[] = [
  { id: 'a1', title: 'Simulation Sprint', desc: '3 simulations in 7 days', icon: 'zap' },
  { id: 'a2', title: 'Skill Mapper', desc: 'Completed full role skill map', icon: 'map' },
  { id: 'a3', title: 'Portfolio Builder', desc: '5 tasks shipped to portfolio', icon: 'briefcase' },
]

// ============================================================================
// MICRO-INTERNSHIPS
// ============================================================================

export const seedMicroInternships: MicroInternship[] = [
  {
    id: 'mi1',
    title: 'Analytics pod — weekend cohort',
    org: 'Lumen Events',
    duration: '10 days',
    tasks: ['Daily funnel check', 'Stakeholder digest', 'Retro note'],
    stipend: '₹15k',
    roleId: 'data',
  },
  {
    id: 'mi2',
    title: 'On-site badge desk systems',
    org: 'Summit Arena',
    duration: '5 days',
    tasks: ['Queue simulation', 'Escalation tree', 'Handoff doc'],
    stipend: '₹8k',
    roleId: 'backend',
  },
]

// ============================================================================
// LIVE PROJECTS
// ============================================================================

export const seedLiveProjects: LiveProject[] = [
  {
    id: 'lp1',
    title: 'Reduce check-in wait times by 18%',
    context: 'Hybrid tech conference · 4k attendees',
    status: 'In discovery',
    roleId: 'data',
  },
  {
    id: 'lp2',
    title: 'Vendor SLA breach playbook',
    context: 'City marathon logistics',
    status: 'Sprint 2',
    roleId: 'backend',
  },
]



// ============================================================================
// MENTORS
// ============================================================================

export const seedMentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Neha Kulkarni',
    focus: 'Frontend + interview loops',
    slots: '2 slots / week',
    feedback: 'Mock debrief templates + async Loom reviews',
  },
  {
    id: 'm2',
    name: 'Arjun Mehta',
    focus: 'Data storytelling for ops',
    slots: '1 office hour',
    feedback: 'Live whiteboard on incident narratives',
  },
]
