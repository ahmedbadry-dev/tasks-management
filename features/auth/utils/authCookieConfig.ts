export const AUTH_COOKIE_NAMES = {
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  rememberMe: 'remember_me',
} as const

// refresh token time
export const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30

// true only in production
const isProd = process.env.NODE_ENV === 'production'

export const buildAuthCookieOptions = (maxAge?: number) => ({
  httpOnly: true,
  secure: isProd,
  sameSite: 'lax' as const,
  path: '/',
  ...(typeof maxAge === 'number' ? { maxAge } : {}),
})
