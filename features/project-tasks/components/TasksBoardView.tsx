'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import { TASK_STATUS_OPTIONS } from '../constants'
import { TasksBoardColumn } from './TasksBoardColumn'
import { TTask } from '../types'
import {
    closestCorners,
    DndContext,
    DragOverlay,
} from '@dnd-kit/core'
import { TasksBoardCard } from './TasksBoardCard'
import { useBoardDnd } from '../hooks/useBoardDnd'
import { useVisibleBoardColumns } from '../hooks/useVisibleBoardColumns'

type Props = {
    projectId: string
}

export const TasksBoardView = ({ projectId }: Props) => {
    const statusIds = useMemo(
        () => TASK_STATUS_OPTIONS.map((status) => status.value),
        []
    )
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const [columnTasksMap, setColumnTasksMap] = useState<Record<string, TTask[]>>(
        () =>
            Object.fromEntries(
                TASK_STATUS_OPTIONS.map((status) => [status.value, [] as TTask[]])
            )
    )
    const { visibleColumns, setColumnNode } = useVisibleBoardColumns({
        rootRef: scrollContainerRef,
    })
    const {
        activeTask,
        sensors,
        handleDragStart,
        handleDragEnd,
        handleDragCancel,
    } = useBoardDnd({
        columnTasksMap,
        setColumnTasksMap,
        statusIds,
    })

    const handleTasksLoaded = useCallback(
        (status: string, newTasks: TTask[], mode: 'replace' | 'append') => {
            setColumnTasksMap((prevMap) => {
                if (mode === 'replace') {
                    return {
                        ...prevMap,
                        [status]: newTasks,
                    }
                }

                const existingTasks = prevMap[status] ?? []
                const existingIds = new Set(existingTasks.map((task) => task.id))
                const uniqueNewTasks = newTasks.filter(
                    (task) => !existingIds.has(task.id)
                )

                return {
                    ...prevMap,
                    [status]: [...existingTasks, ...uniqueNewTasks],
                }
            })
        },
        []
    )

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <div
                ref={scrollContainerRef}
                className="flex h-full min-h-0 gap-4 overflow-x-auto overflow-y-hidden pb-4"
            >
                {TASK_STATUS_OPTIONS.map((status) => (
                    <div
                        key={status.value}
                        data-status={status.value}
                        className="h-full"
                        ref={(node) => setColumnNode(status.value, node)}
                    >
                        <TasksBoardColumn
                            projectId={projectId}
                            status={status.value}
                            statusLabel={status.label}
                            isVisible={visibleColumns.has(status.value)}
                            tasks={columnTasksMap[status.value] ?? []}
                            onTasksLoaded={handleTasksLoaded}
                        />
                    </div>
                ))}
            </div>
            <DragOverlay dropAnimation={null}>
                {activeTask ? (
                    <TasksBoardCard
                        {...activeTask}
                        id={`overlay-${activeTask.id}`}
                        isDragOverlay
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    )
}
