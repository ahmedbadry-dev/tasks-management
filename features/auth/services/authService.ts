import { env } from '@/lib/env'
import {
  TForgotPassword,
  TRefreshTokenBody,
  TSignInBody,
  TSignUpBody,
} from '../types'
import { parseApiError } from '@/utils/parseApiError'
import { createApiHeaders } from '@/utils/createApiHeaders'

export const authService = {
  signUp: async (body: TSignUpBody) => {
    const response = await fetch(`${env.apiUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: createApiHeaders(),
      body: JSON.stringify(body),
    })

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },
  signIn: async (body: TSignInBody) => {
    const response = await fetch(
      `${env.apiUrl}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: createApiHeaders(),
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },
  logout: async (accessToken: string) => {
    const response = await fetch(`${env.apiUrl}/auth/v1/logout`, {
      method: 'POST',
      headers: createApiHeaders(accessToken),
    })

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },
  refreshToken: async (body: TRefreshTokenBody) => {
    const response = await fetch(
      `${env.apiUrl}/auth/v1/token?grant_type=refresh_token`,
      {
        method: 'POST',
        headers: createApiHeaders(),
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },
  userinfo: async (accessToken: string) => {
    const response = await fetch(`${env.apiUrl}/auth/v1/user`, {
      method: 'GET',
      cache: 'no-store',
      headers: createApiHeaders(accessToken),
    })

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },
  forgotPassword: async (body: TForgotPassword) => {
    const response = await fetch(`${env.apiUrl}/auth/v1/recover`, {
      method: 'POST',
      headers: createApiHeaders(),
      body: JSON.stringify(body),
    })

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },
}
