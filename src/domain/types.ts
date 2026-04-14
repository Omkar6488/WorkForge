/**
 * Core domain types for WorkForge app.
 * Single source of truth for all entity definitions.
 */

// ============================================================================
// ENUMS & TYPE GUARDS
// ============================================================================

export type RoleId = 'frontend' | 'backend' | 'data' | 'marketing'

export type StageId = 'learn' | 'simulate' | 'project' | 'internship' | 'job'

export type StageStatus = 'upcoming' | 'active' | 'done'

export type OpportunityType = 'internship' | 'job' | 'micro'

export type SimulationStepType = 'mcq' | 'text' | 'code'

export type SimulationKind = 'classic' | 'traffic'

export type TaskStatus = 'Active' | 'Pending Review' | 'Draft' | 'Deprecated'

export type OpportunityStatus = 'Approved' | 'Pending' | 'Closing Soon'

export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Declined' | 'Rejected'

export type SkillCategory = 'Frontend' | 'Backend' | 'Data' | 'Marketing' | 'Engineering' | 'Professional'

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced'

export type BadgeTier = 'Bronze' | 'Silver' | 'Gold' | 'Platinum'

export type EmployabilityLevel = 'Beginner' | 'Ready' | 'Industry-Ready'

// ============================================================================
// USER & PROFILE
// ============================================================================

export interface User {
  id: string
  name: string
  email?: string
  avatarInitials?: string
  college?: string
  degree?: string
  year?: string
}

export interface StudentProfile extends User {
  headline?: string
  interests?: string[]
  xp: number
  level: number
  streakDays: number
}

// ============================================================================
// SKILLS & PROFICIENCY
// ============================================================================

export interface Skill {
  id: string
  label: string
  category: SkillCategory
  description?: string
  relatedRole?: RoleId
}

export interface SkillLevel {
  skillId: string
  label: string
  level: number // 0-100
  category: SkillCategory
  lastUpdated?: string
}

// ============================================================================
// ROLE & CAREER PATH
// ============================================================================

export interface RoleTrack {
  id: RoleId
  title: string
  blurb: string
  requiredSkills: string[]
  learningPath: string[]
  salaryRange: string
  growthPath: string
}

export interface StageProgress {
  stageId: StageId
  status: StageStatus
  completionPercentage: number
  completedTaskCount: number
  totalTaskCount: number
  completedSimulationCount?: number
  totalSimulationCount?: number
}

export interface CareerPath {
  userId: string
  selectedRoleId?: RoleId
  stages: StageProgress[]
  overallProgress: number
  projectedCompletionDate?: string
}

// ============================================================================
// TASKS
// ============================================================================

export interface Task {
  id: string
  title: string
  role: RoleId
  skill: string
  difficulty: DifficultyLevel
  status: TaskStatus
  stage?: StageId
  lastUpdated: string
  description?: string
}

export interface StudentTaskCompletion {
  studentId: string
  taskId: string
  completedAt: string
  score?: number
}

// ============================================================================
// SIMULATIONS
// ============================================================================

export interface SimulationStep {
  id: string
  type: SimulationStepType
  title: string
  prompt: string
  options?: string[]
  correctIndex?: number
  rubricHint?: string
  placeholder?: string
}

export interface Simulation {
  id: string
  roleId: RoleId
  title: string
  company: string
  summary: string
  difficulty: DifficultyLevel
  durationMin: number
  skills: string[]
  steps: SimulationStep[]
  kind?: SimulationKind
  stage?: StageId
  createdAt?: string
  updatedAt?: string
}

export interface StudentSimulationRun {
  studentId: string
  simulationId: string
  startedAt: string
  completedAt?: string
  score?: number
  responses?: string[]
}

// ============================================================================
// LEARNING RESOURCES
// ============================================================================

export interface LearningResource {
  id: string
  title: string
  kind: 'Video' | 'Course' | 'Article' | 'Documentation'
  provider: string
  duration: string
  roleIds: RoleId[]
  skills: string[]
  stage?: StageId
  href: string
  completedBy?: string[] // student IDs
}

// ============================================================================
// OPPORTUNITIES
// ============================================================================

export interface Opportunity {
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
  status: OpportunityStatus
  matchPct?: number
  eligibilityRequirements?: string[]
  stage?: StageId
  createdAt?: string
  updatedAt?: string
}

export interface Application {
  id: string
  studentId: string
  opportunityId: string
  status: ApplicationStatus
  appliedAt: string
  respondedAt?: string
  notes?: string
}

// ============================================================================
// EXPERIENCE & PORTFOLIO
// ============================================================================

export interface ExperienceRecord {
  id: string
  studentId: string
  title: string
  org: string
  role: RoleId
  duration: string
  description?: string
  impact?: string
  skills?: string[]
  completedAt?: string
  relatedSimulationId?: string
}

export interface PortfolioItem {
  id: string
  studentId: string
  title: string
  role: RoleId
  impact: string
  completedAt?: string
  relatedExperienceId?: string
}

// ============================================================================
// ACHIEVEMENTS
// ============================================================================

export interface Badge {
  id: string
  name: string
  tier: BadgeTier
  xp: number
  locked?: boolean
  earnedBy?: string[] // student IDs
  awardedAt?: string
}

export interface Certificate {
  id: string
  name: string
  issuer: string
  date: string
  studentId?: string
  skills?: string[]
}

export interface Achievement {
  id: string
  title: string
  desc: string
  icon: string // lucide-react icon name
  unlockedBy?: string[] // student IDs
}

// ============================================================================
// METRICS & ANALYTICS
// ============================================================================

export interface EmployabilityMetrics {
  studentId: string
  overall: number // 0-100
  skills: number
  simulations: number
  projects: number
  level: EmployabilityLevel
  lastUpdated: string
}

export interface SkillGapReport {
  studentId: string
  roleId: RoleId
  missing: string[]
  actions: string[]
  generatedAt: string
}

export interface AdminAnalytics {
  totalStudents: number
  internshipReadyCount: number // employability >= 80
  atRiskCount: number // employability < 60
  averageEmployability: number
  readinessByStage: Record<StageId, { count: number; percentage: number }>
  topSimulations: Array<{ id: string; completions: number }>
  activeOpportunities: number
  generatedAt: string
}

// ============================================================================
// MICRO-INTERNSHIPS & LIVE PROJECTS
// ============================================================================

export interface MicroInternship {
  id: string
  title: string
  org: string
  duration: string
  tasks: string[]
  stipend: string
  roleId?: RoleId
  skills?: string[]
  stage?: StageId
}

export interface LiveProject {
  id: string
  title: string
  context: string
  status: string
  assignedTo?: string[]
  roleId?: RoleId
}

// ============================================================================
// MENTORSHIP
// ============================================================================

export interface Mentor {
  id: string
  name: string
  focus: string
  slots: string
  feedback: string
  availability?: string[]
}

// ============================================================================
// AGGREGATED STATE
// ============================================================================

export interface AppState {
  // Entities
  currentUser: StudentProfile | null
  roles: RoleTrack[]
  tasks: Task[]
  simulations: Simulation[]
  opportunities: Opportunity[]
  learningResources: LearningResource[]
  badges: Badge[]
  certificates: Certificate[]
  achievements: Achievement[]
  mentors: Mentor[]
  microInternships: MicroInternship[]
  liveProjects: LiveProject[]

  // Student-specific tracking
  taskCompletions: StudentTaskCompletion[]
  simulationRuns: StudentSimulationRun[]
  applications: Application[]
  experienceRecords: ExperienceRecord[]
  portfolioItems: PortfolioItem[]

  // Derived/computed (not stored, computed via selectors)
  // employabilityMetrics, careerPath, etc. computed on demand
}
