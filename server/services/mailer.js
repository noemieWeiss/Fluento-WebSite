import nodemailer from 'nodemailer'

// Configure via environment variables:
//   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
// For Gmail: SMTP_HOST=smtp.gmail.com, SMTP_PORT=587, use an App Password
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(to, subject, text) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(`[Mailer] SMTP not configured — skipping email to ${to}: "${subject}"`)
    return
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
  })
}
