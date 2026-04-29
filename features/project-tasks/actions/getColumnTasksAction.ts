'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { projectTasksService } from '../services/projectTasksService'
import { TTask } from '../types'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { routes } from '@/lib/routes'

type GetColumnTasksActionResult =
  | { success: true; data: TTask[] }
  | { success: false; error: string }

export const getColumnTasksAction = async (
  projectId: string,
  status: string
): Promise<GetColumnTasksActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    const data = await projectTasksService.getColumnTasks(
      projectId,
      status,
      session.accessToken
    )
    return { success: true, data }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
