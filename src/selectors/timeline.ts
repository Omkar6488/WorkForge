/**
 * PROJECTED TIMELINE LOGIC
 * 
 * Estimates time to reach career milestones based on:
 * - Current stage and completion %
 * - Completion velocity (items per week)
 * - Pending requirements
 * - Role readiness gaps
 */

import { TIMELINE_CONFIG } from '@/config/scoring'
import type { StageId } from '@/domain/types'

// ============================================================================
// TYPES
// ============================================================================

export interface CompletionVelocity {
  itemsPerWeek: number
  taskCompletions: number
  taskDaysAnalyzed: number
  simulationRuns: number
  simulationDaysAnalyzed: number
  isHighVelocity: boolean
  isLowVelocity: boolean
  lastActivityDaysAgo: number
}

export interface TimelineProjection {
  currentStage: StageId
  currentCompletion: number
  weeksToCompleteCurrentStage: number
  weeksToInternshipReady: number
  weeksToJobReady: number
  riskFactors: string[]
  velocity: CompletionVelocity
  projectedDates: {
    currentStageCompletion: Date
    internshipReady: Date
    jobReady: Date
  }
}

export interface MilestoneEstimate {
  milestoneName: string
  targetDate: Date
  daysFromNow: number
  confidence: 'high' | 'medium' | 'low'
  factors: string[]
}

// ============================================================================
// VELOCITY CALCULATIONS
// ============================================================================

/**
 * Analyze student completion velocity.
 */
export function getCompletionVelocity(
  completions: any[],
  simulationRuns: any[],
  studentId: string,
  analysisWindow: number = 30 // days
): CompletionVelocity {
  const now = new Date()
  const windowStart = new Date(
    now.getTime() - analysisWindow * 24 * 60 * 60 * 1000
  )

  // Count completions in window
  const recentCompletions = completions.filter(
    (c) =>
      c.studentId === studentId &&
      new Date(c.completedAt || now) > windowStart
  )

  const recentRuns = simulationRuns.filter(
    (r) =>
      r.studentId === studentId &&
      new Date(r.completedAt || now) > windowStart
  )

  // Find most recent activity
  const allActivities = [
    ...recentCompletions.map((c) => new Date(c.completedAt || now)),
    ...recentRuns.map((r) => new Date(r.completedAt || now)),
  ]

  const mostRecent =
    allActivities.length > 0
      ? new Date(Math.max(...allActivities.map((d) => d.getTime())))
      : null

  const lastActivityDaysAgo = mostRecent
    ? Math.floor((now.getTime() - mostRecent.getTime()) / (24 * 60 * 60 * 1000))
    : 999

  // Calculate weekly rates
  const weeks = analysisWindow / 7
  const taskCompletionsPerWeek =
    weeks > 0 ? recentCompletions.length / weeks : 0
  const simulationRunsPerWeek =
    weeks > 0 ? recentRuns.length / weeks : 0

  const itemsPerWeek =
    taskCompletionsPerWeek + simulationRunsPerWeek

  // Velocity assessment
  const isHighVelocity = itemsPerWeek >= 4
  const isLowVelocity = itemsPerWeek < 1 || lastActivityDaysAgo > 14

  return {
    itemsPerWeek: Math.round(itemsPerWeek * 10) / 10,
    taskCompletions: recentCompletions.length,
    taskDaysAnalyzed: analysisWindow,
    simulationRuns: recentRuns.length,
    simulationDaysAnalyzed: analysisWindow,
    isHighVelocity,
    isLowVelocity,
    lastActivityDaysAgo,
  }
}

// ============================================================================
// STAGE COMPLETION TIME
// ============================================================================

/**
 * Estimate weeks to complete current stage.
 */
export function estimateWeeksToCompleteStage(
  currentCompletion: number,
  velocity: CompletionVelocity,
  remainingItems: number
): number {
  if (currentCompletion >= 100) return 0

  // Use actual velocity or defaults
  const itemsPerWeek =
    velocity.itemsPerWeek > 0
      ? velocity.itemsPerWeek
      : TIMELINE_CONFIG.learnTasksPerWeek

  let weeksNeeded = remainingItems / itemsPerWeek

  // Apply risk factors
  if (velocity.isLowVelocity) {
    weeksNeeded *= TIMELINE_CONFIG.lowVelocityFactor
  }

  // Add buffer for stagnation
  if (velocity.lastActivityDaysAgo > 14) {
    weeksNeeded += 2
  }

  return Math.ceil(weeksNeeded)
}

// ============================================================================
// MILESTONE PROJECTIONS
// ============================================================================

/**
 * Project when student will reach internship readiness.
 */
export function projectInternshipReadyDate(
  employabilityScore: number,
  targetInternshipScore: number,
  velocity: CompletionVelocity,
  currentStageCompletion: number,
  remainingStages: number = 2 // Typically project + internship stages
): Date {
  const now = new Date()

  const scoreGap = Math.max(0, targetInternshipScore - employabilityScore)
  if (scoreGap === 0) {
    return now // Already ready
  }

  // Estimate based on velocity
  // Roughly 10-15 points per week of consistent work
  const pointsPerWeek = velocity.isHighVelocity ? 15 : 8
  const weeksNeeded = scoreGap / pointsPerWeek

  // Add stage completion time
  const stageWeeks = remainingStages * 2 // Rough estimate: 2 weeks per stage

  const totalWeeks = weeksNeeded + stageWeeks

  return new Date(now.getTime() + totalWeeks * 7 * 24 * 60 * 60 * 1000)
}

/**
 * Project when student will be job ready.
 */
export function projectJobReadyDate(
  employabilityScore: number,
  targetJobScore: number,
  velocity: CompletionVelocity,
  currentStage: StageId,
  internshipDate: Date
): Date {
  const now = new Date()

  // If already past internship stage but not job ready
  const stageOrder: StageId[] = ['learn', 'simulate', 'project', 'internship', 'job']
  const currentIndex = stageOrder.indexOf(currentStage)

  let baseDate = internshipDate
  if (currentIndex >= stageOrder.indexOf('internship')) {
    // Already close to job stage
    baseDate = now
  }

  const scoreGap = Math.max(0, targetJobScore - employabilityScore)
  const pointsPerWeek = velocity.isHighVelocity ? 15 : 8
  const weeksNeeded = scoreGap / pointsPerWeek

  return new Date(
    baseDate.getTime() + Math.max(2, weeksNeeded) * 7 * 24 * 60 * 60 * 1000
  )
}

// ============================================================================
// COMPLETE TIMELINE PROJECTION
// ============================================================================

/**
 * Generate full timeline projection for a student.
 */
export function projectTimeline(
  employabilityScore: number,
  currentStage: StageId,
  currentStageCompletion: number,
  remainingItemsInStage: number,
  tasks: any[],
  simulations: any[],
  completions: any[],
  simulationRuns: any[],
  studentId: string,
  targetInternshipScore: number = 75,
  targetJobScore: number = 85
): TimelineProjection {
  // Calculate velocity
  const velocity = getCompletionVelocity(
    completions,
    simulationRuns,
    studentId
  )

  // Estimate stage completion
  const weeksToCompleteStage = estimateWeeksToCompleteStage(
    currentStageCompletion,
    velocity,
    remainingItemsInStage
  )

  // Project readiness dates
  const internshipReadyDate = projectInternshipReadyDate(
    employabilityScore,
    targetInternshipScore,
    velocity,
    currentStageCompletion
  )

  const jobReadyDate = projectJobReadyDate(
    employabilityScore,
    targetJobScore,
    velocity,
    currentStage,
    internshipReadyDate
  )

  const currentStageCompletionDate = new Date(
    new Date().getTime() +
      weeksToCompleteStage * 7 * 24 * 60 * 60 * 1000
  )

  // Risk factors
  const riskFactors: string[] = []
  if (velocity.isLowVelocity) {
    riskFactors.push('Low activity velocity - timeline may extend')
  }
  if (velocity.lastActivityDaysAgo > 21) {
    riskFactors.push('Inactivity detected - possible stagnation')
  }
  if (remainingItemsInStage > 5) {
    riskFactors.push('High backlog in current stage')
  }
  if (employabilityScore < 50) {
    riskFactors.push('Employability score needs significant improvement')
  }

  return {
    currentStage,
    currentCompletion: currentStageCompletion,
    weeksToCompleteCurrentStage: weeksToCompleteStage,
    weeksToInternshipReady: Math.ceil(
      (internshipReadyDate.getTime() - new Date().getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    ),
    weeksToJobReady: Math.ceil(
      (jobReadyDate.getTime() - new Date().getTime()) /
        (7 * 24 * 60 * 60 * 1000)
    ),
    riskFactors,
    velocity,
    projectedDates: {
      currentStageCompletion: currentStageCompletionDate,
      internshipReady: internshipReadyDate,
      jobReady: jobReadyDate,
    },
  }
}

// ============================================================================
// MILESTONE TRACKING
// ============================================================================

/**
 * Get key milestones and estimated dates.
 */
export function getMilestoneEstimates(
  timeline: TimelineProjection
): MilestoneEstimate[] {
  const now = new Date()
  const milestones: MilestoneEstimate[] = []

  // Current stage completion
  const daysToStageCompletion = Math.ceil(
    (timeline.projectedDates.currentStageCompletion.getTime() -
      now.getTime()) /
      (24 * 60 * 60 * 1000)
  )

  milestones.push({
    milestoneName: `Complete ${timeline.currentStage} stage`,
    targetDate: timeline.projectedDates.currentStageCompletion,
    daysFromNow: daysToStageCompletion,
    confidence:
      timeline.velocity.isHighVelocity ||
      timeline.velocity.itemsPerWeek > 2
        ? 'high'
        : timeline.velocity.isLowVelocity
          ? 'low'
          : 'medium',
    factors: [
      `Current completion: ${timeline.currentCompletion}%`,
      `Velocity: ${timeline.velocity.itemsPerWeek} items/week`,
      daysToStageCompletion > 30
        ? 'Longer timeline - pace productivity'
        : 'On track',
    ],
  })

  // Internship readiness
  const daysToInternship = Math.ceil(
    (timeline.projectedDates.internshipReady.getTime() - now.getTime()) /
      (24 * 60 * 60 * 1000)
  )

  milestones.push({
    milestoneName: 'Internship ready',
    targetDate: timeline.projectedDates.internshipReady,
    daysFromNow: daysToInternship,
    confidence:
      timeline.velocity.isHighVelocity ||
      timeline.riskFactors.length === 0
        ? 'high'
        : 'medium',
    factors: [
      `Need employability: ${75} (current: ${75})`,
      'Requires project stage completion',
    ],
  })

  // Job readiness
  const daysToJob = Math.ceil(
    (timeline.projectedDates.jobReady.getTime() - now.getTime()) /
      (24 * 60 * 60 * 1000)
  )

  milestones.push({
    milestoneName: 'Job ready',
    targetDate: timeline.projectedDates.jobReady,
    daysFromNow: daysToJob,
    confidence: 'medium', // Further out, less certain
    factors: [
      'Need internship completion',
      'Requires high employability score',
      '+ internship experience',
    ],
  })

  return milestones
}

// ============================================================================
// ACTIVITY WARNINGS
// ============================================================================

/**
 * Get activity-based warnings/alerts.
 */
export function getActivityAlerts(velocity: CompletionVelocity): string[] {
  const alerts: string[] = []

  if (velocity.lastActivityDaysAgo > TIMELINE_CONFIG.daysBeforeCritical) {
    alerts.push('🚨 Critical: No activity for 2+ weeks - risk of falling behind')
  } else if (velocity.lastActivityDaysAgo > TIMELINE_CONFIG.daysBeforeWarning) {
    alerts.push('⚠️ Warning: No activity for 7+ days')
  }

  if (velocity.isLowVelocity && velocity.itemsPerWeek < 0.5) {
    alerts.push('📉 Very low velocity - consider adjusting schedule')
  }

  if (velocity.isHighVelocity) {
    alerts.push('🚀 Great pace - keep up the momentum!')
  }

  return alerts
}

// ============================================================================
// COMPARISON & INSIGHTS
// ============================================================================

/**
 * Compare actual vs projected timeline.
 */
export function compareProjectedVsActual(
  projectedWeeks: number,
  actualWeeksSoFar: number,
  completionPercent: number
): {
  onTrack: boolean
  variance: string
  recommendation: string
} {
  const projectedCompletion = (actualWeeksSoFar / projectedWeeks) * 100
  const variance = completionPercent - projectedCompletion

  let onTrack = true
  let recommendation = 'You are on track!'

  if (variance > 15) {
    onTrack = true
    recommendation = 'Ahead of schedule - great progress!'
  } else if (variance < -15) {
    onTrack = false
    recommendation = 'Behind schedule - accelerate or adjust goals'
  }

  return {
    onTrack,
    variance: `${variance > 0 ? '+' : ''}${Math.round(variance)}%`,
    recommendation,
  }
}
