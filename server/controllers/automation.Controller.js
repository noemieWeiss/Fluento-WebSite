import { asyncHandler } from '../utils/helpers.js'
import {
  findAllRules, findActiveRulesByTrigger, createRule,
  updateRule, toggleRule, deleteRule, findInactiveStudents,
} from '../models/automation.Model.js'
import { sendEmail } from '../services/mailer.js'

export const getRules  = asyncHandler(async (req, res) => res.json(await findAllRules()))

export const createRuleHandler = asyncHandler(async (req, res) => {
  const { name, trigger_type, condition_value, action_type } = req.body
  if (!name || !trigger_type || !condition_value || !action_type)
    return res.status(400).json({ message: 'Missing required fields' })
  const id = await createRule({ ...req.body, createdBy: req.user.id })
  res.status(201).json({ id, message: 'Rule created' })
})

export const updateRuleHandler = asyncHandler(async (req, res) => {
  await updateRule(req.params.id, req.body)
  res.json({ message: 'Rule updated' })
})

export const toggleRuleHandler = asyncHandler(async (req, res) => {
  await toggleRule(req.params.id)
  res.json({ message: 'Rule toggled' })
})

export const deleteRuleHandler = asyncHandler(async (req, res) => {
  await deleteRule(req.params.id)
  res.json({ message: 'Rule deleted' })
})

// Called by the cron job — not an HTTP endpoint
export async function runAutomationRules() {
  try {
    const rules = await findActiveRulesByTrigger('inactivity')
    for (const rule of rules) {
      const students = await findInactiveStudents(rule.condition_value)
      if (rule.action_type === 'send_email') {
        await Promise.allSettled(students.map(student => {
          const subject = rule.email_subject || 'We miss you on Fluento!'
          const body = (rule.email_template || 'Hi {{name}}, you haven\'t logged in for {{days}} days. Come back and keep learning! 🎓')
            .replace('{{name}}', student.name)
            .replace('{{days}}', rule.condition_value)
          return sendEmail(student.email, subject, body)
        }))
      }
      console.log(`[Automation] Rule "${rule.name}" processed ${students.length} students`)
    }
  } catch (err) {
    console.error('[Automation] runAutomationRules error:', err)
  }
}
