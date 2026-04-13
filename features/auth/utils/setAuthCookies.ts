import { cookies } from 'next/headers'
import { AuthResponse } from '../types'

export const setAuthCookies = async (
  response: AuthResponse,
  rememberMe: boolean = false
) => {
  const cookiesStore = await cookies()

  cookiesStore.set('access_token', response.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: response.expires_in,
  })

  cookiesStore.set('refresh-token', response.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    ...(rememberMe && { maxAge: 60 * 60 * 24 * 30 }),
  })

  cookiesStore.set(
    'user',
    JSON.stringify({
      id: response.user.id,
      email: response.user.email,
      name: response.user.user_metadata.name,
      department: response.user.user_metadata.department,
    }),
    {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      ...(rememberMe && { maxAge: 60 * 60 * 24 * 30 }),
    }
  )
}
