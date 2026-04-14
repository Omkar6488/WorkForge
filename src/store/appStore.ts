/**
 * Central application store using Zustand.
 * Single source of truth for all app state.
 */

import { create } from 'zustand'
import type {
  AppState,
  Task,
  Simulation,
  Opportunity,
  StudentTaskCompletion,
  StudentSimulationRun,
  Application,
  ExperienceRecord,
  PortfolioItem,
  LearningResource,
} from '@/domain/types'
import {
  seedCurrentUser,
  seedRoles,
  seedTasks,
  seedSimulations,
  seedOpportunities,
  seedLearningResources,
  seedBadges,
  seedCertificates,
  seedAchievements,
  seedMicroInternships,
  seedLiveProjects,
  seedMentors,
} from '@/data/seed'

// ============================================================================
// STORE ACTIONS TYPE
// ============================================================================

interface StoreActions {
  // Initialization
  initializeStore: () => void

  // Task mutations
  addTask: (task: Task) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  completeTask: (studentId: string, taskId: string, score?: number) => void

  // Simulation mutations
  addSimulation: (simulation: Simulation) => void
  updateSimulation: (simulationId: string, updates: Partial<Simulation>) => void
  deleteSimulation: (simulationId: string) => void
  recordSimulationRun: (run: StudentSimulationRun) => void

  // Opportunity mutations
  addOpportunity: (opportunity: Opportunity) => void
  updateOpportunity: (opportunityId: string, updates: Partial<Opportunity>) => void
  deleteOpportunity: (opportunityId: string) => void

  // Application tracking
  applyToOpportunity: (studentId: string, opportunityId: string) => void
  updateApplicationStatus: (applicationId: string, status: string) => void

  // Experience tracking
  addExperienceRecord: (record: ExperienceRecord) => void
  addPortfolioItem: (item: PortfolioItem) => void

  // Learning resources
  addLearningResource: (resource: LearningResource) => void
  markResourceCompleted: (studentId: string, resourceId: string) => void
}

// ============================================================================
// STORE CREATION
// ============================================================================

export const useAppStore = create<AppState & StoreActions>((set: any) => ({
  // Initial state
  currentUser: null,
  roles: [],
  tasks: [],
  simulations: [],
  opportunities: [],
  learningResources: [],
  badges: [],
  certificates: [],
  achievements: [],
  mentors: [],
  microInternships: [],
  liveProjects: [],
  taskCompletions: [],
  simulationRuns: [],
  applications: [],
  experienceRecords: [],
  portfolioItems: [],

  // ========================================================================
  // INITIALIZATION
  // ========================================================================

  initializeStore: () => {
    set({
      currentUser: seedCurrentUser,
      roles: seedRoles,
      tasks: seedTasks,
      simulations: seedSimulations,
      opportunities: seedOpportunities,
      learningResources: seedLearningResources,
      badges: seedBadges,
      certificates: seedCertificates,
      achievements: seedAchievements,
      mentors: seedMentors,
      microInternships: seedMicroInternships,
      liveProjects: seedLiveProjects,
    })
  },

  // ========================================================================
  // TASKS
  // ========================================================================

  addTask: (task: Task) =>
    set((state: any) => ({
      tasks: [...state.tasks, task],
    })),

  updateTask: (taskId: string, updates: Partial<Task>) =>
    set((state: any) => ({
      tasks: state.tasks.map((t: Task) => (t.id === taskId ? { ...t, ...updates } : t)),
    })),

  deleteTask: (taskId: string) =>
    set((state: any) => ({
      tasks: state.tasks.filter((t: Task) => t.id !== taskId),
    })),

  completeTask: (studentId: string, taskId: string, score?: number) =>
    set((state: any) => {
      const completion: StudentTaskCompletion = {
        studentId,
        taskId,
        completedAt: new Date().toISOString(),
        score,
      }
      return {
        taskCompletions: [...state.taskCompletions, completion],
      }
    }),

  // ========================================================================
  // SIMULATIONS
  // ========================================================================

  addSimulation: (simulation: Simulation) =>
    set((state: any) => ({
      simulations: [...state.simulations, simulation],
    })),

  updateSimulation: (simulationId: string, updates: Partial<Simulation>) =>
    set((state: any) => ({
      simulations: state.simulations.map((s: Simulation) =>
        s.id === simulationId ? { ...s, ...updates } : s
      ),
    })),

  deleteSimulation: (simulationId: string) =>
    set((state: any) => ({
      simulations: state.simulations.filter((s: Simulation) => s.id !== simulationId),
    })),

  recordSimulationRun: (run: StudentSimulationRun) =>
    set((state: any) => ({
      simulationRuns: [...state.simulationRuns, run],
    })),

  // ========================================================================
  // OPPORTUNITIES
  // ========================================================================

  addOpportunity: (opportunity: Opportunity) =>
    set((state: any) => ({
      opportunities: [...state.opportunities, opportunity],
    })),

  updateOpportunity: (opportunityId: string, updates: Partial<Opportunity>) =>
    set((state: any) => ({
      opportunities: state.opportunities.map((o: Opportunity) =>
        o.id === opportunityId ? { ...o, ...updates } : o
      ),
    })),

  deleteOpportunity: (opportunityId: string) =>
    set((state: any) => ({
      opportunities: state.opportunities.filter((o: Opportunity) => o.id !== opportunityId),
    })),

  // ========================================================================
  // APPLICATIONS
  // ========================================================================

  applyToOpportunity: (studentId: string, opportunityId: string) =>
    set((state: any) => {
      const application: Application = {
        id: `app-${Date.now()}`,
        studentId,
        opportunityId,
        status: 'Applied',
        appliedAt: new Date().toISOString(),
      }
      return {
        applications: [...state.applications, application],
      }
    }),

  updateApplicationStatus: (applicationId: string, status: string) =>
    set((state: any) => ({
      applications: state.applications.map((a: Application) =>
        a.id === applicationId
          ? { ...a, status: status as any, respondedAt: new Date().toISOString() }
          : a
      ),
    })),

  // ========================================================================
  // EXPERIENCE
  // ========================================================================

  addExperienceRecord: (record: ExperienceRecord) =>
    set((state: any) => ({
      experienceRecords: [...state.experienceRecords, record],
    })),

  addPortfolioItem: (item: PortfolioItem) =>
    set((state: any) => ({
      portfolioItems: [...state.portfolioItems, item],
    })),

  // ========================================================================
  // LEARNING RESOURCES
  // ========================================================================

  addLearningResource: (resource: LearningResource) =>
    set((state: any) => ({
      learningResources: [...state.learningResources, resource],
    })),

  markResourceCompleted: (studentId: string, resourceId: string) =>
    set((state: any) => ({
      learningResources: state.learningResources.map((r: LearningResource) =>
        r.id === resourceId
          ? { ...r, completedBy: [...(r.completedBy || []), studentId] }
          : r
      ),
    })),
}))
