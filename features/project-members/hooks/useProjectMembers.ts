'use client'

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { getProjectMembersAction } from '../actions/getProjectMembersAction'

export function useProjectMembers(
  projectId: string | null,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.members.byProject(projectId ?? ''),
    queryFn: async () => {
      const result = await getProjectMembersAction(projectId!)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: enabled && Boolean(projectId),
    staleTime: 1000 * 60 * 10,
  })
}
