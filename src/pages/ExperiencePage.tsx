import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { TabList, TabPanel } from '@/components/ui/Tabs'
import { experienceMicroInternships, liveProjects, mentors } from '@/data/mock'
import { useMemo, useState } from 'react'
import { Badge } from '@/components/ui/Badge'

const tabs = [
  { id: 'micro', label: 'Micro-internships' },
  { id: 'live', label: 'Live projects' },
  { id: 'mentor', label: 'Mentorship' },
] as const

export function ExperiencePage() {
  const [tab, setTab] = useState('micro')
  const items = useMemo(() => tabs.map((t) => ({ id: t.id, label: t.label })), [])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Experience layer"
        title="Ship evidence, not just certificates."
        description="Micro-internships, live project briefs, and mentor touchpoints — all mock UI aligned to how programs bundle real work."
      />

      <Card>
        <CardHeader>
          <CardTitle>Programs</CardTitle>
          <CardDescription>Pick a track to preview structure and tasks</CardDescription>
        </CardHeader>
        <div className="px-5 pb-2">
          <TabList items={items} value={tab} onChange={setTab} />
        </div>
        <div className="px-5 pb-6">
          <TabPanel id="micro" activeId={tab}>
            <div className="grid gap-4 md:grid-cols-2">
              {experienceMicroInternships.map((m) => (
                <Card key={m.id} className="transition-shadow duration-200 hover:shadow-[var(--shadow-float)]">
                  <CardHeader>
                    <Badge tone="brand">{m.duration}</Badge>
                    <CardTitle className="text-lg">{m.title}</CardTitle>
                    <CardDescription>{m.org}</CardDescription>
                  </CardHeader>
                  <ul className="list-disc space-y-1 px-8 pb-5 text-sm text-slate-600 dark:text-slate-300">
                    {m.tasks.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <p className="border-t border-slate-100 px-5 py-3 text-sm font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
                    {m.stipend}
                  </p>
                </Card>
              ))}
            </div>
          </TabPanel>
          <TabPanel id="live" activeId={tab}>
            <div className="grid gap-4 md:grid-cols-2">
              {liveProjects.map((p) => (
                <Card key={p.id}>
                  <CardHeader>
                    <Badge tone="neutral">{p.status}</Badge>
                    <CardTitle className="text-lg">{p.title}</CardTitle>
                    <CardDescription>{p.context}</CardDescription>
                  </CardHeader>
                  <p className="px-5 pb-5 text-sm text-slate-600 dark:text-slate-300">
                    Problem card: define success metrics, constraints, and a 1-week execution slice — mentor reviews async (mock).
                  </p>
                </Card>
              ))}
            </div>
          </TabPanel>
          <TabPanel id="mentor" activeId={tab}>
            <div className="grid gap-4 md:grid-cols-2">
              {mentors.map((m) => (
                <Card key={m.id}>
                  <CardHeader>
                    <CardTitle>{m.name}</CardTitle>
                    <CardDescription>{m.focus}</CardDescription>
                  </CardHeader>
                  <p className="px-5 text-sm text-slate-600 dark:text-slate-300">{m.slots}</p>
                  <div className="mt-3 rounded-xl bg-surface-1/80 px-4 py-3 text-sm text-slate-700 dark:bg-surface-0/50 dark:text-slate-200">
                    <span className="font-semibold text-slate-900 dark:text-white">Feedback style: </span>
                    {m.feedback}
                  </div>
                  <div className="p-5">
                    <button
                      type="button"
                      className="text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300"
                    >
                      Request intro (mock)
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </TabPanel>
        </div>
      </Card>
    </div>
  )
}
