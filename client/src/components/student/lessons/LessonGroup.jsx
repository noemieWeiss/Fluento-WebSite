import LessonCard from './LessonCard'

export default function LessonGroup({ group }) {
  return (
    <div className="lesson-group">
      <div className="lesson-group-header">
        <div className="lesson-group-title">
          <span className="group-flag">{group.flag_emoji}</span>
          <span>{group.language} - {group.level}</span>
        </div>
      </div>

      <div className="lesson-list">
        {group.lessons.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>
    </div>
  )
}