'use client'

import { useCallback, useEffect } from 'react'
import { useDesktopBreakpoint } from './paginated/useDesktopBreakpoint'
import { useInfiniteScrollSentinel } from './paginated/useInfiniteScrollSentinel'
import { usePaginatedResource } from './paginated/usePaginatedResource'
import { PaginatedFetchFn, PaginatedFetchStatus } from './paginated/types'

type UsePaginatedFetchOptions<T> = {
  fetchFn: PaginatedFetchFn<T>
  limit: number
  desktopBreakpoint?: number
}

type UsePaginatedFetchReturn<T> = {
  items: T[]
  status: PaginatedFetchStatus
  error: string | null
  currentPage: number
  totalCount: number
  totalPages: number
  hasNextPage: boolean
  isFetchingPage: boolean
  isInitialLoading: boolean
  isDesktop: boolean | null
  loaderRef: React.RefObject<HTMLDivElement | null>
  goToPage: (page: number) => void
  retry: () => void
}

export function usePaginatedFetch<T>({
  fetchFn,
  limit,
  desktopBreakpoint = 768,
}: UsePaginatedFetchOptions<T>): UsePaginatedFetchReturn<T> {
  const isDesktop = useDesktopBreakpoint(desktopBreakpoint)

  const {
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
  } = usePaginatedResource<T>({ fetchFn, limit })

  useEffect(() => {
    if (isDesktop === null) return
    fetchPage(1, 'replace')
  }, [isDesktop, fetchPage])

  const onLoadMore = useCallback(() => {
    fetchPage(currentPage + 1, 'append')
  }, [fetchPage, currentPage])

  const loaderRef = useInfiniteScrollSentinel({
    enabled: isDesktop === false,
    canLoadMore: hasNextPage && !isFetchingPage && status !== 'loading',
    onLoadMore,
  })

  const goToPage = useCallback(
    (page: number) => {
      fetchPage(page, 'replace')
    },
    [fetchPage]
  )

  const retry = useCallback(() => {
    fetchPage(currentPage, 'replace')
  }, [fetchPage, currentPage])

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
    isDesktop,
    loaderRef,
    goToPage,
    retry,
  }
}
