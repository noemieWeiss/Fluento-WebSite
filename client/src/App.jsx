import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Navbar from './components/common/Navbar'

import Login from './components/common/Login'
import Register from './components/common/Register'
import ChooseLanguage from './pages/ChooseLanguage'
import Dashboard from './pages/Dashboard'
import Lesson from './pages/Lesson'
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
import StudentDashboard from './pages/student/StudentDashboard'

function AppRoutes() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')
  const isStudent = pathname.startsWith('/student')
  return (
    <>
      {!isAdmin && !isStudent && <Navbar />}
      <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/choose-language" element={<ProtectedRoute><ChooseLanguage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/lesson/:lessonId" element={<ProtectedRoute><Lesson /></ProtectedRoute>} />
          <Route path="/level-summary/:levelId" element={<ProtectedRoute><LevelSummary /></ProtectedRoute>} />
          <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/lessons" element={<ProtectedRoute adminOnly><ManageLessons /></ProtectedRoute>} />
          <Route path="/admin/lessons/new" element={<ProtectedRoute adminOnly><CreateLesson /></ProtectedRoute>} />
          <Route path="/admin/lessons/:lessonId/words" element={<ProtectedRoute adminOnly><ManageWords /></ProtectedRoute>} />
          <Route path="/admin/languages" element={<ProtectedRoute adminOnly><ManageLanguages /></ProtectedRoute>} />
          <Route path="/admin/rewards" element={<ProtectedRoute adminOnly><Rewards /></ProtectedRoute>} />
          <Route path="/admin/communications" element={<ProtectedRoute adminOnly><Communications /></ProtectedRoute>} />
          <Route path="/admin/students/:userId" element={<ProtectedRoute adminOnly><StudentProfile /></ProtectedRoute>} />
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
