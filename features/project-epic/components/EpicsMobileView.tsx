'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
    selectEpicsError,
    selectEpicsHasNextPage,
    selectEpicsIsFetchingPage,
    selectEpicsItems,
    selectEpicsStatus,
    selectEpicsTotalCount
} from "../store/projectEpicsSlice"
import { useEffect, useRef } from "react"
import { fetchNextEpicsPage } from "../store/asyncThunk/epicThunk"
import { EpicMobileCard } from "./EpicMobileCard"
import { ErrorState } from "@/shared/components/ErrorState"
import { EpicsPageSkeleton } from "./EpicsPageSkeleton"
import { NoEpics } from "./NoEpics"
import { TEpic } from "../types"



export const EpicsMobileView = ({ accessToken, projectId }: { accessToken: string, projectId: string }) => {
    const dispatch = useAppDispatch()
    const epics = useAppSelector(selectEpicsItems)
    const totalCount = useAppSelector(selectEpicsTotalCount)
    const hasEpics = epics.length > 0
    const hasAnyEpics = totalCount > 0
    const status = useAppSelector(selectEpicsStatus)
    const isFetchingPage = useAppSelector(selectEpicsIsFetchingPage)
    const hasNextPage = useAppSelector(selectEpicsHasNextPage)
    const error = useAppSelector(selectEpicsError)
    const loaderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingPage) {
                    dispatch(fetchNextEpicsPage({ accessToken, project_id: projectId }))
                }
            },
            { threshold: 0.1 }
        )

        if (loaderRef.current) observer.observe(loaderRef.current)
        return () => observer.disconnect()
    }, [hasNextPage, isFetchingPage, dispatch, accessToken, projectId])

    if ((status === 'idle' || status === 'loading') && !hasEpics) {
        return (
            <div className="sm:hidden pb-10">
                <EpicsPageSkeleton count={3} />
            </div>
        )
    }

    if (status === 'failed' && !hasEpics) {
        return (
            <div className="md:hidden">
                <ErrorState
                    title="Failed to load epics"
                    message="Please try again."
                    onRetry={() => dispatch(fetchNextEpicsPage({ accessToken, project_id: projectId }))}
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4 sm:hidden pb-10">
            {hasEpics && (
                epics.map((epic) => (
                    <EpicMobileCard key={epic.id} {...epic} />
                ))
            )}

            {/* trigger element */}
            {hasAnyEpics && hasNextPage && <div ref={loaderRef} className="h-10" />}

            {isFetchingPage && <p>Loading more...</p>}
            {status === 'succeeded' && !isFetchingPage && !hasAnyEpics && (
                <div className=" pb-10 md:hidden">
                    <NoEpics />
                </div>
            )}
            {hasEpics && error && (
                <p>Failed to load more epics</p>
            )}
        </div>
    )
}
