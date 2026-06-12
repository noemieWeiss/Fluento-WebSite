import pool from '../config/db.js'

export const findAllRules = async () => {
  const [rows] = await pool.execute(
    `SELECT ar.*, u.name AS created_by_name
     FROM automation_rules ar
     JOIN users u ON u.id = ar.created_by
     ORDER BY ar.created_at DESC`
  )
  return rows
}

export const findActiveRulesByTrigger = async (triggerType) => {
  const [rows] = await pool.execute(
    'SELECT * FROM automation_rules WHERE is_active=TRUE AND trigger_type=?',
    [triggerType]
  )
  return rows
}

export const createRule = async ({ name, trigger_type, condition_value, action_type, email_subject, email_template, createdBy }) => {
  const [result] = await pool.execute(
    `INSERT INTO automation_rules
       (name, trigger_type, condition_value, action_type, email_subject, email_template, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, trigger_type, condition_value, action_type, email_subject || null, email_template || null, createdBy]
  )
  return result.insertId
}

export const updateRule = async (id, { name, trigger_type, condition_value, action_type, email_subject, email_template, is_active }) => {
  await pool.execute(
    `UPDATE automation_rules
     SET name=?, trigger_type=?, condition_value=?, action_type=?,
         email_subject=?, email_template=?, is_active=?
     WHERE id=?`,
    [name, trigger_type, condition_value, action_type, email_subject, email_template, is_active, id]
  )
}

export const toggleRule = async (id) => {
  await pool.execute('UPDATE automation_rules SET is_active=NOT is_active WHERE id=?', [id])
}

export const deleteRule = async (id) => {
  await pool.execute('DELETE FROM automation_rules WHERE id=?', [id])
}

export const findInactiveStudents = async (days) => {
  const [rows] = await pool.execute(
    `SELECT u.id, u.name, u.email
     FROM users u
     JOIN student_profiles sp ON sp.user_id = u.id
     WHERE u.status='active'
       AND (sp.last_active IS NULL OR sp.last_active < DATE_SUB(NOW(), INTERVAL ? DAY))`,
    [days]
  )
  return rows
}
