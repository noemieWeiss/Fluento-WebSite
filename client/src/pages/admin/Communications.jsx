import { useEffect, useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import WarningsTab from '../../components/admin/communications/WarningsTab'
import QuizzesTab from '../../components/admin/communications/QuizzesTab'
import Toast from '../../components/common/Toast'
import { useToast } from '../../hooks/useToast'
import { rewardsApi } from '../../services/rewardsApi'
import '../../styles/admin.css'
import '../../styles/admin-users.css'
import '../../styles/admin-rewards.css'

const TABS = [['warnings', '⚠️ Warnings'], ['quizzes', '🎯 Surprise Quizzes']]

export default function Communications() {
  const [tab, setTab]           = useState('warnings')
  const [students, setStudents] = useState([])
  const [warnings, setWarnings] = useState([])
  const [quizzes, setQuizzes]   = useState([])
  const { toast, notify, clear } = useToast()

  useEffect(() => {
    rewardsApi.getStudents().then(setStudents)
    rewardsApi.getWarnings().then(setWarnings)
    rewardsApi.getQuizzes().then(setQuizzes)
  }, [])

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h1>Communications</h1>
          <p>Send warnings and create surprise quizzes</p>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}

        <div className="reward-tabs">
          {TABS.map(([key, label]) => (
            <button key={key} className={`reward-tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>

        {tab === 'warnings' && (
          <WarningsTab students={students} warnings={warnings} setWarnings={setWarnings} notify={notify} />
        )}
        {tab === 'quizzes' && (
          <QuizzesTab quizzes={quizzes} setQuizzes={setQuizzes} notify={notify} />
        )}
      </main>
    </div>
  )
}
