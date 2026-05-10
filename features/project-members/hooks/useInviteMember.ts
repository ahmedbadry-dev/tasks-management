'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { inviteMemberAction } from '../actions/inviteMemberAction'

export function useInviteMember(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (email: string) => {
      const result = await inviteMemberAction({ email, projectId })
      if (!result.ok) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.members.byProject(projectId),
      })
    },
  })
}
