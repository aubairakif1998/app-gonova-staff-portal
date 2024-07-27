import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: [
    '/application-inreview/:path*',
    '/loads/:path*',
    '/shippers/:path*',
    '/carriers/:path*',
    '/sign-in',
    '/sign-up',
    '/',
    '/verify/:path*',
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token) {
    if (!token.isVerified) {
      if (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/loads') ||
        url.pathname.startsWith('/shippers') ||
        url.pathname.startsWith('/carriers')
      ) {
        return NextResponse.redirect(new URL(`/application-inreview/${token._id}`, request.url));
      }
    } else {
      if (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/application-inreview')
      ) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  } else {
    if (
      url.pathname.startsWith('/loads') ||
      url.pathname.startsWith('/shippers') ||
      url.pathname.startsWith('/carriers') ||
      url.pathname.startsWith('/application-inreview')
    ) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
}
