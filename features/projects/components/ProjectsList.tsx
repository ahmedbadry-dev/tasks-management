'use client'

import { MainContentHeader } from '@/shared/components/MainContentHeader'
import { ProjectCard } from './ProjectCard'
import { AddProjectCard } from './AddProjectCard'
import { Pagination } from '@/shared/components/Pagination'
import { NoProject } from './NoProject'
import { PlusIcon } from '@/shared/components/icons'
import { useProjectList } from '../hooks/useProjectList'
import { ProjectsPagination } from './ProjectsPagination'

type ProjectsListProps = {
    accessToken: string
}

export const ProjectsList = ({ accessToken }: ProjectsListProps) => {

    const {
        error,
        hasNextPage,
        hasProjects,
        isDesktop,
        isFetchingPage,
        isInitialLoading,
        loadMoreRef,
        projects
    } = useProjectList(accessToken)

    if (isDesktop === null) return <p>Loading...</p>
    if (isInitialLoading && !hasProjects) return <p>Loading...</p>
    if (error && !hasProjects) return <p>{error}</p>

    return (
        <div
            className={`flex min-h-0 flex-col pb-24 md:pb-0 ${hasProjects ? 'gap-10' : 'h-full gap-6'
                }`}
        >
            {hasProjects && (
                <MainContentHeader
                    btnIcon={<PlusIcon />}
                    btnText="Create New Project"
                    msg="Manage and curate your projects"
                    title="Projects"
                    href="project/add"
                />
            )}
            <main
                className={
                    hasProjects
                        ? 'grid min-h-0 grid-cols-1 gap-6 @3xl/main:grid-cols-2 @5xl/main:grid-cols-3'
                        : 'flex min-h-0 flex-1 items-center justify-center'
                }
            >
                {/*  */}
                {hasProjects ? (
                    projects.map((project) => <ProjectCard key={project.id} {...project} />)
                ) : (
                    <NoProject />
                )}
                {hasProjects && <AddProjectCard />}
                {hasProjects && hasNextPage && isDesktop === false && (
                    <div ref={loadMoreRef} className="h-px sm:hidden" aria-hidden />
                )}
            </main>
            {hasProjects && isFetchingPage && isDesktop === false && (
                <p className="type-body-sm text-slate-500 sm:hidden">
                    Loading more projects...
                </p>
            )}
            {hasProjects && error && (
                <p className="type-body-sm text-red-500">
                    {isDesktop ? 'Failed to load projects page' : 'Failed to load more projects'}
                </p>
            )}
            {hasProjects && <ProjectsPagination accessToken={accessToken} />}
        </div>
    )
}
