'use client'

import { useEffect, useState } from 'react'
import { TASKS_PAGE_SIZE } from '../constants'
import { ErrorState } from '@/shared/components/ErrorState'
import { Pagination } from '@/shared/components/Pagination'
import { TasksListTable } from './TasksListTable'

import { useDesktopBreakpoint } from '@/hooks/paginated/useDesktopBreakpoint'
import { TasksListSkeleton } from './TasksListSkeleton'
import { TasksMobileCard } from './TasksMobileCard'
import { useTasksListInfiniteQuery } from '../hooks/useTasksListInfiniteQuery'
import { useTasksListQuery } from '../hooks/useTasksListQuery'
import { useInfiniteScrollSentinel } from '@/hooks/paginated/useInfiniteScrollSentinel'

type Props = {
    projectId: string
    searchTerm?: string
}

export const TasksListView = ({ projectId, searchTerm = '' }: Props) => {
    const isDesktop = useDesktopBreakpoint(992)
    const [page, setPage] = useState(1)

    useEffect(() => {
        setPage(1)
    }, [searchTerm])

    const listQuery = useTasksListQuery(
        projectId,
        page,
        searchTerm,
        isDesktop !== false
    )
    const infiniteQuery = useTasksListInfiniteQuery(
        projectId,
        searchTerm,
        isDesktop === false
    )

    const tasks =
        isDesktop === false
            ? infiniteQuery.data?.pages.flatMap((pageData) => pageData.data) ?? []
            : listQuery.data?.data ?? []
    const totalCount =
        isDesktop === false
            ? infiniteQuery.data?.pages[0]?.totalCount ?? 0
            : listQuery.data?.totalCount ?? 0
    const currentPage = page
    const totalPages = Math.ceil(totalCount / TASKS_PAGE_SIZE)
    const isFetchingPage =
        isDesktop === false ? infiniteQuery.isFetchingNextPage : listQuery.isFetching
    const isInitialLoading =
        isDesktop === false ? infiniteQuery.isLoading : listQuery.isLoading
    const hasRootError = isDesktop === false ? infiniteQuery.isError : listQuery.isError
    const error =
        isDesktop === false
            ? infiniteQuery.error?.message ?? null
            : listQuery.error?.message ?? null
    const retry = () => {
        if (isDesktop === false) {
            void infiniteQuery.refetch()
            return
        }

        void listQuery.refetch()
    }
    const loaderRef = useInfiniteScrollSentinel({
        enabled: isDesktop === false,
        canLoadMore: Boolean(infiniteQuery.hasNextPage) && !infiniteQuery.isFetchingNextPage,
        onLoadMore: () => {
            void infiniteQuery.fetchNextPage()
        },
    })

    const hasTasks = tasks.length > 0
    const isSearching = searchTerm.length > 0

    if (isDesktop === null || isInitialLoading || (isDesktop && isFetchingPage)) {
        return <TasksListSkeleton />
    }

    if (hasRootError && !hasTasks) {
        return (
            <ErrorState
                title={isSearching ? 'Failed to search tasks' : 'Failed to load tasks'}
                message={error ?? 'Please try again.'}
                onRetry={retry}
            />
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {isDesktop ? (
                hasTasks ? (
                    <TasksListTable tasks={tasks} />
                ) : (
                    <p className="type-body-md py-10 text-center text-slate-400">
                        {isSearching
                            ? 'No tasks found matching your search'
                            : 'No tasks found for this project'}
                    </p>
                )
            ) : (
                <div className="flex flex-col gap-3">
                    {tasks.map((task) => (
                        <TasksMobileCard key={task.id} {...task} />
                    ))}
                    {!hasTasks ? (
                        <p className="type-body-md py-10 text-center text-slate-400">
                            {isSearching
                                ? 'No tasks found matching your search'
                                : 'No tasks found for this project'}
                        </p>
                    ) : null}
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
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}
