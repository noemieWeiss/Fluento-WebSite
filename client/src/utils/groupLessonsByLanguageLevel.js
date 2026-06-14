export function groupLessonsByLanguageLevel(lessons) {
  if (!Array.isArray(lessons)) return {}

  return lessons.reduce((acc, lesson) => {
    const key = `${lesson.language}-${lesson.level}`

    if (!acc[key]) {
      acc[key] = {
        language: lesson.language,
        flag_emoji: lesson.flag_emoji,
        level: lesson.level,
        level_id: lesson.level_id,
        lessons: []
      }
    }

    acc[key].lessons.push(lesson)
    return acc
  }, {})
}