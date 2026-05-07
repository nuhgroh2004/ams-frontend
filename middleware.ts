import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * AMS Middleware
 * Rules:
 * 1. '/' -> '/login'
 * 2. Protected '/dashboard/:path*' -> redirect to '/login' if no token
 * 3. Auth routes '/login', '/register' -> redirect to '/dashboard' if already logged in
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('ams-auth-token')?.value

  // 1. Redirect root to login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url)
      // Optional: keep track of original destination
      // loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  // 3. Prevent logged in users from accessing auth pages
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
