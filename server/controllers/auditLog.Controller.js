import { asyncHandler } from '../utils/helpers.js'
import { getAuditLogs } from '../models/auditLog.Model.js'

export const getAuditLogsHandler = asyncHandler(async (req, res) => {
  res.json(await getAuditLogs(req.query))
})
