import { useEffect } from 'react'

const storageKey = (simulationId: string) => `workforge-sim-progress-${simulationId}`

export type PersistedSimulationState = {
  stepIndex: number
  answers: Record<string, { mcq?: number; text?: string }>
}

export function loadSimulationProgress(simulationId: string): PersistedSimulationState | null {
  try {
    const raw = localStorage.getItem(storageKey(simulationId))
    if (!raw) return null
    const p = JSON.parse(raw) as PersistedSimulationState
    if (typeof p.stepIndex !== 'number' || !p.answers || typeof p.answers !== 'object') return null
    return p
  } catch {
    return null
  }
}

export function clearSimulationProgress(simulationId: string) {
  localStorage.removeItem(storageKey(simulationId))
}

export function useSimulationPersistence(
  simulationId: string | undefined,
  phase: 'run' | 'result',
  stepIndex: number,
  answers: Record<string, { mcq?: number; text?: string }>,
) {
  useEffect(() => {
    if (!simulationId || phase !== 'run') return
    const payload: PersistedSimulationState = { stepIndex, answers }
    localStorage.setItem(storageKey(simulationId), JSON.stringify(payload))
  }, [simulationId, phase, stepIndex, answers])
}
