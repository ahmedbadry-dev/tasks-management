import { getSession } from "@/features/auth/utils/getSession";
import { ProjectEpicsView } from "@/features/project-epic/components/ProjectEpicsView";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";


type Props = {
    params: Promise<{ projectId: string }>
}
export default async function EpicsPage({ params }: Props) {
    const { projectId } = await params
    const session = await getSession()
    if (!session) redirect(routes.auth.signIn)
    return (
        <div>
            <ProjectEpicsView projectId={projectId} accessToken={session.accessToken} />
        </div>
    )
}  
