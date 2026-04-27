'use client'

import { useEffect, useRef } from 'react'

type UseInfiniteScrollSentinelOptions = {
  enabled: boolean
  canLoadMore: boolean
  onLoadMore: () => void
  rootMargin?: string
  threshold?: number
}

export function useInfiniteScrollSentinel({
  enabled,
  canLoadMore,
  onLoadMore,
  rootMargin = '200px 0px',
  threshold = 0,
}: UseInfiniteScrollSentinelOptions) {
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const triggeredRef = useRef(false)

  useEffect(() => {
    if (!enabled) {
      triggeredRef.current = false
      return
    }

    const node = loaderRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]

        if (!entry.isIntersecting) {
          triggeredRef.current = false
          return
        }

        if (triggeredRef.current || !canLoadMore) return

        triggeredRef.current = true
        onLoadMore()
      },
      { rootMargin, threshold }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [enabled, canLoadMore, onLoadMore, rootMargin, threshold])

  return loaderRef
}
