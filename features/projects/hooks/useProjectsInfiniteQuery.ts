'use client'

import { useInfiniteQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getProjectsAction } from '../actions/getProjectsAction'
import { PROJECTS_PAGE_SIZE } from '../constants'

export function useProjectsInfiniteQuery(enabled = true) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.projects.all, 'infinite'] as const,
    queryFn: async ({ pageParam = 1 }) => {
      const result = await getProjectsAction(pageParam)
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
    staleTime: 1000 * 60 * 5,
    maxPages: Math.max(1, Math.ceil(1000 / PROJECTS_PAGE_SIZE)),
  })
}
