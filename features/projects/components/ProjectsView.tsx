'use client'

import { useCallback, useMemo, useState } from 'react'
import { PROJECTS_PAGE_SIZE } from '../constants'
import { ProjectCard } from './ProjectCard'
import { AddProjectCard } from './AddProjectCard'
import { NoProject } from './NoProject'
import { ProjectsPageSkeleton } from './ProjectsPageSkeleton'
import { ErrorState } from '@/shared/components/ErrorState'
import { MainContentHeader } from '@/shared/components/MainContentHeader'
import { Pagination } from '@/shared/components/Pagination'
import { PlusIcon } from '@/shared/components/icons'
import { TProject } from '../types'
import { routes } from '@/lib/routes'
import { useDesktopBreakpoint } from '@/hooks/paginated/useDesktopBreakpoint'
import { useInfiniteScrollSentinel } from '@/hooks/paginated/useInfiniteScrollSentinel'
import { useProjectsInfiniteQuery } from '../hooks/useProjectsInfiniteQuery'
import { useProjectsQuery } from '../hooks/useProjectsQuery'

export const ProjectsView = () => {
    const [page, setPage] = useState(1)
    const isDesktop = useDesktopBreakpoint(768)

    const paginatedQuery = useProjectsQuery(page, isDesktop !== false)
    const infiniteQuery = useProjectsInfiniteQuery(isDesktop === false)

    const projects = useMemo<TProject[]>(() => {
        if (isDesktop === false) {
            return infiniteQuery.data?.pages.flatMap((pageData) => pageData.data) ?? []
        }

        return paginatedQuery.data?.data ?? []
    }, [infiniteQuery.data?.pages, isDesktop, paginatedQuery.data?.data])

    const totalCount =
        isDesktop === false
            ? infiniteQuery.data?.pages[0]?.totalCount ?? 0
            : paginatedQuery.data?.totalCount ?? 0
    const totalPages = Math.ceil(totalCount / PROJECTS_PAGE_SIZE)
    const currentPage = page
    const hasNextPage = Boolean(infiniteQuery.hasNextPage)
    const isFetchingPage =
        isDesktop === false ? infiniteQuery.isFetchingNextPage : paginatedQuery.isFetching
    const isInitialLoading =
        isDesktop === false ? infiniteQuery.isLoading : paginatedQuery.isLoading
    const error = isDesktop === false
        ? infiniteQuery.error?.message ?? null
        : paginatedQuery.error?.message ?? null
    const hasRootError =
        isDesktop === false ? infiniteQuery.isError : paginatedQuery.isError

    const retry = useCallback(() => {
        if (isDesktop === false) {
            void infiniteQuery.refetch()
            return
        }

        void paginatedQuery.refetch()
    }, [infiniteQuery, isDesktop, paginatedQuery])

    const loaderRef = useInfiniteScrollSentinel({
        enabled: isDesktop === false,
        canLoadMore: hasNextPage && !infiniteQuery.isFetchingNextPage,
        onLoadMore: () => {
            void infiniteQuery.fetchNextPage()
        },
    })

    const hasProjects = projects.length > 0
    const hasAnyProjects = totalCount > 0

    //  Loading
    if (isDesktop === null || isInitialLoading) {
        return <ProjectsPageSkeleton />
    }

    //  Error (no data yet)
    if (hasRootError && !hasProjects) {
        return (
            <ErrorState
                title="Failed to load projects"
                message={error ?? 'Please try again.'}
                onRetry={retry}
            />
        )
    }

    return (
        <div className={`flex min-h-0 flex-col pb-24 md:pb-0 ${hasProjects ? 'gap-10' : 'h-full gap-6'}`}>

            {hasProjects && (
                <MainContentHeader
                    btnIcon={<PlusIcon />}
                    btnText="Create New Project"
                    msg="Manage and curate your projects"
                    title="Projects"
                    href={routes.project.add}
                />
            )}

            <main
                className={
                    hasProjects
                        ? 'grid min-h-0 grid-cols-1 gap-6 @3xl/main:grid-cols-2 @5xl/main:grid-cols-3'
                        : 'flex min-h-0 flex-1 items-center justify-center'
                }
            >
                {hasProjects ? (
                    <>
                        {projects.map((project) => (
                            <ProjectCard key={project.id} {...project} />
                        ))}
                        <AddProjectCard />

                        {/* Mobile infinite scroll sentinel */}
                        {!isDesktop && hasNextPage && (
                            <div ref={loaderRef} className="h-10" aria-hidden />
                        )}
                    </>
                ) : (
                    status === 'succeeded' && !hasAnyProjects && <NoProject />
                )}
            </main>

            {/* Mobile: loading / error feedback */}
            {!isDesktop && isFetchingPage && (
                <p className="type-body-sm text-slate-500">Loading more projects...</p>
            )}
            {!isDesktop && hasProjects && error && (
                <p className="type-body-sm text-red-500">Failed to load more projects</p>
            )}

            {/* Desktop: pagination */}
            {isDesktop && hasAnyProjects && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalCount={totalCount}
                    limit={PROJECTS_PAGE_SIZE}
                    isFetchingPage={isFetchingPage}
                    label="projects"
                    onPageChange={setPage}
                />
            )}
        </div>
    )
}
