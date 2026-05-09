'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { routes } from '@/lib/routes'
import { parseError } from '@/utils/parseError'
import { redirect } from 'next/navigation'
import { myStatisticsService } from '../services/myStatisticsService'
import type { ProjectTaskCount } from '../types'

type GetProjectTaskCountsActionResult =
  | { success: true; data: ProjectTaskCount[] }
  | { success: false; error: string }

export const getProjectTaskCountsAction = async (
  p_start_date: string,
  p_end_date: string
): Promise<GetProjectTaskCountsActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    const data = await myStatisticsService.getProjectTaskCounts(
      p_start_date,
      p_end_date,
      session.accessToken
    )
    return { success: true, data }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
