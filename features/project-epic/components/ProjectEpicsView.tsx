'use client'

import { useCallback, useMemo, useState } from 'react'
import { ErrorState } from '@/shared/components/ErrorState'
import { MainContentHeader } from '@/shared/components/MainContentHeader'
import { Pagination } from '@/shared/components/Pagination'
import { PlusIcon } from '@/shared/components/icons'
import { PROJECTS_PAGE_SIZE } from '@/features/projects/constants'
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch'
import { TEpic } from '../types'
import { EpicDesktopCard } from './EpicDesktopCard'
import { EpicMobileCard } from './EpicMobileCard'
import { EpicsPageSkeleton } from './EpicsPageSkeleton'
import { NoEpics } from './NoEpics'
import { routes } from '@/lib/routes'
import { useAppSelector } from '@/store/hooks'
import { selectEpicPatchesById } from '@/store/projectEpicPatchesStore/projectEpicPatchesSlice'
import { getProjectEpicsAction } from '../actions/getProjectEpicsAction'
import { useEpicsSearch } from '@/features/project-tasks/hooks/useEpicsSearch'


type Props = {
    projectId: string
}

export const ProjectEpicsView = ({ projectId }: Props) => {
    const epicPatchesById = useAppSelector(selectEpicPatchesById)
    const [searchTerm, setSearchTerm] = useState('')
    const { inputValue, handleChange } = useEpicsSearch((term) => {
        setSearchTerm(term)
    })

    const fetchFn = useCallback(
        async (page: number, signal: AbortSignal) => {
            const result = await getProjectEpicsAction(projectId, page, searchTerm)
            if (!result.success) throw new Error(result.error)
            return result.data
        },
        [projectId, searchTerm]
    )


    const {
        items: epics,
        status,
        error,
        currentPage,
        totalCount,
        totalPages,
        isFetchingPage,
        isInitialLoading,
        hasNextPage,
        isDesktop,
        loaderRef,
        goToPage,
        retry,
    } = usePaginatedFetch<TEpic>({ fetchFn, limit: PROJECTS_PAGE_SIZE })

    const mergedEpics = useMemo(
        () =>
            epics.map((epic) => {
                const patch = epicPatchesById[epic.id]
                if (!patch) return epic

                const mergedAssignee =
                    patch.assignee === undefined
                        ? epic.assignee
                        : patch.assignee.id === null
                            ? null
                            : {
                                sub: patch.assignee.id,
                                name: patch.assignee.name,
                                email: epic.assignee?.email ?? '',
                                department: epic.assignee?.department ?? null,
                            }

                return {
                    ...epic,
                    title: patch.title ?? epic.title,
                    description:
                        patch.description === undefined ? epic.description : patch.description ?? '',
                    deadline: patch.deadline === undefined ? epic.deadline : patch.deadline ?? '',
                    assignee: mergedAssignee,
                }
            }),
        [epics, epicPatchesById]
    )

    const hasEpics = mergedEpics.length > 0
    const hasAnyEpics = totalCount > 0
    const isSearching = searchTerm.length > 0

    if (isDesktop === null || isInitialLoading) {
        return <EpicsPageSkeleton />
    }

    if (status === 'failed' && !hasEpics) {
        return (
            <ErrorState
                title="Failed to load epics"
                message={error ?? 'Please try again.'}
                onRetry={retry}
            />
        )
    }

    return (
        <div className={`flex min-h-0 w-full flex-col pb-10 ${hasEpics ? 'gap-6' : 'h-full gap-6'}`}>
            {hasEpics && isDesktop && (
                <MainContentHeader
                    btnIcon={<PlusIcon />}
                    btnText="New Epic"
                    title="Project Epics"
                    href={routes.project.newEpic(projectId)}
                    search
                    searchValue={inputValue}
                    onSearchChange={handleChange}
                    searchPlaceholder="Search epics..."
                />
            )}

            <main
                className={
                    hasEpics
                        ? isDesktop
                            ? 'grid gap-6 sm:grid-cols-[repeat(auto-fill,minmax(min(100%,25rem),1fr))]'
                            : 'flex flex-col gap-4'
                        : 'flex min-h-0 flex-1 items-center justify-center'
                }
            >
                {hasEpics ? (
                    <>
                        {mergedEpics.map((epic) =>
                            isDesktop ? (
                                <EpicDesktopCard key={epic.id} {...epic} />
                            ) : (
                                <EpicMobileCard key={epic.id} {...epic} />
                            )
                        )}

                        {!isDesktop && hasNextPage && <div ref={loaderRef} className="h-10" aria-hidden />}
                    </>
                ) : status === 'succeeded' && !hasEpics ? (
                    isSearching ? (
                        <p className="type-body-md text-center text-slate-400">
                            No epics found matching your search
                        </p>
                    ) : (
                        <NoEpics projectId={projectId} />
                    )
                ) : null}
            </main>

            {!isDesktop && isFetchingPage && <p>Loading more...</p>}
            {!isDesktop && hasEpics && error && <p>Failed to load more epics</p>}

            {isDesktop && hasAnyEpics && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    limit={PROJECTS_PAGE_SIZE}
                    isFetchingPage={isFetchingPage}
                    label="epics"
                    onPageChange={goToPage}
                />
            )}
        </div>
    )
}
