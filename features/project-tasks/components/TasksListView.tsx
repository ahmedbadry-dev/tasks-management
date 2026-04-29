'use client'

import { useCallback } from 'react'
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch'
import { projectTasksService } from '../services/projectTasksService'
import { getSession } from '@/features/auth/utils/getSession'
import { TTask } from '../types'
import { TASKS_PAGE_SIZE } from '../constants'
import { ErrorState } from '@/shared/components/ErrorState'
import { Pagination } from '@/shared/components/Pagination'
import { TasksListTable } from './TasksListTable'

import { useTasksListFetch } from '../hooks/useTasksListFetch'
import { TasksListSkeleton } from './TasksListSkeleton'
import { TasksMobileCard } from './TasksMobileCard'

type Props = {
    projectId: string
}

export const TasksListView = ({ projectId }: Props) => {
    const {
        items: tasks,
        status,
        error,
        currentPage,
        totalCount,
        totalPages,
        isFetchingPage,
        isInitialLoading,
        isDesktop,
        loaderRef,
        goToPage,
        retry,
    } = useTasksListFetch({ projectId })

    const hasTasks = tasks.length > 0

    if (isDesktop === null || isInitialLoading) {
        return <TasksListSkeleton />
    }

    if (status === 'failed' && !hasTasks) {
        return (
            <ErrorState
                title="Failed to load tasks"
                message={error ?? 'Please try again.'}
                onRetry={retry}
            />
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {isDesktop ? (
                <TasksListTable tasks={tasks} />
            ) : (
                <div className="flex flex-col gap-3">
                    {tasks.map((task) => (
                        <TasksMobileCard key={task.id} {...task} />
                    ))}
                    {!isDesktop && hasTasks && <div ref={loaderRef} className="h-10" aria-hidden />}
                </div>
            )}

            {isDesktop && totalCount > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    limit={TASKS_PAGE_SIZE}
                    isFetchingPage={isFetchingPage}
                    label="tasks"
                    onPageChange={goToPage}
                />
            )}
        </div>
    )
}