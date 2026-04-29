import { env } from '@/lib/env'
import {
  TEpic,
  TEpicDetails,
  TMember,
  TProjectEpicBody,
  TUpdateProjectEpicPatch,
} from '../types'
import { parseApiError } from '@/utils/parseApiError'
import { PaginatedResponse } from '@/features/projects/types'
import { PROJECTS_PAGE_SIZE } from '@/features/projects/constants'
import { toSafeProjectId } from '@/features/projects/utils/toSafeProjectId'
import { toSafeEpicId } from '../utils/toSafeEpicId'

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
    accessToken: string,
    page: number = 1,
    project_id: string,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<TEpic>> => {
    const safeProjectId = toSafeProjectId(project_id)
    const offset = (page - 1) * PROJECTS_PAGE_SIZE

    const response = await fetch(
      `${env.apiUrl}/rest/v1/project_epics?project_id=eq.${safeProjectId}&order=created_at.desc,id.desc&limit=${PROJECTS_PAGE_SIZE}&offset=${offset}`,
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
    const totalCountRaw = contentRange?.split('/')[1]
    const totalCount = totalCountRaw ? Number.parseInt(totalCountRaw, 10) : 0

    const data = await response.json()

    return { data, totalCount }
  },
  getProjectMembers: async (
    project_id: string,
    accessToken: string,
    signal?: AbortSignal
  ): Promise<TMember[]> => {
    const safeProjectId = toSafeProjectId(project_id)

    const response = await fetch(
      `${env.apiUrl}/rest/v1/get_project_members?project_id=eq.${safeProjectId}`,
      {
        method: 'GET',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
        },
        signal,
      }
    )

    if (!response.ok) throw await parseApiError(response)
    return await response.json()
  },
  getEpicDetails: async (
    accessToken: string,
    epic_id: string,
    project_id: string,
    signal?: AbortSignal
  ): Promise<TEpicDetails> => {
    const safeProjectId = toSafeProjectId(project_id)
    const safeEpicId = toSafeEpicId(epic_id)

    const response = await fetch(
      `${env.apiUrl}/rest/v1/project_epics?project_id=eq.${safeProjectId}&id=eq.${safeEpicId}`,
      {
        method: 'GET',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
        },
        signal,
      }
    )

    if (!response.ok) throw await parseApiError(response)

    const data = await response.json()
    const row = Array.isArray(data) ? data[0] : data
    if (!row) throw new Error('Epic details not found')

    return row as TEpicDetails
  },
  updateProjectEpic: async (
    epic_id: string,
    patch: TUpdateProjectEpicPatch,
    accessToken: string
  ) => {
    const safeEpicId = toSafeEpicId(epic_id)

    // Inline editing sends only the changed field(s), so we PATCH a partial payload.
    const response = await fetch(
      `${env.apiUrl}/rest/v1/epics?id=eq.${safeEpicId}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(patch),
      }
    )

    if (!response.ok) throw await parseApiError(response)
  },
}
