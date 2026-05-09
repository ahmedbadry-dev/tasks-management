'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { projectTasksService } from '../services/projectTasksService'
import { TTask } from '../types'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { routes } from '@/lib/routes'
import { PaginatedResponse } from '@/hooks/paginated/types'

type GetTasksListActionResult =
  | { success: true; data: PaginatedResponse<TTask> }
  | { success: false; error: string }

export const getTasksListAction = async (
  projectId: string,
  page: number,
  searchTerm?: string
): Promise<GetTasksListActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    const data = await projectTasksService.getTasksList(
      projectId,
      page,
      session.accessToken,
      undefined,
      searchTerm
    )
    return { success: true, data }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
