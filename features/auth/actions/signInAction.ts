'use server'

import { parseError } from '@/utils/parseError'
import { authService } from '../services/authService'
import { setAuthCookies } from '../utils/setAuthCookies'
import { TSignInSchema } from '../validations/SignInSchema'
import { ActionResult } from '@/shared/types/action-result'

export const signInAction = async (
  data: TSignInSchema
): Promise<ActionResult> => {
  try {
    const response = await authService.signIn({
      email: data.email,
      password: data.password,
    })

    // add tokens to HttpOnly Cookies store
    await setAuthCookies(response, data.rememberMe)
  } catch (error) {
    return { ok: false, error: parseError(error) }
  }

  return { ok: true }
}
