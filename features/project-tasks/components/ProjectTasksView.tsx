'use client'

import { useSearchParams, useRouter } from 'next/navigation'


import { TasksBoardView } from './TasksBoardView'
import { TasksListView } from './TasksListView'
import { TasksMobileView } from './TasksMobileView'
import { useDesktopBreakpoint } from '@/hooks/paginated/useDesktopBreakpoint'
import { TasksPageHeader } from './TasksPageHeader'

type Props = {
    projectId: string
}

type TaskView = 'board' | 'list'

export const ProjectTasksView = ({ projectId }: Props) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const isDesktop = useDesktopBreakpoint(992)

    const view = (searchParams.get('view') ?? 'board') as TaskView

    const handleViewChange = (newView: TaskView) => {
        router.push(`/project/${projectId}/tasks?view=${newView}`)
    }

    if (isDesktop === null) return null

    if (!isDesktop) {
        return <TasksMobileView projectId={projectId} />
    }

    return (
        <div className="flex h-full flex-col gap-6">
            <TasksPageHeader
                currentView={view}
                onViewChange={handleViewChange}
            />
            {view === 'board' ? (
                <TasksBoardView projectId={projectId} />
            ) : (
                <TasksListView projectId={projectId} />
            )}
        </div>
    )
}