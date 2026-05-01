'use server'

import { getSession } from '@/features/auth/utils/getSession'

import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { routes } from '@/lib/routes'
import { PaginatedResponse } from '@/features/projects/types'
import { TEpic } from '@/features/project-epic/types'
import { projectEpicsService } from '@/features/project-epic/services/projectEpicsService'

type GetProjectEpicsActionResult =
  | { success: true; data: PaginatedResponse<TEpic> }
  | { success: false; error: string }

export const getProjectEpicsAction = async (
  projectId: string,
  page: number,
  searchTerm?: string
): Promise<GetProjectEpicsActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    const data = await projectEpicsService.getProjectEpics(
      session.accessToken,
      page,
      projectId,
      searchTerm
    )
    return { success: true, data }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
