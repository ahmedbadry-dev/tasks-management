'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getProjectsAction } from '../actions/getProjectsAction'

export function useProjectsQuery(page: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.projects.list(page),
    queryFn: async () => {
      const result = await getProjectsAction(page)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  })
}
