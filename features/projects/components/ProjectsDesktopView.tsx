'use client'

import { MainContentHeader } from "@/shared/components/MainContentHeader"
import { PlusIcon } from "@/shared/components/icons"
import { ProjectCard } from "./ProjectCard"
import { NoProject } from "./NoProject"
import { AddProjectCard } from "./AddProjectCard"
import { ProjectsPagination } from "./ProjectsPagination"
import { cn } from "@/utils/cn"
import { useEffect } from "react"
import { fetchProjectsPage } from "../store/asyncThunk/projectsThunk"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
    selectProjects,
    selectProjectsError,
    selectProjectsStatus,
    selectProjectsTotalCount
} from "../store/projectsSlice"
import { ProjectsPageSkeleton } from "./ProjectsPageSkeleton"
import { ErrorState } from "@/shared/components/ErrorState"


export const ProjectsDesktopView = ({ accessToken }: { accessToken: string }) => {

    const dispatch = useAppDispatch()
    const projects = useAppSelector(selectProjects)
    const totalCount = useAppSelector(selectProjectsTotalCount)
    const status = useAppSelector(selectProjectsStatus)
    const error = useAppSelector(selectProjectsError)
    const hasProjects = projects.length > 0
    const hasAnyProjects = totalCount > 0


    useEffect(() => {
        dispatch(fetchProjectsPage({ accessToken, page: 1 }))
    }, [dispatch, accessToken])



    if ((status === 'idle' || status === 'loading') && !hasProjects) {
        return <div className="hidden md:block"><ProjectsPageSkeleton /></div>
    }

    if (status === 'failed' && !hasProjects) {
        return (
            <div className="hidden md:block">
                <ErrorState
                    title="Failed to load projects"
                    message={error ?? "Please try again."}
                    onRetry={() => dispatch(fetchProjectsPage({ accessToken, page: 1 }))}
                />
            </div>
        )
    }


    return (
        <div className={
            cn(`hidden md:flex min-h-0 flex-col pb-24 md:pb-0 `,
                hasProjects ? '' : 'flex items-center py-20'
            )}
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
                {hasProjects && (
                    projects.map((project) => <ProjectCard key={project.id} {...project} />)
                )}

                {hasProjects && <AddProjectCard />}

            </main>
            {hasAnyProjects && <ProjectsPagination accessToken={accessToken} />}
            {status === 'succeeded' && !hasAnyProjects && <NoProject />}
        </div>
    )
}
