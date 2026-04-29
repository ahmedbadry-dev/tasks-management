import { RequestStatus } from '@/features/project-epic/types'
import { TTask } from '../types'
import { MobileEpicTaskRow } from './MobileEpicTaskRow'
import { EpicsTasksPlaceholder } from '@/features/project-epic/components/EpicsTasksPlaceholder'
import { Spinner } from '@/shared/components/Spinner'
import { useDesktopBreakpoint } from '@/hooks/paginated/useDesktopBreakpoint'
import { DesktopEpicTaskRow } from './DesktopEpicTaskRow'
import { AddCircleIcon } from '@/shared/components/icons'


type Props = {
    tasks: TTask[]
    status: RequestStatus
    error: string | null
    onRetry: () => void
    handleAddTask: () => void
}

export const EpicTasksList = ({ tasks, status, error, onRetry, handleAddTask }: Props) => {
    const isDesktop = useDesktopBreakpoint(768)
    if (status === 'loading') {
        return (
            <div className="flex h-14 justify-center items-center">
                <Spinner />
            </div>
        )
    }

    if (status === 'failed') {
        return (
            <div className="flex items-center justify-between rounded-lg border border-error/20 bg-error-container/60 p-3">
                <p className="type-body-md text-error">{error ?? 'Failed to load tasks'}</p>
                <button type="button" onClick={onRetry} className="btn btn-ghost px-2 py-1 text-primary">
                    Retry
                </button>
            </div>
        )
    }

    if (tasks.length === 0) {
        return (
            <EpicsTasksPlaceholder handleAddTask={handleAddTask} />
        )
    }

    return (
        <div className="flex flex-col gap-2">
            {
                isDesktop ? (
                    tasks.map((task) => (
                        <DesktopEpicTaskRow key={task.id} {...task} />
                    ))
                ) : (
                    <>
                        {tasks.map((task) => (
                            <MobileEpicTaskRow key={task.id} {...task} />
                        ))}
                        <button
                            onClick={handleAddTask}
                            className='flex justify-center items-center gap-3 py-5 mt-3 border-3 border-dashed border-slate-400/20  rounded-lg'>
                            <AddCircleIcon className=' text-slate-400' />
                            <span className='type-label-sm text-[12px]  text-slate-400'>add new task</span>
                        </button>
                    </>
                )
            }
        </div>
    )
}