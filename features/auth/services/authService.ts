import { env } from '@/lib/env'
import { TSignInBody, TSignUpBody } from '../types'

export const authService = {
  signUp: async (body: TSignUpBody) => {
    const response = await fetch(`${env.apiUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: env.anonKey,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) throw await response.json()

    return await response.json()
  },
  signIn: async (body: TSignInBody) => {
    const response = await fetch(
      `${env.apiUrl}/auth/v1/token?grant_type=password`,
      {
        method: 'POST',
        headers: {
          'content-Type': 'application/json',
          apikey: env.anonKey,
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) throw await response.json()

    return await response.json()
  },
}
