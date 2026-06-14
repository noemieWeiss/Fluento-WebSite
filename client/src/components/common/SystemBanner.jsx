import { useEffect, useState } from 'react'
import { broadcastApi } from '../../services/api'
import { useUser } from '../../context/UserContext'

export default function SystemBanner() {
  const { user } = useUser()
  const [broadcasts, setBroadcasts] = useState([])
  const [dismissed, setDismissed]   = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('dismissedBanners') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    if (!user) return
    broadcastApi.getActive()
      .then(data => setBroadcasts(Array.isArray(data) ? data : []))
      .catch(() => {})

    const interval = setInterval(() => {
      broadcastApi.getActive()
        .then(data => setBroadcasts(Array.isArray(data) ? data : []))
        .catch(() => {})
    }, 30000)

    return () => clearInterval(interval)
  }, [user])

  const dismiss = (id) => {
    const next = [...dismissed, id]
    setDismissed(next)
    sessionStorage.setItem('dismissedBanners', JSON.stringify(next))
  }

  const visible = broadcasts.filter(b => !dismissed.includes(b.id))
  if (visible.length === 0) return null

  return (
    <div className="system-banners">
      {visible.map(b => (
        <div key={b.id} className="system-banner">
          <span className="system-banner-icon">📢</span>
          <span className="system-banner-text">{b.message}</span>
          <button className="system-banner-close" onClick={() => dismiss(b.id)} aria-label="Dismiss">✕</button>
        </div>
      ))}
    </div>
  )
}
