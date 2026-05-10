'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProjectAction } from '../actions/updateProjectAction'
import { TUpdateProjectBody } from '../types'
import { queryKeys } from '@/lib/queryKeys'

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: TUpdateProjectBody) => {
      const result = await updateProjectAction(projectId, body)
      if (!result.ok) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.projects.detail(projectId),
      })
    },
  })
}
