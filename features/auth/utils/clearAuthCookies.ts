import { NextResponse } from 'next/server'
import { AUTH_COOKIE_NAMES } from './authCookieConfig'
export const clearAuthCookies = (response: NextResponse) => {
  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, '', {
    path: '/',
    maxAge: 0,
  })
  response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, '', {
    path: '/',
    maxAge: 0,
  })
  response.cookies.set(AUTH_COOKIE_NAMES.rememberMe, '', {
    path: '/',
    maxAge: 0,
  })
}
