'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { projectEpicsService } from '../services/projectEpicsService'
import { TEpic, TMember } from '../types'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { routes } from '@/lib/routes'

type GetProjectMembersActionResult =
  | { success: true; data: TMember[] }
  | { success: false; error: string }

export const getProjectMembersAction = async (
  project_id: string,
  signal?: AbortSignal
): Promise<GetProjectMembersActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signUp)

  try {
    const response = await projectEpicsService.getProjectMembers(
      project_id,
      session.accessToken,
      signal
    )
    return { success: true, data: response }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
