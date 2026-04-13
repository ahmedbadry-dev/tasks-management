import { NextResponse } from 'next/server'

export const clearAuthCookies = (response: NextResponse) => {
  response.cookies.delete('access_token')
  response.cookies.delete('refresh_token')
  response.cookies.delete('user')
}
