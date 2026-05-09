import { env } from '@/lib/env'
import { parseApiError } from '@/utils/parseApiError'
import type {
  CalendarStatsParams,
  CalendarStatsResponse,
  ProjectTaskCount,
  StatisticsProject,
} from '../types'

export const myStatisticsService = {
  getCalendarStats: async (
    params: CalendarStatsParams,
    accessToken: string
  ): Promise<CalendarStatsResponse> => {
    const response = await fetch(
      `${env.apiUrl}/rest/v1/rpc/get_tasks_calendar_stats`,
      {
        method: 'POST',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      }
    )

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },

  getProjectTaskCounts: async (
    p_start_date: string,
    p_end_date: string,
    accessToken: string
  ): Promise<ProjectTaskCount[]> => {
    const response = await fetch(
      `${env.apiUrl}/rest/v1/rpc/get_tasks_count_per_project`,
      {
        method: 'POST',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_start_date, p_end_date }),
      }
    )

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },

  getFilterProjects: async (
    accessToken: string
  ): Promise<StatisticsProject[]> => {
    const response = await fetch(
      `${env.apiUrl}/rest/v1/rpc/get_projects?limit=1000&offset=0`,
      {
        method: 'GET',
        headers: {
          apikey: env.anonKey,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) throw await parseApiError(response)

    return await response.json()
  },
}
