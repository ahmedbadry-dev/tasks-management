'use server'

import { authService } from '../services/authService'
import { TSignUpSchema } from '../validations/SignUpSchema'
import { parseError } from '@/utils/parseError'
import { setAuthCookies } from '../utils/setAuthCookies'
import { ActionResult } from '@/shared/types/action-result'

export const signUpAction = async (
  data: TSignUpSchema
): Promise<ActionResult> => {
  try {
    const response = await authService.signUp({
      email: data.email,
      password: data.password,
      data: {
        name: data.name,
        job_title: data.jobTitle || '',
      },
    })
    // add tokens to HttpOnly Cookies store
    await setAuthCookies(response)
  } catch (error) {
    return { ok: false, error: parseError(error) }
  }

  return { ok: true }
}
