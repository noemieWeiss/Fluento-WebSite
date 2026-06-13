import { useEffect, useState } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import XPControl from '../../components/admin/rewards/XPControl'
import BadgeManager from '../../components/admin/rewards/BadgeManager'
import Leaderboard from '../../components/admin/rewards/Leaderboard'
import Toast from '../../components/common/Toast'
import { useToast } from '../../hooks/useToast'
import { rewardsApi } from '../../services/rewardsApi'
import '../../styles/admin.css'
import '../../styles/admin-users.css'
import '../../styles/admin-rewards.css'

const TABS = [['xp', '💎 XP Control'], ['badges', '🏅 Badges'], ['leaderboard', '🏆 Leaderboard']]

export default function Rewards() {
  const [tab, setTab]               = useState('xp')
  const [students, setStudents]     = useState([])
  const [badges, setBadges]         = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [xpForm, setXpForm]         = useState({ user_id: '', amount: '', reason: '' })
  const { toast, notify, clear }    = useToast()

  useEffect(() => {
    rewardsApi.getStudents().then(setStudents)
    rewardsApi.getBadges().then(setBadges)
    rewardsApi.getLeaderboard().then(setLeaderboard)
  }, [])

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <h1>Rewards & Penalties</h1>
          <p>Manage XP, badges, streaks and leaderboard</p>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} onClose={clear} />}

        <div className="reward-tabs">
          {TABS.map(([key, label]) => (
            <button key={key} className={`reward-tab ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>{label}</button>
          ))}
        </div>

        {tab === 'xp' && (
          <XPControl students={students} leaderboard={leaderboard} setLeaderboard={setLeaderboard} xpForm={xpForm} setXpForm={setXpForm} notify={notify} />
        )}
        {tab === 'badges' && (
          <BadgeManager students={students} badges={badges} setBadges={setBadges} notify={notify} />
        )}
        {tab === 'leaderboard' && (
          <Leaderboard leaderboard={leaderboard} />
        )}
      </main>
    </div>
  )
}
