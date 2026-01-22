import { Routes, Route } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'
import { MobileNav } from '@/components/mobile-nav'
import { OnboardingNew } from '@/pages/OnboardingNew'
import { PlanSummary } from '@/pages/PlanSummary'
import { Dashboard } from '@/pages/Dashboard'
import { WaterTracker } from '@/pages/WaterTracker'
import { Meals } from '@/pages/Meals'
import { Fasting } from '@/pages/Fasting'
import { Workouts } from '@/pages/Workouts'
import { Progress } from '@/pages/Progress'
import { Settings } from '@/pages/Settings'
import { Toaster } from '@/components/ui/sonner'

export function App() {
  const { isOnboarding } = useApp()

  if (isOnboarding) {
    return (
      <>
        <OnboardingNew />
        <Toaster />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan-summary" element={<PlanSummary />} />
          <Route path="/water" element={<WaterTracker />} />
          <Route path="/meals" element={<Meals />} />
          <Route path="/fasting" element={<Fasting />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <MobileNav />
      </div>
      <Toaster />
    </>
  )
}

export default App
