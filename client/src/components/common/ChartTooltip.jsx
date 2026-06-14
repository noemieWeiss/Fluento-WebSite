export default function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="custom-tooltip">
      <div className="label">{label}</div>
      <div><strong>{payload[0].value}</strong> {payload[0].name}</div>
    </div>
  )
}
