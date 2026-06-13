import pool from '../config/db.js'

export const getAuditLogs = async ({ admin_id, action_type, target_type, from, to, limit = 100, offset = 0 }) => {
  const conditions = []
  const params = []

  if (admin_id)    { conditions.push('al.admin_id = ?');    params.push(admin_id) }
  if (action_type) { conditions.push('al.action_type = ?'); params.push(action_type) }
  if (target_type) { conditions.push('al.target_type = ?'); params.push(target_type) }
  if (from)        { conditions.push('al.created_at >= ?'); params.push(from) }
  if (to)          { conditions.push('al.created_at <= ?'); params.push(to) }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  const [logs] = await pool.query(
    `SELECT al.*, u.name AS admin_name
     FROM audit_logs al
     JOIN users u ON u.id = al.admin_id
     ${where}
     ORDER BY al.created_at DESC
     LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`,
    params
  )

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM audit_logs al ${where}`,
    params
  )

  return { logs, total }
}
