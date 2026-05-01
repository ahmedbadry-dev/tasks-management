import { PlusIcon } from '@/shared/components/icons'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { useColumnTasks } from '../hooks/useColumnTasks'
import { TasksBoardCard } from './TasksBoardCard'
import { cn } from '@/utils/cn'

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
}

export const TasksBoardColumn = ({ projectId, status, statusLabel }: Props) => {
    const router = useRouter()
    const { tasks, isInitialLoading, hasInitialError, retry } = useColumnTasks({ projectId, status })

    const handleAddTask = () => {
        router.push(routes.project.newTask(projectId, { status }))
    }

    return (
        <div className="flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-surface-low p-3">
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
                        {tasks.length}
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
            <div className="flex flex-col gap-2">
                {isInitialLoading ? (
                    <>
                        {[1, 2].map((i) => (
                            <div key={i} className="h-24 animate-pulse rounded-lg bg-surface-highest" />
                        ))}
                    </>
                ) : hasInitialError ? (
                    <div className="flex flex-col items-center gap-2 p-3 text-center">
                        <p className="type-label-sm text-error">Failed to load tasks</p>
                        <button onClick={retry} className="btn btn-ghost px-2 py-1 text-xs text-primary">
                            Retry
                        </button>
                    </div>
                ) : tasks.length === 0 ? (
                    <p className="type-label-sm p-3 text-center text-slate-400">No tasks</p>
                ) : (
                    tasks.map((task) => <TasksBoardCard key={task.id} {...task} />)
                )}
            </div>
        </div>
    )
}
