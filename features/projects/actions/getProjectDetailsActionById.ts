'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { TProject } from '../types'
import { projectService } from '../services/projectService'

type GetProjectDetailsByIdResult =
  | { success: true; data: TProject[] }
  | { success: false; error: string }

export const getProjectDetailsActionById = async (
  project_id: string
): Promise<GetProjectDetailsByIdResult> => {
  const session = await getSession()
  if (!session) redirect('/sign-in')

  try {
    const response = await projectService.getProjectDetailsById(
      project_id,
      session.accessToken
    )

    return { success: true, data: response }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
