'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getStatisticsProjectsAction } from '../actions/getStatisticsProjectsAction'

export function useStatisticsProjects() {
  const query = useQuery({
    queryKey: queryKeys.statistics.projects,
    queryFn: async () => {
      const result = await getStatisticsProjectsAction()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 1000 * 60 * 10,
  })

  return {
    projects: query.data ?? [],
    isProjectsLoading: query.isLoading,
    projectsError: query.error?.message ?? null,
    retryProjects: () => query.refetch(),
  }
}
