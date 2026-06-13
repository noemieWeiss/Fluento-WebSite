import nodemailer from 'nodemailer'

let transporter = null

async function getTransporter() {
  if (transporter) return transporter

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  } else {
    // Dev mode: use Ethereal test account
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
    console.log('[Mailer] Using Ethereal test account:', testAccount.user)
  }

  return transporter
}

export async function sendEmail(to, subject, text) {
  const transport = await getTransporter()

  const info = await transport.sendMail({
    from: process.env.SMTP_FROM || 'noreply@fluento.com',
    to,
    subject,
    text,
  })

  if (!process.env.SMTP_USER) {
    console.log('[Mailer] Preview URL:', nodemailer.getTestMessageUrl(info))
  }
}
