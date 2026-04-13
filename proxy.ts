import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/projects']
const authRoutes = ['/sign-up', '/sign-in']

export const proxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('access_Token')?.value
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (!accessToken && isProtected) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/projects', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
