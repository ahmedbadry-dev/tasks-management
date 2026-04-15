import { decodeJwtPayload } from './decodeJwtPayload'

const EXP_SKEW_SECONDS = 15

// check if accessToken expired
export const isAccessTokenExpired = (token: string): boolean => {
  if (!token) return true // return true as expired

  const payload = decodeJwtPayload(token)
  const tokenExpiredIn = payload?.exp
  if (typeof tokenExpiredIn !== 'number') return true // return true as expired

  const now = Math.floor(Date.now() / 1000) // time by seconds

  return tokenExpiredIn <= now + EXP_SKEW_SECONDS
}
