import { env } from '@/lib/env'
import { TAddProjectBody, TProject } from '../types'
import { parseApiError } from '@/utils/parseApiError'

export const projectService = {
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
  addProject: async (
    body: TAddProjectBody,
    accessToken: string
  ): Promise<void> => {
    const response = await fetch(`${env.apiUrl}/rest/v1/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: env.anonKey,
        Authorization: `Bearer ${accessToken}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) throw await parseApiError(response)
  },
}
