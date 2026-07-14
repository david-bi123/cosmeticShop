import { NextRequest, NextResponse } from 'next/server';
import { COOKIE_NAME } from '@/lib/cookies';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  const isAdminRoute = pathname.startsWith('/admin');
  const isAccountRoute = pathname.startsWith('/account');
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');

  if ((isAdminRoute || isAccountRoute) && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
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
