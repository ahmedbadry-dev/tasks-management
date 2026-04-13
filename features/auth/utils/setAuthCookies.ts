import { cookies } from 'next/headers'

interface AuthResponse {
  access_token: string
  refresh_token: string
  expires_in: number
}

export const setAuthCookies = async (response: AuthResponse) => {
  const cookiesStore = await cookies()

  cookiesStore.set('access_token', response.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: response.expires_in,
    path: '/',
  })

  cookiesStore.set('refresh-token', response.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })
}
