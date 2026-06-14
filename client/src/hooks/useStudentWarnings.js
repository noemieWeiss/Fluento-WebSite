import { useEffect, useState } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getToken = () => {
  try {
    return JSON.parse(localStorage.getItem('authUser'))?.token
  } catch {
    return null
  }
}

export default function useStudentWarnings() {
  const [warnings, setWarnings] = useState([])
  const [loading, setLoading] = useState(true)

  const loadWarnings = async () => {
    try {
      const res = await fetch(`${API_BASE}/student/warnings`, {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })

      const data = await res.json()
      setWarnings(data.warnings || [])
    } catch (err) {
      console.error('Failed to load warnings:', err)
    } finally {
      setLoading(false)
    }
  }

  const markAsSeen = async (warningId) => {
    try {
      await fetch(`${API_BASE}/student/warnings/${warningId}/seen`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })

      setWarnings(prev =>
        prev.map(w =>
          w.id === warningId ? { ...w, seen: true } : w
        )
      )
    } catch (err) {
      console.error('Failed to mark warning as seen:', err)
    }
  }

  useEffect(() => {
    loadWarnings()
  }, [])

  return { warnings, loading, markAsSeen }
}