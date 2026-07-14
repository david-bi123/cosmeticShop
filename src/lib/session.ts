import { dbConnect } from './db';
import { User } from '@/models/User';
import { getToken, JWTPayload } from './auth';

export async function getCurrentUser() {
  const token = await getToken();
  if (!token) return null;
  await dbConnect();
  const user = await User.findById(token.userId).select('-password');
  return user;
}

export async function getAuthPayload(): Promise<JWTPayload | null> {
  return getToken();
}
