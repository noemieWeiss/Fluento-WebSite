import 'dotenv/config'

export const JWT_SECRET = process.env.JWT_SECRET
export const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com'
export const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
export const SMTP_USER = process.env.SMTP_USER
export const SMTP_PASS = process.env.SMTP_PASS
export const SMTP_FROM = process.env.SMTP_FROM || 'noreply@fluento.com'
