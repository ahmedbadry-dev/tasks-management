'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { projectTasksService } from '../services/projectTasksService'
import { TTask } from '../types'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { routes } from '@/lib/routes'

type GetTaskDetailsActionResult =
  | { success: true; data: TTask }
  | { success: false; error: string }

export const getTaskDetailsAction = async (
  taskId: string,
  projectId: string
): Promise<GetTaskDetailsActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    const data = await projectTasksService.getTaskDetails(
      taskId,
      projectId,
      session.accessToken
    )
    return { success: true, data }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
