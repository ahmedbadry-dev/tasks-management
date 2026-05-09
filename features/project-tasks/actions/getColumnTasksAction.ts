'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { projectTasksService } from '../services/projectTasksService'
import { TTask } from '../types'
import { redirect } from 'next/navigation'
import { parseError } from '@/utils/parseError'
import { routes } from '@/lib/routes'
import { PaginatedResponse } from '@/hooks/paginated/types'

type GetColumnTasksActionResult =
  | { success: true; data: PaginatedResponse<TTask> }
  | { success: false; error: string }

export const getColumnTasksAction = async (
  projectId: string,
  status: string,
  page: number = 1,
  searchTerm?: string
): Promise<GetColumnTasksActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    const data = await projectTasksService.getColumnTasks(
      projectId,
      status,
      session.accessToken,
      page,
      searchTerm
    )
    return { success: true, data }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
