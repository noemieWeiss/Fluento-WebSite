import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import CacheProvider from './context/CacheContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import SystemBanner from './components/common/SystemBanner'

import Login from './components/common/Login'
import Register from './components/common/Register'
import ChooseLanguage from './components/ChooseLanguage'
import LessonPage from './components/LessonPage'
import AdminDashboard from './components/admin/AdminDashboard'
import ManageUsers from './components/admin/ManageUsers'
import ManageLessons from './components/admin/ManageLessons'
import ManageLanguages from './components/admin/ManageLanguages'
import ManageWords from './components/admin/ManageWords'
import CreateLesson from './components/admin/CreateLesson'
import Rewards from './components/admin/Rewards'
import Communications from './components/admin/Communications'
import StudentProfile from './components/admin/StudentProfile'
import AuditLogs from './components/admin/AuditLogs'
import SystemBroadcast from './components/admin/SystemBroadcast'
import AutomationRules from './components/admin/AutomationRules'
import StudentDashboard from './components/student/StudentDashboard'
import StudentLessons from './components/student/StudentLessons'
import StudentWarnings from './components/student/StudentWarnings'
import SurpriseQuizzes from './components/student/SurpriseQuizzes'

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
          <Route path="/choose-language" element={<ProtectedRoute studentOnly><ChooseLanguage /></ProtectedRoute>} />
          <Route path="/student" element={<ProtectedRoute studentOnly><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/lessons" element={<ProtectedRoute studentOnly><StudentLessons /></ProtectedRoute>} />
          <Route path="/student/quizzes" element={<ProtectedRoute studentOnly><SurpriseQuizzes /></ProtectedRoute>} />
          <Route path="/student/warnings" element={<ProtectedRoute studentOnly><StudentWarnings /></ProtectedRoute>} />
          <Route path="/lesson/:lessonId" element={<ProtectedRoute studentOnly><LessonPage /></ProtectedRoute>} />
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
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    </>
  )
}

function App() {
  return (
    <CacheProvider>
      <UserProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </UserProvider>
    </CacheProvider>
  )
}

export default App
