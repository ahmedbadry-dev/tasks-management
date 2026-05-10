'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { addProjectEpicAction } from '../actions/addProjectEpicAction'
import { TProjectEpicBody } from '../types'

export function useAddEpic(projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: TProjectEpicBody) => {
      const result = await addProjectEpicAction(body)
      if (!result.ok) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.epics.all })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.epics.allForProject(projectId),
      })
    },
  })
}
