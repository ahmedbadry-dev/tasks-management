'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { TAddTaskBody } from '../types'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { ActionResult } from '@/shared/types/action-result'
import { routes } from '@/lib/routes'
import { projectTasksService } from '../services/projectTasksService'

export const addNewTaskAction = async (
  data: TAddTaskBody
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    await projectTasksService.addNewTask(data, session.accessToken)
    return { ok: true }
  } catch (error) {
    return { ok: false, error: parseError(error) }
  }
}
