'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { projectEpicsService } from '../services/projectEpicsService'
import { TProjectEpicBody } from '../types'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { ActionResult } from '@/shared/types/action-result'

export const addProjectEpicAction = async (
  data: TProjectEpicBody
): Promise<ActionResult> => {
  const session = await getSession()
  if (!session) redirect('/sign-in')

  try {
    await projectEpicsService.addProjectEpic(data, session.accessToken)
    return { ok: true }
  } catch (error) {
    return { ok: false, error: parseError(error) }
  }
}
