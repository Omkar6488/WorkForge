import { AppShell } from '@/components/layout/AppShell'
import { AdminPage } from '@/pages/AdminPage'
import { AdminLoginPage } from '@/pages/AdminLoginPage'
import { CareersPage } from '@/pages/CareersPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ExperiencePage } from '@/pages/ExperiencePage'
import { GamificationPage } from '@/pages/GamificationPage'
import { LandingPage } from '@/pages/LandingPage'
import { LearningPage } from '@/pages/LearningPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { OpportunitiesPage } from '@/pages/OpportunitiesPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { SimulationHubPage } from '@/pages/SimulationHubPage'
import { SimulationLabsPage } from '@/pages/SimulationLabsPage'
import { SimulationRunPage } from '@/pages/SimulationRunPage'
import { SkillGapPage } from '@/pages/SkillGapPage'
import { StudentLoginPage } from '@/pages/StudentLoginPage'
import { TrackingPage } from '@/pages/TrackingPage'
import { useAppStore } from '@/store/appStore'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'

export default function App() {
  const initializeStore = useAppStore((state: any) => state.initializeStore)
  const isAuthenticated = useAppStore((state) => state.isAuthenticated)

  useEffect(() => {
    initializeStore()
  }, [initializeStore])

  return (
    <Routes>
      {/* Home Route - redirect to /dashboard if authenticated, else show landing */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      
      {/* Public Routes */}
      <Route path="/login" element={<StudentLoginPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />

      {/* Authenticated Routes - wrapped in AppShell */}
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
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
      </Route>

      {/* 404 - Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
