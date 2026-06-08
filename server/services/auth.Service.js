import { findUserByEmail } from '../models/user.Model.js';
import { getPasswordByUserId, verifyPassword } from '../models/password.Model.js';

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  console.log("user is ", user);

  if (!user) return null;
  const stored = await getPasswordByUserId(user.id);
  const matches = await verifyPassword(password, stored);
  if (!matches) return null;
  const { id, name, role } = user;
  return { id, name, email, role };
};