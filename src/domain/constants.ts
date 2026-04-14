/**
 * Application constants and enums.
 */

import type { StageId, RoleId } from './types'

// ============================================================================
// STAGE PROGRESSION
// ============================================================================

export const STAGES: Record<StageId, { label: string; order: number }> = {
  learn: { label: 'Learn', order: 1 },
  simulate: { label: 'Simulate', order: 2 },
  project: { label: 'Project', order: 3 },
  internship: { label: 'Internship', order: 4 },
  job: { label: 'Job', order: 5 },
}

export const STAGE_ORDER: StageId[] = ['learn', 'simulate', 'project', 'internship', 'job']

// ============================================================================
// ROLES
// ============================================================================

export const ROLE_NAMES: Record<RoleId, string> = {
  frontend: 'Frontend Developer',
  backend: 'Backend Developer',
  data: 'Data Analyst',
  marketing: 'Digital Marketing Executive',
}

export const ROLE_IDS: RoleId[] = ['frontend', 'backend', 'data', 'marketing']

// ============================================================================
// DIFFICULTY
// ============================================================================

export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'] as const

export const DIFFICULTY_ORDER: Record<string, number> = {
  'Beginner': 1,
  'Intermediate': 2,
  'Advanced': 3,
}

// ============================================================================
// EMPLOYABILITY THRESHOLDS
// ============================================================================

export const EMPLOYABILITY_THRESHOLDS = {
  INTERNSHIP_READY: 80,
  AT_RISK: 60,
  SKILL_STRONG: 70,
  SKILL_MODERATE: 50,
} as const

// ============================================================================
// OPPORTUNITY TYPES
// ============================================================================

export const OPPORTUNITY_TYPES = ['internship', 'job', 'micro'] as const

// ============================================================================
// BADGE TIERS
// ============================================================================

export const BADGE_TIER_XP: Record<string, number> = {
  'Bronze': 200,
  'Silver': 350,
  'Gold': 800,
  'Platinum': 1500,
}

// ============================================================================
// APPLICATION STATUSES
// ============================================================================

export const APPLICATION_STATUSES = ['Applied', 'Interviewing', 'Offer', 'Declined', 'Rejected'] as const

// ============================================================================
// TASK STATUSES
// ============================================================================

export const TASK_STATUSES = ['Active', 'Pending Review', 'Draft', 'Deprecated'] as const

// ============================================================================
// SKILL CATEGORIES
// ============================================================================

export const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Data', 'Marketing', 'Engineering', 'Professional'] as const
