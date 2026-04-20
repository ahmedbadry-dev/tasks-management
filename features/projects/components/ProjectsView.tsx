import { getSession } from "@/features/auth/utils/getSession"
import { ProjectsList } from "./ProjectsList"
import { redirect } from "next/navigation"

export const ProjectsView = async () => {
    const session = await getSession()
    if (!session) redirect('/sign-in')

    return (
        <div>
            <ProjectsList accessToken={session.accessToken} />
        </div>
    )
}
