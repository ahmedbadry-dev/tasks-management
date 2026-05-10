'use client'

import { useEffect, useMemo, useState } from 'react'
import { ErrorState } from '@/shared/components/ErrorState'
import { MainContentHeader } from '@/shared/components/MainContentHeader'
import { Pagination } from '@/shared/components/Pagination'
import { PlusIcon } from '@/shared/components/icons'
import { PROJECTS_PAGE_SIZE } from '@/features/projects/constants'
import { TEpic } from '../types'
import { EpicDesktopCard } from './EpicDesktopCard'
import { EpicMobileCard } from './EpicMobileCard'
import { EpicsPageSkeleton } from './EpicsPageSkeleton'
import { NoEpics } from './NoEpics'
import { routes } from '@/lib/routes'
import { useDebouncedSearch } from '@/shared/hooks/useDebouncedSearch'
import { useDesktopBreakpoint } from '@/hooks/paginated/useDesktopBreakpoint'
import { useInfiniteScrollSentinel } from '@/hooks/paginated/useInfiniteScrollSentinel'
import { useProjectEpicsQuery } from '../hooks/useProjectEpicsQuery'
import { useProjectEpicsInfiniteQuery } from '../hooks/useProjectEpicsInfiniteQuery'


type Props = {
    projectId: string
}

export const ProjectEpicsView = ({ projectId }: Props) => {
    const isDesktop = useDesktopBreakpoint(768)
    const [page, setPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState('')
    const { inputValue, handleChange } = useDebouncedSearch((term) => {
        setSearchTerm(term)
    })

    useEffect(() => {
        setPage(1)
    }, [searchTerm])

    const paginatedQuery = useProjectEpicsQuery(
        projectId,
        page,
        searchTerm,
        isDesktop !== false
    )
    const infiniteQuery = useProjectEpicsInfiniteQuery(
        projectId,
        searchTerm,
        isDesktop === false
    )

    const epics = useMemo<TEpic[]>(() => {
        if (isDesktop === false) {
            return infiniteQuery.data?.pages.flatMap((pageData) => pageData.data) ?? []
        }

        return paginatedQuery.data?.data ?? []
    }, [infiniteQuery.data?.pages, isDesktop, paginatedQuery.data?.data])

    const currentPage = page
    const totalCount =
        isDesktop === false
            ? infiniteQuery.data?.pages[0]?.totalCount ?? 0
            : paginatedQuery.data?.totalCount ?? 0
    const totalPages = Math.ceil(totalCount / PROJECTS_PAGE_SIZE)
    const hasNextPage = Boolean(infiniteQuery.hasNextPage)
    const isFetchingPage =
        isDesktop === false ? infiniteQuery.isFetchingNextPage : paginatedQuery.isFetching
    const isInitialLoading =
        isDesktop === false ? infiniteQuery.isLoading : paginatedQuery.isLoading
    const hasRootError = isDesktop === false ? infiniteQuery.isError : paginatedQuery.isError
    const error =
        isDesktop === false
            ? infiniteQuery.error?.message ?? null
            : paginatedQuery.error?.message ?? null

    const retry = () => {
        if (isDesktop === false) {
            void infiniteQuery.refetch()
            return
        }

        void paginatedQuery.refetch()
    }

    const loaderRef = useInfiniteScrollSentinel({
        enabled: isDesktop === false,
        canLoadMore: hasNextPage && !infiniteQuery.isFetchingNextPage,
        onLoadMore: () => {
            void infiniteQuery.fetchNextPage()
        },
    })

    const hasEpics = epics.length > 0
    const hasAnyEpics = totalCount > 0
    const isSearching = searchTerm.length > 0

    if (isDesktop === null || isInitialLoading) {
        return <EpicsPageSkeleton />
    }

    if (hasRootError && !hasEpics) {
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
                        {epics.map((epic) =>
                            isDesktop ? (
                                <EpicDesktopCard key={epic.id} {...epic} />
                            ) : (
                                <EpicMobileCard key={epic.id} {...epic} />
                            )
                        )}

                        {!isDesktop && hasNextPage && <div ref={loaderRef} className="h-10" aria-hidden />}
                    </>
                ) : !isInitialLoading && !hasEpics ? (
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
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}
