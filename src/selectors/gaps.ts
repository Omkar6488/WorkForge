/**
 * SKILL GAP ANALYZER
 * 
 * Identifies gaps between a student's current skills and the skills
 * required for their target role or next career stage.
 */

import type { RoleTrack, SkillLevel } from '@/domain/types'
import { SKILL_THRESHOLDS } from '@/config/scoring'

// ============================================================================
// TYPES
// ============================================================================

export interface SkillGapAnalysis {
  studentId: string
  roleId: string
  roleName: string
  currentSkills: SkillLevel[]
  requiredSkills: string[]
  gaps: SkillGap[]
  criticalGaps: SkillGap[]
  strengths: SkillLevel[]
  gapSummary: {
    totalRequired: number
    totalStrong: number
    totalModerate: number
    totalWeak: number
    criticalCount: number
    overallAlignment: number // 0-100%
    readinessStatus: 'not-ready' | 'developing' | 'near-ready' | 'ready'
  }
  recommendations: SkillGapRecommendation[]
}

export interface SkillGap {
  skillName: string
  requiredLevel: number
  currentLevel: number
  gap: number
  priority: 'critical' | 'high' | 'medium' | 'low'
  learningPath?: string[]
}

export interface SkillGapRecommendation {
  skillName: string
  action: string
  estimatedHours: number
  resources: string[]
  priority: 'critical' | 'high' | 'medium'
}

// ============================================================================
// SKILL QUERIES
// ============================================================================

/**
 * Get a student's current level for a specific skill.
 */
export function getStudentSkillLevel(
  skills: SkillLevel[],
  skillName: string
): number {
  const skill = skills.find(
    (s) => s.label.toLowerCase() === skillName.toLowerCase()
  )
  return skill ? skill.level : 0
}

/**
 * Get all skills in a specific category.
 */
export function getSkillsByCategory(
  skills: SkillLevel[],
  category: string
): SkillLevel[] {
  return skills.filter((s) => s.category === category)
}

/**
 * Categorize skills by proficiency zone.
 */
export function categorizeByProficiency(skills: SkillLevel[]): {
  strong: SkillLevel[]
  moderate: SkillLevel[]
  weak: SkillLevel[]
} {
  return {
    strong: skills.filter(
      (s) => s.level >= SKILL_THRESHOLDS.STRONG * 100
    ),
    moderate: skills.filter(
      (s) =>
        s.level >= SKILL_THRESHOLDS.MODERATE * 100 &&
        s.level < SKILL_THRESHOLDS.STRONG * 100
    ),
    weak: skills.filter((s) => s.level < SKILL_THRESHOLDS.MODERATE * 100),
  }
}

// ============================================================================
// GAP ANALYSIS
// ============================================================================

/**
 * Analyze skill gaps for a student relative to a target role.
 */
export function analyzeSkillGaps(
  studentId: string,
  currentSkills: SkillLevel[],
  roleTrack: RoleTrack,
  targetThreshold: number = SKILL_THRESHOLDS.CRITICAL * 100
): SkillGapAnalysis {
  const gaps: SkillGap[] = []
  let strongCount = 0
  let moderateCount = 0
  let weakCount = 0
  let criticalCount = 0

  // Analyze each required skill
  roleTrack.requiredSkills.forEach((requiredSkill) => {
    const currentLevel = getStudentSkillLevel(currentSkills, requiredSkill)
    const gap = Math.max(0, targetThreshold - currentLevel)

    let priority: 'critical' | 'high' | 'medium' | 'low'
    if (gap >= 40) {
      priority = 'critical'
      criticalCount++
    } else if (gap >= 25) {
      priority = 'high'
    } else if (gap >= 10) {
      priority = 'medium'
    } else {
      priority = 'low'
    }

    // Categorize current level
    if (currentLevel >= SKILL_THRESHOLDS.STRONG * 100) {
      strongCount++
    } else if (currentLevel >= SKILL_THRESHOLDS.MODERATE * 100) {
      moderateCount++
    } else {
      weakCount++
    }

    gaps.push({
      skillName: requiredSkill,
      requiredLevel: targetThreshold,
      currentLevel,
      gap,
      priority,
    })
  })

  // Create recommendations for each gap
  const recommendations = gaps
    .filter((g) => g.gap > 0)
    .map((gap) => createSkillRecommendation(gap))

  // Calculate overall alignment
  const strongSkillsFor = gaps.filter(
    (g) => g.currentLevel >= targetThreshold
  ).length
  const overallAlignment = Math.round(
    (strongSkillsFor / gaps.length) * 100
  )

  // Determine readiness status
  let readinessStatus: 'not-ready' | 'developing' | 'near-ready' | 'ready'
  if (overallAlignment >= 80) {
    readinessStatus = 'ready'
  } else if (overallAlignment >= 60) {
    readinessStatus = 'near-ready'
  } else if (overallAlignment >= 40) {
    readinessStatus = 'developing'
  } else {
    readinessStatus = 'not-ready'
  }

  // Get strengths (skills at good level)
  const strengths = currentSkills.filter(
    (s) => s.level >= SKILL_THRESHOLDS.STRONG * 100
  )

  // Separate critical gaps
  const criticalGaps = gaps.filter((g) => g.priority === 'critical')

  return {
    studentId,
    roleId: roleTrack.id,
    roleName: roleTrack.title,
    currentSkills,
    requiredSkills: roleTrack.requiredSkills,
    gaps: gaps.sort((a, b) => b.gap - a.gap), // Sort by gap size
    criticalGaps,
    strengths,
    gapSummary: {
      totalRequired: gaps.length,
      totalStrong: strongCount,
      totalModerate: moderateCount,
      totalWeak: weakCount,
      criticalCount,
      overallAlignment,
      readinessStatus,
    },
    recommendations,
  }
}

// ============================================================================
// RECOMMENDATION GENERATION
// ============================================================================

/**
 * Create a learning recommendation for a specific skill gap.
 */
function createSkillRecommendation(gap: SkillGap): SkillGapRecommendation {
  const baseHours = (gap.gap / 10) * 20 // ~20 hours per 10% gap

  // Map low priority to medium for recommendations (not exposed to users)
  const recommendationPriority: 'critical' | 'high' | 'medium' = 
    gap.priority === 'low' ? 'medium' : gap.priority

  // Return generic recommendation for improving skill gap
  return {
    skillName: gap.skillName,
    action: `Improve ${gap.skillName} from ${gap.currentLevel}% to ${gap.requiredLevel}%`,
    estimatedHours: Math.round(baseHours),
    resources: ['Relevant courses', 'Practice projects', 'Peer review'],
    priority: recommendationPriority,
  }
}

// ============================================================================
// MISSING CRITICAL SKILLS
// ============================================================================

/**
 * Get list of critical skills the student is missing for a role.
 */
export function getMissingCriticalSkills(
  gap: SkillGapAnalysis
): string[] {
  return gap.criticalGaps.map((g) => g.skillName)
}

// ============================================================================
// READINESS CHECK
// ============================================================================

/**
 * Check if student is ready for a specific role.
 */
export function isReadyForRole(
  gap: SkillGapAnalysis,
  requiredAlignment: number = 75
): boolean {
  return gap.gapSummary.overallAlignment >= requiredAlignment
}

/**
 * Get a simple readiness percentage (0-100).
 */
export function getRoleReadinessPercent(gap: SkillGapAnalysis): number {
  return gap.gapSummary.overallAlignment
}

// ============================================================================
// MULTIPLE ROLES COMPARISON
// ============================================================================

export interface RoleComparison {
  roles: Array<{
    roleId: string
    roleName: string
    alignment: number
    gaps: SkillGap[]
    bestFit: boolean
  }>
  bestFitRole: {
    roleId: string
    roleName: string
    alignment: number
  }
}

/**
 * Compare student skills against multiple roles to find best fit.
 */
export function compareBestFitRole(
  studentId: string,
  currentSkills: SkillLevel[],
  roles: RoleTrack[]
): RoleComparison {
  const analyses = roles.map((role) =>
    analyzeSkillGaps(studentId, currentSkills, role)
  )

  const roleComparisons = analyses.map((analysis) => ({
    roleId: analysis.roleId,
    roleName: analysis.roleName,
    alignment: analysis.gapSummary.overallAlignment,
    gaps: analysis.gaps,
    bestFit: false,
  }))

  // Sort by alignment
  roleComparisons.sort((a, b) => b.alignment - a.alignment)

  // Mark best fit
  if (roleComparisons.length > 0) {
    roleComparisons[0].bestFit = true
  }

  const bestFitRole = roleComparisons[0]

  return {
    roles: roleComparisons,
    bestFitRole: {
      roleId: bestFitRole.roleId,
      roleName: bestFitRole.roleName,
      alignment: bestFitRole.alignment,
    },
  }
}

// ============================================================================
// LEARNING PATHS & RESOURCES
// ============================================================================

/**
 * Get recommended learning order for closing skill gaps.
 */
export function getLearningPathForGaps(
  gaps: SkillGapAnalysis
): SkillGapRecommendation[] {
  // Prioritize: critical → high → medium
  return gaps.recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Estimate total time to reach target proficiency for role.
 */
export function estimateTimeToReadiness(gap: SkillGapAnalysis): number {
  const totalHours = gap.recommendations.reduce(
    (sum, rec) => sum + rec.estimatedHours,
    0
  )
  // Assume 5 hours per week average engagement
  return Math.ceil(totalHours / 5)
}

// ============================================================================
// PROGRESS TRACKING
// ============================================================================

/**
 * Track how much a student has improved towards a target skill level.
 */
export function trackSkillProgress(
  skillName: string,
  previousLevel: number,
  currentLevel: number,
  targetLevel: number
): {
  improvement: number
  percentOfGapClosed: number
  remainingToTarget: number
} {
  const improvement = currentLevel - previousLevel
  const originalGap = Math.max(0, targetLevel - previousLevel)
  const percentOfGapClosed =
    originalGap > 0
      ? Math.round((improvement / originalGap) * 100)
      : 0
  const remainingToTarget = Math.max(0, targetLevel - currentLevel)

  return {
    improvement,
    percentOfGapClosed,
    remainingToTarget,
  }
}
