import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('🛡️ Middleware:', req.nextUrl.pathname, 'Session:', session ? session.user.email : 'NO SESSION');

  // Protect admin routes
  if (req.nextUrl.pathname.startsWith('/admin') && !session) {
    console.log('⛔ Redirecting /admin → /signin (no session)');
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  // Always require auth for residents page (force Sign In first)
  if (req.nextUrl.pathname.startsWith('/residents') && !session) {
    console.log('⛔ Redirecting /residents → /signin (no session)');
    return NextResponse.redirect(new URL('/signin', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}