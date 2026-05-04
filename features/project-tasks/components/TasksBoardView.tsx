'use client'

import { useEffect, useRef, useState } from 'react'
import { TASK_STATUS_OPTIONS } from '../constants'
import { TasksBoardColumn } from './TasksBoardColumn'

type Props = {
    projectId: string
}

export const TasksBoardView = ({ projectId }: Props) => {
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const columnRefs = useRef(new Map<string, HTMLDivElement>())
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set())

    useEffect(() => {
        const rootNode = scrollContainerRef.current
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
    }, [])

    return (
        <div
            ref={scrollContainerRef}
            className="flex h-full min-h-0 gap-4 overflow-x-auto overflow-y-hidden pb-4"
        >
            {TASK_STATUS_OPTIONS.map((status) => (
                <div
                    key={status.value}
                    data-status={status.value}
                    className="h-full"
                    ref={(node) => {
                        if (node) {
                            columnRefs.current.set(status.value, node)
                        } else {
                            columnRefs.current.delete(status.value)
                        }
                    }}
                >
                    <TasksBoardColumn
                        projectId={projectId}
                        status={status.value}
                        statusLabel={status.label}
                        isVisible={visibleColumns.has(status.value)}
                    />
                </div>
            ))}
        </div>
    )
}
