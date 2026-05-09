type ErrorLike = {
  status?: unknown
  code?: unknown
  message?: unknown
  error?: unknown
  error_description?: unknown
  msg?: unknown
}

const extractMessage = (error: unknown) => {
  if (typeof error === 'string') return error
  if (!error || typeof error !== 'object') return ''

  const err = error as ErrorLike
  const candidates = [
    err.message,
    err.error_description,
    err.error,
    err.msg,
  ]

  const text = candidates.find((candidate) => typeof candidate === 'string')
  return typeof text === 'string' ? text : ''
}

const extractStatus = (error: unknown) => {
  if (!error || typeof error !== 'object') return null
  const status = (error as ErrorLike).status
  return typeof status === 'number' ? status : null
}

export const mapInvitationError = (error: unknown, flow: 'invite' | 'accept') => {
  const status = extractStatus(error)
  const message = extractMessage(error).toLowerCase()
  const code =
    error && typeof error === 'object' && typeof (error as ErrorLike).code === 'string'
      ? String((error as ErrorLike).code).toLowerCase()
      : ''

  if (status === 401) return 'Your session expired. Please sign in again.'
  if (status === 403) return 'You are not allowed to perform this action.'
  if (status === 400 && flow === 'accept') return 'This invitation link is invalid.'
  if (status === 404 && flow === 'accept') return 'This invitation link is invalid.'

  if (status !== null && status >= 500) {
    return 'Server error. Please try again in a moment.'
  }

  if (
    message.includes('failed to fetch') ||
    message.includes('network') ||
    message.includes('fetch')
  ) {
    return 'Network error. Please check your connection and try again.'
  }

  if (flow === 'accept') {
    if (
      message.includes('expired') ||
      code.includes('expired')
    ) {
      return 'This invitation has expired. Ask the project admin for a new one.'
    }
    if (
      message.includes('invalid') ||
      message.includes('token') ||
      message.includes('not found') ||
      code.includes('invalid') ||
      code.includes('token')
    ) {
      return 'This invitation link is invalid.'
    }
  }

  if (
    flow === 'invite' &&
    (message.includes('already') || code.includes('duplicate'))
  ) {
    return 'This user already has a pending invitation or is already a member.'
  }

  return 'Something went wrong, please try again.'
}
