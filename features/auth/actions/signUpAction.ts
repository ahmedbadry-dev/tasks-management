'use server'

import { redirect } from 'next/navigation'
import { authService } from '../services/authService'
import { TSignUpSchema } from '../validations/SignUpSchema'
import { parseError } from '@/utils/parseError'

type SignUpActionResult = { error: string } | void

export const signUpAction = async (
  data: TSignUpSchema
): Promise<SignUpActionResult> => {
  try {
    await authService.signUp({
      email: data.email,
      password: data.password,
      data: {
        name: data.name,
        job_title: data.jobTitle || '',
      },
    })
  } catch (error) {
    return { error: parseError(error) }
  }

  // Redirect the user to the main page
  redirect('/')
}
