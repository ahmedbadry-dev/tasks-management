'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getColumnTasksAction } from '../actions/getColumnTasksAction'
import { TTask } from '../types'
import { RequestStatus } from '@/features/project-epic/types'

type UseColumnTasksOptions = {
  projectId: string
  status: string
}

export function useColumnTasks({ projectId, status }: UseColumnTasksOptions) {
  const [tasks, setTasks] = useState<TTask[]>([])
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  const loadTasks = useCallback(async () => {
    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    setRequestStatus('loading')
    setError(null)

    const result = await getColumnTasksAction(projectId, status)

    if (requestIdRef.current !== requestId) return

    if (result.success) {
      setTasks(result.data)
      setRequestStatus('succeeded')
    } else {
      setRequestStatus('failed')
      setError(result.error)
    }
  }, [projectId, status])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const retry = useCallback(() => {
    loadTasks()
  }, [loadTasks])

  const isInitialLoading = requestStatus === 'loading' && tasks.length === 0
  const hasInitialError = requestStatus === 'failed' && tasks.length === 0

  return {
    tasks,
    requestStatus,
    error,
    isInitialLoading,
    hasInitialError,
    retry,
  }
}
