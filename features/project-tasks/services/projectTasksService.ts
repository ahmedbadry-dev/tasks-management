import { env } from '@/lib/env'

import { parseApiError } from '@/utils/parseApiError'
// import { toSafeEpicId } from '../utils/toSafeEpicId'
import { TAddTaskBody, TTask } from '../types'
import { PaginatedResponse } from '@/hooks/paginated/types'
import { TASKS_PAGE_SIZE } from '../constants'

export const projectTasksService = {
  addNewTask: async (
    body: TAddTaskBody,
    accessToken: string
  ): Promise<void> => {
    const response = await fetch(`${env.apiUrl}/rest/v1/tasks`, {
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
  getEpicTasks: async (
    epicId: string,
    accessToken: string,
    signal?: AbortSignal
  ): Promise<TTask[]> => {
    const response = await fetch(
      `${env.apiUrl}/rest/v1/project_tasks?epic_id=eq.${epicId}`,
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
  getColumnTasks: async (
    projectId: string,
    status: string,
    accessToken: string
  ): Promise<TTask[]> => {
    const response = await fetch(
      `${env.apiUrl}/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}`,
      {
        method: 'GET',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },
  getTasksList: async (
    projectId: string,
    page: number,
    accessToken: string,
    signal?: AbortSignal
  ): Promise<PaginatedResponse<TTask>> => {
    const offset = (page - 1) * TASKS_PAGE_SIZE

    const response = await fetch(
      `${env.apiUrl}/rest/v1/project_tasks?project_id=eq.${projectId}&limit=${TASKS_PAGE_SIZE}&offset=${offset}&order=created_at.desc`,
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
  getTaskDetails: async (
    taskId: string,
    projectId: string,
    accessToken: string
  ): Promise<TTask> => {
    const response = await fetch(
      `${env.apiUrl}/rest/v1/project_tasks?project_id=eq.${projectId}&id=eq.${taskId}&limit=1`,
      {
        method: 'GET',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) throw await parseApiError(response)

    const data = await response.json()
    if (!data.length) throw new Error('Task not found')

    return data[0]
  },
}
