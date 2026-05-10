'use client'

import { useQueries } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getCalendarStatsAction } from '../actions/getCalendarStatsAction'
import { getProjectTaskCountsAction } from '../actions/getProjectTaskCountsAction'
import type { DateRange, TaskStatus } from '../types'

export function useMyStatistics(
  dateRange: DateRange,
  projectId: string | null,
  statusFilter: TaskStatus | null
) {
  const [calendarQuery, projectCountsQuery] = useQueries({
    queries: [
      {
        queryKey: queryKeys.statistics.calendar(
          dateRange.start,
          dateRange.end,
          projectId,
          statusFilter
        ),
        queryFn: async () => {
          const result = await getCalendarStatsAction({
            p_start_date: dateRange.start,
            p_end_date: dateRange.end,
            p_project_id: projectId,
            p_status: statusFilter,
          })
          if (!result.success) throw new Error(result.error)
          return result.data
        },
        staleTime: 1000 * 60 * 5,
      },
      {
        queryKey: queryKeys.statistics.projectCounts(
          dateRange.start,
          dateRange.end
        ),
        queryFn: async () => {
          const result = await getProjectTaskCountsAction(
            dateRange.start,
            dateRange.end
          )
          if (!result.success) throw new Error(result.error)
          return result.data
        },
        staleTime: 1000 * 60 * 5,
      },
    ],
  })

  return {
    calendarStats: calendarQuery.data ?? null,
    projectCounts: projectCountsQuery.data ?? [],
    isLoading: calendarQuery.isLoading || projectCountsQuery.isLoading,
    isCalendarLoading: calendarQuery.isLoading || calendarQuery.isFetching,
    isProjectCountsLoading:
      projectCountsQuery.isLoading || projectCountsQuery.isFetching,
    error: calendarQuery.error?.message ?? projectCountsQuery.error?.message ?? null,
    refetch: () => {
      void calendarQuery.refetch()
      void projectCountsQuery.refetch()
    },
  }
}
