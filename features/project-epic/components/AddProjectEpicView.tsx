
import { MainContentHeader } from "@/shared/components/MainContentHeader"
import { AddProjectEpicForm } from "./AddProjectEpicForm"
import { getProjectMembersAction } from "../actions/getProjectMembersAction"
import { redirect } from "next/navigation"



export const AddProjectEpicView = async ({ projectId }: { projectId: string }) => {

    const members = await getProjectMembersAction(projectId)
    if (!members.success) redirect('/project')
    return (
        <div>
            <MainContentHeader
                title="Create New Epic"
                msg="Define a major project phase or high-level milestone to group related tasks and track architectural progress."
            />
            <div className=" flex justify-center pt-5 sm:pt-10">
                <AddProjectEpicForm members={members.data} projectId={projectId} />
            </div>
        </div>
    )
}
