import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/cookies';

function isTokenValid(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const raw = req.cookies.get(COOKIE_NAME)?.value;
  const valid = raw ? isTokenValid(raw) : false;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAccountRoute = pathname.startsWith('/account');
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  if ((isAdminRoute || isAccountRoute) && !valid) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && valid) {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/login', '/register'],
};
