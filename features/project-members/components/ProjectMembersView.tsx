import { MembersDesktopTable } from "./MembersDesktopTable"
import { MembersMobileList } from "./MembersMobileList"
import { getProjectMembersAction } from "../actions/getProjectMembersAction"
import { redirect } from "next/navigation"
import { routes } from "@/lib/routes"
import { ProjectMembersHeader } from "./ProjectMembersHeader"


type ProjectMembersViewProps = {
    projectId: string
}
export const ProjectMembersView = async ({ projectId }: ProjectMembersViewProps) => {

    const result = await getProjectMembersAction(projectId)
    if (!result.success) redirect(routes.project.list)


    return (
        <div>
            <ProjectMembersHeader projectId={projectId} />
            {/* desktop view */}
            <div className="hidden md:flex justify-center">
                <MembersDesktopTable data={result} />
            </div>
            <div className="flex justify-center pt-5 md:hidden ">
                <MembersMobileList data={result} />
            </div>
        </div>
    )
}
