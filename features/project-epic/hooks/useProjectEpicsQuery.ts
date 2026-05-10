'use client'

import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getProjectEpicsAction } from '../actions/getProjectEpicsAction'

export function useProjectEpicsQuery(
  projectId: string,
  page: number,
  searchTerm: string,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.epics.list(projectId, page, searchTerm),
    queryFn: async () => {
      const result = await getProjectEpicsAction(projectId, page, searchTerm)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 2,
  })
}
