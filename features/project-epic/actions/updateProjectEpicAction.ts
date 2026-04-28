'use server'

import { redirect } from 'next/navigation'
import { getSession } from '@/features/auth/utils/getSession'
import { parseError } from '@/utils/parseError'
import { ActionResult } from '@/shared/types/action-result'
import { routes } from '@/lib/routes'
import { projectEpicsService } from '../services/projectEpicsService'
import { TUpdateProjectEpicPatch } from '../types'
import { UpdateProjectEpicPatchSchema } from '../validations/UpdateProjectEpicSchema'

export const updateProjectEpicAction = async (
  epic_id: string,
  patch: TUpdateProjectEpicPatch
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  // Server-side validation for partial updates (each field can be saved alone).
  const parsedBody = UpdateProjectEpicPatchSchema.safeParse(patch)
  if (!parsedBody.success) {
    const firstIssue = parsedBody.error.issues[0]
    return {
      ok: false,
      error: firstIssue?.message ?? 'Invalid epic data',
    }
  }

  // Strip undefined values to guarantee we only PATCH changed fields.
  const normalizedPatch = Object.fromEntries(
    Object.entries(parsedBody.data).filter(([, value]) => value !== undefined)
  ) as TUpdateProjectEpicPatch

  try {
    await projectEpicsService.updateProjectEpic(epic_id, normalizedPatch, session.accessToken)
  } catch (error) {
    return { ok: false, error: parseError(error) }
  }

  return { ok: true }
}
