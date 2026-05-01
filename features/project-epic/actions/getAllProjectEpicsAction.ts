'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { projectEpicsService } from '../services/projectEpicsService'
import { TEpic } from '../types'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { routes } from '@/lib/routes'

type GetAllProjectEpicsActionResult =
  | { success: true; data: TEpic[] }
  | { success: false; error: string }

export const getAllProjectEpicsAction = async (
  project_id: string
): Promise<GetAllProjectEpicsActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    const data = await projectEpicsService.getAllProjectEpics(
      project_id,
      session.accessToken
    )
    return { success: true, data }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
