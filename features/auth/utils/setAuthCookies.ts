import { cookies } from 'next/headers'
import { AuthResponse } from '../types'
import {
  AUTH_COOKIE_NAMES,
  THIRTY_DAYS_IN_SECONDS,
  buildAuthCookieOptions,
} from './authCookieConfig'

export const setAuthCookies = async (
  response: AuthResponse,
  rememberMe: boolean = false
) => {
  const cookiesStore = await cookies()

  cookiesStore.set(
    AUTH_COOKIE_NAMES.accessToken,
    response.access_token,
    buildAuthCookieOptions(response.expires_in)
  )

  cookiesStore.set(
    AUTH_COOKIE_NAMES.refreshToken,
    response.refresh_token,
    // if user checked the remember me box so we add maxAge property to cookies stor
    // that me browser remember the user if close the browser
    buildAuthCookieOptions(rememberMe ? THIRTY_DAYS_IN_SECONDS : undefined)
  )

  // her we save the remember me in cookies, why? base if we finds it in cookies when we refresh token will but the maxAge
  // for consistency and user not lose the remember me
  if (rememberMe) {
    cookiesStore.set(
      AUTH_COOKIE_NAMES.rememberMe,
      '1',
      buildAuthCookieOptions(THIRTY_DAYS_IN_SECONDS)
    )
  } else {
    cookiesStore.delete(AUTH_COOKIE_NAMES.rememberMe)
  }
}
