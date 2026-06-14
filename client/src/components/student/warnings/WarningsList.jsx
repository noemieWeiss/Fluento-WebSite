import WarningCard from './WarningCard'

export default function WarningsList({ warnings, onMarkSeen }) {
  return (
    <div className="warnings-list">
      {warnings.map(warning => (
        <WarningCard
          key={warning.id}
          warning={warning}
          onMarkSeen={onMarkSeen}
        />
      ))}
    </div>
  )
}