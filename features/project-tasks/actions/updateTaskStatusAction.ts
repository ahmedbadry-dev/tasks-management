'use server'

import { redirect } from 'next/navigation'

import { getSession } from '@/features/auth/utils/getSession'
import { routes } from '@/lib/routes'
import { parseError } from '@/utils/parseError'
import { projectTasksService } from '../services/projectTasksService'

type UpdateTaskStatusActionResult =
  | { success: true }
  | { success: false; error: string }

export const updateTaskStatusAction = async (
  taskId: string,
  status: string
): Promise<UpdateTaskStatusActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    await projectTasksService.updateTaskStatus(taskId, status, session.accessToken)
    return { success: true }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}

