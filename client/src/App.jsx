import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import SystemBanner from './components/common/SystemBanner'

import Login from './components/common/Login'
import Register from './components/common/Register'
import ChooseLanguage from './pages/ChooseLanguage'
import Dashboard from './pages/Dashboard'
import LessonPage from './pages/LessonPage'
import LevelSummary from './pages/LevelSummary'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageUsers from './pages/admin/ManageUsers'
import ManageLessons from './pages/admin/ManageLessons'
import ManageLanguages from './pages/admin/ManageLanguages'
import ManageWords from './pages/admin/ManageWords'
import CreateLesson from './pages/admin/CreateLesson'
import Rewards from './pages/admin/Rewards'
import Communications from './pages/admin/Communications'
import StudentProfile from './pages/admin/StudentProfile'
import AuditLogs from './pages/admin/AuditLogs'
import SystemBroadcast from './pages/admin/SystemBroadcast'
import AutomationRules from './pages/admin/AutomationRules'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentLessons from './pages/student/StudentLessons'
import StudentWarnings from './pages/student/StudentWarnings'
import SurpriseQuizzes from './pages/student/SurpriseQuizzes'

function AppRoutes() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const isAuth = pathname === '/login' || pathname === '/register'
  return (
    <>
      {!isAdmin && !isAuth && <SystemBanner />}
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/choose-language" element={<ProtectedRoute><ChooseLanguage /></ProtectedRoute>} />
          <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/lessons" element={<ProtectedRoute><StudentLessons /></ProtectedRoute>} />
          <Route path="/student/quizzes" element={<ProtectedRoute><SurpriseQuizzes /></ProtectedRoute>} />
          <Route path="/student/warnings" element={<ProtectedRoute><StudentWarnings /></ProtectedRoute>} /> 
          <Route path="/lesson/:lessonId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
          <Route path="/level-summary/:levelId" element={<ProtectedRoute><LevelSummary /></ProtectedRoute>} />
          <Route path="/dashboard" element={<Navigate to="/student" replace />} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/lessons" element={<ProtectedRoute adminOnly><ManageLessons /></ProtectedRoute>} />
          <Route path="/admin/lessons/new" element={<ProtectedRoute adminOnly><CreateLesson /></ProtectedRoute>} />
          <Route path="/admin/lessons/:lessonId/words" element={<ProtectedRoute adminOnly><ManageWords /></ProtectedRoute>} />
          <Route path="/admin/languages" element={<ProtectedRoute adminOnly><ManageLanguages /></ProtectedRoute>} />
          <Route path="/admin/rewards" element={<ProtectedRoute adminOnly><Rewards /></ProtectedRoute>} />
          <Route path="/admin/communications" element={<ProtectedRoute adminOnly><Communications /></ProtectedRoute>} />
          <Route path="/admin/students/:userId" element={<ProtectedRoute adminOnly><StudentProfile /></ProtectedRoute>} />
          <Route path="/admin/audit-logs" element={<ProtectedRoute adminOnly><AuditLogs /></ProtectedRoute>} />
          <Route path="/admin/broadcasts" element={<ProtectedRoute adminOnly><SystemBroadcast /></ProtectedRoute>} />
          <Route path="/admin/automations" element={<ProtectedRoute adminOnly><AutomationRules /></ProtectedRoute>} />
        </Routes>
    </>
  )
}

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
