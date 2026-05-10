'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { redirect } from 'next/navigation'
import { routes } from '@/lib/routes'
import { parseError } from '@/utils/parseError'
import { projectService } from '../services/projectService'
import { PaginatedResponse, TProject } from '../types'

type GetProjectsActionResult =
  | { success: true; data: PaginatedResponse<TProject> }
  | { success: false; error: string }

export const getProjectsAction = async (
  page = 1
): Promise<GetProjectsActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    const data = await projectService.getProjects(session.accessToken, page)
    return { success: true, data }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
