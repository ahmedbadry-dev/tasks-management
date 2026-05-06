'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

type UseVisibleBoardColumnsOptions = {
  rootRef: RefObject<HTMLDivElement | null>
}

type UseVisibleBoardColumnsResult = {
  visibleColumns: Set<string>
  setColumnNode: (status: string, node: HTMLDivElement | null) => void
}

export function useVisibleBoardColumns({
  rootRef,
}: UseVisibleBoardColumnsOptions): UseVisibleBoardColumnsResult {
  const columnRefs = useRef(new Map<string, HTMLDivElement>())
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set())

  const setColumnNode = useCallback((status: string, node: HTMLDivElement | null) => {
    if (node) {
      columnRefs.current.set(status, node)
      return
    }

    columnRefs.current.delete(status)
  }, [])

  useEffect(() => {
    const rootNode = rootRef.current
    if (!rootNode) return

    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleColumns((previousVisibleColumns) => {
          let nextVisibleColumns = previousVisibleColumns
          let hasChanges = false

          entries.forEach((entry) => {
            if (!entry.isIntersecting) return

            const status = (entry.target as HTMLDivElement).dataset.status
            if (!status || previousVisibleColumns.has(status)) return

            if (!hasChanges) {
              nextVisibleColumns = new Set(previousVisibleColumns)
              hasChanges = true
            }

            nextVisibleColumns.add(status)
          })

          return hasChanges ? nextVisibleColumns : previousVisibleColumns
        })
      },
      {
        root: rootNode,
        rootMargin: '0px 100px',
      }
    )

    columnRefs.current.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [rootRef])

  return {
    visibleColumns,
    setColumnNode,
  }
}
