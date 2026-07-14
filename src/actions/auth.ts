'use server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/db';
import { User } from '@/models/User';
import { signToken, setAuthCookie, clearAuthCookie, getToken } from '@/lib/auth';
import { UserRole } from '@/lib/constants';
import { checkOrigin, rateLimit, getClientIp } from '@/lib/security';
import { registerSchema, loginSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

function actionError(message: string) {
  return { success: false as const, error: message };
}

export async function registerAction(formData: FormData) {
  if (!(await checkOrigin())) return actionError('Invalid request origin');
  const ip = await getClientIp();
  if (!rateLimit(`reg_${ip}`, 5, 60_000)) return actionError('Too many attempts. Try again later.');

  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return actionError(parsed.error.errors[0].message);

  await dbConnect();
  const { name, email, phone, password } = parsed.data;
  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) return actionError('An account with this email already exists');

  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email: email.toLowerCase(), phone, password: hashed, role: UserRole.CUSTOMER });

  const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role, name: user.name });
  await setAuthCookie(token);
  revalidatePath('/');
  return { success: true as const, redirect: '/account' };
}

export async function loginAction(formData: FormData) {
  if (!(await checkOrigin())) return actionError('Invalid request origin');
  const ip = await getClientIp();
  if (!rateLimit(`login_${ip}`, 8, 60_000)) return actionError('Too many attempts. Try again later.');

  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return actionError('Invalid email or password');

  await dbConnect();
  const { email, password } = parsed.data;
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) return actionError('Invalid credentials');
  if (user.blocked) return actionError('This account has been blocked. Contact support.');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return actionError('Invalid credentials');

  const token = signToken({
    userId: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
    permissions: user.permissions,
  });
  await setAuthCookie(token);
  const redirect = user.role === UserRole.CUSTOMER ? '/account' : '/admin';
  revalidatePath('/');
  return { success: true as const, redirect };
}

export async function logoutAction() {
  await clearAuthCookie();
  return { success: true as const, redirect: '/' };
}

export async function requestPasswordResetAction(formData: FormData) {
  const email = String(formData.get('email') || '');
  if (!email) return actionError('Email is required');
  await dbConnect();
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) return { success: true as const, message: 'If an account exists, a reset link has been sent.' };
  const token = signToken({ userId: user._id.toString(), email: user.email, role: user.role, name: user.name });
  await User.findByIdAndUpdate(user._id, { passwordResetToken: token, passwordResetExpires: new Date(Date.now() + 3600_000) });
  return { success: true as const, message: 'If an account exists, a reset link has been sent.' };
}

export async function resetPasswordAction(token: string, formData: FormData) {
  const password = String(formData.get('password') || '');
  if (password.length < 6) return actionError('Password must be at least 6 characters');
  await dbConnect();
  const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: new Date() } });
  if (!user) return actionError('Invalid or expired reset token');
  user.password = await bcrypt.hash(password, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return { success: true as const, redirect: '/login' };
}

export async function updateProfileAction(formData: FormData) {
  const payload = await getToken();
  if (!payload) return actionError('Not authenticated');
  const name = String(formData.get('name') || '');
  const phone = String(formData.get('phone') || '');
  await dbConnect();
  await User.findByIdAndUpdate(payload.userId, { name, phone });
  return { success: true as const, message: 'Profile updated' };
}

export async function addAddressAction(formData: FormData) {
  const payload = await getToken();
  if (!payload) return actionError('Not authenticated');
  await dbConnect();
  const address = {
    fullName: String(formData.get('fullName')),
    phone: String(formData.get('phone')),
    street: String(formData.get('street')),
    city: String(formData.get('city')),
    region: String(formData.get('region')),
    landmark: String(formData.get('landmark') || ''),
    isDefault: formData.get('isDefault') === 'on',
  };
  const user = await User.findById(payload.userId);
  if (!user) return actionError('User not found');
  if (address.isDefault) user.addresses.forEach((a: any) => (a.isDefault = false));
  user.addresses.push(address);
  await user.save();
  return { success: true as const };
}

export async function changePasswordAction(formData: FormData) {
  const payload = await getToken();
  if (!payload) return actionError('Not authenticated');
  const current = String(formData.get('current') || '');
  const next = String(formData.get('password') || '');
  if (next.length < 6) return actionError('New password must be at least 6 characters');
  await dbConnect();
  const user = await User.findById(payload.userId).select('+password');
  if (!user) return actionError('User not found');
  const match = await bcrypt.compare(current, user.password);
  if (!match) return actionError('Current password is incorrect');
  user.password = await bcrypt.hash(next, 12);
  await user.save();
  return { success: true as const, message: 'Password changed' };
}

export async function newsletterAction(formData: FormData) {
  const email = String(formData.get('email') || '').toLowerCase().trim();
  if (!email.includes('@')) return actionError('Enter a valid email');
  await dbConnect();
  const { Newsletter } = await import('@/models/Newsletter');
  await Newsletter.findOneAndUpdate({ email }, { email, subscribed: true }, { upsert: true });
  return { success: true as const, message: 'Thank you for subscribing!' };
}

