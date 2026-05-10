import { getSession } from "@/features/auth/utils/getSession"
import { ProjectsView } from "@/features/projects/components/ProjectsView"
import { redirect } from "next/navigation"
import { routes } from "@/lib/routes"

const ProjectsPage = async () => {
    const session = await getSession()
    if (!session) redirect(routes.auth.signIn)
    return (
        <div>
            <ProjectsView />
        </div>
    )
}

export default ProjectsPage
