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
import { NoEpics } from './NoEpics'
import { MainContentHeader } from '@/shared/components/MainContentHeader'
import { PlusIcon } from '@/shared/components/icons'
import { TEpic } from '../types'



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
            {
                hasEpics && (
                    <div className='hidden md:block'>
                        <MainContentHeader
                            btnIcon={<PlusIcon />}
                            btnText="New Epic"
                            title="Project Epics"
                            href="project/add"
                            search={true}
                        />
                    </div>
                )
            }

            <div className="hidden gap-6 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(min(100%,25rem),1fr))] ">
                {hasEpics && (
                    epics.map((epic) => (
                        <EpicDesktopCard key={epic.id} {...epic} />
                    ))
                )}
            </div>
            {status === 'succeeded' && !hasAnyEpics && (
                <div className="hidden  md:flex justify-center items-center ">
                    <NoEpics />
                </div>
            )}
            {hasAnyEpics && (
                <EpicsPagination projectId={projectId} accessToken={accessToken} />
            )}
        </div>
    )
}
