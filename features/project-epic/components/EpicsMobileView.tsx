'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
    selectEpicsError,
    selectEpicsHasNextPage,
    selectEpicsIsFetchingPage,
    selectEpicsIsInitialLoading,
    selectEpicsItems,
    selectEpicsTotalCount
} from "../store/projectEpicsSlice"
import { useEffect, useRef } from "react"
import { fetchNextEpicsPage } from "../store/asyncThunk/epicThunk"
import { EpicMobileCard } from "./EpicMobileCard"

export const EpicsMobileView = ({ accessToken, projectId }: { accessToken: string, projectId: string }) => {
    const dispatch = useAppDispatch()
    const epics = useAppSelector(selectEpicsItems)
    const totalCount = useAppSelector(selectEpicsTotalCount)
    const hasEpics = epics.length > 0
    const hasAnyEpics = totalCount > 0
    const isInitialLoading = useAppSelector(selectEpicsIsInitialLoading)
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

    if (isInitialLoading && !hasEpics) {
        return (
            <div className="sm:hidden pb-10">
                <p>InitialLoading...</p>
            </div>
        )
    }

    if (error && !hasEpics) {
        return (
            <div className="sm:hidden pb-10">
                <p>{error}</p>
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
            <div ref={loaderRef} className="h-10" />

            {isFetchingPage && <p>Loading more...</p>}
            {!isInitialLoading && !isFetchingPage && !hasAnyEpics && !error && (
                <p>No epics yet.</p>
            )}
            {hasEpics && error && (
                <p>Failed to load more epics</p>
            )}
        </div>
    )
}
