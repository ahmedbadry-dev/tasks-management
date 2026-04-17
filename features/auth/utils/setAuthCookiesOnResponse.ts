import { NextResponse } from 'next/server'
import { AuthResponse } from '../types'
import {
  AUTH_COOKIE_NAMES,
  THIRTY_DAYS_IN_SECONDS,
  buildAuthCookieOptions,
} from './authCookieConfig'

export const setAuthCookiesOnResponse = (
  nextResponse: NextResponse,
  response: AuthResponse,
  rememberMe: boolean = false
) => {
  nextResponse.cookies.set(
    AUTH_COOKIE_NAMES.accessToken,
    response.access_token,
    buildAuthCookieOptions(response.expires_in)
  )

  nextResponse.cookies.set(
    AUTH_COOKIE_NAMES.refreshToken,
    response.refresh_token,
    buildAuthCookieOptions(rememberMe ? THIRTY_DAYS_IN_SECONDS : undefined)
  )

  if (rememberMe) {
    nextResponse.cookies.set(
      AUTH_COOKIE_NAMES.rememberMe,
      '1',
      buildAuthCookieOptions(THIRTY_DAYS_IN_SECONDS)
    )
  } else {
    nextResponse.cookies.delete(AUTH_COOKIE_NAMES.rememberMe)
  }
}
