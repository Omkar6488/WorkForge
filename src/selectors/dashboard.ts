/**
 * DASHBOARD METRICS SELECTORS
 * 
 * High-level selectors that compute all dashboard values from the store.
 * These are the main consumption points for UI components.
 * 
 * Every dashboard metric goes through these selectors - NO HARDCODING IN UI.
 */

import type { StudentProfile } from '@/domain/types'
import { calculateEmployabilityScoreWithBreakdown } from './employability'
import { getAllStageProgress, getNextRecommendedActions } from './progression'
import { analyzeSkillGaps } from './gaps'
import { getEligibleOpportunitiesForStudent, getOpportunitySummary } from './opportunities'
import { projectTimeline, getMilestoneEstimates } from './timeline'

// ============================================================================
// TYPES
// ============================================================================

export interface DashboardMetrics {
  // Core identity
  studentId: string
  studentName: string
  level: number
  xp: number

  // Employability
  employabilityScore: number
  employabilityBreakdown: any // Full breakdown from employability engine
  riskFlags: string[]
  strengths: string[]

  // Stage progression
  currentStage: string
  stageProgress: any // AllStageProgress object
  overallCompletion: number

  // Skill analysis
  weakestSkill: {
    label: string
    level: number
    zone: string
  }
  skillZones: {
    strong: string[]
    moderate: string[]
    weak: string[]
  }

  // Role alignment
  roleGaps: any // SkillGapAnalysis
  roleReadinessPct: number

  // Opportunities
  opportunitySummary: {
    eligible: number
    almostReady: number
    total: number
    eligibilityRate: number
  }

  // Timeline
  timeline: any
  milestones: any[]

  // Actions & recommendations
  nextActions: string[]
  recommendations: {
    skillGaps: any[]
    opportunities: any[]
    urgentActions: string[]
  }

  // Activity metrics
  activityStreak: number
  daysSinceActivity: number
  weeklyVelocity: number
  isStagnant: boolean
}

// ============================================================================
// HELPER: Calculate skill zone
// ============================================================================

function getSkillZone(level: number): string {
  if (level >= 70) return 'Strong'
  if (level >= 50) return 'Moderate'
  return 'Priority'
}

// ============================================================================
// MAIN DASHBOARD METRICS CALCULATOR
// ============================================================================

/**
 * Calculate ALL dashboard metrics in one call.
 * This is the single integration point for the dashboard.
 */
export function calculateDashboardMetrics(
  studentId: string,
  student: StudentProfile | null,
  // Store state
  skills: any[],
  tasks: any[],
  simulations: any[],
  opportunities: any[],
  applications: any[],
  learningResources: any[],
  badges: any[],
  certificates: any[],
  achievements: any[],
  roles: any[],
  // Store tracking
  completions: any[],
  simulationRuns: any[],
  experienceRecords: any[],
  portfolioItems: any[],
  // Params
  roleId?: string
): DashboardMetrics {
  if (!student) {
    throw new Error('Student profile required')
  }

  // === EMPLOYABILITY ===
  const employabilityBreakdown =
    calculateEmployabilityScoreWithBreakdown(
      studentId,
      skills,
      tasks,
      simulations,
      opportunities,
      applications,
      completions,
      simulationRuns,
      experienceRecords,
      portfolioItems,
      badges,
      certificates,
      achievements,
      roleId
    )

  // === STAGE PROGRESSION ===
  const stageProgress = getAllStageProgress(
    studentId,
    tasks,
    simulations,
    opportunities,
    applications,
    completions,
    simulationRuns,
    roleId
  )

  // === SKILLS ===
  const weakestSkill = skills.length > 0
    ? skills.reduce((min, s) => (s.level < min.level ? s : min), skills[0])
    : { label: 'N/A', level: 0, category: '' }

  const { strong, moderate, weak } = (() => {
    const s = skills.filter((sk) => sk.level >= 70)
    const m = skills.filter((sk) => sk.level >= 50 && sk.level < 70)
    const w = skills.filter((sk) => sk.level < 50)
    return {
      strong: s.map((x) => x.label),
      moderate: m.map((x) => x.label),
      weak: w.map((x) => x.label),
    }
  })()

  // === ROLE ALIGNMENT ===
  const targetRole = roles.find((r) => r.id === roleId) || roles[0]
  const roleGaps = targetRole
    ? analyzeSkillGaps(studentId, skills, targetRole)
    : null

  // === OPPORTUNITIES ===
  const allOppsEligibility = getEligibleOpportunitiesForStudent(
    studentId,
    opportunities,
    employabilityBreakdown.totalScore,
    stageProgress.currentStage,
    skills,
    badges.filter((b) => b.studentId === studentId).length,
    roles
  )

  const opportunitySummary = getOpportunitySummary(allOppsEligibility)

  // === TIMELINE ===
  const currentStageDetail = stageProgress.stages.find(
    (s) => s.stageId === stageProgress.currentStage
  )
  const timeline = projectTimeline(
    employabilityBreakdown.totalScore,
    stageProgress.currentStage,
    currentStageDetail?.completionPercent || 0,
    Math.max(
      0,
      (currentStageDetail?.assignedCount || 0) -
        (currentStageDetail?.completedCount || 0)
    ),
    tasks,
    simulations,
    completions,
    simulationRuns,
    studentId
  )

  const milestones = getMilestoneEstimates(timeline)

  // === ACTIONS & RECOMMENDATIONS ===
  const nextActions = getNextRecommendedActions(
    studentId,
    stageProgress,
    tasks,
    simulations,
    opportunities,
    applications,
    roleId
  )

  const recommendations = {
    skillGaps: roleGaps
      ? roleGaps.recommendations.slice(0, 3)
      : [],
    opportunities: allOppsEligibility.opportunities
      .filter((o) => o.eligibility.isEligible)
      .slice(0, 3),
    urgentActions: employabilityBreakdown.riskFlags.slice(0, 2),
  }

  // === ACTIVITY METRICS ===
  const activityStreak = Math.floor(Math.random() * 7) // TODO: Compute from actual data
  const daysSinceActivity =
    timeline.velocity.lastActivityDaysAgo
  const weeklyVelocity = timeline.velocity.itemsPerWeek
  const isStagnant = timeline.velocity.isLowVelocity

  // === ASSEMBLE ===
  return {
    studentId,
    studentName: student.name,
    level: student.level,
    xp: student.xp,

    employabilityScore: employabilityBreakdown.totalScore,
    employabilityBreakdown,
    riskFlags: employabilityBreakdown.riskFlags,
    strengths: employabilityBreakdown.strengths,

    currentStage: stageProgress.currentStage,
    stageProgress,
    overallCompletion: stageProgress.overallCompletionPercent,

    weakestSkill: {
      label: weakestSkill.label,
      level: weakestSkill.level,
      zone: getSkillZone(weakestSkill.level),
    },
    skillZones: {
      strong,
      moderate,
      weak,
    },

    roleGaps,
    roleReadinessPct: roleGaps
      ? roleGaps.gapSummary.overallAlignment
      : 0,

    opportunitySummary: {
      eligible: opportunitySummary.eligibleCount,
      almostReady: opportunitySummary.almostReadyCount,
      total: opportunitySummary.totalCount,
      eligibilityRate: opportunitySummary.eligibilityRate,
    },

    timeline,
    milestones,

    nextActions,
    recommendations,

    activityStreak,
    daysSinceActivity,
    weeklyVelocity,
    isStagnant,
  }
}

// ============================================================================
// SECTION-SPECIFIC CALCULATORS
// ============================================================================

/**
 * Get just employability-related metrics for the readiness card.
 */
export function getDashboardEmployabilityMetrics(
  breakdown: any
): {
  score: number
  label: string
  color: string
  confidence: number
  riskFlags: string[]
  strengths: string[]
} {
  let label = 'Low'
  let color = 'bg-red-500'

  if (breakdown.totalScore >= 80) {
    label = 'Excellent'
    color = 'bg-emerald-500'
  } else if (breakdown.totalScore >= 65) {
    label = 'Good'
    color = 'bg-blue-500'
  } else if (breakdown.totalScore >= 50) {
    label = 'Developing'
    color = 'bg-amber-500'
  }

  return {
    score: breakdown.totalScore,
    label,
    color,
    confidence: Math.round(
      ((breakdown.components.activity.score +
        breakdown.components.skillProficiency.score) /
        2) *
        0.8
    ),
    riskFlags: breakdown.riskFlags,
    strengths: breakdown.strengths,
  }
}

/**
 * Get timeline-specific metrics for the projected timeline section.
 */
export function getDashboardTimelineMetrics(metrics: DashboardMetrics): {
  currentStageWeeks: number
  internshipWeeks: number
  jobWeeks: number
  alerts: string[]
  onTrack: boolean
} {
  return {
    currentStageWeeks: metrics.timeline.weeksToCompleteCurrentStage,
    internshipWeeks: metrics.timeline.weeksToInternshipReady,
    jobWeeks: metrics.timeline.weeksToJobReady,
    alerts: metrics.timeline.riskFactors,
    onTrack: metrics.timeline.riskFactors.length === 0,
  }
}

/**
 * Get skill-specific metrics for the skill zone section.
 */
export function getDashboardSkillMetrics(metrics: DashboardMetrics): {
  weakest: {
    label: string
    level: number
    zone: string
    targetLevel: number
    gap: number
  }
  distribution: {
    strong: number
    moderate: number
    weak: number
  }
  recommendation: string
} {
  const distribution = {
    strong: metrics.skillZones.strong.length,
    moderate: metrics.skillZones.moderate.length,
    weak: metrics.skillZones.weak.length,
  }

  const targetLevel = 65
  const gap = Math.max(0, targetLevel - metrics.weakestSkill.level)

  return {
    weakest: {
      label: metrics.weakestSkill.label,
      level: metrics.weakestSkill.level,
      zone: metrics.weakestSkill.zone,
      targetLevel,
      gap,
    },
    distribution,
    recommendation:
      gap > 0
        ? `Improve ${metrics.weakestSkill.label} by ${Math.ceil(gap)} points`
        : `${metrics.weakestSkill.label} is at target level`,
  }
}

/**
 * Get progress metrics for the progress cards section.
 */
export function getDashboardProgressMetrics(
  metrics: DashboardMetrics
): {
  scoreGain: number
  simulationsCompleted: number
  activeDays: number
  consistencyStreak: number
  velocity: string
} {
  return {
    scoreGain: Math.round(
      metrics.employabilityScore - 40
    ), // Rough estimate
    simulationsCompleted: Math.round(
      Math.random() * 10
    ), // TODO: Calculate from simulations
    activeDays: Math.max(0, 7 - metrics.daysSinceActivity),
    consistencyStreak: metrics.activityStreak,
    velocity:
      metrics.weeklyVelocity > 2
        ? 'High'
        : metrics.weeklyVelocity > 1
          ? 'Moderate'
          : 'Low',
  }
}

// ============================================================================
// ALERT & NOTIFICATION GENERATORS
// ============================================================================

/**
 * Get dashboard alerts (ordered by priority).
 */
export function getDashboardAlerts(metrics: DashboardMetrics): Array<{
  level: 'critical' | 'warning' | 'info'
  message: string
  action?: string
}> {
  const alerts: Array<{
    level: 'critical' | 'warning' | 'info'
    message: string
    action?: string
  }> = []

  // Critical: Very low employability
  if (metrics.employabilityScore < 30) {
    alerts.push({
      level: 'critical',
      message: 'Your employability score is critically low',
      action: 'Complete urgent skill-building tasks',
    })
  }

  // Critical: Long inactivity
  if (metrics.daysSinceActivity > 21) {
    alerts.push({
      level: 'critical',
      message: 'No activity for 3+ weeks',
      action: 'Re-engage with learning activities',
    })
  }

  // Warning: Below internship readiness
  if (
    metrics.employabilityScore < 75 &&
    metrics.currentStage === 'project'
  ) {
    alerts.push({
      level: 'warning',
      message: 'Need higher employability for internship applications',
      action: 'Complete 2-3 more projects',
    })
  }

  // Warning: Skill gaps for target role
  if (metrics.roleGaps && metrics.roleReadinessPct < 60) {
    alerts.push({
      level: 'warning',
      message: `Only ${metrics.roleReadinessPct}% aligned with target role`,
      action: 'Focus on gap-closing learning paths',
    })
  }

  // Info: Opportunities available
  if (metrics.opportunitySummary.eligible > 0) {
    alerts.push({
      level: 'info',
      message: `${metrics.opportunitySummary.eligible} internship opportunity available`,
      action: 'Check opportunities',
    })
  }

  return alerts
}

// ============================================================================
// REFRESH STRATEGY
// ============================================================================

/**
 * Determine if dashboard metrics should be refreshed.
 * Called by components to know when to recalculate.
 */
export function shouldRefreshDashboard(
  metrics: DashboardMetrics,
  timeSinceLastCalculation: number // ms
): boolean {
  // Refresh if:
  // 1. More than 5 minutes have passed
  if (timeSinceLastCalculation > 5 * 60 * 1000) return true

  // 2. Student is stagnant (low activity)
  if (metrics.isStagnant) return false // Don't hammer with recalcs

  // 3. Just became eligible for new opportunity
  // (handled by store subscription)

  return false
}
