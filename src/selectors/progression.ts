/**
 * STAGE PROGRESSION SELECTORS
 * 
 * Core logic for tracking and calculating student progression across 5 stages.
 * These selectors determine which stage a student is in and what they need next.
 */

import type {
  Task,
  Simulation,
  StudentTaskCompletion,
  StudentSimulationRun,
  Opportunity,
  Application,
  ExperienceRecord,
  StageId,
} from '@/domain/types'
import {
  STAGE_ADVANCEMENT_RULES,
  STAGE_WEIGHTS,
  getAdvancementRule,
} from '@/config/scoring'

// ============================================================================
// TYPES
// ============================================================================

export interface StageProgressDetail {
  stageId: StageId
  label: string
  order: number
  status: 'upcoming' | 'active' | 'completed'
  assignedCount: number
  completedCount: number
  inProgressCount: number
  completionPercent: number
  startedAt?: Date
  completedAt?: Date
  canAdvance: boolean
  blockers?: string[]
}

export interface StageProgressSummary {
  stageId: StageId
  assignedItems: number
  completedItems: number
  inProgressItems: number
  blockedItems: number
  completionPercent: number
  startedAt?: Date
  completedAt?: Date
}

export interface AllStageProgress {
  currentStage: StageId
  stages: StageProgressDetail[]
  overallCompletionPercent: number
  stageWeightedCompletion: number
}

// ============================================================================
// STAGE QUERIES
// ============================================================================

/**
 * Get all tasks assigned to a specific stage.
 */
export function getTasksForStage(
  tasks: Task[],
  stageId: StageId
): Task[] {
  return tasks.filter((t) => t.stage === stageId)
}

/**
 * Get all simulations for a role (all stages within that role).
 */
export function getSimulationsForRole(
  simulations: Simulation[],
  roleId: string
): Simulation[] {
  return simulations.filter((s) => s.roleId === roleId)
}

/**
 * Get completed tasks by student for a stage.
 */
export function getCompletedTasksForStage(
  stageId: StageId,
  studentId: string,
  tasks: Task[],
  completions: StudentTaskCompletion[]
): Task[] {
  const stageTaskIds = new Set(
    getTasksForStage(tasks, stageId).map((t) => t.id)
  )
  const studentCompletedIds = new Set(
    completions
      .filter((c) => c.studentId === studentId)
      .map((c) => c.taskId)
  )

  return Array.from(stageTaskIds).filter((id) =>
    studentCompletedIds.has(id)
  )
}

/**
 * Get in-progress tasks by student for a stage.
 */
export function getInProgressTasksForStage(
  stageId: StageId,
  studentId: string,
  tasks: Task[],
  completions: StudentTaskCompletion[]
): Task[] {
  const stageTaskIds = new Set(
    getTasksForStage(tasks, stageId).map((t) => t.id)
  )
  const studentCompletedIds = new Set(
    completions
      .filter((c) => c.studentId === studentId)
      .map((c) => c.taskId)
  )

  return Array.from(stageTaskIds)
    .filter(
      (id) => !studentCompletedIds.has(id)
    )
    .map((id) => tasks.find((t) => t.id === id)!)
    .filter((t) => t?.status === 'Active')
}

/**
 * Calculate completion percentage for a stage.
 */
export function calculateStageCompletion(
  stageId: StageId,
  studentId: string,
  tasks: Task[],
  simulations: Simulation[],
  completions: StudentTaskCompletion[],
  simulationRuns: StudentSimulationRun[],
  roleId?: string
): number {
  // Get all items for this stage
  const stageTasks = getTasksForStage(tasks, stageId)
  const stageSimulations = roleId
    ? getSimulationsForRole(simulations, roleId).filter(
        (s) => s.stageId === stageId || stageId === 'simulate'
      )
    : []

  const totalItems = stageTasks.length + stageSimulations.length

  if (totalItems === 0) return 0

  // Count completed
  const completedTasks = getCompletedTasksForStage(
    stageId,
    studentId,
    tasks,
    completions
  ).length

  const completedSimulations = stageSimulations.filter((sim) =>
    simulationRuns.some(
      (run) => run.studentId === studentId && run.simulationId === sim.id
    )
  ).length

  const totalCompleted = completedTasks + completedSimulations

  return Math.round((totalCompleted / totalItems) * 100)
}

// ============================================================================
// CURRENT STAGE DETERMINATION
// ============================================================================

/**
 * Determine the student's current stage based on completion and advancement rules.
 * This is the core logic for stage progression.
 */
export function getStudentCurrentStage(
  studentId: string,
  tasks: Task[],
  simulations: Simulation[],
  opportunities: Opportunity[],
  applications: Application[],
  completions: StudentTaskCompletion[],
  simulationRuns: StudentSimulationRun[],
  roleId?: string
): StageId {
  // Helper: check if student can advance from a stage
  const canAdvanceFromStage = (from: StageId): boolean => {
    if (from === 'job') return false // Can't advance past job

    const rule = getAdvancementRule(from as any)
    if (!rule) return false

    // Check task completion
    const stageTasks = getTasksForStage(tasks, from)
    if (stageTasks.length > 0) {
      const completed = getCompletedTasksForStage(
        from,
        studentId,
        tasks,
        completions
      )
      const completionRate = completed.length / stageTasks.length

      if (completionRate < rule.minTaskCompletion) {
        return false
      }
    }

    // Check simulation requirements if applicable
    if (from === 'simulate' && rule.minSimulationCompletion) {
      const stageSimulations = getSimulationsForRole(simulations, roleId || '')
        .length
      if (stageSimulations > 0) {
        const completed = simulationRuns.filter(
          (r) => r.studentId === studentId
        ).length
        const completionRate = completed / stageSimulations

        if (completionRate < rule.minSimulationCompletion) {
          return false
        }
      }
    }

    return true
  }

  // Determine stage based on advancement eligibility
  const stagesInOrder: StageId[] = ['learn', 'simulate', 'project', 'internship', 'job']

  for (let i = stagesInOrder.length - 1; i >= 0; i--) {
    // Check if we can reach this stage
    let canReach = true
    for (let j = 0; j < i; j++) {
      if (!canAdvanceFromStage(stagesInOrder[j])) {
        canReach = false
        break
      }
    }

    if (canReach) {
      return stagesInOrder[i]
    }
  }

  return 'learn'
}

// ============================================================================
// STAGE ADVANCEMENT CHECKS
// ============================================================================

/**
 * Check if a student can advance from their current stage.
 */
export function canAdvanceToNextStage(
  studentId: string,
  currentStage: StageId,
  tasks: Task[],
  simulations: Simulation[],
  completions: StudentTaskCompletion[],
  simulationRuns: StudentSimulationRun[],
  skills: any[],
  roleId?: string
): { canAdvance: boolean; blockers: string[] } {
  const rule = getAdvancementRule(currentStage as any)
  if (!rule) {
    return { canAdvance: false, blockers: ['Last stage reached'] }
  }

  const blockers: string[] = []

  // Check task completion
  const stageTasks = getTasksForStage(tasks, currentStage)
  if (stageTasks.length > 0) {
    const completed = getCompletedTasksForStage(
      currentStage,
      studentId,
      tasks,
      completions
    )
    const completionRate = completed.length / stageTasks.length
    const requiredCount = Math.ceil(
      stageTasks.length * rule.minTaskCompletion
    )

    if (completed.length < requiredCount) {
      blockers.push(
        `Complete ${requiredCount} learning tasks (${completed.length}/${requiredCount})`
      )
    }
  }

  // Check simulation requirements
  if (rule.minSimulationCompletion) {
    const stageSimulations = getSimulationsForRole(simulations, roleId || '')
    if (stageSimulations.length > 0) {
      const completed = simulationRuns.filter(
        (r) => r.studentId === studentId
      ).length
      const requiredCount = Math.ceil(
        stageSimulations.length * rule.minSimulationCompletion
      )

      if (completed < requiredCount) {
        blockers.push(
          `Complete ${requiredCount} simulations (${completed}/${requiredCount})`
        )
      }
    }
  }

  // Check skill requirements
  if (rule.minSkillThreshold) {
    const weakSkills = skills.filter((s) => s.level < rule.minSkillThreshold * 100)
    if (weakSkills.length > 0) {
      blockers.push(
        `Improve ${weakSkills.map((s) => s.label).join(', ')} to ${rule.minSkillThreshold * 100}%`
      )
    }
  }

  return {
    canAdvance: blockers.length === 0,
    blockers,
  }
}

// ============================================================================
// STAGE PROGRESS DETAIL
// ============================================================================

/**
 * Get detailed progress information for a specific stage.
 */
export function getStageSummary(
  stageId: StageId,
  studentId: string,
  tasks: Task[],
  simulations: Simulation[],
  completions: StudentTaskCompletion[],
  simulationRuns: StudentSimulationRun[],
  roleId?: string
): StageProgressSummary {
  const stageTasks = getTasksForStage(tasks, stageId)
  const stageSimulations = roleId
    ? getSimulationsForRole(simulations, roleId).filter(
        (s) => s.stageId === stageId || stageId === 'simulate'
      )
    : []

  const completedTasks = getCompletedTasksForStage(
    stageId,
    studentId,
    tasks,
    completions
  ).length

  const completedSimulations = stageSimulations.filter((sim) =>
    simulationRuns.some(
      (run) => run.studentId === studentId && run.simulationId === sim.id
    )
  ).length

  const inProgressTasks = getInProgressTasksForStage(
    stageId,
    studentId,
    tasks,
    completions
  ).length

  const totalItems = stageTasks.length + stageSimulations.length
  const totalCompleted = completedTasks + completedSimulations

  return {
    stageId,
    assignedItems: totalItems,
    completedItems: totalCompleted,
    inProgressItems: inProgressTasks,
    blockedItems: Math.max(
      0,
      totalItems - totalCompleted - inProgressTasks
    ),
    completionPercent: totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0,
  }
}

// ============================================================================
// ALL STAGES PROGRESS
// ============================================================================

/**
 * Get the complete progress picture across all 5 stages.
 */
export function getAllStageProgress(
  studentId: string,
  tasks: Task[],
  simulations: Simulation[],
  opportunities: Opportunity[],
  applications: Application[],
  completions: StudentTaskCompletion[],
  simulationRuns: StudentSimulationRun[],
  roleId?: string
): AllStageProgress {
  const stages: StageId[] = ['learn', 'simulate', 'project', 'internship', 'job']

  const currentStage = getStudentCurrentStage(
    studentId,
    tasks,
    simulations,
    opportunities,
    applications,
    completions,
    simulationRuns,
    roleId
  )

  const stageProgressDetails: StageProgressDetail[] = stages.map((stage) => {
    const summary = getStageSummary(
      stage,
      studentId,
      tasks,
      simulations,
      completions,
      simulationRuns,
      roleId
    )

    const order = stages.indexOf(stage)
    const currentIndex = stages.indexOf(currentStage)

    let status: 'upcoming' | 'active' | 'completed'
    if (order < currentIndex) {
      status = 'completed'
    } else if (order === currentIndex) {
      status = 'active'
    } else {
      status = 'upcoming'
    }

    const canAdvance =
      summary.completionPercent === 100 &&
      (stage === 'job' ||
        canAdvanceToNextStage(
          studentId,
          stage,
          tasks,
          simulations,
          completions,
          simulationRuns,
          [],
          roleId
        ).canAdvance)

    return {
      stageId: stage,
      label: stage.charAt(0).toUpperCase() + stage.slice(1),
      order,
      status,
      assignedCount: summary.assignedItems,
      completedCount: summary.completedItems,
      inProgressCount: summary.inProgressItems,
      completionPercent: summary.completionPercent,
      canAdvance,
    }
  })

  // Calculate overall completion using weighted approach
  const weightedCompletion = stageProgressDetails.reduce((sum, stage) => {
    const weight = STAGE_WEIGHTS[stage.stageId]
    return sum + (stage.completionPercent / 100) * weight
  }, 0)

  const overallCompletion = Math.round(
    stageProgressDetails.reduce((sum, s) => sum + s.completionPercent, 0) /
      stages.length
  )

  return {
    currentStage,
    stages: stageProgressDetails,
    overallCompletionPercent: overallCompletion,
    stageWeightedCompletion: Math.round(weightedCompletion * 100),
  }
}

// ============================================================================
// NEXT RECOMMENDED ACTIONS
// ============================================================================

/**
 * Get the most important next action for a student.
 */
export function getNextRecommendedActions(
  studentId: string,
  allProgress: AllStageProgress,
  tasks: Task[],
  simulations: Simulation[],
  opportunities: Opportunity[],
  applications: Application[],
  roleId?: string
): string[] {
  const actions: string[] = []
  const currentStageProgress = allProgress.stages.find(
    (s) => s.stageId === allProgress.currentStage
  )!

  // If not at 100%, complete current stage
  if (currentStageProgress.completionPercent < 100) {
    const remaining =
      currentStageProgress.assignedCount -
      currentStageProgress.completedCount
    actions.push(
      `Complete ${remaining} more ${allProgress.currentStage} item${remaining > 1 ? 's' : ''}`
    )
  }

  // Check for advancement blockers
  if (
    allProgress.currentStage !== 'job' &&
    currentStageProgress.completionPercent === 100
  ) {
    const check = canAdvanceToNextStage(
      studentId,
      allProgress.currentStage,
      tasks,
      simulations,
      [],
      [],
      [],
      roleId
    )
    if (!check.canAdvance && check.blockers.length > 0) {
      actions.push(`Blocker: ${check.blockers[0]}`)
    }
  }

  // Opportunity recommendation
  if (
    allProgress.currentStage === 'project' ||
    allProgress.currentStage === 'internship'
  ) {
    const relevantOps = opportunities.filter((o) =>
      ['internship', 'micro-internship'].includes(o.type)
    )
    if (relevantOps.length > 0) {
      actions.push(`${relevantOps.length} internship opportunity available`)
    }
  }

  return actions.slice(0, 3) // Return top 3 actions
}
