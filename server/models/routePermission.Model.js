import pool from '../config/db.js'

export const isRouteAllowed = async (path, role) => {
  const [rows] = await pool.query(
    'SELECT id FROM route_permissions WHERE ? LIKE CONCAT(prefix, \'%\') AND role = ?',
    [path, role]
  )
  return rows.length > 0
}
