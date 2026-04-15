/**
 * Student-facing selectors
 * Filters and derives data from admin-created content based on student profile
 */

import type {
  Task,
  Simulation,
  Opportunity,
  LearningResource,
  Application,
  ExperienceRecord,
  Badge,
  Certificate,
  StudentProfile,
  RoleTrack,
  StageId,
  SkillLevel,
  StudentTaskCompletion,
  StudentSimulationRun,
  StudentLearningResourceCompletion,
  PortfolioItem,
} from '@/domain/types'

// ============================================================================
// TASK SELECTORS
// ============================================================================

/**
 * Get all active tasks for a student (not deprecated)
 */
export function getTasksForStudent(
  studentId: string,
  tasks: Task[],
  studentProfile: StudentProfile | null
): Task[] {
  if (!studentProfile) return []
  
  return tasks.filter(
    (t) =>
      t.status !== 'Deprecated' &&
      t.role === studentProfile.id // Would need studentProfile.roleId
  )
}

/**
 * Get tasks by stage
 */
export function getTasksByStage(
  studentId: string,
  stage: StageId,
  tasks: Task[],
  studentProfile: StudentProfile | null
): Task[] {
  return getTasksForStudent(studentId, tasks, studentProfile).filter((t) => t.stage === stage)
}

/**
 * Get completed tasks
 */
export function getCompletedTasks(
  studentId: string,
  taskCompletions: StudentTaskCompletion[],
  tasks: Task[]
): Task[] {
  const completedIds = new Set(taskCompletions.map((c) => c.taskId))
  return tasks.filter((t) => completedIds.has(t.id))
}

/**
 * Get pending tasks (not yet completed)
 */
export function getPendingTasks(
  studentId: string,
  tasks: Task[],
  taskCompletions: StudentTaskCompletion[],
  studentProfile: StudentProfile | null,
  currentStage: StageId
): Task[] {
  const completedIds = new Set(taskCompletions.map((c) => c.taskId))
  return getTasksByStage(studentId, currentStage, tasks, studentProfile).filter(
    (t) => !completedIds.has(t.id) && t.status !== 'Deprecated'
  )
}

/**
 * Get recommended tasks based on skill gaps and role
 */
export function getRecommendedTasks(
  studentId: string,
  tasks: Task[],
  completedTasks: StudentTaskCompletion[],
  weakestSkills: string[]
): Task[] {
  const completedIds = new Set(completedTasks.map((c) => c.taskId))
  
  return tasks
    .filter((t) => !completedIds.has(t.id) && t.status === 'Active')
    .filter((t) => weakestSkills.includes(t.skill))
    .sort((a, b) => {
      // Prioritize by difficulty and skill relevance
      const diffMap = { Beginner: 0, Intermediate: 1, Advanced: 2 }
      return diffMap[a.difficulty] - diffMap[b.difficulty]
    })
    .slice(0, 5) // Top 5 recommendations
}

/**
 * Get blocked tasks (prerequisites not met)
 */
export function getBlockedTasks(
  tasks: Task[],
  completedTasks: StudentTaskCompletion[]
): Task[] {
  const completedIds = new Set(completedTasks.map((c) => c.taskId))
  
  return tasks.filter(
    (t) =>
      t.prerequisites &&
      t.prerequisites.length > 0 &&
      t.prerequisites.some((prereqId) => !completedIds.has(prereqId))
  )
}

// ============================================================================
// SIMULATION SELECTORS
// ============================================================================

/**
 * Get all simulations for a student's role
 */
export function getSimulationsForStudent(
  studentId: string,
  simulations: Simulation[],
  studentProfile: StudentProfile | null
): Simulation[] {
  if (!studentProfile) return []
  
  // Would need roleId on profile
  return simulations.filter((s) => s.roleId === studentProfile.id)
}

/**
 * Get completed simulations
 */
export function getCompletedSimulations(
  studentId: string,
  simulationRuns: StudentSimulationRun[],
  simulations: Simulation[]
): Simulation[] {
  const completedIds = new Set(
    simulationRuns
      .filter((r) => r.studentId === studentId && r.completedAt)
      .map((r) => r.simulationId)
  )
  return simulations.filter((s) => completedIds.has(s.id))
}

/**
 * Get eligible simulations (student has completed enough learn tasks)
 */
export function getEligibleSimulations(
  studentId: string,
  simulations: Simulation[],
  completedTasks: StudentTaskCompletion[],
  tasks: Task[],
  studentProfile: StudentProfile | null
): Simulation[] {
  const learnTasks = tasks.filter((t) => t.stage === 'learn')
  const completedLearnCount = completedTasks.filter((c) =>
    learnTasks.some((t) => t.id === c.taskId)
  ).length
  
  const minLearningTasksRequired = 3
  
  if (completedLearnCount < minLearningTasksRequired) {
    return [] // Not eligible yet
  }
  
  return getSimulationsForStudent(studentId, simulations, studentProfile)
}

/**
 * Get in-progress simulations
 */
export function getInProgressSimulations(
  studentId: string,
  simulationRuns: StudentSimulationRun[]
): StudentSimulationRun[] {
  return simulationRuns.filter(
    (r) => r.studentId === studentId && !r.completedAt
  )
}

// ============================================================================
// OPPORTUNITY SELECTORS
// ============================================================================

/**
 * Get all opportunities
 */
export function getAllOpportunities(opportunities: Opportunity[]): Opportunity[] {
  return opportunities.filter((o) => o.status !== 'Closing Soon' || isRecentlyPosted(o.posted))
}

/**
 * Get active opportunities
 */
export function getActiveOpportunities(opportunities: Opportunity[]): Opportunity[] {
  return opportunities.filter((o) => o.status === 'Approved' || o.status === 'Pending')
}

/**
 * Get external opportunities (redirect links)
 */
export function getExternalOpportunities(opportunities: Opportunity[]): Opportunity[] {
  return getActiveOpportunities(opportunities).filter((o) => !o.isInternal && o.externalLink)
}

/**
 * Get internal opportunities (managed in app)
 */
export function getInternalOpportunities(opportunities: Opportunity[]): Opportunity[] {
  return getActiveOpportunities(opportunities).filter((o) => o.isInternal)
}

/**
 * Get opportunities for a student based on role alignment
 */
export function getOpportunitiesForStudent(
  studentId: string,
  opportunities: Opportunity[],
  studentProfile: StudentProfile | null
): Opportunity[] {
  if (!studentProfile) return []
  
  // Would need roleId on profile
  return getActiveOpportunities(opportunities).filter((o) => o.roleId === studentProfile.id)
}

/**
 * Get eligible opportunities (student meets skill requirements)
 */
export function getEligibleOpportunities(
  studentId: string,
  opportunities: Opportunity[],
  skills: SkillLevel[],
  studentProfile: StudentProfile | null
): Opportunity[] {
  const studentOpps = getOpportunitiesForStudent(studentId, opportunities, studentProfile)
  const skillMap = new Map(skills.map((s) => [s.skillId, s.level]))
  
  return studentOpps.filter((opp) => {
    // Check if student has required skills at reasonable level
    const requiredSkills = opp.skills || []
    const minSkillLevel = 50
    
    return requiredSkills.every((skillId) => {
      const studentLevel = skillMap.get(skillId) || 0
      return studentLevel >= minSkillLevel
    })
  })
}

/**
 * Get recommended opportunities (high match %)
 */
export function getRecommendedOpportunities(
  studentId: string,
  opportunities: Opportunity[],
  skills: SkillLevel[],
  studentProfile: StudentProfile | null
): Opportunity[] {
  const eligible = getEligibleOpportunities(studentId, opportunities, skills, studentProfile)
  
  return eligible
    .filter((o) => (o.matchPct || 0) >= 70)
    .sort((a, b) => (b.matchPct || 0) - (a.matchPct || 0))
    .slice(0, 5)
}

/**
 * Get opportunities by type
 */
export function getOpportunitiesByType(
  opportunities: Opportunity[],
  type: string
): Opportunity[] {
  return getActiveOpportunities(opportunities).filter((o) => o.type === type)
}

// ============================================================================
// LEARNING RESOURCE SELECTORS
// ============================================================================

/**
 * Get resources for a student's role and stage
 */
export function getResourcesForStudent(
  studentId: string,
  resources: LearningResource[],
  studentProfile: StudentProfile | null,
  currentStage?: StageId
): LearningResource[] {
  if (!studentProfile) return []
  
  let filtered = resources.filter((r) => r.roleIds.includes(studentProfile.id))
  
  if (currentStage) {
    filtered = filtered.filter((r) => !r.stage || r.stage === currentStage)
  }
  
  return filtered
}

/**
 * Get resources by skill
 */
export function getResourcesBySkill(skill: string, resources: LearningResource[]): LearningResource[] {
  return resources.filter((r) => r.skills.includes(skill))
}

/**
 * Get resources for a stage
 */
export function getResourcesForStage(stage: StageId, resources: LearningResource[]): LearningResource[] {
  return resources.filter((r) => r.stage === stage)
}

/**
 * Get recommended resources based on skill gaps
 */
export function getRecommendedResources(
  studentId: string,
  resources: LearningResource[],
  completions: StudentLearningResourceCompletion[],
  weakestSkills: string[],
  studentProfile: StudentProfile | null
): LearningResource[] {
  const completedIds = new Set(completions.map((c) => c.resourceId))
  const studentResources = getResourcesForStudent(studentId, resources, studentProfile)
  
  return studentResources
    .filter((r) => !completedIds.has(r.id))
    .filter((r) => r.skills.some((s) => weakestSkills.includes(s)))
    .sort((a, b) => {
      const diffMap = { Beginner: 0, Intermediate: 1, Advanced: 2 }
      const aDiff = a.difficulty ? diffMap[a.difficulty] : 1
      const bDiff = b.difficulty ? diffMap[b.difficulty] : 1
      return aDiff - bDiff
    })
    .slice(0, 5)
}

/**
 * Get completed resources
 */
export function getCompletedResources(
  studentId: string,
  completions: StudentLearningResourceCompletion[],
  resources: LearningResource[]
): LearningResource[] {
  const completedIds = new Set(
    completions.filter((c) => c.studentId === studentId).map((c) => c.resourceId)
  )
  return resources.filter((r) => completedIds.has(r.id))
}

// ============================================================================
// APPLICATION SELECTORS
// ============================================================================

/**
 * Get all applications for a student
 */
export function getStudentApplications(
  studentId: string,
  applications: Application[]
): Application[] {
  return applications.filter((a) => a.studentId === studentId)
}

/**
 * Get applications for an opportunity
 */
export function getApplicationsForOpportunity(
  opportunityId: string,
  applications: Application[]
): Application[] {
  return applications.filter((a) => a.opportunityId === opportunityId)
}

/**
 * Check if student already applied to opportunity
 */
export function hasApplied(
  studentId: string,
  opportunityId: string,
  applications: Application[]
): boolean {
  return applications.some((a) => a.studentId === studentId && a.opportunityId === opportunityId)
}

/**
 * Get application status
 */
export function getApplicationStatus(
  studentId: string,
  opportunityId: string,
  applications: Application[]
): string | null {
  const app = applications.find((a) => a.studentId === studentId && a.opportunityId === opportunityId)
  return app?.status || null
}

// ============================================================================
// EXPERIENCE & PORTFOLIO SELECTORS
// ============================================================================

/**
 * Get all experience records for a student
 */
export function getExperienceForStudent(
  studentId: string,
  experiences: ExperienceRecord[]
): ExperienceRecord[] {
  return experiences.filter((e) => e.studentId === studentId)
}

/**
 * Get badges earned by student
 */
export function getBadgesForStudent(
  studentId: string,
  badges: Badge[]
): Badge[] {
  return badges.filter((b) => b.earnedBy && b.earnedBy.includes(studentId))
}

/**
 * Get certificates earned by student
 */
export function getCertificatesForStudent(
  studentId: string,
  certificates: Certificate[]
): Certificate[] {
  return certificates.filter((c) => c.studentId === studentId)
}

/**
 * Generate experience record from opportunity
 */
export function generateExperienceFromOpportunity(
  studentId: string,
  opportunity: Opportunity,
  applicationId: string
): ExperienceRecord {
  return {
    id: `exp-${applicationId}`,
    studentId,
    title: opportunity.title,
    org: opportunity.org,
    role: opportunity.roleId,
    duration: opportunity.duration || `Unknown`,
    relatedOpportunityId: opportunity.id,
    type: opportunity.type as any,
    completedAt: new Date().toISOString(),
    skills: opportunity.skills,
    description: `Completed ${opportunity.title} at ${opportunity.org}`,
    impact: `Gained experience in ${opportunity.skills.join(', ')}`,
  }
}

/**
 * Get portfolio items for student
 */
export function getPortfolioForStudent(
  studentId: string,
  items: PortfolioItem[]
): PortfolioItem[] {
  return items.filter((p) => p.studentId === studentId)
}

/**
 * Get featured portfolio items
 */
export function getFeaturedPortfolio(
  studentId: string,
  items: PortfolioItem[]
): PortfolioItem[] {
  return getPortfolioForStudent(studentId, items).slice(0, 3)
}

// ============================================================================
// UTILITY HELPERS
// ============================================================================

function isRecentlyPosted(postedDate: string): boolean {
  const posted = new Date(postedDate)
  const now = new Date()
  const daysSincPosted = (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24)
  return daysSincPosted <= 30 // Posted within last 30 days
}

/**
 * Calculate match percentage between student and opportunity
 */
export function calculateOpportunityMatch(
  skills: SkillLevel[],
  opportunity: Opportunity
): number {
  if (!opportunity.skills || opportunity.skills.length === 0) return 50
  
  const skillMap = new Map(skills.map((s) => [s.skillId, s.level]))
  const matches = opportunity.skills.filter((skillId) => {
    const level = skillMap.get(skillId) || 0
    return level >= 50
  })
  
  return Math.round((matches.length / opportunity.skills.length) * 100)
}

/**
 * Count available opportunities by stage
 */
export function countOpportunitiesByStage(
  opportunities: Opportunity[],
  stage: StageId
): number {
  return getActiveOpportunities(opportunities).filter((o) => o.stage === stage).length
}
