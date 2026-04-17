import { MainContentHeader } from "@/shared/components/MainContentHeader"
import { AddProjectForm } from "./AddProjectForm"
import { AddUserIcon, InviteUserIcon } from "@/shared/components/icons"

export const AddProjectView = () => {
    return (
        <div>
            <MainContentHeader
                btnText="Invite Member"
                title="Add New Project"
                btnIcon={<InviteUserIcon />}
                hidden={true}
            />
            <div className=" flex justify-center  pt-10">
                <AddProjectForm />
            </div>
        </div>
    )
}
