'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { updateTaskStatusAction } from '../actions/updateTaskStatusAction'

type UpdateTaskStatusInput = {
  taskId: string
  status: string
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ taskId, status }: UpdateTaskStatusInput) => {
      const result = await updateTaskStatusAction(taskId, status)
      if (!result.success) throw new Error(result.error)
      return result
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
    },
  })
}
