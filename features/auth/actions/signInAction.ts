'use server'

import { parseError } from '@/utils/parseError'
import { authService } from '../services/authService'
import { setAuthCookies } from '../utils/setAuthCookies'
import { TSignInSchema } from '../validations/SignInSchema'
import { redirect } from 'next/navigation'

type SignInActionResult = { success: boolean; error: string } | void

export const signInAction = async (
  data: TSignInSchema
): Promise<SignInActionResult> => {
  try {
    const response = await authService.signIn({
      email: data.email,
      password: data.password,
    })

    // add tokens to HttpOnly Cookies store
    await setAuthCookies(response, data.rememberMe)
  } catch (error) {
    return { success: false, error: parseError(error) }
  }

  redirect('/project')
}
