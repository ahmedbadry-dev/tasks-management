import { ApiError } from '@/features/auth/types'

export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'error_code' in error &&
    'msg' in error
  )
}
