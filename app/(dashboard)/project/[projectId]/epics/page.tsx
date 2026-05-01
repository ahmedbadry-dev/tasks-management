
import { ProjectEpicsView } from "@/features/project-epic/components/ProjectEpicsView";


type Props = {
    params: Promise<{ projectId: string }>
}
export default async function EpicsPage({ params }: Props) {
    const { projectId } = await params
    return (
        <div>
            <ProjectEpicsView projectId={projectId} />
        </div>
    )
}  
