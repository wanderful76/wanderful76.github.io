import { useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore'
import { useTaskStore } from './store/useTaskStore'
import { useAppSync } from './hooks/useAppSync'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import LotteryPage from './pages/LotteryPage'
import StatsPage from './pages/StatsPage'
import SettingsPage from './pages/SettingsPage'
import MemosPage from './pages/MemosPage'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuthStore()
  if (!currentUser) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { currentUser } = useAuthStore()
  const { resetDailyTasks } = useTaskStore()
  useAppSync()

  useEffect(() => {
    resetDailyTasks()
    const interval = setInterval(resetDailyTasks, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [resetDailyTasks])

  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={
          currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } />

        <Route path="/" element={
          <RequireAuth>
            <Layout>
              <Navigate to="/dashboard" replace />
            </Layout>
          </RequireAuth>
        } />

        <Route path="/dashboard" element={
          <RequireAuth>
            <Layout><DashboardPage /></Layout>
          </RequireAuth>
        } />
        <Route path="/tasks" element={
          <RequireAuth>
            <Layout><TasksPage /></Layout>
          </RequireAuth>
        } />
        <Route path="/lottery" element={
          <RequireAuth>
            <Layout><LotteryPage /></Layout>
          </RequireAuth>
        } />
        <Route path="/stats" element={
          <RequireAuth>
            <Layout><StatsPage /></Layout>
          </RequireAuth>
        } />
        <Route path="/settings" element={
          <RequireAuth>
            <Layout><SettingsPage /></Layout>
          </RequireAuth>
        } />
        <Route path="/memos" element={
          <RequireAuth>
            <Layout><MemosPage /></Layout>
          </RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  )
}
