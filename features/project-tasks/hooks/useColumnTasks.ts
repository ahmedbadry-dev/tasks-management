'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'
import { getColumnTasksAction } from '../actions/getColumnTasksAction'
import { TTask } from '../types'
import { RequestStatus } from '@/features/project-epic/types'
import type { FetchMode } from '@/hooks/paginated/types'

type UseColumnTasksOptions = {
  projectId: string
  status: string
  isVisible: boolean
}

type UseColumnInfiniteScrollOptions = {
  hasMore: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  scrollContainerRef: RefObject<HTMLDivElement | null>
}

type UseColumnTasksLoaderOptions = {
  projectId: string
  status: string
  isVisible: boolean
  onTasksLoaded: (
    status: string,
    tasks: TTask[],
    mode: FetchMode
  ) => void
}

export function useColumnTasks({
  projectId,
  status,
  isVisible,
}: UseColumnTasksOptions) {
  const [tasks, setTasks] = useState<TTask[]>([])
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)

  const requestIdRef = useRef(0)
  const hasFetchedRef = useRef(false)

  const fetchColumnTasks = useCallback(
    async (page: number, mode: FetchMode) => {
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId

      if (mode === 'replace') {
        setRequestStatus('loading')
        setError(null)
        setIsFetchingNextPage(false)
      } else {
        setIsFetchingNextPage(true)
      }

      const result = await getColumnTasksAction(projectId, status, page)

      if (requestIdRef.current !== requestId) return

      if (result.success) {
        setTasks((prevTasks) =>
          mode === 'replace'
            ? result.data.data
            : [...prevTasks, ...result.data.data]
        )
        setTotalCount(result.data.totalCount)
        setCurrentPage(page)
        setRequestStatus('succeeded')
        setError(null)
      } else {
        if (mode === 'replace') setRequestStatus('failed')
        setError(result.error)
      }
      setIsFetchingNextPage(false)
    },
    [projectId, status]
  )

  useEffect(() => {
    if (!isVisible || hasFetchedRef.current) return

    hasFetchedRef.current = true

    const timeoutId = window.setTimeout(() => {
      void fetchColumnTasks(1, 'replace')
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchColumnTasks, isVisible])

  const hasMore = totalCount !== null && tasks.length < totalCount

  const loadMore = useCallback(() => {
    if (
      !hasFetchedRef.current ||
      !hasMore ||
      isFetchingNextPage ||
      requestStatus === 'loading'
    ) {
      return
    }

    void fetchColumnTasks(currentPage + 1, 'append')
  }, [
    currentPage,
    fetchColumnTasks,
    hasMore,
    isFetchingNextPage,
    requestStatus,
  ])

  const retry = useCallback(() => {
    setTasks([])
    setCurrentPage(0)
    setTotalCount(null)
    setError(null)
    hasFetchedRef.current = true
    void fetchColumnTasks(1, 'replace')
  }, [fetchColumnTasks])

  const isInitialLoading = requestStatus === 'loading' && tasks.length === 0
  const hasInitialError = requestStatus === 'failed' && tasks.length === 0

  return {
    tasks,
    totalCount,
    currentPage,
    hasMore,
    requestStatus,
    error,
    isInitialLoading,
    isFetchingNextPage,
    hasInitialError,
    loadMore,
    retry,
  }
}

export function useColumnTasksLoader({
  projectId,
  status,
  isVisible,
  onTasksLoaded,
}: UseColumnTasksLoaderOptions) {
  const [requestStatus, setRequestStatus] = useState<RequestStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [loadedCount, setLoadedCount] = useState(0)
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false)

  const requestIdRef = useRef(0)
  const hasFetchedRef = useRef(false)

  const fetchColumnTasks = useCallback(
    async (page: number, mode: FetchMode) => {
      const requestId = requestIdRef.current + 1
      requestIdRef.current = requestId

      if (mode === 'replace') {
        setRequestStatus('loading')
        setError(null)
        setIsFetchingNextPage(false)
      } else {
        setIsFetchingNextPage(true)
      }

      const result = await getColumnTasksAction(projectId, status, page)

      if (requestIdRef.current !== requestId) return

      if (result.success) {
        onTasksLoaded(status, result.data.data, mode)
        setTotalCount(result.data.totalCount)
        setCurrentPage(page)
        setLoadedCount((prevCount) =>
          mode === 'replace'
            ? result.data.data.length
            : prevCount + result.data.data.length
        )
        setRequestStatus('succeeded')
        setError(null)
      } else {
        if (mode === 'replace') setRequestStatus('failed')
        setError(result.error)
      }

      setIsFetchingNextPage(false)
    },
    [onTasksLoaded, projectId, status]
  )

  useEffect(() => {
    if (!isVisible || hasFetchedRef.current) return

    hasFetchedRef.current = true

    const timeoutId = window.setTimeout(() => {
      void fetchColumnTasks(1, 'replace')
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchColumnTasks, isVisible])

  const hasMore = totalCount !== null && loadedCount < totalCount

  const loadMore = useCallback(() => {
    if (
      !hasFetchedRef.current ||
      !hasMore ||
      isFetchingNextPage ||
      requestStatus === 'loading'
    ) {
      return
    }

    void fetchColumnTasks(currentPage + 1, 'append')
  }, [
    currentPage,
    fetchColumnTasks,
    hasMore,
    isFetchingNextPage,
    requestStatus,
  ])

  const retry = useCallback(() => {
    setCurrentPage(0)
    setTotalCount(null)
    setLoadedCount(0)
    setError(null)
    hasFetchedRef.current = true
    void fetchColumnTasks(1, 'replace')
  }, [fetchColumnTasks])

  const isInitialLoading = requestStatus === 'loading' && loadedCount === 0
  const hasInitialError = requestStatus === 'failed' && loadedCount === 0

  return {
    isInitialLoading,
    isFetchingNextPage,
    hasInitialError,
    error,
    hasMore,
    loadMore,
    retry,
    totalCount,
  }
}

export function useColumnInfiniteScroll({
  hasMore,
  isFetchingNextPage,
  onLoadMore,
  scrollContainerRef,
}: UseColumnInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const triggeredRef = useRef(false)

  useEffect(() => {
    const sentinelNode = sentinelRef.current
    const scrollContainerNode = scrollContainerRef.current

    if (!sentinelNode || !scrollContainerNode || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (!entry.isIntersecting) {
          triggeredRef.current = false
          return
        }

        if (triggeredRef.current || !hasMore || isFetchingNextPage) return

        triggeredRef.current = true
        onLoadMore()
      },
      {
        root: scrollContainerNode,
        rootMargin: '80px 0px',
      }
    )

    observer.observe(sentinelNode)

    const sentinelRect = sentinelNode.getBoundingClientRect()
    const containerRect = scrollContainerNode.getBoundingClientRect()
    const isVisibleInContainer = sentinelRect.top <= containerRect.bottom + 80

    if (isVisibleInContainer && !isFetchingNextPage) {
      triggeredRef.current = true
      onLoadMore()
    }

    return () => observer.disconnect()
  }, [hasMore, isFetchingNextPage, onLoadMore, scrollContainerRef])

  return { sentinelRef }
}
