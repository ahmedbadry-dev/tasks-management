import { env } from '@/lib/env'
import { TEpic, TMember, TProjectEpicBody } from '../types'
import { parseApiError } from '@/utils/parseApiError'

export const projectEpicsService = {
  addProjectEpic: async (
    body: TProjectEpicBody,
    accessToken: string
  ): Promise<void> => {
    const response = await fetch(`${env.apiUrl}/rest/v1/epics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: env.anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) throw await parseApiError(response)
  },
  getProjectEpics: async (
    project_id: string,
    accessToken: string,
    signal?: AbortSignal
  ): Promise<TEpic[]> => {
    const response = await fetch(
      `${env.apiUrl}/rest/v1/project_epics?project_id=eq.${project_id}`,
      {
        method: 'GET',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Prefer: 'count=exact',
        },
        signal,
      }
    )

    if (!response.ok) throw await parseApiError(response)
    return await response.json()
  },
  getProjectMembers: async (
    project_id: string,
    accessToken: string,
    signal?: AbortSignal
  ): Promise<TMember[]> => {
    const response = await fetch(
      `${env.apiUrl}/rest/v1/get_project_members?project_id=eq.${project_id}`,
      {
        method: 'GET',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        signal,
      }
    )

    if (!response.ok) throw await parseApiError(response)
    return await response.json()
  },
}
