'use server'

import { redirect } from 'next/navigation'
import { authService } from '../services/authService'
import { TSignUpSchema } from '../validations/SignUpSchema'
import { parseError } from '@/utils/parseError'
import { setAuthCookies } from '../utils/setAuthCookies'

type SignUpActionResult = { success: boolean; error: string } | void

export const signUpAction = async (
  data: TSignUpSchema
): Promise<SignUpActionResult> => {
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
    return { success: false, error: parseError(error) }
  }

  // Redirect the user to the main page
  redirect('/project')
}
