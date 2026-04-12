export type RoleId = 'frontend' | 'backend' | 'data' | 'marketing'

export type SimulationStepType = 'mcq' | 'text' | 'code'

export type SimulationStep = {
  id: string
  type: SimulationStepType
  title: string
  prompt: string
  options?: string[]
  correctIndex?: number
  rubricHint?: string
  placeholder?: string
}

export type SimulationKind = 'classic' | 'traffic'

export type Simulation = {
  id: string
  roleId: RoleId
  title: string
  company: string
  summary: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  durationMin: number
  skills: string[]
  steps: SimulationStep[]
  /** Optional: traffic ops UI layer in the runner (default classic when omitted). */
  kind?: SimulationKind
}

export type OpportunityType = 'internship' | 'job' | 'micro'

export type Opportunity = {
  id: string
  type: OpportunityType
  title: string
  org: string
  location: string
  mode: 'Remote' | 'Hybrid' | 'On-site'
  roleId: RoleId
  skills: string[]
  stipendOrSalary: string
  posted: string
  /** Mock fit score vs passport (0–100). */
  matchPct?: number
}

export type LearningResource = {
  id: string
  title: string
  kind: 'Video' | 'Course' | 'Article'
  provider: string
  duration: string
  roleIds: RoleId[]
  skills: string[]
  href: string
}

export const studentProfile = {
  name: 'Omkar Sharma',
  college: 'MIT ADT University',
  degree: 'B.Tech Computer Science',
  year: '3rd Year',
  interests: ['Web platforms', 'Data storytelling', 'Product growth'],
  headline: 'Aspiring Frontend Engineer · Design systems enthusiast',
  avatarInitials: 'OS',
  xp: 4280,
  level: 12,
  employabilityScore: 78,
  streakDays: 9,
}

export const skillPassport = [
  { id: 'react', label: 'React', level: 72, category: 'Frontend' },
  { id: 'ts', label: 'TypeScript', level: 64, category: 'Engineering' },
  { id: 'sql', label: 'SQL', level: 58, category: 'Data' },
  { id: 'api', label: 'REST APIs', level: 61, category: 'Backend' },
  { id: 'seo', label: 'SEO & Analytics', level: 45, category: 'Marketing' },
  { id: 'comm', label: 'Stakeholder Comms', level: 70, category: 'Professional' },
]

export const achievements = [
  { id: 'a1', title: 'Simulation Sprint', desc: '3 simulations in 7 days', icon: 'zap' as const },
  { id: 'a2', title: 'Skill Mapper', desc: 'Completed full role skill map', icon: 'map' as const },
  { id: 'a3', title: 'Portfolio Builder', desc: '5 tasks shipped to portfolio', icon: 'briefcase' as const },
]

export const certifications = [
  { id: 'c1', name: 'Job-Ready Frontend Foundations', issuer: 'WorkForge', date: 'Mar 2026' },
  { id: 'c2', name: 'API Integration Lab', issuer: 'WorkForge', date: 'Feb 2026' },
]

export const portfolioItems = [
  { id: 'p1', title: 'Checkout flow hardening', role: 'Frontend Developer', impact: '+2.1% conversion (mock)' },
  { id: 'p2', title: 'Incident report automation', role: 'Backend Developer', impact: '−35% triage time (mock)' },
  { id: 'p3', title: 'Campaign attribution dashboard', role: 'Data Analyst', impact: 'Exec-ready weekly view' },
]

export const roles = [
  {
    id: 'frontend' as RoleId,
    title: 'Frontend Developer',
    blurb: 'Ship accessible, performant interfaces that users trust.',
    requiredSkills: ['HTML/CSS', 'JavaScript', 'React', 'Testing', 'Web performance'],
    learningPath: ['UI foundations', 'Component systems', 'Data fetching', 'Production readiness'],
    salaryRange: '₹6–18 LPA (India, early career)',
    growthPath: 'Engineer → Senior → Staff / Frontend Architect',
  },
  {
    id: 'backend' as RoleId,
    title: 'Backend Developer',
    blurb: 'Design reliable services, APIs, and data flows at scale.',
    requiredSkills: ['Programming', 'REST/GraphQL', 'Databases', 'Auth', 'Observability'],
    learningPath: ['API design', 'Persistence', 'Security', 'Scaling basics'],
    salaryRange: '₹7–20 LPA (India, early career)',
    growthPath: 'Engineer → Senior → Platform / SRE leaning roles',
  },
  {
    id: 'data' as RoleId,
    title: 'Data Analyst',
    blurb: 'Turn raw signals into decisions stakeholders act on.',
    requiredSkills: ['SQL', 'Excel/Sheets', 'Visualization', 'Statistics', 'Storytelling'],
    learningPath: ['Data cleaning', 'Dashboards', 'Experimentation', 'Stakeholder reviews'],
    salaryRange: '₹5–14 LPA (India, early career)',
    growthPath: 'Analyst → Senior Analyst → Analytics Manager',
  },
  {
    id: 'marketing' as RoleId,
    title: 'Digital Marketing Executive',
    blurb: 'Grow acquisition loops with measurable creative execution.',
    requiredSkills: ['SEO/SEM', 'Content', 'Analytics', 'CRM basics', 'Experiment design'],
    learningPath: ['Funnel basics', 'Channel strategy', 'Attribution', 'Reporting cadence'],
    salaryRange: '₹4–12 LPA (India, early career)',
    growthPath: 'Executive → Growth Lead → Head of Demand Gen',
  },
]

export const skillGrowthSeries = [
  { week: 'W1', score: 52 },
  { week: 'W2', score: 55 },
  { week: 'W3', score: 61 },
  { week: 'W4', score: 64 },
  { week: 'W5', score: 70 },
  { week: 'W6', score: 74 },
  { week: 'W7', score: 78 },
]

export const activitySeries = [
  { day: 'Mon', minutes: 35 },
  { day: 'Tue', minutes: 50 },
  { day: 'Wed', minutes: 20 },
  { day: 'Thu', minutes: 65 },
  { day: 'Fri', minutes: 40 },
  { day: 'Sat', minutes: 15 },
  { day: 'Sun', minutes: 55 },
]

export const recentActivity = [
  { id: 'r1', text: 'Completed “Release readiness review” simulation', time: '2h ago' },
  { id: 'r2', text: 'Mapped skills for Frontend Developer role', time: 'Yesterday' },
  { id: 'r3', text: 'Earned badge: Simulation Sprint', time: '2 days ago' },
]

export const suggestedActions = [
  { id: 's1', title: 'Run a backend API hardening simulation', cta: 'Start', href: '/simulation/run/be-api-hardening' },
  { id: 's2', title: 'Close the SQL gap for Data Analyst track', cta: 'Analyze gaps', href: '/skill-gap' },
  { id: 's3', title: 'Apply to 2 micro-internships matching React', cta: 'Browse', href: '/opportunities' },
]

export const simulations: Simulation[] = [
  {
    id: 'fe-release-readiness',
    roleId: 'frontend',
    title: 'Release readiness review',
    company: 'Northwind Commerce',
    summary: 'You are the FE owner for a checkout release. Prioritize risks, validate telemetry, and unblock QA.',
    difficulty: 'Intermediate',
    durationMin: 25,
    skills: ['React', 'Testing', 'Web performance'],
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
  {
    id: 'dm-launch-retro',
    roleId: 'marketing',
    title: 'Launch retro & next experiment',
    company: 'Orbit SaaS',
    summary: 'A product launch under-performed on qualified demos. Diagnose funnel leaks and propose the next test.',
    difficulty: 'Beginner',
    durationMin: 18,
    skills: ['SEO/SEM', 'Analytics', 'Experiment design'],
    steps: [
      {
        id: 'dm-1',
        type: 'mcq',
        title: 'Funnel diagnosis',
        prompt: 'MQL → SQL conversion dropped sharply while traffic is stable. Best next step?',
        options: [
          'Spend more on top-of-funnel awareness',
          'Interview sales + inspect lead quality, sources, and SLA follow-up times',
          'Remove all forms to reduce friction',
          'Pause reporting until numbers improve',
        ],
        correctIndex: 1,
      },
      {
        id: 'dm-2',
        type: 'text',
        title: 'Experiment proposal',
        prompt: 'Propose one experiment (hypothesis, metric, duration) for the next 2 weeks.',
        placeholder: 'Hypothesis: …\nPrimary metric: …\nDuration: …',
      },
      {
        id: 'dm-3',
        type: 'text',
        title: 'Creative angle',
        prompt: 'Give 2 messaging angles tailored to IT managers evaluating security software.',
        placeholder: 'Angle A: …\nAngle B: …',
      },
    ],
  },
  {
    id: 'traffic-ops-management',
    roleId: 'data',
    title: 'Traffic Operations Management System',
    company: 'City Mobility Control',
    summary:
      'Weekend festival surge: monitor corridors, interpret congestion and alerts, coordinate closures, and recommend actions to field teams.',
    difficulty: 'Intermediate',
    durationMin: 28,
    skills: ['Situational analysis', 'Incident triage', 'Stakeholder comms'],
    kind: 'traffic',
    steps: [
      {
        id: 'to-1',
        type: 'mcq',
        title: 'Congestion hotspot',
        prompt:
          'Ring Road East shows sustained speed drop with no incident ticket yet. What is the best first move for the operations desk?',
        options: [
          'Ignore until social media spikes',
          'Flag corridor for camera sweep + notify traffic police liaison with ETA window',
          'Close the entire ring until Monday',
          'Divert all buses to residential lanes',
        ],
        correctIndex: 1,
        rubricHint: 'Prioritize verification + controlled comms before hard closures.',
      },
      {
        id: 'to-2',
        type: 'text',
        title: 'Road closure handling',
        prompt:
          'A VIP motorcade will close two northbound lanes for 25 minutes during peak. Draft the public alert (2 sentences) + internal note to marshals (2 bullets).',
        placeholder: 'Public: …\nInternal: • …\n• …',
      },
      {
        id: 'to-3',
        type: 'mcq',
        title: 'Alert prioritization',
        prompt:
          'Multiple alerts: (A) debris sensor, (B) stalled bus blocking one lane, (C) low-priority sign knockdown. Order for dispatch in the first 5 minutes.',
        options: ['A → C → B', 'B → A → C', 'C → A → B', 'B → C → A'],
        correctIndex: 1,
      },
    ],
  },
]

export const opportunities: Opportunity[] = [
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
    matchPct: 91,
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
    matchPct: 79,
  },
]

export const learningResources: LearningResource[] = [
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

export const badges = [
  { id: 'b1', name: 'First Simulation', tier: 'Bronze', xp: 200 },
  { id: 'b2', name: 'Role Mapper', tier: 'Silver', xp: 350 },
  { id: 'b3', name: 'Offer Ready', tier: 'Gold', xp: 800, locked: true },
  { id: 'b4', name: 'Streak: 14 days', tier: 'Silver', xp: 400, locked: true },
]

export const adminStudents = [
  { id: 'u1', name: 'Omkar Sharma', simulations: 6, employability: 78, lastActive: 'Today' },
  { id: 'u2', name: 'Rahul Verma', simulations: 3, employability: 62, lastActive: 'Yesterday' },
  { id: 'u3', name: 'Meera Iyer', simulations: 9, employability: 86, lastActive: 'Today' },
]

export function getRoleSkillGap(roleId: RoleId) {
  const role = roles.find((r) => r.id === roleId)
  if (!role) return { missing: [] as string[], actions: [] as string[] }
  const levels = new Map(skillPassport.map((s) => [s.label, s.level]))
  const missing = role.requiredSkills.filter((skill) => (levels.get(skill) ?? 0) < 60)
  const actions = [
    missing.length
      ? `Complete 2 simulations tagged: ${missing.slice(0, 2).join(', ')}`
      : 'Maintain momentum with an advanced simulation this week',
    'Refresh portfolio with one measurable outcome bullet per task',
    'Schedule a peer review on WorkForge to validate your skill map',
  ]
  return { missing: missing.length ? missing : ['Advanced system design depth'], actions }
}

export const employabilityBreakdown = {
  overall: studentProfile.employabilityScore,
  skills: 82,
  simulations: 76,
  projects: 71,
  level: 'Ready' as 'Beginner' | 'Ready' | 'Industry-Ready',
}

export const careerPathPhases = [
  { id: 'learn', label: 'Learn', status: 'done' as const },
  { id: 'simulate', label: 'Simulate', status: 'done' as const },
  { id: 'project', label: 'Project', status: 'active' as const },
  { id: 'internship', label: 'Internship', status: 'upcoming' as const },
  { id: 'job', label: 'Job', status: 'upcoming' as const },
]

export const experienceMicroInternships = [
  {
    id: 'mi1',
    title: 'Analytics pod — weekend cohort',
    org: 'Lumen Events',
    duration: '10 days',
    tasks: ['Daily funnel check', 'Stakeholder digest', 'Retro note'],
    stipend: '₹15k',
  },
  {
    id: 'mi2',
    title: 'On-site badge desk systems',
    org: 'Summit Arena',
    duration: '5 days',
    tasks: ['Queue simulation', 'Escalation tree', 'Handoff doc'],
    stipend: '₹8k',
  },
]

export const liveProjects = [
  {
    id: 'lp1',
    title: 'Reduce check-in wait times by 18%',
    context: 'Hybrid tech conference · 4k attendees',
    status: 'In discovery',
  },
  {
    id: 'lp2',
    title: 'Vendor SLA breach playbook',
    context: 'City marathon logistics',
    status: 'Sprint 2',
  },
]

export const mentors = [
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

export const eventOpsMetrics = [
  { label: 'Active venues', value: '12', delta: '+2' },
  { label: 'Open incidents', value: '5', delta: '−1' },
  { label: 'SLA at risk', value: '2', delta: '0' },
]

export const eventOpsTickets = [
  { id: 't1', title: 'Stage A power redundancy check', priority: 'P1', owner: 'Ops desk' },
  { id: 't2', title: 'Crowd density sensor drift — Hall 3', priority: 'P2', owner: 'Vendor' },
  { id: 't3', title: 'Volunteer radio channel 4 static', priority: 'P3', owner: 'Comms' },
]

export const githubMockRepos = [
  { name: 'workforge-ui', stars: 128, issuesOpen: 4, lastCommit: '2h ago' },
  { name: 'telemetry-sdk', stars: 56, issuesOpen: 11, lastCommit: '1d ago' },
]

export const githubMockCommits = [
  { sha: 'c4a91f2', msg: 'fix: guard double-submit on checkout CTA', author: 'you', time: 'Today' },
  { sha: '91be10a', msg: 'chore: tighten bundle budget for release', author: 'you', time: 'Yesterday' },
]

export const githubMockIssues = [
  { id: 402, title: 'Flaky E2E on payment route', labels: ['bug', 'qa'] },
  { id: 401, title: 'Document rollback playbook', labels: ['docs'] },
]

export const crmCustomers = [
  { id: 'c1', name: 'Northwind Commerce', status: 'Negotiation', arr: '₹42L' },
  { id: 'c2', name: 'HelioBank', status: 'Renewal', arr: '₹1.1Cr' },
  { id: 'c3', name: 'Orbit SaaS', status: 'Onboarding', arr: '₹18L' },
]

export const analyticsLabSeries = [
  { name: 'Week 1', conv: 2.1, bounce: 41 },
  { name: 'Week 2', conv: 2.4, bounce: 38 },
  { name: 'Week 3', conv: 2.8, bounce: 35 },
  { name: 'Week 4', conv: 3.0, bounce: 33 },
]

export const performanceTrend = [
  { week: 'W1', simScore: 58, taskScore: 54 },
  { week: 'W2', simScore: 62, taskScore: 59 },
  { week: 'W3', simScore: 68, taskScore: 63 },
  { week: 'W4', simScore: 72, taskScore: 67 },
  { week: 'W5', simScore: 76, taskScore: 71 },
]

export const completedSimulationsForPortfolio = [
  { id: 'cs1', title: 'Release readiness review', score: 84, date: 'Apr 2026' },
  { id: 'cs2', title: 'Traffic Operations Management System', score: 79, date: 'Apr 2026' },
  { id: 'cs3', title: 'API hardening under load', score: 71, date: 'Mar 2026' },
]

export const skillCategories = ['Frontend', 'Engineering', 'Data', 'Backend', 'Marketing', 'Professional'] as const
