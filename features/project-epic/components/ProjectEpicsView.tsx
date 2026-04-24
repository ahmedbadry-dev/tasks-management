'use client'

import { useCallback, useState } from "react"
import { EpicsDesktopView } from "./EpicsDesktopView"
import { EpicsMobileView } from "./EpicsMobileView"
import { TEpic } from "../types"
import { EpicsModel } from "./EpicsModel"


export const ProjectEpicsView = ({ projectId, accessToken }: { projectId: string, accessToken: string }) => {
    const [selectedEpic, setSelectedEpic] = useState<TEpic | null>(null)

    const openEpicDetails = useCallback((epic: TEpic) => {
        setSelectedEpic(epic)
    }, [])

    const closeEpicDetails = useCallback(() => {
        setSelectedEpic(null)
    }, [])
    return (
        <div className="w-full">
            <EpicsDesktopView projectId={projectId} accessToken={accessToken} />
            <EpicsMobileView projectId={projectId} accessToken={accessToken} />
            {/* <EpicsModel /> */}
        </div>
    )
}
