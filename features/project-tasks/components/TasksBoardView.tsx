'use client'

import { useCallback, useRef } from 'react'
import type { WheelEvent as ReactWheelEvent } from 'react'
import { TASK_STATUS_OPTIONS } from '../constants'
import { TasksBoardColumn } from './TasksBoardColumn'

type Props = {
    projectId: string
}

export const TasksBoardView = ({ projectId }: Props) => {
    const containerRef = useRef<HTMLDivElement | null>(null)

    const handleWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
        const container = containerRef.current
        if (!container) return

        const hasHorizontalOverflow = container.scrollWidth > container.clientWidth
        if (!hasHorizontalOverflow) return

        if (event.deltaY === 0) return
        event.preventDefault()
        container.scrollLeft += event.deltaY
    }, [])

    return (
        <div
            ref={containerRef}
            onWheel={handleWheel}
            className="flex h-full gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
            {TASK_STATUS_OPTIONS.map((status) => (
                <TasksBoardColumn
                    key={status.value}
                    projectId={projectId}
                    status={status.value}
                    statusLabel={status.label}
                />
            ))}
        </div>
    )
}
