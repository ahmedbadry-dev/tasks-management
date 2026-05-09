'use client'

import { useCallback } from 'react'
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch'

import { TTask } from '../types'
import { TASKS_PAGE_SIZE } from '../constants'
import { getTasksListAction } from '../actions/getTasksListAction'

type Options = {
  projectId: string
  searchTerm?: string
}

export function useTasksListFetch({ projectId, searchTerm = '' }: Options) {
  const fetchFn = useCallback(
    async (page: number, signal: AbortSignal) => {
      const result = await getTasksListAction(projectId, page, searchTerm)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    [projectId, searchTerm]
  )

  return usePaginatedFetch<TTask>({ fetchFn, limit: TASKS_PAGE_SIZE })
}
