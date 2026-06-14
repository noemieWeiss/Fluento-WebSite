import { useEffect, useState } from 'react'
import { studentApi } from '../services/api'

export default function useStudentLessons() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    studentApi.getLessons()
      .then(data => {
        setLessons(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading lessons:', err)
        setError('Failed to load lessons')
        setLessons([])
        setLoading(false)
      })
  }, [])

  return { lessons, loading, error }
}