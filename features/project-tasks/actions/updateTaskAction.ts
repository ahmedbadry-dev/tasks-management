'use server'

import { redirect } from 'next/navigation'
import { getSession } from '@/features/auth/utils/getSession'
import { routes } from '@/lib/routes'
import { parseError } from '@/utils/parseError'
import { ActionResult } from '@/shared/types/action-result'
import { projectTasksService } from '../services/projectTasksService'
import { TUpdateTaskPatch } from '../types'
import { updateTaskPatchSchema } from '../validations/updateTaskSchema'

export const updateTaskAction = async (
  taskId: string,
  patch: TUpdateTaskPatch
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  const parsedPatch = updateTaskPatchSchema.safeParse(patch)
  if (!parsedPatch.success) {
    const firstIssue = parsedPatch.error.issues[0]

    return {
      ok: false,
      error: firstIssue?.message ?? 'Invalid task data',
    }
  }

  const normalizedPatch = Object.fromEntries(
    Object.entries(parsedPatch.data).filter(([, value]) => value !== undefined)
  ) as TUpdateTaskPatch

  try {
    await projectTasksService.updateTask(taskId, normalizedPatch, session.accessToken)
    return { ok: true }
  } catch (error) {
    return { ok: false, error: parseError(error) }
  }
}
