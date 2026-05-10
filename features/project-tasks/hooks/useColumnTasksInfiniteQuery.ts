'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getColumnTasksAction } from '../actions/getColumnTasksAction'

export function useColumnTasksInfiniteQuery(
  projectId: string,
  status: string,
  searchTerm: string,
  enabled: boolean
) {
  return useInfiniteQuery({
    queryKey: queryKeys.tasks.boardColumn(projectId, status, searchTerm),
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getColumnTasksAction(
        projectId,
        status,
        pageParam,
        searchTerm
      )

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
