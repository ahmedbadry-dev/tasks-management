export const parseError = (error: unknown): string => {
  if (typeof error === 'string') {
    return error.toLowerCase().includes('invalid login credentials')
      ? 'Incorrect email or password'
      : error
  }

  if (error && typeof error === 'object') {
    const err = error as Record<string, unknown>

    const message =
      typeof err.message === 'string'
        ? err.message
        : typeof err.error_description === 'string'
          ? err.error_description
          : typeof err.error === 'string'
            ? err.error
            : typeof err.msg === 'string'
              ? err.msg
              : ''

    if (message.toLowerCase().includes('invalid login credentials')) {
      return 'Incorrect email or password'
    }

    return message || 'Something went wrong, please try again'
  }

  return 'Something went wrong, please try again'
}
