import { NextRequest, NextResponse } from 'next/server'
import { authService } from './features/auth/services/authService'
import { setAuthCookiesOnResponse } from './features/auth/utils/setAuthCookiesOnResponse'
import { clearAuthCookies } from './features/auth/utils/clearAuthCookies'
import { AUTH_COOKIE_NAMES } from '@/features/auth/utils/authCookieConfig'
import { isAccessTokenExpired } from './lib/isAccessTokenExpire'

const protectedRoutes = ['/projects']
const authRoutes = ['/sign-up', '/sign-in']

export const proxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl

  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value
  const refreshToken = request.cookies.get(
    AUTH_COOKIE_NAMES.refreshToken
  )?.value
  const rememberMe =
    request.cookies.get(AUTH_COOKIE_NAMES.rememberMe)?.value === '1' // === '1'  => return true or false

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  const refreshAndAttachCookies = async (response: NextResponse) => {
    if (!refreshToken) return null

    const data = await authService.refreshToken({ refresh_token: refreshToken }) // this return new response with new accessToken and refreshToken
    setAuthCookiesOnResponse(response, data, rememberMe)
    return response // this response have the newest accessToken and refreshToken
  }

  if (isAuthRoute) {
    // happy case
    if (accessToken && !isAccessTokenExpired(accessToken)) {
      return NextResponse.redirect(new URL('/projects', request.url)) // authenticated user can not see the signin or signup page
    }

    // accessToken expired or not found and we have the refreshToken
    if (refreshToken) {
      try {
        // 1 => create redirect response to projects page
        const redirectResponse = NextResponse.redirect(
          new URL('/projects', request.url)
        )

        // 2 => try to refreshed tokens
        const refreshed = await refreshAndAttachCookies(redirectResponse)
        if (refreshed) return refreshed
      } catch {
        // 1 => create new response
        const nextResponse = NextResponse.next()
        // 2 => clear the tokens from it
        clearAuthCookies(nextResponse)
        // 3 => return the response with no tokens
        return nextResponse
      }
    }

    // to make sure all old access token is deleted
    if (accessToken && isAccessTokenExpired(accessToken)) {
      const nextResponse = NextResponse.next()
      clearAuthCookies(nextResponse)
      return nextResponse
    }

    return NextResponse.next()
  }

  if (isProtected) {
    // happy case
    if (accessToken && !isAccessTokenExpired(accessToken)) {
      return NextResponse.next()
    }

    // accessToken expired or not found and we have the refreshToken
    if (refreshToken) {
      try {
        // 1 => create new response
        const nextResponse = NextResponse.next()
        // 2 => try to refreshed tokens
        const refreshed = await refreshAndAttachCookies(nextResponse)
        if (refreshed) return refreshed
      } catch {
        const redirectResponse = NextResponse.redirect(
          new URL('/sign-in', request.url)
        )
        clearAuthCookies(redirectResponse) // we clear the redirect response first
        return redirectResponse
      }
    }

    // if we do not have refreshToken clear and redirect to sign in
    const redirectResponse = NextResponse.redirect(
      new URL('/sign-in', request.url)
    )
    clearAuthCookies(redirectResponse)
    return redirectResponse
  }

  return NextResponse.next() // for noun protected routes
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
