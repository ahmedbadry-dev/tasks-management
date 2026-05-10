'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { addNewTaskAction } from '../actions/addNewTaskAction'
import { TAddTaskBody } from '../types'

export function useAddTask() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: TAddTaskBody) => {
      const result = await addNewTaskAction(body)
      if (!result.ok) throw new Error(result.error)
      return result
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
    },
  })
}
