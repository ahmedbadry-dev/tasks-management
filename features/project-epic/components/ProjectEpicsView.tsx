

import { EpicsDesktopView } from "./EpicsDesktopView"
import { EpicsMobileView } from "./EpicsMobileView"


export const ProjectEpicsView = ({ projectId, accessToken }: { projectId: string, accessToken: string }) => {

    return (
        <div className="w-full">
            <EpicsDesktopView projectId={projectId} accessToken={accessToken} />
            <EpicsMobileView projectId={projectId} accessToken={accessToken} />
        </div>
    )
}
