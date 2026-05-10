'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { redirect } from 'next/navigation'
import { routes } from '@/lib/routes'
import { parseError } from '@/utils/parseError'
import { projectEpicsService } from '../services/projectEpicsService'
import { TEpicDetails } from '../types'

type GetEpicDetailsActionResult =
  | { success: true; data: TEpicDetails }
  | { success: false; error: string }

export const getEpicDetailsAction = async (
  epicId: string,
  projectId: string
): Promise<GetEpicDetailsActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    const data = await projectEpicsService.getEpicDetails(
      session.accessToken,
      epicId,
      projectId
    )
    return { success: true, data }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
