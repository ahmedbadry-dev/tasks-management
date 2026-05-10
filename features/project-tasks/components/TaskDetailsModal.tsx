'use client'

import { useCallback, useEffect, useId, useState } from 'react'
import { useTaskDetailsQuery } from '../hooks/useTaskDetailsQuery'
import { TaskDetailsModalSkeleton } from './TaskDetailsModalSkeleton'
import { TaskDetailsModalContent } from './TaskDetailsModalContent'
import { TTask, TUpdateTaskPatch } from '../types'
import { RequestStatus } from '@/features/project-epic/types'
import { useProjectMembers } from '@/features/project-members/hooks/useProjectMembers'
import { useAllProjectEpics } from '@/features/project-epic/hooks/useAllProjectEpics'
import { useUpdateTask } from '../hooks/useUpdateTask'


type Props = {
    isOpen: boolean
    taskId: string | null
    projectId: string | null
    onClose: () => void
}

export const TaskDetailsModal = ({ isOpen, taskId, projectId, onClose }: Props) => {
    const dialogTitleId = useId()
    const [shouldLoadMembers, setShouldLoadMembers] = useState(false)
    const [shouldLoadEpics, setShouldLoadEpics] = useState(false)

    const taskDetailsQuery = useTaskDetailsQuery(taskId, projectId, isOpen)
    const updateTaskMutation = useUpdateTask(taskId ?? '', projectId ?? '')
    const membersQuery = useProjectMembers(
        projectId,
        isOpen && shouldLoadMembers && Boolean(projectId)
    )
    const epicsQuery = useAllProjectEpics(
        projectId,
        isOpen && shouldLoadEpics && Boolean(projectId)
    )

    useEffect(() => {
        if (!isOpen) {
            setShouldLoadMembers(false)
            setShouldLoadEpics(false)
        }
    }, [isOpen])

    const loadMembers = useCallback(() => {
        if (!shouldLoadMembers) {
            setShouldLoadMembers(true)
            return
        }

        void membersQuery.refetch()
    }, [membersQuery, shouldLoadMembers])

    const loadEpics = useCallback(() => {
        if (!shouldLoadEpics) {
            setShouldLoadEpics(true)
            return
        }

        void epicsQuery.refetch()
    }, [epicsQuery, shouldLoadEpics])

    const savePatch = useCallback(
        async (patch: TUpdateTaskPatch, nextTask: TTask) => {
            if (!taskId || !projectId) {
                return false
            }

            try {
                await updateTaskMutation.mutateAsync({ patch, nextTask })
                return true
            } catch {
                return false
            }
        },
        [projectId, taskId, updateTaskMutation]
    )

    const handleClose = useCallback(() => {
        onClose()
    }, [onClose])

    useEffect(() => {
        if (!isOpen) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose()
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [handleClose, isOpen])

    if (!isOpen) return null

    const task = taskDetailsQuery.data ?? null
    const isInitialLoading = taskDetailsQuery.isLoading
    const hasInitialError = taskDetailsQuery.isError
    const error = taskDetailsQuery.error?.message ?? null
    const retry = () => taskDetailsQuery.refetch()

    const members = membersQuery.data ?? []
    const membersStatus: RequestStatus = membersQuery.isError
        ? 'failed'
        : membersQuery.isLoading
            ? 'loading'
            : membersQuery.isSuccess
                ? 'succeeded'
                : 'idle'
    const membersError = membersQuery.error?.message ?? null

    const epics = epicsQuery.data ?? []
    const epicsStatus: RequestStatus = epicsQuery.isError
        ? 'failed'
        : epicsQuery.isLoading
            ? 'loading'
            : epicsQuery.isSuccess
                ? 'succeeded'
                : 'idle'
    const epicsError = epicsQuery.error?.message ?? null

    return (
        <div
            className="fixed inset-0 z-90 flex items-end justify-center bg-slate-900/40 md:items-center md:p-4"
            onClick={handleClose}
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
                            <TaskDetailsModalContent
                                task={task}
                                onClose={handleClose}
                                members={members}
                                membersStatus={membersStatus}
                                membersError={membersError}
                                onLoadMembers={loadMembers}
                                epics={epics}
                                epicsStatus={epicsStatus}
                                epicsError={epicsError}
                                onLoadEpics={loadEpics}
                                onSavePatch={savePatch}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}
