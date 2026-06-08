import { useState } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)
  const notify = (msg, type = 'success') => setToast({ msg, type })
  const clear = () => setToast(null)
  return { toast, notify, clear }
}
