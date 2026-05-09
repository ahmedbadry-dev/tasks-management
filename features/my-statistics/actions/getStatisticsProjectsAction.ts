'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { routes } from '@/lib/routes'
import { parseError } from '@/utils/parseError'
import { redirect } from 'next/navigation'
import { myStatisticsService } from '../services/myStatisticsService'
import type { StatisticsProject } from '../types'

type GetStatisticsProjectsActionResult =
  | { success: true; data: StatisticsProject[] }
  | { success: false; error: string }

export const getStatisticsProjectsAction =
  async (): Promise<GetStatisticsProjectsActionResult> => {
    const session = await getSession()
    if (!session) redirect(routes.auth.signIn)

    try {
      const data = await myStatisticsService.getFilterProjects(
        session.accessToken
      )
      return { success: true, data }
    } catch (error) {
      return { success: false, error: parseError(error) }
    }
  }
