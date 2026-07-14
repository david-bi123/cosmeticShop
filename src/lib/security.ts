import { headers } from 'next/headers';

export async function checkOrigin(): Promise<boolean> {
  const h = await headers();
  const origin = h.get('origin');
  const host = h.get('host');
  if (!host) return false;
  // Standard same-origin check (works on any host, including Vercel/preview).
  if (origin) {
    try {
      if (new URL(origin).host === host) return true;
    } catch {
      /* fall through */
    }
  } else {
    // No Origin header (e.g. same-origin navigations, some clients): allow.
    return true;
  }
  // Allow an explicitly configured app URL as an additional trusted origin.
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '');
  if (appUrl) {
    try {
      if (new URL(appUrl).host === host) return true;
    } catch {
      /* ignore */
    }
  }
  return false;
}

const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit(key: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || entry.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}

export async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0] || h.get('x-real-ip') || 'unknown';
}
