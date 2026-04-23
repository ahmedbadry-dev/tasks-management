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
    selectProjectsIsInitialLoading,
    selectProjectsTotalCount
} from "../store/projectsSlice"


export const ProjectsDesktopView = ({ accessToken }: { accessToken: string }) => {

    // const {
    //     error,
    //     hasNextPage,
    //     hasProjects,
    //     isDesktop,
    //     isFetchingPage,
    //     isInitialLoading,
    //     loadMoreRef,
    //     projects
    // } = useProjectList(accessToken)

    const dispatch = useAppDispatch()
    const projects = useAppSelector(selectProjects)
    const totalCount = useAppSelector(selectProjectsTotalCount)
    const isInitialLoading = useAppSelector(selectProjectsIsInitialLoading)
    const error = useAppSelector(selectProjectsError)
    const hasProjects = projects.length > 0
    const hasAnyProjects = totalCount > 0


    useEffect(() => {
        dispatch(fetchProjectsPage({ accessToken: accessToken, page: 1 }))
    }, [dispatch, accessToken])



    if (isInitialLoading && !hasProjects) return <p className="hidden md:block">InitialLoading...</p>
    if (error && !hasProjects) return <p className="hidden md:block">{error}</p>


    return (
        <div className={
            cn(`hidden md:flex min-h-0 flex-col pb-24 md:pb-0 `,
                hasProjects ? 'gap-10' : 'flex items-center py-20'
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
            {!hasAnyProjects && <NoProject />}
        </div>
    )
}
