import { findUserByEmail } from '../models/user.Model.js';
import { getPasswordByUserId, verifyPassword } from '../models/password.Model.js';
import { hasChosenLanguages, ensureStudentProfile } from './student.Service.js';

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  console.log("user is ", user);

  if (!user) return null;
  const stored = await getPasswordByUserId(user.id);
  const matches = await verifyPassword(password, stored);
  if (!matches) return null;
  const { id, name, role } = user;

  let isNewStudent = false;
  if (role === 'student') {
    await ensureStudentProfile(id);
    isNewStudent = !(await hasChosenLanguages(id));
  }

  return { id, name, email, role, isNewStudent };
};