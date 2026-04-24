import { ProjectMembersView } from "@/features/project-members/components/ProjectMembersView";

type Props = {
    params: Promise<{ projectId: string }>
}

export default async function MembersPage({ params }: Props) {
    const { projectId } = await params
    return (
        <div>
            <ProjectMembersView projectId={projectId} />
        </div>
    )
}