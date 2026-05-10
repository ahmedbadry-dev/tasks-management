'use client'

import { useEffect, useRef, type RefObject } from 'react'

type UseColumnInfiniteScrollOptions = {
  hasMore: boolean
  isFetchingNextPage: boolean
  onLoadMore: () => void
  scrollContainerRef: RefObject<HTMLDivElement | null>
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
