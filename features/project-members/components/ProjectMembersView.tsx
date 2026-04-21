import { MainContentHeader } from "@/shared/components/MainContentHeader"
import { MembersDesktopTable } from "./MembersDesktopTable"
import { MembersMobileList } from "./MembersMobileList"
import { InviteUserIcon } from "@/shared/components/icons"

export const ProjectMembersView = () => {
    return (
        <div>
            <MainContentHeader
                title="Project Members"
                btnIcon={<InviteUserIcon />}
                btnText="Invite Member"
                href={'#'}
            />
            {/* desktop view */}
            <div className="hidden md:flex justify-center pt-10">
                <MembersDesktopTable />
            </div>
            <div className="flex justify-center pt-5 md:hidden ">
                <MembersMobileList />
            </div>
        </div>
    )
}
