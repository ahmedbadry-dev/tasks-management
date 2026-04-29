'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getEpicTasksAction } from '../actions/getEpicTasksAction'
import { TTask } from '../types'
import { RequestStatus } from '@/features/project-epic/types'

type UseEpicTasksOptions = {
  isOpen: boolean
  epicId: string | null
}

export function useEpicTasks({ isOpen, epicId }: UseEpicTasksOptions) {
  const [tasks, setTasks] = useState<TTask[]>([])
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  const loadEpicTasks = useCallback(async () => {
    if (!isOpen || !epicId) return

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    setStatus('loading')
    setError(null)

    const result = await getEpicTasksAction(epicId)

    if (requestIdRef.current !== requestId) return

    if (result.success) {
      setTasks(result.data)
      setStatus('succeeded')
    } else {
      setStatus('failed')
      setError(result.error)
    }
  }, [isOpen, epicId])

  useEffect(() => {
    if (!isOpen || !epicId) return
    loadEpicTasks()
  }, [isOpen, epicId, loadEpicTasks])

  const retry = useCallback(() => {
    loadEpicTasks()
  }, [loadEpicTasks])

  const isInitialLoading = status === 'loading' && tasks.length === 0
  const hasInitialError = status === 'failed' && tasks.length === 0

  return {
    tasks,
    status,
    error,
    isInitialLoading,
    hasInitialError,
    retry,
  }
}
