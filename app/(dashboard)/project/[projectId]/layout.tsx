
import { getSession } from "@/features/auth/utils/getSession"
import { redirect } from "next/navigation"
import { routes } from "@/lib/routes"
import { getProjectDetailsActionById } from "@/features/projects/actions/getProjectDetailsActionById"
import { ProjectBreadcrumbHeader } from "@/shared/components/ProjectBreadcrumbHeader"

type Props = {
    children: React.ReactNode
    params: Promise<{ projectId: string }>
}

export default async function ProjectLayout({ children, params }: Props) {
    const session = await getSession()
    if (!session) redirect(routes.auth.signIn)

    const { projectId } = await params

    if (!projectId) redirect(routes.project.list)

    const projectResult = await getProjectDetailsActionById(projectId)
    if (!projectResult.success) redirect(routes.project.list)

    const project = projectResult.data[0]
    if (!project) redirect(routes.project.list)

    return (
        <div className="flex min-h-0 h-full flex-col gap-4">
            {/* Shared project breadcrumb keeps page context visible across all project routes. */}
            <ProjectBreadcrumbHeader projectId={projectId} projectName={project.name} />
            <div className="min-h-0 flex-1">
                {children}
            </div>
        </div>
    )
}
