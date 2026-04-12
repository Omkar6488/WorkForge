import { AnalyticsLabPanel } from '@/components/simulations/AnalyticsLabPanel'
import { CrmLabPanel } from '@/components/simulations/CrmLabPanel'
import { GitHubLabPanel } from '@/components/simulations/GitHubLabPanel'
import { TabList, TabPanel } from '@/components/ui/Tabs'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { useMemo, useState } from 'react'
const tabs = [
  { id: 'github', label: 'GitHub' },
  { id: 'crm', label: 'CRM' },
  { id: 'analytics', label: 'Analytics' },
] as const

export function SimulationLabsPage() {
  const [tab, setTab] = useState<string>('github')
  const items = useMemo(() => tabs.map((t) => ({ id: t.id, label: t.label })), [])

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Tool-based simulations"
        title="Practice in interfaces that resemble real delivery tools."
        description="Each lab is fully interactive against static mock data — no backend. Use these to warm up before full narrative simulations."
        action={
          <Button to="/simulation" variant="secondary">
            Back to scenarios
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Choose a lab surface</CardTitle>
          <CardDescription>GitHub-style repo view, CRM pipeline, or analytics cockpit</CardDescription>
        </CardHeader>
        <div className="px-5 pb-2">
          <TabList items={items} value={tab} onChange={setTab} />
        </div>
        <div className="px-5 pb-5">
          <TabPanel id="github" activeId={tab}>
            <GitHubLabPanel />
          </TabPanel>
          <TabPanel id="crm" activeId={tab}>
            <CrmLabPanel />
          </TabPanel>
          <TabPanel id="analytics" activeId={tab}>
            <AnalyticsLabPanel />
          </TabPanel>
        </div>
      </Card>
    </div>
  )
}
