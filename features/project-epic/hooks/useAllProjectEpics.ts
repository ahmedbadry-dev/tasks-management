'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getAllProjectEpicsAction } from '../actions/getAllProjectEpicsAction'

export function useAllProjectEpics(
  projectId: string | null,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.epics.allForProject(projectId ?? ''),
    queryFn: async () => {
      const result = await getAllProjectEpicsAction(projectId!)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: enabled && Boolean(projectId),
    staleTime: 1000 * 60 * 5,
  })
}
