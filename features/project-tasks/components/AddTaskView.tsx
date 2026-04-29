
import { MainContentHeader } from "@/shared/components/MainContentHeader"
import { AddNewTaskForm } from "./AddNewTaskForm"

import { getProjectEpicsAction } from "@/features/project-epic/actions/getProjectEpicsAction"
import { getProjectMembersAction } from "@/features/project-epic/actions/getProjectMembersAction"



export const AddTaskView = async ({
    projectId,
    epicId,
    status,
}: {
    projectId: string
    epicId?: string
    status?: string
}) => {

    const [membersResult, epicsResult] = await Promise.all([
        getProjectMembersAction(projectId),
        getProjectEpicsAction(projectId),
    ])

    if (!membersResult.success) throw new Error(membersResult.error)
    if (!epicsResult.success) throw new Error(epicsResult.error)

    return (
        <div>
            <MainContentHeader
                title="Create New Task"
                msg="Initialize a new work item within the Architectural Workspace ecosystem."
            />
            <div className=" flex justify-center pt-5 sm:pt-10">
                <AddNewTaskForm
                    members={membersResult.data}
                    epics={epicsResult.data}
                    projectId={projectId}
                    epicId={epicId}
                    status={status}
                />
            </div>
        </div>
    )
}
