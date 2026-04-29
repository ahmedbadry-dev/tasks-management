import { env } from '@/lib/env'

import { parseApiError } from '@/utils/parseApiError'
// import { toSafeEpicId } from '../utils/toSafeEpicId'
import { TAddTaskBody, TTask } from '../types'

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
}
