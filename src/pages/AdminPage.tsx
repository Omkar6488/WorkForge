import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { adminStudents, opportunities, simulations } from '@/data/mock'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '@/context/useTheme'
import { useState } from 'react'

const tabs = ['Tasks', 'Simulations', 'Opportunities', 'Analytics'] as const
type Tab = (typeof tabs)[number]

// ADDED: Mock task data for management
const mockTasks = [
  {
    id: 't1',
    title: 'API Rate Limiting Review',
    role: 'Backend',
    skill: 'REST APIs',
    difficulty: 'Intermediate',
    status: 'Active' as const,
    lastUpdated: '2 days ago',
  },
  {
    id: 't2',
    title: 'React Suspense Patterns',
    role: 'Frontend',
    skill: 'React',
    difficulty: 'Advanced',
    status: 'Active' as const,
    lastUpdated: '1 week ago',
  },
  {
    id: 't3',
    title: 'SQL Window Functions Deep Dive',
    role: 'Data',
    skill: 'SQL',
    difficulty: 'Intermediate',
    status: 'Pending Review' as const,
    lastUpdated: '3 days ago',
  },
  {
    id: 't4',
    title: 'Incident Communication Templates',
    role: 'Communication',
    skill: 'Stakeholder Comms',
    difficulty: 'Beginner',
    status: 'Draft' as const,
    lastUpdated: '5 days ago',
  },
  {
    id: 't5',
    title: 'Legacy Database Migration',
    role: 'Backend',
    skill: 'Databases',
    difficulty: 'Advanced',
    status: 'Deprecated' as const,
    lastUpdated: '2 weeks ago',
  },
  {
    id: 't6',
    title: 'CSS Grid vs Flexbox Mastery',
    role: 'Frontend',
    skill: 'Web Design',
    difficulty: 'Beginner',
    status: 'Active' as const,
    lastUpdated: '1 day ago',
  },
]

// ADDED: Status color mapping
const getStatusColor = (status: string): 'brand' | 'brand' | 'warning' | 'neutral' => {
  switch (status) {
    case 'Active':
      return 'brand'
    case 'Pending Review':
      return 'warning'
    case 'Draft':
      return 'neutral'
    case 'Deprecated':
      return 'neutral'
    default:
      return 'neutral'
  }
}

// ADDED: Enhanced simulation data for admin view
const enhancedSimulations = simulations.map((s) => ({
  ...s,
  skillsMapped: s.roleId === 'frontend' ? 'React, Testing' : s.roleId === 'backend' ? 'REST APIs, Security' : s.roleId === 'data' ? 'SQL, Visualization' : 'Communication',
  completionRate: s.roleId === 'frontend' ? 72 : s.roleId === 'backend' ? 68 : 74,
  avgScore: s.roleId === 'frontend' ? 76 : s.roleId === 'backend' ? 71 : 79,
  impact: s.difficulty === 'Intermediate' ? 'High' : 'Medium',
}))

export function AdminPage() {
  const [tab, setTab] = useState<Tab>('Simulations')
  const { theme } = useTheme()
  const axis = theme === 'dark' ? '#94a3b8' : '#64748b'
  const grid = theme === 'dark' ? '#1e293b' : '#e2e8f0'

  // ADDED: Filter states for each tab
  const [taskRoleFilter, setTaskRoleFilter] = useState<string>('All')
  const [taskSkillFilter, setTaskSkillFilter] = useState<string>('All')
  const [simRoleFilter, setSimRoleFilter] = useState<string>('All')
  const [simDifficultyFilter, setSimDifficultyFilter] = useState<string>('All')
  const [simImpactFilter, setSimImpactFilter] = useState<string>('All')
  const [empRangeFilter, setEmpRangeFilter] = useState<string>('All')
  const [activityFilter, setActivityFilter] = useState<string>('All')

  const filteredStudents = adminStudents

  // ADDED: Filter logic for tasks
  const filteredTasks = mockTasks.filter((t) => {
    const roleMatch = taskRoleFilter === 'All' || t.role === taskRoleFilter
    const skillMatch = taskSkillFilter === 'All' || t.skill === taskSkillFilter
    return roleMatch && skillMatch
  })

  // ADDED: Filter logic for simulations
  const filteredSims = enhancedSimulations.filter((s) => {
    const roleMatch = simRoleFilter === 'All' || s.roleId === simRoleFilter
    const diffMatch = simDifficultyFilter === 'All' || s.difficulty === simDifficultyFilter
    const impactMatch = simImpactFilter === 'All' || s.impact === simImpactFilter
    return roleMatch && diffMatch && impactMatch
  })

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Administration"
        title="Operate WorkForge platform."
        description="Manage simulations, tasks, and opportunity feeds while monitoring cohort readiness and individual student progress."
      />

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2 dark:border-slate-800">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={
              tab === t
                ? 'rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-slate-900'
                : 'rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
            }
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Tasks' ? (
        <div className="space-y-4">
          {/* ADDED: Task management header with actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Task Templates</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                24 active templates · 6 pending review · 3 deprecated
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button>New Task</Button>
              <Button variant="secondary">Review Pending (6)</Button>
              <Button variant="secondary">Import pack</Button>
            </div>
          </div>

          {/* ADDED: Filter row */}
          <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
            <select
              value={taskRoleFilter}
              onChange={(e) => setTaskRoleFilter(e.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option>All Roles</option>
              <option>Frontend</option>
              <option>Backend</option>
              <option>Data</option>
              <option>Communication</option>
            </select>
            <select
              value={taskSkillFilter}
              onChange={(e) => setTaskSkillFilter(e.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option>All Skills</option>
              <option>React</option>
              <option>REST APIs</option>
              <option>SQL</option>
              <option>Stakeholder Comms</option>
            </select>
          </div>

          {/* ADDED: Task management table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="pb-3 pe-4 font-semibold">Title</th>
                    <th className="pb-3 pe-4 font-semibold">Role</th>
                    <th className="pb-3 pe-4 font-semibold">Skill</th>
                    <th className="pb-3 pe-4 font-semibold">Difficulty</th>
                    <th className="pb-3 pe-4 font-semibold">Status</th>
                    <th className="pb-3 pe-4 font-semibold">Updated</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredTasks.map((t) => (
                    <tr key={t.id} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                      <td className="py-3 pe-4 font-medium text-slate-900 dark:text-white">{t.title}</td>
                      <td className="py-3 pe-4 text-xs">{t.role}</td>
                      <td className="py-3 pe-4 text-xs">{t.skill}</td>
                      <td className="py-3 pe-4">
                        <Badge tone={t.difficulty === 'Beginner' ? 'success' : t.difficulty === 'Intermediate' ? 'brand' : 'warning'}>
                          {t.difficulty}
                        </Badge>
                      </td>
                      <td className="py-3 pe-4">
                        <Badge tone={getStatusColor(t.status)}>
                          {t.status}
                        </Badge>
                      </td>
                      <td className="py-3 pe-4 text-xs text-slate-500">{t.lastUpdated}</td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <button className="text-xs px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">Edit</button>
                          <button className="text-xs px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">Duplicate</button>
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

      {tab === 'Simulations' ? (
        <div className="space-y-4">
          {/* ADDED: Simulations header with primary action */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Simulations Catalog</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Linked to roles and difficulty curve</p>
            </div>
            <Button>Create Simulation</Button>
          </div>

          {/* ADDED: Compact stats row */}
          <div className="grid gap-3 md:grid-cols-4">
            <Card>
              <div className="px-5 py-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Total</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{simulations.length}</p>
              </div>
            </Card>
            <Card>
              <div className="px-5 py-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Active</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{enhancedSimulations.length}</p>
              </div>
            </Card>
            <Card>
              <div className="px-5 py-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">High-Impact</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{enhancedSimulations.filter(s => s.impact === 'High').length}</p>
              </div>
            </Card>
            <Card>
              <div className="px-5 py-3">
                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Avg Completion</p>
                <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">
                  {Math.round(enhancedSimulations.reduce((sum, s) => sum + s.completionRate, 0) / enhancedSimulations.length)}%
                </p>
              </div>
            </Card>
          </div>

          {/* ADDED: Filter row */}
          <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
            <select
              value={simRoleFilter}
              onChange={(e) => setSimRoleFilter(e.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="All">All Roles</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="data">Data</option>
              <option value="marketing">Marketing</option>
            </select>
            <select
              value={simDifficultyFilter}
              onChange={(e) => setSimDifficultyFilter(e.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="All">All Difficulty</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <select
              value={simImpactFilter}
              onChange={(e) => setSimImpactFilter(e.target.value)}
              className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="All">All Impact</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>
          </div>

          {/* MODIFIED: Enhanced simulations table with new columns */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead className="text-xs uppercase text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="pb-3 pe-4 font-semibold">Title</th>
                    <th className="pb-3 pe-4 font-semibold">Role</th>
                    <th className="pb-3 pe-4 font-semibold">Difficulty</th>
                    <th className="pb-3 pe-4 font-semibold">Skills</th>
                    <th className="pb-3 pe-4 font-semibold">Completion</th>
                    <th className="pb-3 pe-4 font-semibold">Avg Score</th>
                    <th className="pb-3 pe-4 font-semibold">Impact</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSims.map((s) => (
                    <tr key={s.id} className="text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900/30">
                      <td className="py-3 pe-4 font-medium text-slate-900 dark:text-white">{s.title}</td>
                      <td className="py-3 pe-4 text-xs capitalize">{s.roleId}</td>
                      <td className="py-3 pe-4">
                        <Badge tone="brand">{s.difficulty}</Badge>
                      </td>
                      <td className="py-3 pe-4 text-xs">{s.skillsMapped}</td>
                      <td className="py-3 pe-4 text-xs font-medium">{s.completionRate}%</td>
                      <td className="py-3 pe-4 text-xs font-medium">{s.avgScore}</td>
                      <td className="py-3 pe-4">
                        <Badge tone={s.impact === 'High' ? 'warning' : 'success'}>{s.impact}</Badge>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-1">
                          <button className="text-xs px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">View</button>
                          <button className="text-xs px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">Edit</button>
                          <button className="text-xs px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">Duplicate</button>
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

      {tab === 'Opportunities' ? (
        <div className="space-y-4">
          {/* ADDED: Opportunities header with primary action */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Opportunity Feed</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Manage internships, micro-opportunities, and roles</p>
            </div>
            <Button>Add Opportunity</Button>
          </div>

          {/* ADDED: Filter row */}
          <div className="flex flex-wrap gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
            <select className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
              <option>All Types</option>
              <option>internship</option>
              <option>micro</option>
              <option>job</option>
            </select>
            <select className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
              <option>Expiring</option>
            </select>
            <select className="rounded border border-slate-300 bg-white px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
              <option>All Deadlines</option>
              <option>Closing Soon</option>
              <option>Open</option>
            </select>
          </div>

          {/* MODIFIED: Enhanced opportunity list with status, deadline, eligibility */}
          <Card>
            <ul className="space-y-3 px-5 py-4 text-sm text-slate-700 dark:text-slate-200 divide-y divide-slate-100 dark:divide-slate-800">
              {opportunities.map((o, idx) => {
                // ADDED: Status determination
                const statuses = ['Approved', 'Pending', 'Expiring', 'Approved']
                const status = statuses[idx % statuses.length]
                const freshness = idx === 0 ? 'New' : idx === opportunities.length - 1 ? 'Closing Soon' : undefined
                const eligibilityNotes = {
                  'o1': 'Requires React 70%+',
                  'o2': 'Requires Backend 60%+',
                  'o3': 'Open to simulation-ready students',
                  'o4': 'Best for project-ready learners',
                }
                const eligibility = eligibilityNotes[o.id as keyof typeof eligibilityNotes] || 'Check details'

                return (
                  <li
                    key={o.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-[300px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-slate-900 dark:text-white">{o.title}</span>
                        {freshness && (
                          <Badge tone={freshness === 'New' ? 'success' : 'warning'} className="text-xs">
                            {freshness}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                        <span>{o.org}</span>
                        <span>·</span>
                        <span>{o.mode}</span>
                        <span>·</span>
                        <span className="text-slate-500 dark:text-slate-500">{eligibility}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge tone={status === 'Approved' ? 'success' : status === 'Expiring' ? 'warning' : 'neutral'}>
                        {status}
                      </Badge>
                      <div className="flex gap-1">
                        {status === 'Pending' ? (
                          <button className="text-xs px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded font-medium">Approve</button>
                        ) : null}
                        <button className="text-xs px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">Edit</button>
                        <button className="text-xs px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded">{status === 'Approved' ? 'Pause' : 'View'}</button>
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
