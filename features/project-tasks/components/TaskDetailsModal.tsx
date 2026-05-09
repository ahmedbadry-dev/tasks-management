'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useTaskDetails } from '../hooks/useTaskDetails'
import { TaskDetailsModalSkeleton } from './TaskDetailsModalSkeleton'
import { TaskDetailsModalContent } from './TaskDetailsModalContent'
import { TTask, TUpdateTaskPatch } from '../types'
import { RequestStatus, TMember, TEpic } from '@/features/project-epic/types'
import { getProjectMembersAction } from '@/features/project-epic/actions/getProjectMembersAction'
import { getAllProjectEpicsAction } from '@/features/project-epic/actions/getAllProjectEpicsAction'
import { updateTaskAction } from '../actions/updateTaskAction'


type Props = {
    isOpen: boolean
    taskId: string | null
    projectId: string | null
    onClose: () => void
}

export const TaskDetailsModal = ({ isOpen, taskId, projectId, onClose }: Props) => {
    const dialogTitleId = useId()
    const [currentTask, setCurrentTask] = useState<TTask | null>(null)
    const [members, setMembers] = useState<TMember[]>([])
    const [membersStatus, setMembersStatus] = useState<RequestStatus>('idle')
    const [membersError, setMembersError] = useState<string | null>(null)
    const [epics, setEpics] = useState<TEpic[]>([])
    const [epicsStatus, setEpicsStatus] = useState<RequestStatus>('idle')
    const [epicsError, setEpicsError] = useState<string | null>(null)
    const hasSuccessfulUpdateRef = useRef(false)
    const { task, isInitialLoading, hasInitialError, error, retry } = useTaskDetails({
        isOpen,
        taskId,
        projectId,
    })

    useEffect(() => {
        setCurrentTask(task)
    }, [task])

    useEffect(() => {
        if (!isOpen) {
            setCurrentTask(null)
            setMembers([])
            setMembersStatus('idle')
            setMembersError(null)
            setEpics([])
            setEpicsStatus('idle')
            setEpicsError(null)
            hasSuccessfulUpdateRef.current = false
        }
    }, [isOpen])

    const loadMembers = useCallback(async () => {
        if (!projectId || membersStatus === 'loading' || membersStatus === 'succeeded') return

        setMembersStatus('loading')
        setMembersError(null)

        const result = await getProjectMembersAction(projectId)

        if (result.success) {
            setMembers(result.data)
            setMembersStatus('succeeded')
        } else {
            setMembersError(result.error)
            setMembersStatus('failed')
        }
    }, [membersStatus, projectId])

    const loadEpics = useCallback(async () => {
        if (!projectId || epicsStatus === 'loading' || epicsStatus === 'succeeded') return

        setEpicsStatus('loading')
        setEpicsError(null)

        const result = await getAllProjectEpicsAction(projectId)

        if (result.success) {
            setEpics(result.data)
            setEpicsStatus('succeeded')
        } else {
            setEpicsError(result.error)
            setEpicsStatus('failed')
        }
    }, [epicsStatus, projectId])

    const savePatch = useCallback(
        async (patch: TUpdateTaskPatch, nextTask: TTask) => {
            if (!currentTask) return false

            const previousTask = currentTask
            setCurrentTask(nextTask)

            const result = await updateTaskAction(currentTask.id, patch)

            if (!result.ok) {
                setCurrentTask(previousTask)
                toast.error('Failed to update task. Please try again.')
                return false
            }

            hasSuccessfulUpdateRef.current = true
            toast.success('Task updated successfully!')
            return true
        },
        [currentTask]
    )

    const handleClose = useCallback(() => {
        if (hasSuccessfulUpdateRef.current && projectId) {
            window.dispatchEvent(
                new CustomEvent('task-details-updated', {
                    detail: { projectId },
                })
            )
        }

        onClose()
    }, [onClose, projectId])

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

                    {!isInitialLoading && !hasInitialError && !currentTask && (
                        <div className="flex flex-1 items-center justify-center p-5">
                            <p className="type-body-md text-center text-slate-400">Task not found</p>
                        </div>
                    )}

                    {!isInitialLoading && !hasInitialError && currentTask && (
                        <div className="min-h-0 flex-1 overflow-y-auto">
                            <TaskDetailsModalContent
                                task={currentTask}
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
