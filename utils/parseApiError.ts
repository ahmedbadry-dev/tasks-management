export const parseApiError = async (response: Response) => {
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return await response.json()
  }

  const text = await response.text()
  return { message: text || 'Request failed', status: response.status }
}
