import { MainContentHeader } from "@/shared/components/MainContentHeader"
import { AddProjectForm } from "./AddProjectForm"
import { InviteUserIcon } from "@/shared/components/icons"

export const AddProjectView = () => {
    return (
        <div>
            <MainContentHeader
                btnText="Invite Member"
                title="Add New Project"
                btnIcon={<InviteUserIcon />}
                href="#"
            />
            <div className=" flex justify-center  pt-10">
                <AddProjectForm />
            </div>
        </div>
    )
}
