import { env } from '@/lib/env'

import { parseApiError } from '@/utils/parseApiError'
// import { toSafeEpicId } from '../utils/toSafeEpicId'
import { TAddTaskBody } from '../types'

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
}
