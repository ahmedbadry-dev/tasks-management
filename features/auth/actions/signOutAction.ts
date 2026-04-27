'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AUTH_COOKIE_NAMES } from '../utils/authCookieConfig'
import { authService } from '../services/authService'
import { routes } from '@/lib/routes'

export async function signOutAction() {
  const cookieStore = await cookies()

  const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.accessToken)?.value

  try {
    if (accessToken) await authService.logout(accessToken)
  } catch (error) {}

  cookieStore.delete(AUTH_COOKIE_NAMES.accessToken)
  cookieStore.delete(AUTH_COOKIE_NAMES.refreshToken)
  cookieStore.delete(AUTH_COOKIE_NAMES.rememberMe)

  redirect(routes.auth.signIn)
}
