import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Redirect to dashboard if the user is already authenticated
  // and trying to access sign-in, sign-up, or home page
  if (
    token &&
    (url.pathname.startsWith('/sign-in') ||
      url.pathname.startsWith('/sign-up') ||
      url.pathname.startsWith('/verify')
      // ||
      // url.pathname === '/'
    )
  ) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!token && url.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}


// NEXTAUTH_SECRET=123sDSDADASDWE31E
// MONGODB_URI=mongodb+srv://admin:admin@novatech-cluster0.k7gqe87.mongodb.net/Nova-ShipperDB?retryWrites=true&w=majority&appName=NOVATech-Cluster0
// RESEND_API_KEY=re_3qWLgDeN_HKAYtfE3UpgJBE51wBPJbJZz
// NEXTAUTH_URL=http://localhost:3000/


//4pb71ikq
//aubairakif1998