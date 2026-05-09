'use server'

import { getSession } from '@/features/auth/utils/getSession'
import { routes } from '@/lib/routes'
import { parseError } from '@/utils/parseError'
import { redirect } from 'next/navigation'
import { myStatisticsService } from '../services/myStatisticsService'
import type { CalendarStatsParams, CalendarStatsResponse } from '../types'

type GetCalendarStatsActionResult =
  | { success: true; data: CalendarStatsResponse }
  | { success: false; error: string }

export const getCalendarStatsAction = async (
  params: CalendarStatsParams
): Promise<GetCalendarStatsActionResult> => {
  const session = await getSession()
  if (!session) redirect(routes.auth.signIn)

  try {
    const data = await myStatisticsService.getCalendarStats(
      params,
      session.accessToken
    )
    return { success: true, data }
  } catch (error) {
    return { success: false, error: parseError(error) }
  }
}
