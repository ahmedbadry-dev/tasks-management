import { cookies } from 'next/headers'
import { AUTH_COOKIE_NAMES } from './authCookieConfig'
import { authService } from '../services/authService'
import { isAccessTokenExpired } from '@/lib/isAccessTokenExpire'

export const getSession = async () => {
  const cookiesStore = await cookies()

  const accessToken = cookiesStore.get(AUTH_COOKIE_NAMES.accessToken)?.value

  if (!accessToken) return null
  if (isAccessTokenExpired(accessToken)) return null // to prevent un unnecessary api call in non protected pages

  try {
    const user = await authService.userinfo(accessToken)
    return { user }
  } catch {
    return null
  }
}
