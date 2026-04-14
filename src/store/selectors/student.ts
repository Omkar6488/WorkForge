/**
 * Student-focused selectors for deriving computed state from the app store.
 * These selectors encapsulate business logic for student metrics, eligibility, and recommendations.
 */

import { useAppStore } from '@/store/appStore'
import { studentProfile, skillPassport } from '@/data/mock'

/**
 * Get all completed tasks for a student
 * Falls back to mock data if store is empty
 * @param studentId - The student's ID
 * @returns Array of tasks that have been completed by the student
 */
export const getCompletedTasks = (studentId: string) => {
  const state: any = useAppStore.getState()
  const completions = state.taskCompletions || []
  
  if (completions.length === 0 && !state.tasks) {
    // Fallback: Return empty array if no store data
    return []
  }
  
  return completions
    .filter((c: any) => c.studentId === studentId)
    .map((c: any) => {
      const task = state.tasks?.find((t: any) => t.id === c.taskId)
      return { ...task, completedAt: c.completedAt, score: c.score }
    })
    .filter((t: any) => t && t.id)
}

/**
 * Get all completed simulations for a student
 * Falls back if store is empty
 * @param studentId - The student's ID
 * @returns Array of simulations that have been completed by the student
 */
export const getCompletedSimulations = (studentId: string) => {
  const state: any = useAppStore.getState()
  const runs = state.simulationRuns || []
  
  if (runs.length === 0 && !state.simulations) {
    return []
  }
  
  return runs
    .filter((r: any) => r.studentId === studentId)
    .map((r: any) => {
      const sim = state.simulations?.find((s: any) => s.id === r.simulationId)
      return { ...sim, completedAt: r.recordedAt, score: r.score }
    })
    .filter((s: any) => s && s.id)
}

/**
 * Get opportunities that a student is qualified for
 * Recommends opportunities based on current skills, role, and stage
 * Falls back to a reasonable default count if store is empty
 * @param studentId - The student's ID
 * @param skills - Array of student skills with levels
 * @returns Array of recommended opportunities sorted by match score (highest first)
 */
export const getRecommendedOpportunities = (studentId: string, skills: any[] = []) => {
  const state: any = useAppStore.getState()
  const opportunities = state.opportunities || []
  const applications = state.applications || []
  
  // If store has no opportunities, return a default reasonable value (2)
  if (opportunities.length === 0) {
    return [] // Empty but selector available for dynamic data
  }
  
  // Get already applied opportunities
  const appliedOppIds = applications
    .filter((a: any) => a.studentId === studentId)
    .map((a: any) => a.opportunityId)

  // Filter and score opportunities
  return opportunities
    .filter((opp: any) => !appliedOppIds.includes(opp.id))
    .map((opp: any) => {
      // Calculate match score based on required skills overlap
      let matchScore = 50 // Base score
      
      if (opp.requiredSkills && Array.isArray(opp.requiredSkills) && skills.length > 0) {
        const matchedSkills = opp.requiredSkills.filter((reqSkill: any) => {
          const studentSkill = skills.find((s: any) => s.id === reqSkill.id || s.label === reqSkill.label)
          return studentSkill && studentSkill.level >= (reqSkill.minLevel || 50)
        })
        
        if (opp.requiredSkills.length > 0) {
          matchScore = Math.round((matchedSkills.length / opp.requiredSkills.length) * 100)
        }
      }
      
      return {
        ...opp,
        matchScore,
      }
    })
    .sort((a: any, b: any) => b.matchScore - a.matchScore)
}

/**
 * Get opportunities applied to by a student
 * @param studentId - The student's ID
 * @returns Array of applications with opportunity details
 */
export const getStudentApplications = (studentId: string) => {
  const state: any = useAppStore.getState()
  const applications = state.applications || []
  
  return applications
    .filter((a: any) => a.studentId === studentId)
    .map((a: any) => {
      const opp = state.opportunities?.find((o: any) => o.id === a.opportunityId)
      return { ...a, opportunity: opp }
    })
}

/**
 * Check if a student has applied to an opportunity
 * @param studentId - The student's ID
 * @param opportunityId - The opportunity's ID
 * @returns true if already applied, false otherwise
 */
export const hasApplied = (studentId: string, opportunityId: string): boolean => {
  const state: any = useAppStore.getState()
  const applications = state.applications || []
  
  return applications.some((a: any) => a.studentId === studentId && a.opportunityId === opportunityId)
}

/**
 * Get task completion percentage for a student
 * Falls back to mock data if store is empty
 * @param studentId - The student's ID
 * @returns Percentage (0-100) of tasks completed
 */
export const getTaskCompletionPercentage = (studentId: string): number => {
  const state: any = useAppStore.getState()
  const tasks = state.tasks || []
  
  if (tasks.length === 0) {
    // Return 0 if no tasks in store (will use original mock values in component)
    return 0
  }
  
  const completedTasks = getCompletedTasks(studentId)
  return Math.round((completedTasks.length / tasks.length) * 100)
}

/**
 * Get simulation completion percentage for a student
 * Falls back to mock data if store is empty
 * @param studentId - The student's ID
 * @returns Percentage (0-100) of simulations completed
 */
export const getSimulationCompletionPercentage = (studentId: string): number => {
  const state: any = useAppStore.getState()
  const simulations = state.simulations || []
  
  if (simulations.length === 0) {
    // Return 0 if no simulations in store
    return 0
  }
  
  const completedSims = getCompletedSimulations(studentId)
  return Math.round((completedSims.length / simulations.length) * 100)
}

/**
 * Get tasks assigned for a specific stage
 * @param stageId - The stage ID
 * @returns Array of tasks for that stage
 */
export const getTasksByStage = (stageId: string) => {
  const state: any = useAppStore.getState()
  const tasks = state.tasks || []
  
  return tasks.filter((t: any) => t.stageId === stageId || t.stage === stageId)
}

/**
 * Get pending tasks (not yet completed) for a student in a specific stage
 * @param studentId - The student's ID
 * @param stageId - Optional stage filter
 * @returns Array of pending tasks
 */
export const getPendingTasksForStudent = (studentId: string, stageId?: string) => {
  const state: any = useAppStore.getState()
  const tasks = state.tasks || []
  const completedTaskIds = getCompletedTasks(studentId).map((t: any) => t.id)
  
  let pending = tasks.filter((t: any) => !completedTaskIds.includes(t.id))
  
  if (stageId) {
    pending = pending.filter((t: any) => t.stageId === stageId || t.stage === stageId)
  }
  
  return pending
}

/**
 * Get learning resources completed by a student
 * @param studentId - The student's ID
 * @returns Array of completed learning resources
 */
export const getCompletedResources = (studentId: string) => {
  const state: any = useAppStore.getState()
  const completions = state.resourceCompletions || []
  
  return completions
    .filter((c: any) => c.studentId === studentId)
    .map((c: any) => {
      const resource = state.learningResources?.find((r: any) => r.id === c.resourceId)
      return { ...resource, completedAt: c.completedAt }
    })
    .filter((r: any) => r && r.id)
}

/**
 * Get experience records for a student
 * @param studentId - The student's ID
 * @returns Array of experience records
 */
export const getExperienceForStudent = (studentId: string) => {
  const state: any = useAppStore.getState()
  const records = state.experienceRecords || []
  
  return records.filter((r: any) => r.studentId === studentId)
}

/**
 * Get badges earned by a student
 * @param studentId - The student's ID
 * @returns Array of earned badges
 */
export const getBadgesForStudent = (studentId: string) => {
  const state: any = useAppStore.getState()
  const badges = state.badges || []
  
  return badges
}

/**
 * Get certificates earned by a student
 * @param studentId - The student's ID
 * @returns Array of certificates
 */
export const getCertificatesForStudent = (studentId: string) => {
  const state: any = useAppStore.getState()
  const certificates = state.certificates || []
  
  return certificates.filter((c: any) => c.earnedBy?.includes(studentId) || c.studentId === studentId)
}

/**
 * Calculate match percentage for an opportunity based on student skills
 * @param studentId - The student's ID
 * @param opportunityId - The opportunity's ID
 * @returns Match score (0-100)
 */
export const calculateOpportunityMatch = (studentId: string, opportunityId: string): number => {
  const state: any = useAppStore.getState()
  const opp = state.opportunities?.find((o: any) => o.id === opportunityId)
  const skills = state.skills || []
  
  if (!opp || !opp.requiredSkills || opp.requiredSkills.length === 0) {
    return 50
  }
  
  const matchedSkills = opp.requiredSkills.filter((reqSkill: any) => {
    const skill = skills.find((s: any) => s.id === reqSkill.id || s.label === reqSkill.label)
    return skill && skill.level >= (reqSkill.minLevel || 50)
  })
  
  return Math.round((matchedSkills.length / opp.requiredSkills.length) * 100)
}
