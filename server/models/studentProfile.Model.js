import pool from '../config/db.js'

export const getStudentById = async (userId) => {
  const [[user]] = await pool.query(`
    SELECT u.id, u.name, u.email, u.status, u.created_at,
      sp.xp, sp.streak, sp.last_active,
      GROUP_CONCAT(DISTINCT lang.name ORDER BY lang.name SEPARATOR ', ') AS languages
    FROM users u
    LEFT JOIN student_profiles sp ON sp.user_id = u.id
    LEFT JOIN user_languages ul ON ul.user_id = u.id
    LEFT JOIN languages lang ON lang.id = ul.language_id
    WHERE u.id = ?
    GROUP BY u.id, sp.xp, sp.streak, sp.last_active
  `, [userId])
  return user || null
}

export const getProgressByUser = async (userId) => {
  const [rows] = await pool.query(`
    SELECT up.*, l.title AS lesson, lv.title AS level, lang.name AS language, lang.flag_emoji
    FROM user_progress up
    JOIN lessons l    ON l.id  = up.lesson_id
    JOIN levels lv    ON lv.id = l.level_id
    JOIN languages lang ON lang.id = lv.language_id
    WHERE up.user_id = ?
    ORDER BY lang.name, lv.level_number, l.lesson_number
  `, [userId])
  return rows
}

export const getLeaderboard = async () => {
  const [rows] = await pool.query(`
    SELECT u.id, u.name, u.status,
      sp.xp, sp.streak,
      GROUP_CONCAT(DISTINCT lang.name ORDER BY lang.name SEPARATOR ', ') AS languages,
      COUNT(DISTINCT ub.badge_id) AS badge_count,
      COUNT(DISTINCT up.lesson_id) AS lessons_completed
    FROM users u
    JOIN roles_to_users rtu ON rtu.user_id = u.id
    JOIN roles r ON r.id = rtu.role_id
    LEFT JOIN student_profiles sp ON sp.user_id = u.id
    LEFT JOIN user_languages ul ON ul.user_id = u.id
    LEFT JOIN languages lang ON lang.id = ul.language_id
    LEFT JOIN user_badges ub ON ub.user_id = u.id
    LEFT JOIN user_progress up ON up.user_id = u.id AND up.completed = TRUE
    WHERE r.name = 'student'
    GROUP BY u.id, u.name, u.status, sp.xp, sp.streak
    ORDER BY sp.xp DESC
    LIMIT 20
  `)
  return rows
}
