import { env } from '@/lib/env'
import { TProject } from '../types'
import { parseApiError } from '@/utils/parseApiError'

export const projectsService = {
  getProjects: async (accessToken: string): Promise<TProject[]> => {
    const response = await fetch(`${env.apiUrl}/rest/v1/rpc/get_projects`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        apikey: env.anonKey,
      },
    })

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },
}
