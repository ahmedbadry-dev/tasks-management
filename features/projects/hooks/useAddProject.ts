'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addProjectAction } from '../actions/addProjectAction'
import { TAddProjectBody } from '../types'
import { queryKeys } from '@/lib/queryKeys'

export function useAddProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: TAddProjectBody) => {
      const result = await addProjectAction(body)
      if (!result.ok) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
    },
  })
}
