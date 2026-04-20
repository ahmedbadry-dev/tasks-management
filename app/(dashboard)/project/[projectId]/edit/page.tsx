import { UpdateProjectView } from "@/features/projects/components/UpdateProjectView";

type Props = {
    params: Promise<{ projectId: string }>
}

export default async function EditPage({ params }: Props) {
    const { projectId } = await params

    return <div>
        <UpdateProjectView projectId={projectId} />
    </div>
}
