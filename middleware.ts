import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const referrer = req.headers.get('referer');

  // Redirect helper
  const redirectToReferrer = () => {
    if (referrer) {
      return NextResponse.redirect(referrer);
    } else {
      return NextResponse.redirect(new URL('/', req.url)); // Fallback to homepage if no referrer
    }
  };

  // Check if the user is navigating to the Login page
  if (pathname === '/login') {
    if (!referrer || (!referrer.includes('/') && !referrer.includes('/register'))) {
      return redirectToReferrer();
    }
  }

  /// Check if the user is navigating to the Register page
  if (pathname === '/register') {
    if (!referrer || !referrer.includes('/login')) {
      return redirectToReferrer();
    }
  }

  // Check if the user is navigating to OTP page
  if (pathname === '/otp') {
    if (!referrer || !referrer.includes('/login')) {
      return redirectToReferrer();
    }
  }

  // Add other conditional redirects if necessary
  if (pathname === '/restricted-page') {
    // Example logic for other pages
    return NextResponse.redirect(new URL('/some-other-page', req.url));
  }

  // Allow other requests to pass through
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/account-verification', '/restricted-page', '/otp'], // List protected routes here
};
