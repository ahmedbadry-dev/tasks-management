import { AddProjectEpicView } from "@/features/project-epic/components/AddProjectEpicView"


type Props = {
    params: Promise<{ projectId: string }>
}
const page = async ({ params }: Props) => {

    const { projectId } = await params
    return (
        <div>
            <AddProjectEpicView projectId={projectId} />
        </div>
    )
}

export default page
