'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  FetchMode,
  PaginatedFetchFn,
  PaginatedFetchStatus,
} from './types'

type UsePaginatedResourceOptions<T> = {
  fetchFn: PaginatedFetchFn<T>
  limit: number
}

export function usePaginatedResource<T>({
  fetchFn,
  limit,
}: UsePaginatedResourceOptions<T>) {
  const [items, setItems] = useState<T[]>([])
  const [status, setStatus] = useState<PaginatedFetchStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [isFetchingPage, setIsFetchingPage] = useState(false)

  const activeRequestIdRef = useRef(0)
  const activeControllerRef = useRef<AbortController | null>(null)
  const itemsRef = useRef<T[]>([])

  itemsRef.current = items

  const totalPages = Math.ceil(totalCount / limit)
  const isInitialLoading = status === 'loading' && items.length === 0

  const fetchPage = useCallback(
    async (page: number, mode: FetchMode) => {
      const requestId = activeRequestIdRef.current + 1
      activeRequestIdRef.current = requestId

      activeControllerRef.current?.abort()
      const controller = new AbortController()
      activeControllerRef.current = controller

      if (mode === 'replace') {
        setStatus('loading')
        setIsFetchingPage(itemsRef.current.length > 0)
      } else {
        setIsFetchingPage(true)
      }

      setError(null)

      try {
        const { data, totalCount: total } = await fetchFn(page, controller.signal)

        if (activeRequestIdRef.current !== requestId) return

        setItems((prev) => (mode === 'append' ? [...prev, ...data] : data))
        setCurrentPage(page)
        setTotalCount(total)
        setHasNextPage(page * limit < total)
        setStatus('succeeded')
      } catch (err) {
        if (activeRequestIdRef.current !== requestId) return
        if (controller.signal.aborted) return
        if (err instanceof DOMException && err.name === 'AbortError') return

        setStatus('failed')
        setError(err instanceof Error ? err.message : 'Something went wrong')
      } finally {
        if (activeRequestIdRef.current === requestId) {
          setIsFetchingPage(false)
        }
      }
    },
    [fetchFn, limit]
  )

  useEffect(() => {
    return () => {
      activeControllerRef.current?.abort()
    }
  }, [])

  return {
    items,
    status,
    error,
    currentPage,
    totalCount,
    totalPages,
    hasNextPage,
    isFetchingPage,
    isInitialLoading,
    fetchPage,
  }
}
