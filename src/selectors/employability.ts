/**
 * EMPLOYABILITY SCORING ENGINE
 * 
 * Calculates a student's employability score (0-100) based on:
 * - Stage completion progress
 * - Skill proficiency
 * - Active engagement/consistency
 * - Experience (projects, internships, jobs)
 * - Certifications, badges, achievements
 */

import type { StageId } from '@/domain/types'
import {
  EMPLOYABILITY_WEIGHTS,
  ACTIVITY_SCORING,
  EXPERIENCE_SCORING,
  CERTIFICATION_SCORING,
  SKILL_CATEGORY_WEIGHTS,
} from '@/config/scoring'
import { getAllStageProgress } from './progression'

// ============================================================================
// TYPES
// ============================================================================

export interface EmployabilityScoreBreakdown {
  totalScore: number
  components: {
    stageCompletion: {
      score: number
      weight: number
      contribution: number
    }
    skillProficiency: {
      score: number
      weight: number
      contribution: number
    }
    activity: {
      score: number
      weight: number
      contribution: number
      details: {
        consistencyBonus: number
        stagnationPenalty: number
        velocityBonus: number
      }
    }
    experience: {
      score: number
      weight: number
      contribution: number
      details: {
        projectsContribution: number
        microInternshipsContribution: number
        internshipsContribution: number
        jobsContribution: number
        portfolioContribution: number
      }
    }
    certifications: {
      score: number
      weight: number
      contribution: number
      details: {
        badgesContribution: number
        certificatesContribution: number
        achievementsContribution: number
      }
    }
  }
  riskFlags: string[]
  strengths: string[]
}

export interface ActivityMetrics {
  activeStreak: number
  daysSinceLastActivity: number
  itemsCompletedThisWeek: number
  isStagnant: boolean
  hasConsistencyBonus: boolean
}

// ============================================================================
// STAGE COMPLETION SCORING
// ============================================================================

/**
 * Calculate score contribution from stage completion.
 * Based on weighted progress across all stages.
 */
export function calculateStageCompletionScore(
  studentId: string,
  tasks: any[],
  simulations: any[],
  opportunities: any[],
  applications: any[],
  completions: any[],
  simulationRuns: any[],
  roleId?: string
): number {
  const allProgress = getAllStageProgress(
    studentId,
    tasks,
    simulations,
    opportunities,
    applications,
    completions,
    simulationRuns,
    roleId
  )

  return allProgress.stageWeightedCompletion
}

// ============================================================================
// SKILL PROFICIENCY SCORING
// ============================================================================

/**
 * Calculate score contribution from skill proficiency.
 * Weighted by category importance and threshold achievements.
 */
export function calculateSkillProficiencyScore(skills: any[]): number {
  if (skills.length === 0) return 0

  // Group by category
  const byCategory: Record<string, number[]> = {}
  skills.forEach((skill) => {
    if (!byCategory[skill.category]) {
      byCategory[skill.category] = []
    }
    byCategory[skill.category].push(skill.level)
  })

  // Calculate category averages
  let weightedScore = 0
  Object.entries(byCategory).forEach(([category, levels]) => {
    const categoryWeight =
      (SKILL_CATEGORY_WEIGHTS as any)[category] || 0.05
    const avgLevel =
      levels.reduce((a, b) => a + b, 0) / levels.length
    weightedScore += (avgLevel / 100) * categoryWeight
  })

  // Normalize to 0-100 scale
  return Math.round(weightedScore * 100)
}

// ============================================================================
// ACTIVITY SCORING
// ============================================================================

/**
 * Analyze student activity for consistency bonuses and stagnation penalties.
 */
export function analyzeActivityMetrics(
  completions: any[],
  simulationRuns: any[],
  studentId: string,
  today: Date = new Date()
): ActivityMetrics {
  // Get all student activity
  const studentCompletions = completions.filter(
    (c) => c.studentId === studentId
  )
  const studentRuns = simulationRuns.filter(
    (r) => r.studentId === studentId
  )

  // Find most recent activity
  const allActivities = [
    ...studentCompletions.map((c) => c.completedAt || new Date()),
    ...studentRuns.map((r) => r.completedAt || new Date()),
  ]

  const mostRecentActivity =
    allActivities.length > 0
      ? new Date(Math.max(...allActivities.map((d) => new Date(d).getTime())))
      : null

  const daysSinceLastActivity = mostRecentActivity
    ? Math.floor(
        (today.getTime() - new Date(mostRecentActivity).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 999

  // Count items completed this week
  const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const itemsThisWeek = allActivities.filter(
    (d) => new Date(d) > oneWeekAgo
  ).length

  // Streak calculation (simplified: check if active in last 7 days)
  const activeStreak = daysSinceLastActivity <= 1 ? 7 : 0

  const isStagnant =
    daysSinceLastActivity >
    ACTIVITY_SCORING.daysSinceActivityThreshold

  const hasConsistencyBonus =
    activeStreak >= ACTIVITY_SCORING.activeStreakDaysForBonus ||
    itemsThisWeek >= ACTIVITY_SCORING.velocityBonusThreshold

  return {
    activeStreak,
    daysSinceLastActivity,
    itemsCompletedThisWeek: itemsThisWeek,
    isStagnant,
    hasConsistencyBonus,
  }
}

/**
 * Calculate score contribution from activity and consistency.
 */
export function calculateActivityScore(
  completions: any[],
  simulationRuns: any[],
  studentId: string
): number {
  const activity = analyzeActivityMetrics(completions, simulationRuns, studentId)

  let score = 50 // Base score

  // Add bonus for consistency
  if (activity.hasConsistencyBonus) {
    score += ACTIVITY_SCORING.consistencyBonus * 50
  }

  // Subtract penalty for stagnation
  if (activity.isStagnant) {
    score -= ACTIVITY_SCORING.stagnationPenalty * 50
  }

  return Math.max(0, Math.min(100, Math.round(score)))
}

// ============================================================================
// EXPERIENCE SCORING
// ============================================================================

export interface ExperienceCounts {
  completedProjects: number
  completedMicroInternships: number
  completedInternships: number
  completedJobs: number
  portfolioItems: number
}

/**
 * Count student experience items.
 */
export function countExperience(
  applications: any[],
  experienceRecords: any[],
  portfolioItems: any[],
  studentId: string
): ExperienceCounts {
  const appsByStatus = applications.filter(
    (a) => a.studentId === studentId
  )

  const completedInternships = appsByStatus.filter(
    (a) =>
      (a.type === 'internship' || a.type === 'micro-internship') &&
      a.status === 'completed'
  ).length

  const completedJobs = appsByStatus.filter(
    (a) => a.type === 'job' && a.status === 'completed'
  ).length

  const completedProjects = experienceRecords.filter(
    (e) => e.studentId === studentId && e.type === 'project'
  ).length

  const portfolio = portfolioItems.filter(
    (p) => p.studentId === studentId
  ).length

  return {
    completedProjects,
    completedMicroInternships: completedInternships,
    completedInternships:
      completedInternships > 0
        ? Math.max(0, completedInternships - 1)
        : 0,
    completedJobs,
    portfolioItems: portfolio,
  }
}

/**
 * Calculate score contribution from experience.
 */
export function calculateExperienceScore(
  experience: ExperienceCounts
): number {
  let score = 0

  // Projects contribution
  score += Math.min(
    experience.completedProjects * EXPERIENCE_SCORING.projectCompletionValue,
    EXPERIENCE_SCORING.maxProjectContribution
  )

  // Micro-internship contribution
  score += Math.min(
    experience.completedMicroInternships *
      EXPERIENCE_SCORING.microInternshipValue,
    EXPERIENCE_SCORING.maxMicroInternshipContribution
  )

  // Internship contribution
  score +=
    experience.completedInternships * EXPERIENCE_SCORING.internshipValue

  // Job contribution
  score += experience.completedJobs * EXPERIENCE_SCORING.jobValue

  // Portfolio contribution
  score += Math.min(
    experience.portfolioItems * EXPERIENCE_SCORING.portfolioItemValue,
    EXPERIENCE_SCORING.maxPortfolioContribution
  )

  return Math.min(100, Math.round(score * 100))
}

// ============================================================================
// CERTIFICATION SCORING
// ============================================================================

export interface CertificationCounts {
  badges: number
  certificates: number
  achievements: number
}

/**
 * Count student credentials.
 */
export function countCertifications(
  badges: any[],
  certificates: any[],
  achievements: any[],
  studentId: string
): CertificationCounts {
  return {
    badges: badges.filter((b) => b.studentId === studentId).length,
    certificates: certificates.filter(
      (c) => c.studentId === studentId
    ).length,
    achievements: achievements.filter(
      (a) => a.studentId === studentId
    ).length,
  }
}

/**
 * Calculate score contribution from certifications.
 */
export function calculateCertificationScore(
  certifications: CertificationCounts
): number {
  let score = 0

  // Badges contribution
  score += Math.min(
    certifications.badges * CERTIFICATION_SCORING.badgeValue * 100,
    CERTIFICATION_SCORING.maxBadgeContribution * 100
  )

  // Certificates contribution
  score += Math.min(
    certifications.certificates * CERTIFICATION_SCORING.certificateValue * 100,
    CERTIFICATION_SCORING.maxCertificateContribution * 100
  )

  // Achievements contribution
  score += Math.min(
    certifications.achievements *
      CERTIFICATION_SCORING.achievementValue * 100,
    CERTIFICATION_SCORING.maxAchievementContribution * 100
  )

  return Math.min(100, Math.round(score))
}

// ============================================================================
// COMPLETE EMPLOYABILITY SCORE
// ============================================================================

/**
 * Calculate complete employability score with detailed breakdown.
 * This is the main entry point for employability calculations.
 */
export function calculateEmployabilityScoreWithBreakdown(
  studentId: string,
  skills: any[],
  tasks: any[],
  simulations: any[],
  opportunities: any[],
  applications: any[],
  completions: any[],
  simulationRuns: any[],
  experienceRecords: any[],
  portfolioItems: any[],
  badges: any[],
  certificates: any[],
  achievements: any[],
  roleId?: string
): EmployabilityScoreBreakdown {
  // Calculate component scores
  const stageScore = calculateStageCompletionScore(
    studentId,
    tasks,
    simulations,
    opportunities,
    applications,
    completions,
    simulationRuns,
    roleId
  )

  const skillScore = calculateSkillProficiencyScore(skills)

  const activityScore = calculateActivityScore(
    completions,
    simulationRuns,
    studentId
  )

  const experience = countExperience(
    applications,
    experienceRecords,
    portfolioItems,
    studentId
  )
  const experienceScore = calculateExperienceScore(experience)

  const certs = countCertifications(
    badges,
    certificates,
    achievements,
    studentId
  )
  const certScore = calculateCertificationScore(certs)

  // Calculate contributions (weighted)
  const stageContribution =
    (stageScore / 100) * EMPLOYABILITY_WEIGHTS.stageCompletion
  const skillContribution =
    (skillScore / 100) * EMPLOYABILITY_WEIGHTS.skillProficiency
  const activityContribution =
    (activityScore / 100) * EMPLOYABILITY_WEIGHTS.activity
  const experienceContribution =
    (experienceScore / 100) * EMPLOYABILITY_WEIGHTS.experience
  const certContribution =
    (certScore / 100) * EMPLOYABILITY_WEIGHTS.certifications

  const totalScore = Math.round(
    (stageContribution +
      skillContribution +
      activityContribution +
      experienceContribution +
      certContribution) *
      100
  )

  // Activity breakdown
  const activity = analyzeActivityMetrics(
    completions,
    simulationRuns,
    studentId
  )

  // Risk flags
  const riskFlags: string[] = []
  if (totalScore < 40) riskFlags.push('At risk - low employability')
  if (stageScore < 50) riskFlags.push('Behind on stage progression')
  if (skillScore < 50) riskFlags.push('Key skills need development')
  if (activity.isStagnant) riskFlags.push('No recent activity')
  if (experience.completedProjects === 0 && experience.completedMicroInternships === 0) {
    riskFlags.push('No practical experience yet')
  }

  // Strengths
  const strengths: string[] = []
  if (totalScore >= 80) strengths.push('Excellent employability')
  if (experience.completedInternships > 0) strengths.push('Internship experience')
  if (experience.completedJobs > 0) strengths.push('Job placement achieved')
  if (certs.certificates > 0) strengths.push('Certified skills')
  if (activity.hasConsistencyBonus) strengths.push('Consistent engagement')

  return {
    totalScore,
    components: {
      stageCompletion: {
        score: stageScore,
        weight: EMPLOYABILITY_WEIGHTS.stageCompletion,
        contribution: Math.round(stageContribution * 100),
      },
      skillProficiency: {
        score: skillScore,
        weight: EMPLOYABILITY_WEIGHTS.skillProficiency,
        contribution: Math.round(skillContribution * 100),
      },
      activity: {
        score: activityScore,
        weight: EMPLOYABILITY_WEIGHTS.activity,
        contribution: Math.round(activityContribution * 100),
        details: {
          consistencyBonus: activity.hasConsistencyBonus ? 5 : 0,
          stagnationPenalty: activity.isStagnant ? -10 : 0,
          velocityBonus: activity.itemsCompletedThisWeek > 3 ? 5 : 0,
        },
      },
      experience: {
        score: experienceScore,
        weight: EMPLOYABILITY_WEIGHTS.experience,
        contribution: Math.round(experienceContribution * 100),
        details: {
          projectsContribution:
            experience.completedProjects *
            EXPERIENCE_SCORING.projectCompletionValue,
          microInternshipsContribution:
            experience.completedMicroInternships *
            EXPERIENCE_SCORING.microInternshipValue,
          internshipsContribution:
            experience.completedInternships *
            EXPERIENCE_SCORING.internshipValue,
          jobsContribution:
            experience.completedJobs * EXPERIENCE_SCORING.jobValue,
          portfolioContribution:
            experience.portfolioItems *
            EXPERIENCE_SCORING.portfolioItemValue,
        },
      },
      certifications: {
        score: certScore,
        weight: EMPLOYABILITY_WEIGHTS.certifications,
        contribution: Math.round(certContribution * 100),
        details: {
          badgesContribution:
            certs.badges * CERTIFICATION_SCORING.badgeValue,
          certificatesContribution:
            certs.certificates * CERTIFICATION_SCORING.certificateValue,
          achievementsContribution:
            certs.achievements * CERTIFICATION_SCORING.achievementValue,
        },
      },
    },
    riskFlags,
    strengths,
  }
}

/**
 * Simplified version that returns just the total score.
 */
export function calculateEmployabilityScore(
  studentId: string,
  skills: any[],
  tasks: any[],
  simulations: any[],
  opportunities: any[],
  applications: any[],
  completions: any[],
  simulationRuns: any[],
  experienceRecords: any[],
  portfolioItems: any[],
  badges: any[],
  certificates: any[],
  achievements: any[],
  roleId?: string
): number {
  const breakdown = calculateEmployabilityScoreWithBreakdown(
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
  return breakdown.totalScore
}
