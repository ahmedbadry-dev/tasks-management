import { env } from '@/lib/env'
import { TEpic, TMember, TProjectEpicBody } from '../types'
import { parseApiError } from '@/utils/parseApiError'
import { PaginatedResponse } from '@/features/projects/types'
import { PROJECTS_PAGE_SIZE } from '@/features/projects/constants'

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
  // getProjectEpics: async (
  //   project_id: string,
  //   accessToken: string
  // ): Promise<TEpic[]> => {
  //   const response = await fetch(
  //     `${env.apiUrl}/rest/v1/project_epics?project_id=eq.${project_id}`,
  //     {
  //       method: 'GET',
  //       headers: {
  //         apikey: env.anonKey,
  //         Authorization: `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json',
  //         Prefer: 'count=exact',
  //       },
  //     }
  //   )

  //   if (!response.ok) throw await parseApiError(response)
  //   return await response.json()
  // },
  getProjectEpics: async (
    accessToken: string,
    page: number = 1,
    project_id: string,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<TEpic>> => {
    const offset = (page - 1) * PROJECTS_PAGE_SIZE

    const response = await fetch(
      `${env.apiUrl}/rest/v1/project_epics?project_id=eq.${project_id}&limit=${PROJECTS_PAGE_SIZE}&offset=${offset}`,
      {
        method: 'GET',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
          Prefer: 'count=exact',
        },
        signal,
      }
    )

    if (!response.ok) throw await parseApiError(response)

    const contentRange = response.headers.get('Content-Range')
    const totalCount = contentRange ? parseInt(contentRange.split('/')[1]) : 0

    const data = await response.json()

    return { data, totalCount }
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
