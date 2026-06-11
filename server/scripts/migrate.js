import pool from '../config/db.js'

const migrations = [
  {
    name: 'audit_logs',
    sql: `CREATE TABLE IF NOT EXISTS audit_logs (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      admin_id    INT NOT NULL,
      action_type VARCHAR(50) NOT NULL,
      target_type VARCHAR(50) NOT NULL,
      target_id   INT,
      details     JSON,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_admin_id (admin_id),
      INDEX idx_created_at (created_at),
      INDEX idx_action_type (action_type)
    ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  },
  {
    name: 'system_broadcasts',
    sql: `CREATE TABLE IF NOT EXISTS system_broadcasts (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      message    TEXT NOT NULL,
      is_active  BOOLEAN DEFAULT TRUE,
      created_by INT NOT NULL,
      expires_at TIMESTAMP NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  },
  {
    name: 'automation_rules',
    sql: `CREATE TABLE IF NOT EXISTS automation_rules (
      id              INT AUTO_INCREMENT PRIMARY KEY,
      name            VARCHAR(100) NOT NULL,
      trigger_type    VARCHAR(50) NOT NULL,
      condition_value INT NOT NULL,
      action_type     VARCHAR(50) NOT NULL,
      email_subject   VARCHAR(200),
      email_template  TEXT,
      is_active       BOOLEAN DEFAULT TRUE,
      created_by      INT NOT NULL,
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
  },
]

async function migrate() {
  for (const { name, sql } of migrations) {
    await pool.query(sql)
    console.log(`✓ ${name}`)
  }
  console.log('Migration complete.')
  await pool.end()
}

migrate().catch(err => { console.error(err); process.exit(1) })
