'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    selectEpicsError,
    selectEpicsItems,
    selectEpicsStatus,
    selectEpicsTotalCount
} from '../store/projectEpicsSlice'
import { EpicDesktopCard } from './EpicDesktopCard'
import { useEffect } from 'react'
import { fetchProjectEpicsPage } from '../store/asyncThunk/epicThunk'
import { EpicsPagination } from './EpicsPagination'
import { ErrorState } from '@/shared/components/ErrorState'
import { EpicsPageSkeleton } from './EpicsPageSkeleton'


export const EpicsDesktopView = ({ projectId, accessToken }: { projectId: string, accessToken: string }) => {

    const dispatch = useAppDispatch()
    const epics = useAppSelector(selectEpicsItems)
    const status = useAppSelector(selectEpicsStatus)
    const error = useAppSelector(selectEpicsError)
    const totalCount = useAppSelector(selectEpicsTotalCount)
    const hasEpics = epics.length > 0
    const hasAnyEpics = totalCount > 0

    useEffect(() => {
        dispatch(fetchProjectEpicsPage({ accessToken: accessToken, project_id: projectId, page: 1 }))
    }, [dispatch, projectId, accessToken])

    if ((status === 'idle' || status === 'loading') && !hasEpics) {
        return (
            <div className="hidden sm:block">
                <EpicsPageSkeleton />
            </div>
        )
    }

    if (status === 'failed' && !hasEpics) {
        return (
            <div className="hidden md:block">
                <ErrorState
                    title="Failed to load epics"
                    message={error ?? "Please try again."}
                    onRetry={() => dispatch(fetchProjectEpicsPage({ accessToken: accessToken, project_id: projectId, page: 1 }))}
                />
            </div>
        )
    }

    return (
        <div>
            <div className="hidden gap-6 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] pb-10">
                {hasEpics && (
                    epics.map((epic) => (
                        <EpicDesktopCard key={epic.id} {...epic} />
                    ))
                )}
            </div>
            {status === 'succeeded' && !hasAnyEpics && (
                <p className="hidden pb-10 sm:block">No epics yet.</p>
            )}
            {hasAnyEpics && (
                <EpicsPagination projectId={projectId} accessToken={accessToken} />
            )}
        </div>
    )
}
