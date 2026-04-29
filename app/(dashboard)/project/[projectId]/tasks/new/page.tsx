import { AddTaskView } from "@/features/project-tasks/components/AddTaskView"

type Props = {
    params: Promise<{ projectId: string }>
    searchParams: Promise<{ epicId?: string | string[]; status?: string | string[] }>
}

export default async function NewTaskPage({ params, searchParams }: Props) {
    const { projectId } = await params
    const { epicId, status } = await searchParams
    const safeEpicId = Array.isArray(epicId) ? epicId[0] : epicId
    const safeStatus = Array.isArray(status) ? status[0] : status

    return (
        <div>
            <AddTaskView projectId={projectId} epicId={safeEpicId} status={safeStatus} />
        </div>
    )
}
