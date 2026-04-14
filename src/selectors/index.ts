/**
 * Selectors for derived data.
 * These compute values from raw store data without mutating state.
 * All derived data flows through selectors to ensure consistency.
 */

import type {
  EmployabilityMetrics,
  SkillGapReport,
  CareerPath,
  StageProgress,
  ExperienceRecord,
  PortfolioItem,
  Badge,
  Certificate,
  RoleTrack,
  Task,
  Opportunity,
  SkillLevel,
  StudentProfile,
  AdminAnalytics,
} from '@/domain/types'
import { EMPLOYABILITY_THRESHOLDS, STAGE_ORDER } from '@/domain/constants'

// ============================================================================
// STUDENT SKILLS
// ============================================================================

export function getStudentSkillLevel(
  skills: SkillLevel[],
  skillId: string
): SkillLevel | null {
  return skills.find((s) => s.skillId === skillId) || null
}

export function getWeakestSkill(skills: SkillLevel[]): SkillLevel | null {
  return skills.reduce((prev, curr) => (curr.level < prev.level ? curr : prev), skills[0]) || null
}

export function getSkillsByCategory(
  skills: SkillLevel[],
  category: string
): SkillLevel[] {
  return skills.filter((s) => s.category === category)
}

export function getSkillZone(
  level: number
): 'Strong' | 'Moderate' | 'Priority' {
  if (level >= EMPLOYABILITY_THRESHOLDS.SKILL_STRONG) return 'Strong'
  if (level >= EMPLOYABILITY_THRESHOLDS.SKILL_MODERATE) return 'Moderate'
  return 'Priority'
}

// ============================================================================
// EMPLOYABILITY METRICS
// ============================================================================

export function calculateEmployabilityScore(skills: SkillLevel[]): number {
  if (skills.length === 0) return 0
  const total = skills.reduce((sum, s) => sum + s.level, 0)
  return Math.round(total / skills.length)
}

export function getEmployabilityMetrics(
  studentId: string,
  skills: SkillLevel[],
  taskCompletions: any[],
  simulationRuns: any[]
): EmployabilityMetrics {
  const overallScore = calculateEmployabilityScore(skills)
  const skillScore = overallScore // Same calculation for now
  const simScore = simulationRuns.length > 0
    ? Math.min(100, 50 + simulationRuns.length * 10)
    : 40
  const projScore = taskCompletions.length > 0
    ? Math.min(100, 50 + taskCompletions.length * 8)
    : 40

  const avgScore =
    (skillScore + simScore + projScore) / 3

  let level: 'Beginner' | 'Ready' | 'Industry-Ready' = 'Beginner'
  if (avgScore >= 80) level = 'Industry-Ready'
  else if (avgScore >= 60) level = 'Ready'

  return {
    studentId,
    overall: Math.round(avgScore),
    skills: Math.round(skillScore),
    simulations: Math.round(simScore),
    projects: Math.round(projScore),
    level,
    lastUpdated: new Date().toISOString(),
  }
}

// ============================================================================
// SKILL GAP ANALYSIS
// ============================================================================

export function getSkillGapReport(
  studentId: string,
  roleId: string,
  roleTrack: RoleTrack | null,
  skills: SkillLevel[]
): SkillGapReport {
  if (!roleTrack) {
    return {
      studentId,
      roleId: roleId as any,
      missing: [],
      actions: [],
      generatedAt: new Date().toISOString(),
    }
  }

  const skillMap = new Map(skills.map((s) => [s.label, s.level]))
  const missing = roleTrack.requiredSkills.filter(
    (skill) => (skillMap.get(skill) ?? 0) < 60
  )

  const actions = [
    missing.length
      ? `Complete 2 simulations tagged: ${missing.slice(0, 2).join(', ')}`
      : 'Maintain momentum with an advanced simulation this week',
    'Refresh portfolio with one measurable outcome bullet per task',
    'Schedule a peer review on WorkForge to validate your skill map',
  ]

  return {
    studentId,
    roleId: roleId as any,
    missing: missing.length ? missing : ['Advanced system design depth'],
    actions,
    generatedAt: new Date().toISOString(),
  }
}

// ============================================================================
// TASK QUERIES
// ============================================================================

export function getTasksForRole(tasks: Task[], roleId: string): Task[] {
  return tasks.filter((t) => t.role === roleId)
}

export function getTasksForStage(tasks: Task[], stageId: string): Task[] {
  return tasks.filter((t) => t.stage === stageId)
}

export function getTasksForRoleAndStage(
  tasks: Task[],
  roleId: string,
  stageId: string
): Task[] {
  return tasks.filter((t) => t.role === roleId && t.stage === stageId)
}

export function getCompletedTaskCount(
  taskCompletions: any[],
  studentId: string
): number {
  return taskCompletions.filter((tc) => tc.studentId === studentId).length
}

// ============================================================================
// STAGE PROGRESS
// ============================================================================

export function calculateStageProgress(
  studentId: string,
  stageId: string,
  tasks: Task[],
  taskCompletions: any[],
  simulations: any[],
  simulationRuns: any[]
): StageProgress {
  const stageTaskCount = tasks.filter((t) => t.stage === stageId).length
  const completedStageTaskCount = taskCompletions
    .filter((tc) => tc.studentId === studentId)
    .filter((tc) => {
      const task = tasks.find((t) => t.id === tc.taskId)
      return task?.stage === stageId
    }).length

  const stageSimCount = simulations.filter((s: any) => s.stage === stageId).length
  const completedStageSimCount = simulationRuns
    .filter((sr: any) => sr.studentId === studentId)
    .filter((sr: any) => {
      const sim = simulations.find((s: any) => s.id === sr.simulationId)
      return sim?.stage === stageId
    }).length

  const totalItems = stageTaskCount + stageSimCount || 1
  const completedItems = completedStageTaskCount + completedStageSimCount
  const completionPercentage = Math.round((completedItems / totalItems) * 100)

  const status =
    completionPercentage === 100
      ? ('done' as const)
      : completionPercentage > 0
        ? ('active' as const)
        : ('upcoming' as const)

  return {
    stageId: stageId as any,
    status,
    completionPercentage,
    completedTaskCount: completedStageTaskCount,
    totalTaskCount: stageTaskCount,
    completedSimulationCount: completedStageSimCount,
    totalSimulationCount: stageSimCount,
  }
}

export function getCareerPath(
  studentId: string,
  selectedRoleId: string | null,
  _stages: any[],
  tasks: Task[],
  taskCompletions: any[],
  simulations: any[],
  simulationRuns: any[]
): CareerPath {
  const stageProgresses = STAGE_ORDER.map((stageId) =>
    calculateStageProgress(
      studentId,
      stageId,
      tasks,
      taskCompletions,
      simulations,
      simulationRuns
    )
  )

  const totalCompleted = stageProgresses.reduce((sum, s) => sum + s.completionPercentage, 0)
  const overallProgress = Math.round(totalCompleted / stageProgresses.length)

  return {
    userId: studentId,
    selectedRoleId: (selectedRoleId as any) || undefined,
    stages: stageProgresses,
    overallProgress,
  }
}

// ============================================================================
// EXPERIENCE & PORTFOLIO
// ============================================================================

export function getStudentExperience(
  experienceRecords: ExperienceRecord[],
  studentId: string
): ExperienceRecord[] {
  return experienceRecords.filter((e) => e.studentId === studentId)
}

export function getStudentPortfolioItems(
  portfolioItems: PortfolioItem[],
  studentId: string
): PortfolioItem[] {
  return portfolioItems.filter((p) => p.studentId === studentId)
}

// ============================================================================
// APPLICATIONS & OPPORTUNITIES
// ============================================================================

export function getStudentApplications(applications: any[], studentId: string): any[] {
  return applications.filter((a) => a.studentId === studentId)
}

export function getEligibleOpportunities(
  opportunities: Opportunity[],
  skills: SkillLevel[],
  _employabilityScore: number
): Opportunity[] {
  const skillLabels = new Set(skills.map((s) => s.label))

  return opportunities
    .filter((opp) => {
      const hasSkills = opp.skills.some((skill) => skillLabels.has(skill))
      return hasSkills
    })
    .sort((a, b) => (b.matchPct || 0) - (a.matchPct || 0))
}

export function getApprovedOpportunities(opportunities: Opportunity[]): Opportunity[] {
  return opportunities.filter((o) => o.status === 'Approved')
}

// ============================================================================
// BADGES & CERTIFICATES
// ============================================================================

export function getStudentBadges(badges: Badge[], studentId: string): Badge[] {
  return badges.filter((b) => b.earnedBy?.includes(studentId))
}

export function getStudentCertificates(certificates: Certificate[], studentId: string): Certificate[] {
  return certificates.filter((c) => c.studentId === studentId)
}

// ============================================================================
// ADMIN ANALYTICS
// ============================================================================

export function calculateAdminAnalytics(
  allStudents: StudentProfile[],
  employabilityScores: Map<string, number>,
  stageProgresses: Map<string, Map<string, StageProgress>>,
  _simulations: any[]
): AdminAnalytics {
  const internshipReady = Array.from(employabilityScores.values()).filter(
    (score) => score >= EMPLOYABILITY_THRESHOLDS.INTERNSHIP_READY
  ).length

  const atRisk = Array.from(employabilityScores.values()).filter(
    (score) => score < EMPLOYABILITY_THRESHOLDS.AT_RISK
  ).length

  const avgEmp =
    Array.from(employabilityScores.values()).reduce((sum, score) => sum + score, 0) /
    employabilityScores.size || 0

  const readinessByStage: Record<string, { count: number; percentage: number }> = {}
  STAGE_ORDER.forEach((stageId) => {
    const stageCount = Array.from(stageProgresses.values()).filter((studentStages) => {
      const stageProgress = studentStages.get(stageId)
      return stageProgress?.status === 'done'
    }).length
    readinessByStage[stageId] = {
      count: stageCount,
      percentage: Math.round((stageCount / allStudents.length) * 100),
    }
  })

  return {
    totalStudents: allStudents.length,
    internshipReadyCount: internshipReady,
    atRiskCount: atRisk,
    averageEmployability: Math.round(avgEmp),
    readinessByStage,
    topSimulations: [],
    activeOpportunities: 0,
    generatedAt: new Date().toISOString(),
  }
}
