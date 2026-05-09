import { PlusIcon } from '@/shared/components/icons'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { useColumnInfiniteScroll, useColumnTasksLoader } from '../hooks/useColumnTasks'
import { TasksBoardCard } from './TasksBoardCard'
import { cn } from '@/utils/cn'
import { useRef } from 'react'
import { Spinner } from '@/shared/components/Spinner'
import { TTask } from '../types'
import { useDroppable } from '@dnd-kit/core'
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useColumnScrollHint } from '../hooks/useColumnScrollHint'

const STATUS_DOT_STYLES: Record<string, string> = {
    TO_DO: 'bg-slate-600',
    IN_PROGRESS: 'bg-blue-600',
    BLOCKED: 'bg-red-600',
    IN_REVIEW: 'bg-yellow-600',
    READY_FOR_QA: 'bg-purple-600',
    REOPENED: 'bg-orange-600',
    READY_FOR_PRODUCTION: 'bg-green-600',
    DONE: 'bg-emerald-600',
}

type Props = {
    projectId: string
    status: string
    statusLabel: string
    isVisible: boolean
    refreshVersion: number
    searchTerm?: string
    tasks: TTask[]
    onTasksLoaded: (
        status: string,
        tasks: TTask[],
        mode: 'replace' | 'append'
    ) => void
}

export const TasksBoardColumn = ({
    projectId,
    status,
    statusLabel,
    isVisible,
    refreshVersion,
    searchTerm = '',
    tasks,
    onTasksLoaded,
}: Props) => {
    const router = useRouter()
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const { setNodeRef: setDroppableNodeRef, isOver } = useDroppable({ id: status })
    const {
        totalCount,
        hasMore,
        isInitialLoading,
        isFetchingNextPage,
        hasInitialError,
        error,
        retry,
        loadMore,
    } = useColumnTasksLoader({
        projectId,
        status,
        isVisible,
        refreshVersion,
        searchTerm,
        onTasksLoaded,
    })
    const { sentinelRef } = useColumnInfiniteScroll({
        hasMore,
        isFetchingNextPage,
        onLoadMore: loadMore,
        scrollContainerRef,
    })
    const { showBottomShadow } = useColumnScrollHint({
        containerRef: scrollContainerRef,
        tasksLength: tasks.length,
        isInitialLoading,
        isFetchingNextPage,
        hasInitialError,
        hasMore,
    })

    const isSearching = searchTerm.length > 0
    const hasPaginationError = Boolean(error) && !hasInitialError && tasks.length > 0

    const handleAddTask = () => {
        router.push(routes.project.newTask(projectId, { status }))
    }

    return (
        <div className="flex h-full w-72 shrink-0 flex-col gap-3 overflow-hidden rounded-lg bg-surface-low p-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${STATUS_DOT_STYLES[status] ?? 'bg-slate-600'}`} />
                    <span className="type-label-sm font-semibold uppercase text-slate-400">
                        {statusLabel}
                    </span>
                    <span className={cn("type-label-sm rounded-md bg-surface-highest px-2 py-0.5 text-slate-400",
                        status === 'BLOCKED' && 'bg-error-container'
                    )}>
                        {totalCount ?? tasks.length}
                    </span>
                </div>
                <button
                    onClick={handleAddTask}
                    className="btn btn-ghost p-1 text-slate-400 hover:text-primary cursor-pointer"
                    aria-label={`Add task to ${statusLabel}`}
                >
                    <PlusIcon size={16} />
                </button>
            </div>

            {/* Add New Task Button */}
            <button
                onClick={handleAddTask}
                className="flex w-full items-center gap-2 rounded-lg border-2 border-dashed border-surface-highest p-2 text-slate-400 hover:border-primary hover:text-primary cursor-pointer"
            >
                <PlusIcon size={14} />
                <span className="type-label-sm">ADD NEW TASK</span>
            </button>

            {/* Content */}
            <div className="relative min-h-0 flex-1">
                <div
                    ref={(node) => {
                        scrollContainerRef.current = node
                        setDroppableNodeRef(node)
                    }}
                    className={cn(
                        "flex h-full min-h-0 flex-col gap-2 overflow-y-auto pr-1 [scrollbar-width:thin] [scrollbar-color:rgba(148,163,184,0.55)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-400/55 hover:[&::-webkit-scrollbar-thumb]:bg-slate-500/70",
                        isOver && tasks.length === 0 && 'ring-2 ring-primary ring-dashed'
                    )}
                >
                    {isInitialLoading ? (
                        <>
                            {[1, 2].map((i) => (
                                <div key={i} className="h-24 animate-pulse rounded-lg bg-surface-highest" />
                            ))}
                        </>
                    ) : hasInitialError ? (
                        <div className="flex flex-col items-center gap-2 p-3 text-center">
                            <p className="type-label-sm text-error">
                                {isSearching ? 'Failed to search tasks' : 'Failed to load tasks'}
                            </p>
                            <button onClick={retry} className="btn btn-ghost px-2 py-1 text-xs text-primary">
                                Retry
                            </button>
                        </div>
                    ) : tasks.length === 0 ? (
                        <p className="type-label-sm p-3 text-center text-slate-400">
                            {isSearching ? 'No tasks found matching your search' : 'No tasks'}
                        </p>
                    ) : (
                        <SortableContext
                            items={tasks.map((task) => task.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            {tasks.map((task) => (
                                <TasksBoardCard key={task.id} {...task} />
                            ))}
                        </SortableContext>
                    )}
                    {hasMore ? <div ref={sentinelRef} className="h-1 w-full" /> : null}
                    {isFetchingNextPage ? (
                        <div className="flex justify-center py-2">
                            <Spinner size="sm" label={`Loading more ${statusLabel} tasks`} />
                        </div>
                    ) : null}
                    {hasPaginationError ? (
                        <div className="flex flex-col items-center gap-2 py-2 text-center">
                            <p className="type-label-sm text-error">
                                {isSearching ? 'Failed to search tasks' : 'Failed to load more tasks'}
                            </p>
                            <button onClick={retry} className="btn btn-ghost px-2 py-1 text-xs text-primary">
                                Retry
                            </button>
                        </div>
                    ) : null}
                </div>
                {showBottomShadow ? (
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-linear-to-t from-surface-low to-transparent" />
                ) : null}
            </div>
        </div>
    )
}
