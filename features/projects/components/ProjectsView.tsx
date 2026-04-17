import { getSession } from "@/features/auth/utils/getSession"
import { ProjectsList } from "./ProjectsList"
import { redirect } from "next/navigation"
import { projectService } from "../services/projectService"

export const ProjectsView = async () => {
    const session = await getSession()
    if (!session) redirect('/sign-in')

    // fetch projects 
    const projects = await projectService.getProjects(session.accessToken)

    return (
        <div>
            <ProjectsList projects={projects} />
        </div>
    )
}
