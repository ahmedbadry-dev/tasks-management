import { env } from '@/lib/env'
import { TSignUpBody } from '../types'

export const authService = {
  signUp: async (body: TSignUpBody) => {
    const response = await fetch(`${process.env.API_URL}/auth/v1/signup`, {
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
}
