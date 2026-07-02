import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/superadmin')) {
    const auth = request.cookies.get('admin_auth')?.value
    
    // Only allow these two emails to access the superadmin pages
    if (auth !== 'bhaliyayash595@gmail.com' && auth !== 'hardikkotadiya90@gmail.com') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}

export const config = {
  matcher: '/superadmin/:path*',
}
