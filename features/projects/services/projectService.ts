import { env } from '@/lib/env'
import {
  PaginatedResponse,
  TAddProjectBody,
  TProject,
  TUpdateProjectBody,
} from '../types'
import { parseApiError } from '@/utils/parseApiError'
import { PROJECTS_PAGE_SIZE } from '../constants'
import { toSafeProjectId } from '../utils/toSafeProjectId'

export const projectService = {
  getProjects: async (
    accessToken: string,
    page: number = 1,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<TProject>> => {
    const offset = (page - 1) * PROJECTS_PAGE_SIZE

    const response = await fetch(
      `${env.apiUrl}/rest/v1/rpc/get_projects?limit=${PROJECTS_PAGE_SIZE}&offset=${offset}`,
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
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) throw await parseApiError(response)
  },
  updateProject: async (
    project_id: string,
    body: TUpdateProjectBody,
    accessToken: string
  ) => {
    const safeProjectId = toSafeProjectId(project_id)

    const response = await fetch(
      `${env.apiUrl}/rest/v1/projects?id=eq.${safeProjectId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      }
    )
    if (!response.ok) throw await parseApiError(response)
  },
  getProjectDetailsById: async (
    project_id: string,
    accessToken: string
  ): Promise<TProject[]> => {
    const safeProjectId = toSafeProjectId(project_id)
    const response = await fetch(
      `${env.apiUrl}/rest/v1/projects?id=eq.${safeProjectId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )
    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },
}
