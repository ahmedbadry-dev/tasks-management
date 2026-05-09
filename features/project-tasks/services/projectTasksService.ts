import { env } from '@/lib/env'

import { parseApiError } from '@/utils/parseApiError'
// import { toSafeEpicId } from '../utils/toSafeEpicId'
import { TAddTaskBody, TTask, TUpdateTaskPatch } from '../types'
import { PaginatedResponse } from '@/hooks/paginated/types'
import { COLUMN_PAGE_SIZE, TASKS_PAGE_SIZE } from '../constants'

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
    accessToken: string,
    page: number = 1
  ): Promise<PaginatedResponse<TTask>> => {
    const offset = (page - 1) * COLUMN_PAGE_SIZE

    const response = await fetch(
      `${env.apiUrl}/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}&limit=${COLUMN_PAGE_SIZE}&offset=${offset}&order=created_at.desc`,
      {
        method: 'GET',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
          Prefer: 'count=exact',
        },
      }
    )

    if (!response.ok) throw await parseApiError(response)

    const contentRange = response.headers.get('Content-Range')
    const totalCountPart = contentRange?.split('/')[1]
    const parsedTotalCount = totalCountPart
      ? Number.parseInt(totalCountPart, 10)
      : 0
    const totalCount = Number.isNaN(parsedTotalCount) ? 0 : parsedTotalCount
    const data = await response.json()

    return { data, totalCount }
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
  updateTaskStatus: async (
    taskId: string,
    status: string,
    accessToken: string
  ): Promise<void> => {
    const response = await fetch(`${env.apiUrl}/rest/v1/tasks?id=eq.${taskId}`, {
      method: 'PATCH',
      headers: {
        apikey: env.anonKey,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ status }),
    })

    if (!response.ok) throw await parseApiError(response)
  },
  updateTask: async (
    taskId: string,
    patch: TUpdateTaskPatch,
    accessToken: string
  ): Promise<void> => {
    const response = await fetch(
      `${env.apiUrl}/rest/v1/tasks?id=eq.${encodeURIComponent(taskId)}`,
      {
        method: 'PATCH',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(patch),
      }
    )

    if (!response.ok) throw await parseApiError(response)
  },
}
