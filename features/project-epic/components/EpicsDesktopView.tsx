'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { selectEpicsError, selectEpicsIsInitialLoading, selectEpicsItems } from '../store/projectEpicsSlice'
import { EpicDesktopCard } from './EpicDesktopCard'
import { useEffect } from 'react'
import { fetchProjectEpicsPage } from '../store/asyncThunk/epicThunk'
import { EpicsPagination } from './EpicsPagination'


export const EpicsDesktopView = ({ projectId, accessToken }: { projectId: string, accessToken: string }) => {

    const dispatch = useAppDispatch()
    const epics = useAppSelector(selectEpicsItems)
    const isLoading = useAppSelector(selectEpicsIsInitialLoading)
    const error = useAppSelector(selectEpicsError)

    useEffect(() => {
        dispatch(fetchProjectEpicsPage({ accessToken: accessToken, project_id: projectId, page: 1 }))
    }, [dispatch, projectId, accessToken])

    if (isLoading) return <p>Loading...</p>

    if (error) return <p>{error}</p>
    return (
        <div>
            <div className="hidden gap-6 sm:grid sm:grid-cols-[repeat(auto-fit,minmax(min(100%,25rem),1fr))] pb-10">
                {
                    epics.map((epic) => (
                        <EpicDesktopCard key={epic.id} {...epic} />
                    ))
                }

            </div>
            <EpicsPagination projectId={projectId} accessToken={accessToken} />
        </div>
    )
}
