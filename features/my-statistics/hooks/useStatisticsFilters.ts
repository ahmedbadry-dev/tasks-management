'use client'

import { useCallback, useState } from 'react'
import { daysBetween, getCurrentWeekRange } from '../utils/dateRange'
import type { DateRange, TaskStatus } from '../types'

export function useStatisticsFilters() {
  const [dateRange, updateDateRange] = useState<DateRange>(() =>
    getCurrentWeekRange()
  )
  const [projectId, setProjectId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null)
  const [dateError, setDateError] = useState<string | null>(null)

  const setDateRange = useCallback((range: DateRange) => {
    if (range.start > range.end) {
      setDateError('Start date must be before end date')
      return
    }

    if (daysBetween(range.start, range.end) > 7) {
      setDateError('Date range cannot exceed 7 days')
      return
    }

    updateDateRange(range)
    setDateError(null)
  }, [])

  return {
    dateRange,
    projectId,
    statusFilter,
    dateError,
    setDateRange,
    setProjectId,
    setStatusFilter,
  }
}
