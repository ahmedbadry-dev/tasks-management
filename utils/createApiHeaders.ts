import { env } from '@/lib/env'

export function createApiHeaders(
  accessToken?: string,
  headers: Record<string, string> = {}
): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: env.anonKey,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...headers,
  }
}
