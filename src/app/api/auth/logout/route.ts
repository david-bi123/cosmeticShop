import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await clearAuthCookie();
  const redirect = new URL('/', req.url);
  return NextResponse.redirect(redirect, { status: 303 });
}
