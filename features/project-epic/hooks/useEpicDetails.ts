'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getEpicDetailsAction } from '../actions/getEpicDetailsAction'
import { RequestStatus } from '../types'

type UseEpicDetailsOptions = {
  isOpen: boolean
  epicId: string | null
  projectId: string | null
}

export function useEpicDetails({
  isOpen,
  epicId,
  projectId,
}: UseEpicDetailsOptions) {
  const query = useQuery({
    queryKey: queryKeys.epics.detail(epicId ?? '', projectId ?? ''),
    queryFn: async () => {
      const result = await getEpicDetailsAction(epicId!, projectId!)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: isOpen && Boolean(epicId) && Boolean(projectId),
    staleTime: 1000 * 60 * 2,
  })

  const status: RequestStatus = query.isError
    ? 'failed'
    : query.isLoading
      ? 'loading'
      : query.isSuccess
        ? 'succeeded'
        : 'idle'

  return {
    epicDetails: query.data ?? null,
    status,
    error: query.error?.message ?? null,
    isInitialLoading: query.isLoading,
    hasInitialError: query.isError,
    isRefreshing: query.isFetching && !query.isLoading,
    retry: () => query.refetch(),
  }
}
