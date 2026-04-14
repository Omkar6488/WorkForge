/**
 * EMPLOYABILITY SCORING CONFIGURATION
 * 
 * Defines weights, thresholds, and calculation rules for the employability engine.
 * All values are configurable and can be tuned without modifying component logic.
 */

// ============================================================================
// SCORE WEIGHTS
// ============================================================================

/**
 * Weighted factors that contribute to the final employability score (0-100).
 * Sum of all weights should be close to 1.0 or 100.
 */
export const EMPLOYABILITY_WEIGHTS = {
  // Stage completion (30% of score)
  stageCompletion: 0.30,

  // Skill proficiency (25% of score)
  skillProficiency: 0.25,

  // Active engagement & consistency (20% of score)
  activity: 0.20,

  // Experience & achievements (15% of score)
  experience: 0.15,

  // Certifications & credentials (10% of score)
  certifications: 0.10,
} as const

// ============================================================================
// STAGE PROGRESSION THRESHOLDS
// ============================================================================

/**
 * Advancement rules: minimum requirements to progress to the next stage.
 * These are the gates that control student progression.
 */
export const STAGE_ADVANCEMENT_RULES = {
  // learn → simulate: Must complete 50% of learning tasks
  learnToSimulate: {
    minTaskCompletion: 0.50, // 50% of learn tasks
    minEmployability: 30, // Minimum employability score
    requiredCertifications: 0,
  },

  // simulate → project: Must complete simulations and demonstrate skills
  simulateToProject: {
    minSimulationCompletion: 0.60, // 60% of assigned simulations
    minAvgSimulationScore: 65, // Average score on simulations
    minEmployability: 50,
    requiredCertifications: 0,
  },

  // project → internship: Must complete projects with skill evidence
  projectToInternship: {
    minProjectCompletion: 0.70, // 70% of assigned projects
    minEmployability: 70,
    minSkillThreshold: 0.60, // 60% proficiency in key skills
    requiredCertifications: 1, // At least 1 certification
  },

  // internship → job: Must secure internship and maintain high employability
  internshipToJob: {
    minInternshipCompletion: 1.0, // Must have completed at least 1
    minEmployability: 80,
    minSkillThreshold: 0.75, // 75% proficiency in key skills
    requiredCertifications: 2, // At least 2 certifications
  },
} as const

// ============================================================================
// EMPLOYABILITY THRESHOLDS
// ============================================================================

/**
 * Risk and readiness levels based on employability score.
 */
export const EMPLOYABILITY_LEVELS = {
  ENTRY_READY: 30, // Ready to start learn stage
  SIMULATE_READY: 50, // Ready for simulations
  PROJECT_READY: 65, // Ready for projects
  INTERNSHIP_READY: 75, // Ready for internships
  JOB_READY: 85, // Ready for job opportunities
  ELITE: 95, // Top tier preparation

  // Risk thresholds
  AT_RISK: 40, // Needs intervention
  LOW_ACTIVITY: 20, // Very low engagement
} as const

// ============================================================================
// SKILL PROFICIENCY LEVELS
// ============================================================================

export const SKILL_THRESHOLDS = {
  CRITICAL: 0.65, // 65%+ is critical for role readiness
  STRONG: 0.70, // 70%+ is strong
  MODERATE: 0.50, // 50%+ is moderate
  WEAK: 0.30, // Below 30% is weak
} as const

// ============================================================================
// STAGE COMPLETION WEIGHTS
// ============================================================================

/**
 * How each stage contributes to the overall stage completion score.
 * Normalized to sum to 1.0.
 */
export const STAGE_WEIGHTS = {
  learn: 0.2,
  simulate: 0.2,
  project: 0.25,
  internship: 0.2,
  job: 0.15,
} as const

// ============================================================================
// ACTIVITY SCORING
// ============================================================================

/**
 * How activity/consistency affects employability.
 */
export const ACTIVITY_SCORING = {
  // Consistency streak bonus
  activeStreakDaysForBonus: 7, // 7-day streak bonus
  consistencyBonus: 0.05, // +5% for strong consistency

  // Stagnation penalty
  daysSinceActivityThreshold: 14, // Days before stagnation penalty kicks in
  stagnationPenalty: 0.10, // -10% for inactivity

  // Velocity bonus
  velocityBonusThreshold: 5, // Items completed in last 7 days
  velocityBonus: 0.05, // +5% for high velocity
} as const

// ============================================================================
// EXPERIENCE SCORING
// ============================================================================

/**
 * How projects, micro-internships, and real experience contribute.
 */
export const EXPERIENCE_SCORING = {
  // Project participation
  projectCompletionValue: 0.08, // 8% per completed project
  maxProjectContribution: 0.12, // Max 12% from projects

  // Micro-internship value
  microInternshipValue: 0.10, // 10% per completed micro-internship
  maxMicroInternshipContribution: 0.15, // Max 15%

  // Real internship/job value
  internshipValue: 0.15, // 15% per completed internship
  jobValue: 0.20, // 20% for job placement

  // Portfolio items
  portfolioItemValue: 0.03, // 3% per portfolio item
  maxPortfolioContribution: 0.10, // Max 10%
} as const

// ============================================================================
// CERTIFICATION SCORING
// ============================================================================

export const CERTIFICATION_SCORING = {
  // Badge value
  badgeValue: 0.02, // 2% per badge
  maxBadgeContribution: 0.05, // Max 5%

  // Certificate value
  certificateValue: 0.05, // 5% per certificate
  maxCertificateContribution: 0.10, // Max 10%

  // Achievement value
  achievementValue: 0.01, // 1% per achievement
  maxAchievementContribution: 0.05, // Max 5%
} as const

// ============================================================================
// TIMELINE PROJECTIONS
// ============================================================================

/**
 * Estimation config for projected timelines.
 */
export const TIMELINE_CONFIG = {
  // Assumed items per week completion rates (can be adjusted)
  learnTasksPerWeek: 2,
  simulationsPerWeek: 1.5,
  projectsPerWeek: 0.5, // Longer, deeper tasks
  microInternshipsPerWeek: 0.25,

  // Risk factors for extensions
  lowVelocityFactor: 1.5, // Extend estimate by 50% if low velocity
  incompletePrereqFactor: 2.0, // Extend estimate by 2x if missing prerequisites

  // Stagnation detection
  daysBeforeWarning: 7, // Warn if no activity for 7 days
  daysBeforeCritical: 14, // Critical alert at 14 days
} as const

// ============================================================================
// ROLE TRACK ALIGNMENT
// ============================================================================

/**
 * How well a student's skills align with a role track.
 */
export const ROLE_ALIGNMENT_THRESHOLDS = {
  PERFECT: 0.85, // 85%+ skill alignment
  EXCELLENT: 0.75, // 75%+ skill alignment
  GOOD: 0.65, // 65%+ skill alignment
  MODERATE: 0.50, // 50%+ skill alignment
  WEAK: 0.30, // 30%+ skill alignment
} as const

// ============================================================================
// SKILL CATEGORY IMPORTANCE
// ============================================================================

/**
 * Weight of different skill categories in overall employability.
 * Technical skills weighted higher than soft skills.
 */
export const SKILL_CATEGORY_WEIGHTS = {
  Frontend: 0.25,
  Backend: 0.25,
  Data: 0.20,
  Engineering: 0.15, // Core fundamentals
  Professional: 0.10, // Communication, soft skills
  Marketing: 0.05,
} as const

// ============================================================================
// RECOMMENDED ACTION LOGIC
// ============================================================================

/**
 * Thresholds for triggering specific recommendations.
 */
export const RECOMMENDATION_TRIGGERS = {
  // Skill gaps
  skillGapThreshold: 0.40, // Recommend learning if < 40%
  criticalSkillGapThreshold: 0.30, // Critical alert if < 30%

  // Task completion
  taskBacklogThreshold: 3, // Alert if 3+ tasks pending
  overdueTaskThreshold: 7, // Days overdue before alert

  // Stage readiness
  stagePrerequisitesMissing: 0.50, // Alert if < 50% prerequisites met

  // Opportunity eligibility
  almostEligibleThreshold: 0.05, // 5% below threshold (show "almost there")
} as const

// ============================================================================
// BADGE & ACHIEVEMENT THRESHOLDS
// ============================================================================

/**
 * Triggers for automatic badge/achievement award.
 */
export const BADGE_TRIGGERS = {
  // Consistency badges
  sevenDayStreak: 7,
  thirtyDayStreak: 30,
  ninetyDayStreak: 90,

  // Performance badges
  allSimulationsAbove75: 0.75,
  allProjectsCompleted: 1.0,
  fourErrorFreeSim: 4,

  // Experience badges
  firstProject: 1,
  firstInternship: 1,
  threeInternships: 3,
  jobPlacement: 1,

  // Leadership badges
  referralsSuccessful: 3,
  mentorshipHours: 10,
} as const

// ============================================================================
// HELPER: Get stage advancement rule
// ============================================================================

export function getAdvancementRule(
  fromStage: 'learn' | 'simulate' | 'project' | 'internship'
) {
  const rules = {
    learn: STAGE_ADVANCEMENT_RULES.learnToSimulate,
    simulate: STAGE_ADVANCEMENT_RULES.simulateToProject,
    project: STAGE_ADVANCEMENT_RULES.projectToInternship,
    internship: STAGE_ADVANCEMENT_RULES.internshipToJob,
  }
  return rules[fromStage]
}
