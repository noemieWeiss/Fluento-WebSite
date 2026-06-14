export const fillWeekly = (raw) => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key   = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en', { weekday: 'short' })
    const found = raw?.find(r => r.day?.slice(0, 10) === key)
    days.push({ day: label, completions: found ? found.completions : 0 })
  }
  return days
}
