import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { UserRole } from './constants';
import { COOKIE_NAME, CART_COOKIE, WISHLIST_COOKIE } from './cookies';

export { COOKIE_NAME, CART_COOKIE, WISHLIST_COOKIE };

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-dev-secret-change-in-production-please-32';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRoleType;
  name: string;
  permissions?: string[];
}

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES as any });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getToken(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function isAdminRole(role: UserRoleType): boolean {
  return role === UserRole.SUPER_ADMIN || role === UserRole.ADMIN;
}

export function hasPermission(payload: JWTPayload | null, perm: string): boolean {
  if (!payload) return false;
  if (payload.role === UserRole.SUPER_ADMIN) return true;
  if (payload.role === UserRole.ADMIN) return true;
  return payload.permissions?.includes(perm) ?? false;
}
