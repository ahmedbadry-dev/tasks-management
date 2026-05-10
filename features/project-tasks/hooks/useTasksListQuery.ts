'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getTasksListAction } from '../actions/getTasksListAction'

export function useTasksListQuery(
  projectId: string,
  page: number,
  searchTerm: string,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.tasks.list(projectId, page, searchTerm),
    queryFn: async () => {
      const result = await getTasksListAction(projectId, page, searchTerm)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  })
}
