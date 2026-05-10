'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getEpicTasksAction } from '../actions/getEpicTasksAction'

export function useEpicTasksQuery(epicId: string | null, isOpen = true) {
  return useQuery({
    queryKey: queryKeys.tasks.epicTasks(epicId ?? ''),
    queryFn: async () => {
      const result = await getEpicTasksAction(epicId!)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: isOpen && Boolean(epicId),
    staleTime: 1000 * 60 * 2,
  })
}
