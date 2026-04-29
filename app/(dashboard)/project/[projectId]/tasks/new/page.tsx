import { AddTaskView } from "@/features/project-tasks/components/AddTaskView"

type Props = {
    params: Promise<{ projectId: string }>
    searchParams: Promise<{ epicId?: string }>
}

export default async function NewTaskPage({ params, searchParams }: Props) {
    const { projectId } = await params
    const { epicId } = await searchParams

    return (
        <div>
            <AddTaskView projectId={projectId} epicId={epicId || ''} />
        </div>
    )
}