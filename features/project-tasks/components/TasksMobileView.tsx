'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { routes } from '@/lib/routes'
import { PlusIcon } from '@/shared/components/icons'
import { SearchInput } from '@/shared/components/SearchInput'
import { ErrorState } from '@/shared/components/ErrorState'
import { useTasksListFetch } from '../hooks/useTasksListFetch'
import { TasksMobileCard } from './TasksMobileCard'
import { TasksListSkeleton } from './TasksListSkeleton'
import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch'

type Props = {
    projectId: string
}

export const TasksMobileView = ({ projectId }: Props) => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const { inputValue, handleChange } = useDebouncedSearch((term) => {
        setSearchTerm(term)
    })

    const {
        items: tasks,
        status,
        error,
        isInitialLoading,
        hasNextPage,
        isFetchingPage,
        loaderRef,
        retry,
    } = useTasksListFetch({ projectId, searchTerm })

    const hasTasks = tasks.length > 0
    const isSearching = searchTerm.length > 0

    const handleCreateTask = () => {
        router.push(routes.project.newTask(projectId))
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex flex-col gap-3">
                <h1 className="heading-1">Active Workboard</h1>
                <SearchInput
                    value={inputValue}
                    onChange={handleChange}
                    placeholder="Search tasks..."
                />
                <button
                    onClick={handleCreateTask}
                    className="btn btn-primary flex w-full items-center justify-center gap-2"
                >
                    <PlusIcon />
                    Create Task
                </button>
            </div>

            {/* Content */}
            {isInitialLoading ? (
                <TasksListSkeleton />
            ) : status === 'failed' && !hasTasks ? (
                <ErrorState
                    title={isSearching ? 'Failed to search tasks' : 'Failed to load tasks'}
                    message={error ?? 'Please try again.'}
                    onRetry={retry}
                />
            ) : !hasTasks ? (
                <p className="type-body-md py-10 text-center text-slate-400">
                    {isSearching
                        ? 'No tasks found matching your search'
                        : 'No tasks found for this project'}
                </p>
            ) : (
                <div className="flex flex-col gap-3 pb-24">
                    {tasks.map((task) => (
                        <TasksMobileCard key={task.id} {...task} />
                    ))}
                    {hasNextPage && <div ref={loaderRef} className="h-10" aria-hidden />}
                    {isFetchingPage && (
                        <p className="type-label-sm py-2 text-center text-slate-400">
                            Loading more...
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
