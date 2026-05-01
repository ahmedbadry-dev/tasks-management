'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { projectEpicsService } from '../services/projectEpicsService'
import { RequestStatus, TEpicDetails } from '../types'

type UseEpicDetailsOptions = {
  isOpen: boolean
  epicId: string | null
  projectId: string | null
  accessToken: string
}

export function useEpicDetails({
  isOpen,
  epicId,
  projectId,
  accessToken,
}: UseEpicDetailsOptions) {
  const [epicDetails, setEpicDetails] = useState<TEpicDetails | null>(null)
  const [status, setStatus] = useState<RequestStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const requestIdRef = useRef(0)
  const activeControllerRef = useRef<AbortController | null>(null)

  const cancelActiveRequest = useCallback(() => {
    activeControllerRef.current?.abort()
  }, [])

  const loadEpicDetails = useCallback(
    async () => {
      if (!isOpen || !epicId || !projectId) return

      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId

      // Cancel the previous in-flight request before starting a new one.
      cancelActiveRequest()
      const controller = new AbortController()
      activeControllerRef.current = controller

      setStatus('loading')
      setError(null)

      try {
        const data = await projectEpicsService.getEpicDetails(
          accessToken,
          epicId,
          projectId,
          controller.signal
        )

        // Ignore stale responses from old requests.
        if (requestIdRef.current !== requestId) return

        setEpicDetails(data)
        setStatus('succeeded')
      } catch (err) {
        if (requestIdRef.current !== requestId) return
        if (controller.signal.aborted) return
        if (err instanceof DOMException && err.name === 'AbortError') return

        setStatus('failed')
        setError(err instanceof Error ? err.message : 'Failed to load epic details.')
      } finally {
        // Clear the active controller reference when this request is the latest one.
        if (requestIdRef.current === requestId) {
          activeControllerRef.current = null
        }
      }
    },
    [isOpen, epicId, projectId, cancelActiveRequest, accessToken]
  )

  useEffect(() => {
    if (!isOpen || !epicId || !projectId) return
    loadEpicDetails()
  }, [isOpen, epicId, projectId, loadEpicDetails])

  useEffect(() => {
    // Abort the request when modal closes or component unmounts.
    return () => cancelActiveRequest()
  }, [cancelActiveRequest])

  const retry = useCallback(() => {
    loadEpicDetails()
  }, [loadEpicDetails])

  const isInitialLoading = status === 'loading' && !epicDetails
  const hasInitialError = status === 'failed' && !epicDetails
  const isRefreshing = status === 'loading' && Boolean(epicDetails)

  return {
    epicDetails,
    status,
    error,
    isInitialLoading,
    hasInitialError,
    isRefreshing,
    retry,
  }
}
