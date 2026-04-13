import { NextRequest, NextResponse } from 'next/server'
import { authService } from './features/auth/services/authService'
import { setAuthCookiesOnResponse } from './features/auth/utils/setAuthCookiesOnResponse'
import { clearAuthCookies } from './features/auth/utils/clearAuthCookies'

const protectedRoutes = ['/projects']
const authRoutes = ['/sign-up', '/sign-in']

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get('access_token')?.value
  const refreshToken = request.cookies.get('refresh_token')?.value

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  if (accessToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/projects', request.url))
  }

  if (accessToken) {
    return NextResponse.next()
  }

  if (!accessToken && refreshToken && isProtected) {
    try {
      const data = await authService.refreshToken({
        refresh_token: refreshToken,
      })

      const nextResponse = NextResponse.next()
      // update tokens
      setAuthCookiesOnResponse(nextResponse, data)
      return nextResponse
    } catch {
      const redirectResponse = NextResponse.redirect(
        new URL('/sign-in', request.url)
      )

      clearAuthCookies(redirectResponse)

      return redirectResponse
    }
  }

  if (!accessToken && !refreshToken && isProtected) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
