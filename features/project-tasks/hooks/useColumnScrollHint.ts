'use client'

import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

type UseColumnScrollHintOptions = {
  containerRef: RefObject<HTMLDivElement | null>
  tasksLength: number
  isInitialLoading: boolean
  isFetchingNextPage: boolean
  hasInitialError: boolean
  hasMore: boolean
}

export function useColumnScrollHint({
  containerRef,
  tasksLength,
  isInitialLoading,
  isFetchingNextPage,
  hasInitialError,
  hasMore,
}: UseColumnScrollHintOptions) {
  const [showBottomShadow, setShowBottomShadow] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateScrollHint = () => {
      const hasOverflow = container.scrollHeight > container.clientHeight + 1
      const isAtBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 2
      setShowBottomShadow(hasOverflow && !isAtBottom)
    }

    updateScrollHint()

    container.addEventListener('scroll', updateScrollHint, { passive: true })
    const resizeObserver = new ResizeObserver(updateScrollHint)
    resizeObserver.observe(container)

    return () => {
      container.removeEventListener('scroll', updateScrollHint)
      resizeObserver.disconnect()
    }
  }, [
    containerRef,
    tasksLength,
    isInitialLoading,
    isFetchingNextPage,
    hasInitialError,
    hasMore,
  ])

  return { showBottomShadow }
}
