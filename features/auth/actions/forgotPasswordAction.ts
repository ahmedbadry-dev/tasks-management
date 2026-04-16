'use server'

import { parseError } from '@/utils/parseError'
import { isApiError } from '@/lib/isApiError'
import { parseRetryAfter } from '@/lib/parseRetryAfter'
import { authService } from '../services/authService'
import { TForgetPasswordSchema } from '../validations/ForgetPasswordSchema'

type ForgotPasswordActionResult =
  | { status: 'sent' }
  | { status: 'rate_limited'; retryAfter: number }
  | { status: 'blocked' }
  | { status: 'error'; error: string }

export const forgotPasswordAction = async (
  data: TForgetPasswordSchema
): Promise<ForgotPasswordActionResult> => {
  try {
    await authService.forgotPassword({ email: data.email })
    return { status: 'sent' }
  } catch (error) {
    if (
      isApiError(error) &&
      error.error_code === 'over_email_send_rate_limit'
    ) {
      const retryAfter = parseRetryAfter(error.msg)

      if (retryAfter === -1) return { status: 'blocked' }

      return { status: 'rate_limited', retryAfter }
    }

    return { status: 'error', error: parseError(error) }
  }
}

// test response from postman
// {
//   "code": 429,
//   "error_code": "over_email_send_rate_limit",
//   "msg": "For security purposes, you can only request this after 57 seconds."
// }

// {
//   "code": 429,
//   "error_code": "over_email_send_rate_limit",
//   "msg": "email rate limit exceeded"
// }
