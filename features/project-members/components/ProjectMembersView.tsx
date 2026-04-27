import { MainContentHeader } from "@/shared/components/MainContentHeader"
import { MembersDesktopTable } from "./MembersDesktopTable"
import { MembersMobileList } from "./MembersMobileList"
import { InviteUserIcon } from "@/shared/components/icons"
import { getProjectMembersAction } from "../actions/getProjectMembersAction"
import { redirect } from "next/navigation"
import { routes } from "@/lib/routes"


type ProjectMembersViewProps = {
    projectId: string
}
export const ProjectMembersView = async ({ projectId }: ProjectMembersViewProps) => {

    const result = await getProjectMembersAction(projectId)
    if (!result.success) redirect(routes.project.list)


    return (
        <div>
            <MainContentHeader
                title="Project Members"
                btnIcon={<InviteUserIcon />}
                btnText="Invite Member"
                href={'#'}
            />
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
