import { asyncHandler } from '../utils/helpers.js'
import { getKpi, getWeeklyActivity, getHardestLessons } from '../models/adminStats.Model.js'

export const getStats = asyncHandler(async (req, res) => {
  const [kpi, weeklyActivity, hardestLessons] = await Promise.all([
    getKpi(),
    getWeeklyActivity(),
    getHardestLessons(),
  ])
  res.json({ kpi, weeklyActivity, hardestLessons })
})
