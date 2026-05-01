'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getTaskDetailsAction } from '../actions/getTaskDetailsAction'
import { TTask } from '../types'
import { RequestStatus } from '@/features/project-epic/types'

type Options = {
  isOpen: boolean
  taskId: string | null
  projectId: string | null
}

export function useTaskDetails({ isOpen, taskId, projectId }: Options) {
  const [task, setTask] = useState<TTask | null>(null)
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  const loadTask = useCallback(async () => {
    if (!isOpen || !taskId || !projectId) return

    const requestId = requestIdRef.current + 1
    requestIdRef.current = requestId

    setStatus('loading')
    setError(null)

    const result = await getTaskDetailsAction(taskId, projectId)

    if (requestIdRef.current !== requestId) return

    if (result.success) {
      setTask(result.data)
      setStatus('succeeded')
    } else {
      setStatus('failed')
      setError(result.error)
    }
  }, [isOpen, taskId, projectId])

  useEffect(() => {
    if (!isOpen || !taskId || !projectId) return
    loadTask()
  }, [isOpen, taskId, projectId, loadTask])

  const retry = useCallback(() => loadTask(), [loadTask])

  const isInitialLoading = status === 'loading' && !task
  const hasInitialError = status === 'failed' && !task

  return { task, status, error, isInitialLoading, hasInitialError, retry }
}
