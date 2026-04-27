'use client'

import { useEffect, useId } from 'react'
import {
    CalendarIcon,
    CloseIcon,
    ColumnsIcon,
    ListBulletsIcon,
    PlusIcon,
} from '@/shared/components/icons'
import { MemberAvatar } from '@/features/project-members/components/MemberAvatar'
import { formatServerDateTime } from '@/features/projects/utils/formatServerDateTime'
import { EpicsModelSkeleton } from './EpicsModelSkeleton'
import { useEpicDetails } from '../hooks/useEpicDetails'

type Props = {
    isOpen: boolean
    epicId: string | null
    projectId: string | null
    accessToken: string
    onClose: () => void
}

export const EpicsModel = ({
    isOpen,
    epicId,
    projectId,
    accessToken,
    onClose,
}: Props) => {
    const dialogTitleId = useId()
    const {
        epicDetails,
        status: epicDetailsStatus,
        error: epicDetailsError,
        isInitialLoading,
        hasInitialError,
        isRefreshing,
        retry,
    } = useEpicDetails({
        isOpen,
        epicId,
        projectId,
        accessToken,
    })

    const selectedEpic = epicDetails

    const createdByName = selectedEpic?.created_by?.name ?? '-'
    const assigneeName = selectedEpic?.assignee?.name ?? '-'
    const epicCode = selectedEpic?.epic_id ?? '-'
    const epicTitle = selectedEpic?.title ?? 'Epic Details'
    const mobileEpicTitle = selectedEpic?.title ?? 'Epic Details'
    const description = selectedEpic?.description?.trim()
    const createdAtDate = selectedEpic?.created_at
        ? formatServerDateTime(selectedEpic.created_at).date
        : '-'

    useEffect(() => {
        if (!isOpen) return

        // Lock background scroll while the modal is open.
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose()
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
            className="fixed inset-0 z-90 flex items-center justify-center bg-slate-900/40 p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
        >
            <div
                className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
                onClick={(event) => event.stopPropagation()}
                role="document"
            >
                {/* header */}
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                            <span className="hidden md:inline-flex">
                                <ColumnsIcon className="text-primary" />
                            </span>
                            <span>{epicCode}</span>
                        </div>
                        <h2 id={dialogTitleId}>
                            <span className="hidden md:inline-flex heading-2">{epicTitle}</span>
                            <span className="md:hidden heading-3">{mobileEpicTitle}</span>
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md border border-slate-200 px-3 p-2 text-sm text-slate-600 hover:bg-slate-50"
                        aria-label="Close epic details modal"
                    >
                        <CloseIcon />
                    </button>
                </div>

                {/* body */}
                <div className="flex flex-col gap-5">
                    {isInitialLoading && (
                        <EpicsModelSkeleton />
                    )}

                    {hasInitialError && (
                        <div className="rounded-lg border border-error/20 bg-error-container/60 p-4">
                            <p className="type-body-md text-error mb-3">
                                {epicDetailsError ?? 'Failed to load epic details.'}
                            </p>
                            <button
                                type="button"
                                onClick={retry}
                                className="btn btn-primary py-2 px-4"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {!isInitialLoading && !hasInitialError && (
                        <>
                            {isRefreshing && (
                                <div className="flex items-center gap-2 text-slate-400" aria-live="polite">
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-primary" />
                                    <span className="type-label-sm">Refreshing details...</span>
                                </div>
                            )}

                            {epicDetailsStatus === 'failed' && selectedEpic && (
                                <div className="flex items-center justify-between rounded-lg border border-error/20 bg-error-container/60 p-3">
                                    <p className="type-body-md text-error">
                                        {epicDetailsError ?? 'Could not refresh latest details.'}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={retry}
                                        className="btn btn-ghost text-primary py-1 px-2"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            {/* description */}
                            <div>
                                <span className="hidden md:inline-flex">
                                    {description || 'A comprehensive review and upgrade of the core architectural frameworks.'}
                                </span>
                                <div className="md:hidden">
                                    <p className="type-label-sm text-slate-900">Description</p>
                                    <p>{description || 'No description provided'}</p>
                                </div>
                            </div>

                            {/* members for desktop */}
                            <div className="hidden md:flex">
                                <div className="flex-1">
                                    <h5 className="type-label-sm text-slate-400 mb-1">Created By</h5>
                                    <div className="flex items-center gap-2">
                                        <MemberAvatar name={createdByName} size={8} textSize={12} />
                                        <p>{createdByName}</p>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h5 className="type-label-sm text-slate-400 mb-1">Assignee</h5>
                                    <div className="flex items-center gap-2">
                                        <MemberAvatar name={assigneeName} size={8} textSize={12} />
                                        <p>{assigneeName}</p>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <h5 className="type-label-sm text-slate-400 mb-1">Created At</h5>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="text-slate-400" />
                                        <p>{createdAtDate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* members for mobile */}
                            <div className="grid grid-cols-2 md:hidden border-b border-slate-400/20 pb-4">
                                <div>
                                    <h5 className="type-label-sm text-slate-400 mb-1">Created By</h5>
                                    <div className="flex items-center gap-2">
                                        <MemberAvatar name={createdByName} size={8} textSize={12} />
                                        <p className="text-xs">{createdByName}</p>
                                    </div>
                                </div>

                                <div>
                                    <h5 className="type-label-sm text-slate-400 mb-1">Assignee</h5>
                                    <div className="flex items-center gap-2">
                                        <MemberAvatar name={assigneeName} size={8} textSize={12} />
                                        <p className="text-xs">{assigneeName}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:hidden">
                                <div className="flex-1">
                                    <h5 className="type-label-sm text-slate-400 mb-1">Created At</h5>
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="text-primary" size={15} />
                                        <p className="text-xs">{createdAtDate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* tasks */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="type-label-sm text-lg">Tasks</p>
                                    <button className="hidden md:flex btn btn-ghost text-primary">
                                        <PlusIcon />
                                        Add Task
                                    </button>
                                    <div className="md:hidden type-label-sm px-2 py-1 bg-surface-highest rounded-2xl">
                                        <span>0</span> Tasks
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4 justify-center items-center bg-surface-low border-3 border-dashed border-surface-highest rounded-lg p-4">
                                    <div className="bg-surface-highest p-3 rounded-lg">
                                        <ListBulletsIcon className="text-primary" />
                                    </div>
                                    <p className="text-center max-w-50">
                                        No tasks have been added to this epic yet.
                                    </p>
                                    <button className="btn btn-primary rounded-none py-2 px-3 text-xs">
                                        <PlusIcon />
                                        Add Task
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
