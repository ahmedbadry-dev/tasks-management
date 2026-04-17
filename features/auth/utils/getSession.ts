import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAMES } from './authCookieConfig'
import { isAccessTokenExpired } from '@/lib/isAccessTokenExpire'
import { decodeJwtPayload } from '@/lib/decodeJwtPayload'
import { AuthUser } from '../types'

export type Session = {
  accessToken: string
  user: AuthUser
}

// fast don't make api call it extract data from local token
export const getSession = async (): Promise<Session | null> => {
  const cookiesStore = await cookies()
  const accessToken = cookiesStore.get(AUTH_COOKIE_NAMES.accessToken)?.value

  if (!accessToken) return null
  if (isAccessTokenExpired(accessToken)) return null

  const payload = decodeJwtPayload(accessToken)
  if (!payload) return null

  return {
    accessToken,
    user: {
      id: payload.sub as string,
      email: payload.email as string,
      user_metadata: payload.user_metadata as AuthUser['user_metadata'],
    },
  }
}
