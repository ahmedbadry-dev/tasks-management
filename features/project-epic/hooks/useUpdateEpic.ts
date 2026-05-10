'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/lib/queryKeys'
import { updateProjectEpicAction } from '../actions/updateProjectEpicAction'
import { TEpic, TEpicDetails, TUpdateProjectEpicPatch } from '../types'

type UpdateEpicInput = {
  patch: TUpdateProjectEpicPatch
  optimisticEpic?: Partial<TEpicDetails>
}

export function useUpdateEpic(epicId: string, projectId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ patch }: UpdateEpicInput) => {
      const result = await updateProjectEpicAction(epicId, patch)
      if (!result.ok) throw new Error(result.error)
      return result
    },
    onMutate: async ({ optimisticEpic, patch }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.epics.detail(epicId, projectId),
      })

      const previousDetail = queryClient.getQueryData<TEpicDetails>(
        queryKeys.epics.detail(epicId, projectId)
      )

      if (optimisticEpic || patch) {
        queryClient.setQueryData(
          queryKeys.epics.detail(epicId, projectId),
          (old: TEpicDetails | undefined) =>
            old ? { ...old, ...(optimisticEpic ?? patch) } : old
        )
      }

      const listCaches = queryClient.getQueriesData<{ data: TEpic[] }>({
        queryKey: queryKeys.epics.all,
      })
      const previousLists = listCaches.map(([key, data]) => [key, data] as const)

      if (optimisticEpic || patch) {
        for (const [key] of listCaches) {
          queryClient.setQueryData(key, (oldValue: unknown) => {
            const optimisticData = optimisticEpic ?? patch
            if (!optimisticData || !oldValue) return oldValue

            if (
              typeof oldValue === 'object' &&
              oldValue !== null &&
              'data' in oldValue &&
              Array.isArray((oldValue as { data?: unknown }).data)
            ) {
              const typed = oldValue as { data: TEpic[]; totalCount?: number }
              return {
                ...typed,
                data: typed.data.map((epic) =>
                  epic.id === epicId ? { ...epic, ...optimisticData } : epic
                ),
              }
            }

            if (Array.isArray(oldValue)) {
              return (oldValue as TEpic[]).map((epic) =>
                epic.id === epicId ? { ...epic, ...optimisticData } : epic
              )
            }

            return oldValue
          })
        }
      }

      return { previousDetail, previousLists }
    },
    onError: (error, _input, context) => {
      if (context?.previousDetail) {
        queryClient.setQueryData(
          queryKeys.epics.detail(epicId, projectId),
          context.previousDetail
        )
      }

      if (context?.previousLists) {
        for (const [key, data] of context.previousLists) {
          queryClient.setQueryData(key, data)
        }
      }

      toast.error(error instanceof Error ? error.message : 'Failed to update epic.')
    },
    onSuccess: () => {
      toast.success('Epic updated successfully!')
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.epics.all })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.epics.detail(epicId, projectId),
      })
    },
  })
}
