'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { updateTaskAction } from '../actions/updateTaskAction'
import { TTask, TUpdateTaskPatch } from '../types'
import { toast } from 'sonner'

type UpdateTaskInput = {
  patch: TUpdateTaskPatch
  nextTask: TTask
}

export function useUpdateTask(taskId: string, projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ patch }: UpdateTaskInput) => {
      const result = await updateTaskAction(taskId, patch)
      if (!result.ok) throw new Error(result.error)
      return result
    },
    onMutate: async ({ nextTask }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.tasks.detail(taskId, projectId),
      })

      const previousTask = queryClient.getQueryData<TTask>(
        queryKeys.tasks.detail(taskId, projectId)
      )

      queryClient.setQueryData(queryKeys.tasks.detail(taskId, projectId), nextTask)

      return { previousTask }
    },
    onError: (error, _input, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(
          queryKeys.tasks.detail(taskId, projectId),
          context.previousTask
        )
      }
      toast.error(error instanceof Error ? error.message : 'Failed to update task.')
    },
    onSuccess: () => {
      toast.success('Task updated successfully!')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.detail(taskId, projectId),
      })
    },
  })
}
