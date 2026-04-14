import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { useAppStore } from '@/store/appStore'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '@/context/useTheme'
import { useState, useMemo } from 'react'
import { AlertCircle, CheckCircle2, Clock, TrendingUp } from 'lucide-react'

const tabs = ['Tasks', 'Simulations', 'Opportunities', 'Analytics'] as const
type Tab = (typeof tabs)[number]

const getStatusColor = (status: string): 'brand' | 'success' | 'warning' | 'neutral' => {
  switch (status) {
    case 'Active':
    case 'Approved':
      return 'success'
    case 'Pending Review':
    case 'Expiring':
      return 'warning'
    default:
      return 'neutral'
  }
}

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('Simulations')
  const { theme } = useTheme()
  const axis = theme === 'dark' ? '#94a3b8' : '#64748b'
  const grid = theme === 'dark' ? '#1e293b' : '#e2e8f0'

  // ===== NEW ARCHITECTURE: Read from centralized store =====
  const tasks = useAppStore((state: any) => state.tasks)
  const simulations = useAppStore((state: any) => state.simulations)
  const opportunities = useAppStore((state: any) => state.opportunities)

  // Seed admin students (in real app, come from store)
  const adminStudents = [
    { id: 'u1', name: 'Omkar Sharma', simulations: 6, employability: 78, lastActive: 'Today' },
    { id: 'u2', name: 'Rahul Verma', simulations: 3, employability: 62, lastActive: 'Yesterday' },
    { id: 'u3', name: 'Meera Iyer', simulations: 9, employability: 86, lastActive: 'Today' },
  ]

  // Enhance simulations with metrics
  const enhancedSimulations = useMemo(
    () =>
      simulations.map((s: any) => ({
        ...s,
        skillsMapped: s.roleId === 'frontend' ? 'React, Testing' : s.roleId === 'backend' ? 'REST APIs, Security' : 'SQL, Visualization',
        completionRate: s.roleId === 'frontend' ? 72 : s.roleId === 'backend' ? 68 : 74,
        avgScore: s.roleId === 'frontend' ? 76 : s.roleId === 'backend' ? 71 : 79,
        impact: s.difficulty === 'Intermediate' ? 'High' : 'Medium',
      })),
    [simulations]
  )

  // REFINED: Filter states
  const [taskRoleFilter, setTaskRoleFilter] = useState<string>('All')
  const [simRoleFilter, setSimRoleFilter] = useState<string>('All')
  const [simDifficultyFilter, setSimDifficultyFilter] = useState<string>('All')
  const [empRangeFilter, setEmpRangeFilter] = useState<string>('All')
  const [activityFilter, setActivityFilter] = useState<string>('All')

  // REBUILT: Operations metrics
  const pendingReviews = tasks.filter((t: any) => t.status === 'Pending Review').length
  const activeSimulations = simulations.length
  const readyCount = adminStudents.filter(s => s.employability >= 80).length
  const atRiskStudents = adminStudents.filter(s => s.employability < 60).length

  const filteredTasks = useMemo(
    () =>
      tasks.filter((t: any) => {
        const roleMatch = taskRoleFilter === 'All' || t.role === taskRoleFilter
        return roleMatch
      }),
    [tasks, taskRoleFilter]
  )

  const filteredSims = useMemo(
    () =>
      enhancedSimulations.filter((s: any) => {
        const roleMatch = simRoleFilter === 'All' || s.roleId === simRoleFilter
        const diffMatch = simDifficultyFilter === 'All' || s.difficulty === simDifficultyFilter
        return roleMatch && diffMatch
      }),
    [enhancedSimulations, simRoleFilter, simDifficultyFilter]
  )

  const filteredStudents = useMemo(
    () =>
      adminStudents.filter((s: any) => {
        const empMatch = 
          empRangeFilter === 'All' ||
          (empRangeFilter === 'High' && s.employability >= 80) ||
          (empRangeFilter === 'Medium' && s.employability >= 60 && s.employability < 80) ||
          (empRangeFilter === 'Low' && s.employability < 60)
        return empMatch
      }),
    [adminStudents, empRangeFilter]
  )

  return (
    <div className="space-y-6">
      {/* REBUILT: Operations header with key metrics */}
      <div className="space-y-3">
        <PageHeader title="Operations Console" />
        
        {/* REFINED: High-signal metrics strip */}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300">
              <Clock className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Pending</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{pendingReviews}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Active</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{activeSimulations}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">Ready</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{readyCount}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/30">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">At risk</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{atRiskStudents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* REFINED: Tab navigation */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 -mx-6 px-6">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`${
              tab === t
                ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
            } pb-3 px-1 text-sm font-medium transition-colors`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TAB: TASKS */}
      {tab === 'Tasks' ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Task Management</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {filteredTasks.length} tasks · {tasks.filter((t: any) => t.status === 'Active').length} active · {pendingReviews} pending
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm">New Task</Button>
              {pendingReviews > 0 && (
                <Button size="sm" variant="secondary">Review ({pendingReviews})</Button>
              )}
            </div>
          </div>

          <select
            value={taskRoleFilter}
            onChange={(e) => setTaskRoleFilter(e.target.value)}
            className="rounded border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            <option>All Roles</option>
            <option>Frontend</option>
            <option>Backend</option>
            <option>Data</option>
          </select>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-200 text-left text-sm">
                <thead className="text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Title</th>
                    <th className="px-6 py-3 font-semibold">Role</th>
                    <th className="px-6 py-3 font-semibold">Skill</th>
                    <th className="px-6 py-3 font-semibold">Difficulty</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold">Updated</th>
                    <th className="px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTasks.map((t: any) => (
                    <tr key={t.id} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                      <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{t.title}</td>
                      <td className="px-6 py-3 text-xs">{t.role}</td>
                      <td className="px-6 py-3 text-xs">{t.skill}</td>
                      <td className="px-6 py-3">
                        <Badge tone={t.difficulty === 'Beginner' ? 'success' : t.difficulty === 'Intermediate' ? 'brand' : 'warning'}>
                          {t.difficulty}
                        </Badge>
                      </td>
                      <td className="px-6 py-3">
                        <Badge tone={getStatusColor(t.status)}>{t.status}</Badge>
                      </td>
                      <td className="px-6 py-3 text-xs text-slate-500">{t.lastUpdated}</td>
                      <td className="px-6 py-3 text-xs">
                        <div className="flex gap-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Edit</button>
                          <button className="text-slate-600 dark:text-slate-400 hover:underline font-medium">Duplicate</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}

      {/* TAB: SIMULATIONS */}
      {tab === 'Simulations' ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Simulations</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {filteredSims.length} simulations across all roles
              </p>
            </div>
            <Button size="sm">Create Simulation</Button>
          </div>

          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            <Card>
              <div className="px-4 py-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold">Total</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{simulations.length}</p>
              </div>
            </Card>
            <Card>
              <div className="px-4 py-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold">High Impact</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {enhancedSimulations.filter((s: any) => s.impact === 'High').length}
                </p>
              </div>
            </Card>
            <Card>
              <div className="px-4 py-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold">Avg Complete</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {Math.round(enhancedSimulations.reduce((sum: any, s: any) => sum + s.completionRate, 0) / enhancedSimulations.length)}%
                </p>
              </div>
            </Card>
            <Card>
              <div className="px-4 py-3">
                <p className="text-xs text-slate-600 dark:text-slate-400 uppercase font-semibold">Avg Score</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                  {Math.round(enhancedSimulations.reduce((sum: any, s: any) => sum + s.avgScore, 0) / enhancedSimulations.length)}
                </p>
              </div>
            </Card>
          </div>

          <div className="flex gap-2 flex-wrap">
            <select
              value={simRoleFilter}
              onChange={(e) => setSimRoleFilter(e.target.value)}
              className="rounded border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="All">All Roles</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="data">Data</option>
            </select>
            <select
              value={simDifficultyFilter}
              onChange={(e) => setSimDifficultyFilter(e.target.value)}
              className="rounded border border-slate-300 bg-white px-3 py-2 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="All">All Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-225 text-left text-sm">
                <thead className="text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Title</th>
                    <th className="px-6 py-3 font-semibold">Role</th>
                    <th className="px-6 py-3 font-semibold">Difficulty</th>
                    <th className="px-6 py-3 font-semibold">Skills</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                    <th className="px-6 py-3 font-semibold">Completion</th>
                    <th className="px-6 py-3 font-semibold">Score</th>
                    <th className="px-6 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSims.map((s: any) => (
                    <tr key={s.id} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                      <td className="px-6 py-3 font-medium text-slate-900 dark:text-white">{s.title}</td>
                      <td className="px-6 py-3 text-xs capitalize">{s.roleId}</td>
                      <td className="px-6 py-3">
                        <Badge tone="brand">{s.difficulty}</Badge>
                      </td>
                      <td className="px-6 py-3 text-xs">{s.skillsMapped}</td>
                      <td className="px-6 py-3">
                        <Badge tone={s.impact === 'High' ? 'warning' : 'success'}>{s.impact} impact</Badge>
                      </td>
                      <td className="px-6 py-3 text-xs font-medium">{s.completionRate}%</td>
                      <td className="px-6 py-3 text-xs font-medium">{s.avgScore}</td>
                      <td className="px-6 py-3 text-xs">
                        <div className="flex gap-2">
                          <button className="text-blue-600 dark:text-blue-400 hover:underline font-medium">View</button>
                          <button className="text-slate-600 dark:text-slate-400 hover:underline font-medium">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : null}

      {/* TAB: OPPORTUNITIES */}
      {tab === 'Opportunities' ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Opportunities</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                {opportunities.length} total · manage publishing and eligibility
              </p>
            </div>
            <Button size="sm">Add Opportunity</Button>
          </div>

          <Card>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {opportunities.map((o: any, idx: any) => {
                const statuses = ['Approved', 'Pending', 'Closing Soon', 'Approved']
                const status = statuses[idx % statuses.length]
                const newness = idx === 0 ? 'New' : idx === opportunities.length - 1 ? 'Closing Soon' : undefined
                const eligibility = idx === 0 ? 'Requires React 70%+' : idx === 1 ? 'Backend 60%+' : 'Simulation-ready'

                return (
                  <li
                    key={o.id}
                    className="px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900 dark:text-white truncate">{o.title}</span>
                        {newness && (
                          <Badge tone={newness === 'New' ? 'success' : 'warning'} className="shrink-0 text-xs">
                            {newness}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span>{o.org}</span>
                        <span>·</span>
                        <span>{eligibility}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap shrink-0">
                      <Badge tone={getStatusColor(status)}>{status}</Badge>
                      <div className="flex gap-1">
                        {status === 'Pending' && (
                          <button className="text-xs px-3 py-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded font-medium">
                            Approve
                          </button>
                        )}
                        <button className="text-xs px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-medium text-slate-600 dark:text-slate-400">
                          {status === 'Approved' ? 'Pause' : 'Edit'}
                        </button>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      ) : null}

      {tab === 'Analytics' ? (
        <div className="space-y-4">
          {/* ADDED: Analytics filter row */}
          <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
            <select
              value={empRangeFilter}
              onChange={(e) => setEmpRangeFilter(e.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="All">All Employability</option>
              <option value="High">80-100</option>
              <option value="Medium">60-79</option>
              <option value="Low">Below 60</option>
            </select>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="All">All Activity</option>
              <option value="Active">Active Today</option>
              <option value="Week">Active This Week</option>
              <option value="Inactive">Inactive 7+ days</option>
            </select>
          </div>

          {/* ADDED: Summary stats strip */}
          <div className="grid gap-3 md:grid-cols-3">
            <Card>
              <div className="px-5 py-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Internship-Ready</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {filteredStudents.filter(s => s.employability >= 80).length}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">Employability 80+</p>
              </div>
            </Card>
            <Card>
              <div className="px-5 py-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">At Risk</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {filteredStudents.filter(s => s.employability < 60).length}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">Below 60</p>
              </div>
            </Card>
            <Card>
              <div className="px-5 py-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Avg Employability</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.round(filteredStudents.reduce((sum, s) => sum + s.employability, 0) / filteredStudents.length)}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">Cohort average</p>
              </div>
            </Card>
          </div>

          {/* ADDED: Readiness stages card */}
          <Card>
            <CardHeader>
              <CardTitle>Readiness Stages</CardTitle>
              <CardDescription>Student distribution across readiness levels</CardDescription>
            </CardHeader>
            <div className="space-y-4 px-5 pb-6">
              {[
                { stage: 'Early', color: 'bg-slate-300 dark:bg-slate-600', count: 2, pct: 20 },
                { stage: 'Simulation-Ready', color: 'bg-sky-300 dark:bg-sky-600', count: 1, pct: 10 },
                { stage: 'Project-Ready', color: 'bg-amber-300 dark:bg-amber-600', count: 3, pct: 50 },
                { stage: 'Internship-Ready', color: 'bg-emerald-400 dark:bg-emerald-600', count: 2, pct: 20 },
              ].map((item) => (
                <div key={item.stage}>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.stage}</span>
                    <span className="text-xs text-slate-600 dark:text-slate-400">{item.count} students</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* ADDED: Analytics insights */}
          <div className="flex flex-wrap gap-2 rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900/50 dark:bg-blue-950/20">
            <div className="text-xs text-slate-700 dark:text-slate-300">
              <p className="font-medium mb-1">📊 Cohort Insights:</p>
              <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <li>• Backend is the weakest skill across the cohort (avg 58.3/100)</li>
                <li>• 2 students are ready for internships (80+ employability)</li>
              </ul>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Cohort Employability</CardTitle>
                <CardDescription>Distribution by active learner</CardDescription>
              </CardHeader>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredStudents} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={grid} vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: axis, fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: axis, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={28}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid rgba(148,163,184,0.35)',
                        background: theme === 'dark' ? '#0f172a' : '#ffffff',
                        color: theme === 'dark' ? '#e2e8f0' : '#0f172a',
                      }}
                    />
                    <Bar dataKey="employability" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Employability" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Student Activity</CardTitle>
                <CardDescription>Engagement and simulation metrics</CardDescription>
              </CardHeader>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="pb-3 pe-4 font-semibold">Student</th>
                      <th className="pb-3 pe-4 font-semibold">Sims</th>
                      <th className="pb-3 pe-4 font-semibold">Score</th>
                      <th className="pb-3 pe-4 font-semibold">Stage</th>
                      <th className="pb-3 pe-4 font-semibold">Weakest</th>
                      <th className="pb-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredStudents.map((u) => {
                      // ADDED: Stage and weakest skill determination
                      const stage = u.employability >= 80 ? 'Internship-Ready' : u.employability >= 65 ? 'Project-Ready' : 'Simulation-Ready'
                      const weakest = u.employability <= 65 ? 'Backend' : 'SQL'
                      return (
                        <tr key={u.id} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                          <td className="py-3 pe-4 font-medium text-slate-900 dark:text-white">{u.name}</td>
                          <td className="py-3 pe-4">{u.simulations}</td>
                          <td className="py-3 pe-4">{u.employability}</td>
                          <td className="py-3 pe-4 text-xs">
                            <Badge tone={stage === 'Internship-Ready' ? 'success' : stage === 'Project-Ready' ? 'warning' : 'neutral'}>
                              {stage}
                            </Badge>
                          </td>
                          <td className="py-3 pe-4 text-xs">{weakest}</td>
                          <td className="py-3 text-xs">
                            <button className="text-blue-600 dark:text-blue-400 hover:underline">View Profile</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      ) : null}
    </div>
  )
}
