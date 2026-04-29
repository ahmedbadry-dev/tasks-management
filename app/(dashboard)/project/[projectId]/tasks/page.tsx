import { getSession } from '@/features/auth/utils/getSession'
import { redirect } from 'next/navigation'
import { routes } from '@/lib/routes'
import { ProjectTasksView } from '@/features/project-tasks/components/ProjectTasksView'

type Props = {
    params: Promise<{ projectId: string }>
}

export default async function TasksPage({ params }: Props) {
    const { projectId } = await params
    const session = await getSession()
    if (!session) redirect(routes.auth.signIn)

    return <ProjectTasksView projectId={projectId} />
}