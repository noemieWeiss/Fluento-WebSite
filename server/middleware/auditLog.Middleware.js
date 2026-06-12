import pool from '../config/db.js'

const SENSITIVE_ACTIONS = {
  DELETE: 'delete',
  PUT: 'update',
  POST: 'create',
}

// Maps route patterns to target types
const TARGET_TYPE_MAP = [
  { pattern: /\/users\/(\d+)/, type: 'user' },
  { pattern: /\/users/, type: 'user' },
  { pattern: /\/languages\/(\d+)/, type: 'language' },
  { pattern: /\/languages/, type: 'language' },
  { pattern: /\/levels\/(\d+)/, type: 'level' },
  { pattern: /\/levels/, type: 'level' },
  { pattern: /\/lessons\/(\d+)/, type: 'lesson' },
  { pattern: /\/lessons/, type: 'lesson' },
  { pattern: /\/words\/(\d+)/, type: 'word' },
  { pattern: /\/words/, type: 'word' },
  { pattern: /\/warnings/, type: 'warning' },
  { pattern: /\/quizzes/, type: 'quiz' },
  { pattern: /\/badges/, type: 'badge' },
  { pattern: /\/xp/, type: 'xp' },
  { pattern: /\/broadcasts/, type: 'broadcast' },
  { pattern: /\/automations/, type: 'automation' },
]

function resolveTargetType(path) {
  for (const { pattern, type } of TARGET_TYPE_MAP) {
    if (pattern.test(path)) return type
  }
  return 'unknown'
}

function resolveTargetId(path, body, params) {
  // Try route param id first
  if (params?.id) return parseInt(params.id)
  // Try extracting from path
  const match = path.match(/\/(\d+)$/)
  if (match) return parseInt(match[1])
  // Try body id
  if (body?.id) return parseInt(body.id)
  return null
}

export function auditLog(req, res, next) {
  const method = req.method
  if (!SENSITIVE_ACTIONS[method]) return next()

  const originalJson = res.json.bind(res)
  res.json = function (data) {
    // Only log on success (2xx)
    if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
      const adminId = req.user.id
      const actionType = SENSITIVE_ACTIONS[method]
      const fullPath = req.baseUrl + req.path
      const targetType = resolveTargetType(fullPath)
      const targetId = resolveTargetId(req.path, req.body, req.params)

      const details = {
        path: fullPath,
        method,
        ...(req.body && Object.keys(req.body).length ? { body: sanitizeBody(req.body) } : {}),
      }

      pool.execute(
        'INSERT INTO audit_logs (admin_id, action_type, target_type, target_id, details) VALUES (?, ?, ?, ?, ?)',
        [adminId, actionType, targetType, targetId, JSON.stringify(details)]
      ).catch(err => console.error('Audit log insert failed:', err))
    }
    return originalJson(data)
  }

  next()
}

// Remove sensitive fields before storing
function sanitizeBody(body) {
  const { password, password_hash, token, ...safe } = body
  return safe
}
