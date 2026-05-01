'use client'

import { useEffect, useId } from 'react'
import { useTaskDetails } from '../hooks/useTaskDetails'
import { TaskDetailsModalSkeleton } from './TaskDetailsModalSkeleton'
import { TaskDetailsModalContent } from './TaskDetailsModalContent'


type Props = {
    isOpen: boolean
    taskId: string | null
    projectId: string | null
    onClose: () => void
}

export const TaskDetailsModal = ({ isOpen, taskId, projectId, onClose }: Props) => {
    const dialogTitleId = useId()
    const { task, isInitialLoading, hasInitialError, error, retry } = useTaskDetails({
        isOpen,
        taskId,
        projectId,
    })

    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-90 flex items-end justify-center bg-slate-900/40 md:items-center md:p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
        >
            <div
                className="modal-scroll-hidden max-h-[88vh] w-full overflow-hidden rounded-t-2xl bg-white shadow-xl md:h-[85vh] md:max-w-3xl md:rounded-2xl"
                onClick={(e) => e.stopPropagation()}
                role="document"
            >
                <div className="flex h-full min-h-0 flex-col">
                    {isInitialLoading && <TaskDetailsModalSkeleton className="flex-1" />}

                    {hasInitialError && (
                        <div className="flex flex-1 items-center justify-center p-5">
                            <div className="w-full max-w-md rounded-lg border border-error/20 bg-error-container/60 p-4">
                                <p className="type-body-md mb-3 text-error">
                                    {error ?? 'Failed to load task details'}
                                </p>
                                <button onClick={retry} className="btn btn-primary px-4 py-2">
                                    Retry
                                </button>
                            </div>
                        </div>
                    )}

                    {!isInitialLoading && !hasInitialError && !task && (
                        <div className="flex flex-1 items-center justify-center p-5">
                            <p className="type-body-md text-center text-slate-400">Task not found</p>
                        </div>
                    )}

                    {!isInitialLoading && !hasInitialError && task && (
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <TaskDetailsModalContent task={task} onClose={onClose} />
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
