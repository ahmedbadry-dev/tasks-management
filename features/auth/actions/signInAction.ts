'use server'

import { parseError } from '@/utils/parseError'
import { authService } from '../services/authService'
import { setAuthCookies } from '../utils/setAuthCookies'
import { TSignInSchema } from '../validations/SignInSchema'
import { redirect } from 'next/navigation'

export const signInAction = async (data: TSignInSchema) => {
  try {
    const response = await authService.signIn({
      email: data.email,
      password: data.password,
    })

    // add tokens to HttpOnly Cookies store
    await setAuthCookies(response, data.rememberMe)
  } catch (error) {
    return { error: parseError(error) }
  }

  redirect('/projects')
}
