/**
 * OPPORTUNITY ELIGIBILITY LOGIC
 * 
 * Determines whether a student is eligible for a specific opportunity
 * based on stage, employability, skills, requirements, and role alignment.
 */

import type {
  Opportunity,
  RoleTrack,
  SkillLevel,
} from '@/domain/types'
import {
  EMPLOYABILITY_LEVELS,
  SKILL_THRESHOLDS,
  ROLE_ALIGNMENT_THRESHOLDS,
} from '@/config/scoring'
import { analyzeSkillGaps, isReadyForRole } from './gaps'
import { getStudentCurrentStage } from './progression'

// ============================================================================
// TYPES
// ============================================================================

export interface OpportunityEligibility {
  opportunityId: string
  opportunityTitle: string
  isEligible: boolean
  eligibilityScore: number // 0-100
  reasons: EligibilityReason[]
  blockers: EligibilityBlocker[]
  almostReady: boolean // Within 10% of eligible
  readinessSummary: string
}

export interface EligibilityReason {
  criterion: string
  status: 'pass' | 'warning' | 'fail'
  value: string | number
  required: string | number
}

export interface EligibilityBlocker {
  requirement: string
  gap: string
  suggestedAction: string
}

export interface OpportunitiesWithEligibility {
  totalOpportunities: number
  eligibleCount: number
  almostReadyCount: number
  opportunities: Array<{
    opportunity: Opportunity
    eligibility: OpportunityEligibility
  }>
}

// ============================================================================
// OPPORTUNITY TYPE RULES
// ============================================================================

/**
 * Define eligibility rules for different opportunity types.
 */
const OPPORTUNITY_RULES = {
  'micro-internship': {
    minEmployability: EMPLOYABILITY_LEVELS.SIMULATE_READY,
    minStage: 'simulate',
    minSkillThreshold: 0.50,
    requiredCertifications: 0,
    description: 'Short internship experiences',
  },
  internship: {
    minEmployability: EMPLOYABILITY_LEVELS.PROJECT_READY,
    minStage: 'project',
    minSkillThreshold: 0.65,
    requiredCertifications: 1,
    description: 'Full-time or extended internship',
  },
  job: {
    minEmployability: EMPLOYABILITY_LEVELS.JOB_READY,
    minStage: 'internship',
    minSkillThreshold: 0.75,
    requiredCertifications: 2,
    description: 'Full-time job position',
  },
  'mini-project': {
    minEmployability: EMPLOYABILITY_LEVELS.PROJECT_READY,
    minStage: 'learn',
    minSkillThreshold: 0.40,
    requiredCertifications: 0,
    description: 'Short collaborative project',
  },
  'live-project': {
    minEmployability: EMPLOYABILITY_LEVELS.PROJECT_READY,
    minStage: 'project',
    minSkillThreshold: 0.60,
    requiredCertifications: 1,
    description: 'Real-world project work',
  },
  workshop: {
    minEmployability: EMPLOYABILITY_LEVELS.ENTRY_READY,
    minStage: 'learn',
    minSkillThreshold: 0.0,
    requiredCertifications: 0,
    description: 'Workshop or training session',
  },
  'competitive-challenge': {
    minEmployability: EMPLOYABILITY_LEVELS.SIMULATE_READY,
    minStage: 'simulate',
    minSkillThreshold: 0.55,
    requiredCertifications: 0,
    description: 'Competitive coding/design challenge',
  },
  mentorship: {
    minEmployability: EMPLOYABILITY_LEVELS.ENTRY_READY,
    minStage: 'learn',
    minSkillThreshold: 0.0,
    requiredCertifications: 0,
    description: 'Mentorship or career guidance',
  },
  'industrial-visit': {
    minEmployability: EMPLOYABILITY_LEVELS.ENTRY_READY,
    minStage: 'learn',
    minSkillThreshold: 0.0,
    requiredCertifications: 0,
    description: 'Company/industry visit',
  },
}

// ============================================================================
// BASIC ELIGIBILITY CHECKS
// ============================================================================

/**
 * Get the rules for an opportunity type.
 */
export function getOpportunityRules(type: string) {
  return (OPPORTUNITY_RULES as any)[type] || OPPORTUNITY_RULES.workshop
}

/**
 * Check if student meets employability minimum.
 */
function checkEmployabilityRequirement(
  employabilityScore: number,
  minRequired: number
): EligibilityReason {
  const pass = employabilityScore >= minRequired
  return {
    criterion: 'Employability Score',
    status: pass ? 'pass' : 'fail',
    value: employabilityScore,
    required: minRequired,
  }
}

/**
 * Check if student is at the right stage.
 */
function checkStageRequirement(
  currentStage: string,
  minStage: string,
  stageOrder: string[]
): EligibilityReason {
  const currentIndex = stageOrder.indexOf(currentStage)
  const minIndex = stageOrder.indexOf(minStage)
  const pass = currentIndex >= minIndex

  return {
    criterion: 'Career Stage',
    status: pass ? 'pass' : 'fail',
    value: currentStage,
    required: minStage,
  }
}

/**
 * Check role alignment skills.
 */
function checkRoleAlignmentRequirement(
  studentSkills: SkillLevel[],
  opportunityRoleId: string,
  availableRoles: RoleTrack[],
  minThreshold: number
): EligibilityReason {
  const targetRole = availableRoles.find((r) => r.id === opportunityRoleId)
  if (!targetRole) {
    return {
      criterion: 'Role Alignment',
      status: 'pass', // No specific role requirement
      value: 'N/A',
      required: 'N/A',
    }
  }

  const gapAnalysis = analyzeSkillGaps(
    'temp',
    studentSkills,
    targetRole,
    minThreshold * 100
  )

  const pass = isReadyForRole(gapAnalysis, 50) // 50% alignment check
  const alignment = gapAnalysis.gapSummary.overallAlignment

  return {
    criterion: `Role Alignment (${targetRole.title})`,
    status: pass ? 'pass' : alignment > 40 ? 'warning' : 'fail',
    value: `${alignment}%`,
    required: `${Math.round(minThreshold * 100)}%`,
  }
}

/**
 * Check certification requirements.
 */
function checkCertificationRequirement(
  studentCertCount: number,
  minRequired: number
): EligibilityReason {
  const pass = studentCertCount >= minRequired
  return {
    criterion: 'Certifications',
    status: pass ? 'pass' : 'fail',
    value: studentCertCount,
    required: minRequired,
  }
}

// ============================================================================
// COMPLETE ELIGIBILITY CHECK
// ============================================================================

/**
 * Determine complete eligibility for a student for a specific opportunity.
 */
export function checkOpportunityEligibility(
  studentId: string,
  opportunity: Opportunity,
  employabilityScore: number,
  currentStage: string,
  skills: SkillLevel[],
  certificationsCount: number,
  roles: RoleTrack[],
  stageOrder: string[] = ['learn', 'simulate', 'project', 'internship', 'job']
): OpportunityEligibility {
  const rules = getOpportunityRules(opportunity.type)
  const reasons: EligibilityReason[] = []
  const blockers: EligibilityBlocker[] = []

  // Check employability
  const empReason = checkEmployabilityRequirement(
    employabilityScore,
    rules.minEmployability
  )
  reasons.push(empReason)
  if (empReason.status === 'fail') {
    blockers.push({
      requirement: 'Employability Score',
      gap: `${rules.minEmployability - employabilityScore} points`,
      suggestedAction: 'Complete more tasks and simulations',
    })
  }

  // Check stage
  const stageReason = checkStageRequirement(
    currentStage,
    rules.minStage,
    stageOrder
  )
  reasons.push(stageReason)
  if (stageReason.status === 'fail') {
    blockers.push({
      requirement: 'Career Stage',
      gap: `Need to reach ${rules.minStage} stage`,
      suggestedAction: `Progress through current stage to reach ${rules.minStage}`,
    })
  }

  // Check role alignment
  if (opportunity.roleId) {
    const roleReason = checkRoleAlignmentRequirement(
      skills,
      opportunity.roleId,
      roles,
      rules.minSkillThreshold
    )
    reasons.push(roleReason)
    if (roleReason.status === 'fail') {
      blockers.push({
        requirement: 'Role-Specific Skills',
        gap: 'Skills not aligned with role',
        suggestedAction: 'Take skill-building courses',
      })
    }
  }

  // Check certifications
  const certReason = checkCertificationRequirement(
    certificationsCount,
    rules.requiredCertifications
  )
  reasons.push(certReason)
  if (certReason.status === 'fail') {
    const need = rules.requiredCertifications - certificationsCount
    blockers.push({
      requirement: 'Certifications',
      gap: `Need ${need} more certificate(s)`,
      suggestedAction: 'Earn certifications through learning and projects',
    })
  }

  // Calculate eligibility score
  const passCount = reasons.filter((r) => r.status === 'pass').length
  const warningCount = reasons.filter((r) => r.status === 'warning').length
  const eligibilityScore = Math.round(
    ((passCount + warningCount * 0.5) / reasons.length) * 100
  )

  const isEligible = blockers.length === 0
  const almostReady = !isEligible && eligibilityScore >= 75

  let readinessSummary = ''
  if (isEligible) {
    readinessSummary = `Ready to apply for ${opportunity.title}`
  } else if (almostReady) {
    readinessSummary = `Almost ready: ${blockers[0]?.gap}`
  } else if (eligibilityScore >= 50) {
    readinessSummary = 'Developing readiness - address key gaps'
  } else {
    readinessSummary = 'Not yet ready - significant gaps remain'
  }

  return {
    opportunityId: opportunity.id,
    opportunityTitle: opportunity.title,
    isEligible,
    eligibilityScore,
    reasons,
    blockers,
    almostReady,
    readinessSummary,
  }
}

// ============================================================================
// BULK ELIGIBILITY CHECKS
// ============================================================================

/**
 * Check eligibility for all opportunities for a student.
 */
export function getEligibleOpportunitiesForStudent(
  studentId: string,
  opportunities: Opportunity[],
  employabilityScore: number,
  currentStage: string,
  skills: SkillLevel[],
  certificationsCount: number,
  roles: RoleTrack[],
  stageOrder?: string[]
): OpportunitiesWithEligibility {
  const results = opportunities.map((opp) => ({
    opportunity: opp,
    eligibility: checkOpportunityEligibility(
      studentId,
      opp,
      employabilityScore,
      currentStage,
      skills,
      certificationsCount,
      roles,
      stageOrder
    ),
  }))

  const eligible = results.filter((r) => r.eligibility.isEligible)
  const almostReady = results.filter(
    (r) => !r.eligibility.isEligible && r.eligibility.almostReady
  )

  return {
    totalOpportunities: opportunities.length,
    eligibleCount: eligible.length,
    almostReadyCount: almostReady.length,
    opportunities: results.sort((a, b) =>
      b.eligibility.isEligible ? 1 : -1
    ),
  }
}

// ============================================================================
// FILTERING & SORTING
// ============================================================================

/**
 * Get only eligible opportunities.
 */
export function getApprovedOpportunities(
  allOpps: OpportunitiesWithEligibility
): Opportunity[] {
  return allOpps.opportunities
    .filter((item) => item.eligibility.isEligible)
    .map((item) => item.opportunity)
}

/**
 * Get opportunities student is close to being eligible for.
 */
export function getAlmostReadyOpportunities(
  allOpps: OpportunitiesWithEligibility
): Opportunity[] {
  return allOpps.opportunities
    .filter((item) => item.eligibility.almostReady)
    .map((item) => item.opportunity)
}

/**
 * Get opportunities by minimum gap to eligibility.
 * Helps students see what to work towards.
 */
export function getOpportunitiesByProximity(
  allOpps: OpportunitiesWithEligibility
): Array<{
  opportunity: Opportunity
  eligibility: OpportunityEligibility
  proximityPercent: number
}> {
  return allOpps.opportunities
    .map((item) => ({
      ...item,
      proximityPercent: item.eligibility.eligibilityScore,
    }))
    .sort((a, b) => b.proximityPercent - a.proximityPercent)
}

// ============================================================================
// STATS & SUMMARIES
// ============================================================================

/**
 * Get summary stats for opportunities.
 */
export function getOpportunitySummary(
  allOpps: OpportunitiesWithEligibility
): {
  totalCount: number
  eligibleCount: number
  almostReadyCount: number
  notReadyCount: number
  eligibilityRate: number
} {
  return {
    totalCount: allOpps.totalOpportunities,
    eligibleCount: allOpps.eligibleCount,
    almostReadyCount: allOpps.almostReadyCount,
    notReadyCount:
      allOpps.totalOpportunities -
      allOpps.eligibleCount -
      allOpps.almostReadyCount,
    eligibilityRate: allOpps.totalOpportunities > 0
      ? Math.round((allOpps.eligibleCount / allOpps.totalOpportunities) * 100)
      : 0,
  }
}

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

/**
 * Get top opportunities to pursue based on stage alignment.
 */
export function getRecommendedOpportunities(
  allOpps: OpportunitiesWithEligibility,
  topN: number = 3
): Opportunity[] {
  // Prioritize: eligible > almost ready > by score
  const eligible = allOpps.opportunities
    .filter((o) => o.eligibility.isEligible)
    .slice(0, topN)

  if (eligible.length >= topN) {
    return eligible.map((o) => o.opportunity)
  }

  const almostReady = allOpps.opportunities
    .filter((o) => o.eligibility.almostReady)
    .slice(0, topN - eligible.length)

  return [
    ...eligible,
    ...almostReady,
  ].map((o) => o.opportunity)
}

/**
 * Prioritize opportunities by employer/role fit.
 */
export function prioritizeByRoleAlignment(
  allOpps: OpportunitiesWithEligibility,
  preferredRoleId: string
): Opportunity[] {
  return allOpps.opportunities
    .filter((o) => o.opportunity.roleId === preferredRoleId)
    .map((o) => o.opportunity)
}
