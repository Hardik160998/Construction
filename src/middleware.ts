import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const auth = request.cookies.get('admin_auth')?.value

  if (request.nextUrl.pathname.startsWith('/superadmin')) {
    if (auth !== 'hardikkotadiya90@gmail.com') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  if (request.nextUrl.pathname.startsWith('/project')) {
    if (auth !== 'bhaliyayash595@gmail.com') {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
}

export const config = {
  matcher: ['/superadmin/:path*', '/project/:path*'],
}
