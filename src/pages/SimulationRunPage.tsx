import { ReadinessFlow } from '@/components/flow/ReadinessFlow'
import { TrafficOpsContext } from '@/components/simulations/TrafficOpsContext'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { SimulationStepper } from '@/components/ui/Stepper'
import { simulations, type Simulation, type SimulationStep } from '@/data/mock'
import {
  clearSimulationProgress,
  loadSimulationProgress,
  useSimulationPersistence,
} from '@/hooks/useSimulationPersistence'
import { cn } from '@/lib/cn'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, ArrowLeft, CheckCircle2, Timer } from 'lucide-react'
import { startTransition, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

type Answers = Record<string, { mcq?: number; text?: string }>

function scoreStep(step: SimulationStep, answer: Answers[string] | undefined) {
  if (!answer) return 0
  if (step.type === 'mcq' && typeof answer.mcq === 'number' && typeof step.correctIndex === 'number') {
    return answer.mcq === step.correctIndex ? 100 : 35
  }
  const text = (answer.text ?? '').trim()
  if (text.length >= 120) return 92
  if (text.length >= 60) return 78
  if (text.length >= 25) return 62
  if (text.length > 0) return 48
  return 0
}

function collectMistakes(sim: Simulation, ans: Answers) {
  const out: string[] = []
  for (const st of sim.steps) {
    const a = ans[st.id]
    if (st.type === 'mcq' && typeof st.correctIndex === 'number' && typeof a?.mcq === 'number') {
      if (a.mcq !== st.correctIndex) {
        out.push(`MCQ “${st.title}”: selected option did not match the safest operational choice.`)
      }
    } else if (st.type !== 'mcq') {
      const len = (a?.text ?? '').trim().length
      if (len < 40) {
        out.push(`Written “${st.title}”: response was thin — add owners, timelines, and metrics.`)
      }
    }
  }
  return out
}

function suggestionsFor(score: number, mistakes: string[]) {
  const s: string[] = []
  if (score < 70) s.push('Re-run with a peer review before submitting to portfolio.')
  if (mistakes.length) s.push('Turn each mistake into a checklist item for the next simulation.')
  s.push('Publish a one-page retrospective to Skill Passport with quantified outcomes.')
  return s
}

export function SimulationRunPage() {
  const { simulationId } = useParams()
  const navigate = useNavigate()
  const simulation = useMemo(
    () => simulations.find((s) => s.id === simulationId),
    [simulationId],
  )

  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [phase, setPhase] = useState<'run' | 'result'>('run')
  const [timerOn, setTimerOn] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!timerOn || phase !== 'run') return
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(id)
  }, [timerOn, phase])

  useEffect(() => {
    if (!simulationId) return
    const found = simulations.find((s) => s.id === simulationId)
    if (!found) return
    startTransition(() => {
      const p = loadSimulationProgress(simulationId)
      if (p) {
        setStepIndex(Math.min(p.stepIndex, found.steps.length - 1))
        setAnswers(p.answers)
      } else {
        setStepIndex(0)
        setAnswers({})
      }
      setPhase('run')
      setSeconds(0)
      setSubmitError(null)
    })
  }, [simulationId])

  useSimulationPersistence(simulationId, phase, stepIndex, answers)

  const totals = useMemo(() => {
    if (!simulation) return { score: 0 }
    let sum = 0
    for (const s of simulation.steps) {
      sum += scoreStep(s, answers[s.id])
    }
    return { score: Math.round(sum / simulation.steps.length) }
  }, [answers, simulation])

  const resultInsights = useMemo(() => {
    if (!simulation) return { mistakes: [] as string[], suggestions: [] as string[], skillGain: 0 }
    const mistakes = collectMistakes(simulation, answers)
    return {
      mistakes,
      suggestions: suggestionsFor(totals.score, mistakes),
      skillGain: Math.min(14, 3 + Math.round(totals.score / 12)),
    }
  }, [simulation, answers, totals.score])

  if (!simulation) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Simulation not found</CardTitle>
            <CardDescription>
              This ID is not in the mock catalog. Pick a scenario from the hub.
            </CardDescription>
          </CardHeader>
          <Button to="/simulation" variant="secondary">
            Back to simulations
          </Button>
        </Card>
      </div>
    )
  }

  const step = simulation.steps[stepIndex]
  const progress = ((stepIndex + 1) / simulation.steps.length) * 100

  function updateAnswer(patch: Partial<Answers[string]>) {
    setAnswers((prev) => ({
      ...prev,
      [step.id]: { ...prev[step.id], ...patch },
    }))
  }

  async function goNext() {
    if (!simulation) return
    setSubmitError(null)
    setLoading(true)
    // Mock flaky submission to demonstrate error UI
    await new Promise((r) => setTimeout(r, 450))
    const fail = Math.random() < 0.12
    setLoading(false)
    if (fail) {
      setSubmitError('We could not sync your step just now. This is a mock network hiccup.')
      return
    }
    if (stepIndex < simulation.steps.length - 1) {
      setStepIndex((i) => i + 1)
    } else {
      clearSimulationProgress(simulation.id)
      setPhase('result')
    }
  }

  function resetRun() {
    if (!simulation) return
    clearSimulationProgress(simulation.id)
    setStepIndex(0)
    setAnswers({})
    setPhase('run')
    setSeconds(0)
    setTimerOn(false)
    setSubmitError(null)
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/simulation"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant={timerOn ? 'primary' : 'secondary'}
            onClick={() => setTimerOn((v) => !v)}
            className="inline-flex items-center gap-2"
          >
            <Timer className="h-4 w-4" />
            Timer {timerOn ? 'on' : 'off'}
          </Button>
          <Badge tone="brand">
            {mm}:{ss}
          </Badge>
        </div>
      </div>

      <ReadinessFlow activeIndex={phase === 'result' ? 5 : 3} />

      {phase === 'run' ? (
        <Card>
          <div className="border-b border-slate-100 px-5 pb-4 pt-5 dark:border-slate-800">
            <SimulationStepper current={stepIndex} total={simulation.steps.length} />
          </div>
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 pb-5 pt-4 dark:border-slate-800 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-300">
                {simulation.company}
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
                {simulation.title}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                {simulation.summary}
              </p>
            </div>
            <Badge tone="neutral">
              Step {stepIndex + 1}/{simulation.steps.length}
            </Badge>
          </div>
          <div className="mt-5 px-5">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Task flow</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <ProgressBar value={progress} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22 }}
              className="mt-8 space-y-4 px-5 pb-5"
            >
              {simulation.kind === 'traffic' ? <TrafficOpsContext stepIndex={stepIndex} /> : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  {step.type === 'mcq' ? 'Multiple choice' : step.type === 'code' ? 'Work product' : 'Written response'}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h2>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{step.prompt}</p>
              </div>

              {step.type === 'mcq' && step.options ? (
                <div className="grid gap-2">
                  {step.options.map((opt, idx) => {
                    const selected = answers[step.id]?.mcq === idx
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => updateAnswer({ mcq: idx })}
                        className={cn(
                          'rounded-xl border px-4 py-3 text-left text-sm transition',
                          selected
                            ? 'border-brand-500 bg-brand-50 text-brand-900 dark:border-sky-400 dark:bg-brand-900 dark:text-sky-50'
                            : 'border-slate-200 bg-surface-1/60 hover:border-brand-300 dark:border-slate-800 dark:bg-surface-0/50 dark:hover:border-brand-700',
                        )}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <textarea
                  value={answers[step.id]?.text ?? ''}
                  onChange={(e) => updateAnswer({ text: e.target.value })}
                  rows={step.type === 'code' ? 10 : 6}
                  placeholder={step.placeholder}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-surface-0 px-3 py-3 font-mono text-sm text-slate-900 shadow-inner outline-none ring-brand-500/0 transition duration-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/15 dark:border-slate-800 dark:bg-surface-0 dark:text-slate-100"
                />
              )}

              {step.rubricHint ? (
                <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-900/60 dark:text-slate-300">
                  <span className="font-semibold text-slate-800 dark:text-slate-100">Evaluator lens: </span>
                  {step.rubricHint}
                </div>
              ) : null}

              {submitError ? (
                <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-3 text-sm text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-50">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold">Submission did not go through</p>
                    <p className="mt-1 text-xs opacity-90">{submitError}</p>
                    <Button size="sm" className="mt-3" variant="secondary" onClick={() => goNext()}>
                      Retry sync
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  disabled={loading}
                  onClick={() => {
                    void goNext()
                  }}
                  className="transition-opacity duration-200"
                >
                  {loading
                    ? 'Saving…'
                    : stepIndex === simulation.steps.length - 1
                      ? 'Submit simulation'
                      : 'Next step'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                  disabled={stepIndex === 0 || loading}
                >
                  Back
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </Card>
      ) : (
        <Card>
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-200">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <CardTitle>Evaluation complete</CardTitle>
                <CardDescription>
                  Mock scoring blends rubric fit + completeness. Hiring managers still review the narrative.
                </CardDescription>
              </div>
            </div>
            <div className="text-left md:text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Composite score
              </p>
              <p className="text-4xl font-semibold text-slate-900 dark:text-white">{totals.score}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Skills improved (mock)</p>
              <div className="mt-3 space-y-3">
                {simulation.skills.map((sk, i) => {
                  const gain = Math.min(100, 58 + resultInsights.skillGain + i * 3)
                  return (
                    <div key={sk}>
                      <div className="mb-1 flex justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>{sk}</span>
                        <span>+{resultInsights.skillGain - i} pts est.</span>
                      </div>
                      <ProgressBar value={gain} />
                    </div>
                  )
                })}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Mistakes & gaps</p>
              {resultInsights.mistakes.length ? (
                <ul className="mt-3 space-y-2 text-sm text-amber-900 dark:text-amber-100/90">
                  {resultInsights.mistakes.map((m) => (
                    <li key={m}>• {m}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">No major rubric misses detected in this pass.</p>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Suggestions</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {resultInsights.suggestions.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">Coach feedback</p>
              <ul className="mt-2 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <li>• Strong structure on tradeoffs; tighten timelines on comms steps.</li>
                <li>• Add a measurable metric when you propose experiments or fixes.</li>
                <li>• Peer-review this output in Skill Passport for credibility.</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button to="/profile">Update passport view</Button>
            <Button to="/opportunities" variant="secondary">
              Browse matching opportunities
            </Button>
            <Button variant="ghost" onClick={resetRun}>
              Re-run simulation
            </Button>
            <Button variant="ghost" onClick={() => navigate('/tracking')}>
              See tracking charts
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
