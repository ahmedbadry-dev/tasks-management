import { getSession } from "@/features/auth/utils/getSession"
import { ProjectsList } from "./ProjectsList"
import { redirect } from "next/navigation"
import { ProjectsDesktopView } from "./ProjectsDesktopView"
import { ProjectsMobileView } from "./ProjectsMobileView"

export const ProjectsView = async () => {
    const session = await getSession()
    if (!session) redirect('/sign-in')

    return (
        <div>
            <ProjectsDesktopView accessToken={session.accessToken} />
            <ProjectsMobileView accessToken={session.accessToken} />
        </div>
    )
}
