'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getTasksListAction } from '../actions/getTasksListAction'

export function useTasksListInfiniteQuery(
  projectId: string,
  searchTerm: string,
  enabled = true
) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.tasks.all, 'infinite', projectId, searchTerm] as const,
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getTasksListAction(projectId, pageParam, searchTerm)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    initialPageParam: 1,
    enabled,
    getNextPageParam: (lastPage, allPages) => {
      const loadedCount = allPages.reduce(
        (sum, page) => sum + page.data.length,
        0
      )
      if (loadedCount >= lastPage.totalCount) return undefined

      return allPages.length + 1
    },
    staleTime: 1000 * 60,
  })
}
