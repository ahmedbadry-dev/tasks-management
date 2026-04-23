'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { selectEpicsHasNextPage, selectEpicsIsFetchingPage, selectEpicsItems } from "../store/projectEpicsSlice"
import { useEffect, useRef } from "react"
import { fetchNextEpicsPage } from "../store/asyncThunk/epicThunk"
import { EpicMobileCard } from "./EpicMobileCard"

export const EpicsMobileView = ({ accessToken, projectId }: { accessToken: string, projectId: string }) => {
    const dispatch = useAppDispatch()
    const epics = useAppSelector(selectEpicsItems)
    const isFetchingPage = useAppSelector(selectEpicsIsFetchingPage)
    const hasNextPage = useAppSelector(selectEpicsHasNextPage)
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

    return (
        <div className="flex flex-col gap-4 sm:hidden pb-10">
            {epics.map((epic) => (
                <EpicMobileCard key={epic.id} {...epic} />
            ))}

            {/* trigger element */}
            <div ref={loaderRef} className="h-10" />

            {isFetchingPage && <p>Loading more...</p>}
        </div>
    )
}
