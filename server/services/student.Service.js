import { countUserLanguages, getStudentProfile, createStudentProfile } from '../models/student.Model.js'

export const hasChosenLanguages = async (userId) => {
  const count = await countUserLanguages(userId)
  return count > 0
}

export const ensureStudentProfile = async (userId) => {
  const existing = await getStudentProfile(userId)
  if (!existing) {
    await createStudentProfile(userId)
  }
}
