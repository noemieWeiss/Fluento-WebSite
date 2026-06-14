import cron from 'node-cron'
import { runAutomationRules } from '../controllers/automation.Controller.js'

export function startAutomationCron() {
  cron.schedule('0 8 * * *', async () => {
    console.log('[Cron] Running automation rules...')
    await runAutomationRules()
  })
  console.log('[Cron] Automation scheduler started (daily at 08:00)')
}
