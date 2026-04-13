import { NextResponse } from 'next/server'
import { AuthResponse } from '../types'

export const setAuthCookiesOnResponse = (
  nextResponse: NextResponse,
  response: AuthResponse
) => {
  nextResponse.cookies.set('access_token', response.access_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: response.expires_in,
  })

  nextResponse.cookies.set('refresh_token', response.refresh_token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  })

  nextResponse.cookies.set(
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
    }
  )
}
