import { findUserByEmail } from '../models/user.Model.js';
import { getPasswordByUserId } from '../models/password.Model.js';

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) return null;
  const stored = await getPasswordByUserId(user.id);
  if (stored !== password) return null;
  const { id, name } = user;
  return { id, name, email };
};