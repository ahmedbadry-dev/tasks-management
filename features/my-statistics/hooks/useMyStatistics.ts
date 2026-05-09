'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getCalendarStatsAction } from '../actions/getCalendarStatsAction'
import { getProjectTaskCountsAction } from '../actions/getProjectTaskCountsAction'
import type {
  CalendarStatsResponse,
  DateRange,
  ProjectTaskCount,
  TaskStatus,
} from '../types'

export function useMyStatistics(
  dateRange: DateRange,
  projectId: string | null,
  statusFilter: TaskStatus | null
) {
  const [calendarStats, setCalendarStats] =
    useState<CalendarStatsResponse | null>(null)
  const [projectCounts, setProjectCounts] = useState<ProjectTaskCount[]>([])
  const [isCalendarLoading, setIsCalendarLoading] = useState(false)
  const [isProjectsLoading, setIsProjectsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const calendarRequestIdRef = useRef(0)
  const projectsRequestIdRef = useRef(0)

  const fetchCalendarStats = useCallback(async () => {
    const requestId = calendarRequestIdRef.current + 1
    calendarRequestIdRef.current = requestId

    setIsCalendarLoading(true)
    setError(null)

    const result = await getCalendarStatsAction({
      p_start_date: dateRange.start,
      p_end_date: dateRange.end,
      p_project_id: projectId,
      p_status: statusFilter,
    })

    // Ignore older responses when the user changes filters quickly.
    if (calendarRequestIdRef.current !== requestId) return

    if (result.success) {
      setCalendarStats(result.data)
    } else {
      setError(result.error)
    }

    setIsCalendarLoading(false)
  }, [dateRange.end, dateRange.start, projectId, statusFilter])

  const fetchProjectCounts = useCallback(async () => {
    const requestId = projectsRequestIdRef.current + 1
    projectsRequestIdRef.current = requestId

    setIsProjectsLoading(true)
    setError(null)

    const result = await getProjectTaskCountsAction(
      dateRange.start,
      dateRange.end
    )

    if (projectsRequestIdRef.current !== requestId) return

    if (result.success) {
      setProjectCounts(result.data)
    } else {
      setError(result.error)
    }

    setIsProjectsLoading(false)
  }, [dateRange.end, dateRange.start])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchCalendarStats()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchCalendarStats])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchProjectCounts()
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchProjectCounts])

  const refetch = useCallback(() => {
    void fetchCalendarStats()
    void fetchProjectCounts()
  }, [fetchCalendarStats, fetchProjectCounts])

  return {
    calendarStats,
    projectCounts,
    isLoading: isCalendarLoading || isProjectsLoading,
    isCalendarLoading,
    isProjectCountsLoading: isProjectsLoading,
    error,
    refetch,
  }
}
