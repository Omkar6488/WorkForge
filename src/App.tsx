import { AppShell } from '@/components/layout/AppShell'
import { AdminPage } from '@/pages/AdminPage'
import { CareersPage } from '@/pages/CareersPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ExperiencePage } from '@/pages/ExperiencePage'
import { GamificationPage } from '@/pages/GamificationPage'
import { LearningPage } from '@/pages/LearningPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OpportunitiesPage } from '@/pages/OpportunitiesPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SimulationHubPage } from '@/pages/SimulationHubPage'
import { SimulationLabsPage } from '@/pages/SimulationLabsPage'
import { SimulationRunPage } from '@/pages/SimulationRunPage'
import { SkillGapPage } from '@/pages/SkillGapPage'
import { TrackingPage } from '@/pages/TrackingPage'
import { useAppStore } from '@/store/appStore'
import { Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'

export default function App() {
  const initializeStore = useAppStore((state: any) => state.initializeStore)

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="careers" element={<CareersPage />} />
        <Route path="simulation/labs" element={<SimulationLabsPage />} />
        <Route path="simulation/run/:simulationId" element={<SimulationRunPage />} />
        <Route path="simulation" element={<SimulationHubPage />} />
        <Route path="experience" element={<ExperiencePage />} />
        <Route path="tracking" element={<TrackingPage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="learning" element={<LearningPage />} />
        <Route path="skill-gap" element={<SkillGapPage />} />
        <Route path="gamification" element={<GamificationPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
