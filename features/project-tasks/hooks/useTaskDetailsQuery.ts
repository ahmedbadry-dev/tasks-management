'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getTaskDetailsAction } from '../actions/getTaskDetailsAction'

export function useTaskDetailsQuery(
  taskId: string | null,
  projectId: string | null,
  isOpen: boolean
) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(taskId ?? '', projectId ?? ''),
    queryFn: async () => {
      const result = await getTaskDetailsAction(taskId!, projectId!)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: isOpen && Boolean(taskId) && Boolean(projectId),
    staleTime: 1000 * 60,
  })
}
