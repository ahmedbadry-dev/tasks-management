'use client'

import { useCallback } from 'react'
import { projectService } from '../services/projectService'
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
import { usePaginatedFetch } from '@/hooks/usePaginatedFetch'
import { routes } from '@/lib/routes'

type Props = {
    accessToken: string
}

export const ProjectsView = ({ accessToken }: Props) => {
    const fetchFn = useCallback(
        (page: number, signal: AbortSignal) =>
            projectService.getProjects(accessToken, page, signal),
        [accessToken]
    )

    const {
        items: projects,
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
    } = usePaginatedFetch<TProject>({ fetchFn, limit: PROJECTS_PAGE_SIZE })

    const hasProjects = projects.length > 0
    const hasAnyProjects = totalCount > 0

    //  Loading
    if (isDesktop === null || isInitialLoading) {
        return <ProjectsPageSkeleton />
    }

    //  Error (no data yet)
    if (status === 'failed' && !hasProjects) {
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
                    onPageChange={goToPage}
                />
            )}
        </div>
    )
}
