'use client'

import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
    selectProjects,
    selectProjectsError,
    selectProjectsHasNextPage,
    selectProjectsIsFetchingPage,
    selectProjectsTotalCount
} from "../store/projectsSlice"
import { useEffect, useRef } from "react"
import { fetchNextProjects } from "../store/asyncThunk/projectsThunk"
import { MainContentHeader } from "@/shared/components/MainContentHeader"
import { PlusIcon } from "@/shared/components/icons"
import { ProjectCard } from "./ProjectCard"
import { AddProjectCard } from "./AddProjectCard"
import { NoProject } from "./NoProject"

export const ProjectsMobileView = ({ accessToken }: { accessToken: string }) => {

    const dispatch = useAppDispatch()
    const projects = useAppSelector(selectProjects)
    const totalCount = useAppSelector(selectProjectsTotalCount)
    const hasProjects = projects.length > 0
    const hasAnyProjects = totalCount > 0
    const isFetchingPage = useAppSelector(selectProjectsIsFetchingPage)
    const hasNextPage = useAppSelector(selectProjectsHasNextPage)
    const error = useAppSelector(selectProjectsError)
    const loaderRef = useRef<HTMLDivElement>(null)

    const triggeredRef = useRef(false)

    useEffect(() => {
        const node = loaderRef.current
        if (!node) return

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0]

                // reset the triggeredRef to be ready for the next fetch when the node intersected
                if (!entry.isIntersecting) {
                    triggeredRef.current = false
                    return
                }

                // if i fetch data before do not fetched again
                if (triggeredRef.current) return
                if (!hasNextPage || isFetchingPage) return

                triggeredRef.current = true

                dispatch(fetchNextProjects({ accessToken }))
            },
            {
                rootMargin: '200px 0px',
                threshold: 0,
            }
        )

        observer.observe(node)

        return () => observer.disconnect()
    }, [dispatch, hasNextPage, isFetchingPage, accessToken])
    return (
        <div className="md:hidden">
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
                ) : !hasAnyProjects ? (
                    <NoProject />
                ) : null}

                {hasProjects && <AddProjectCard />}

                {/* trigger element */}
                <div ref={loaderRef} className="h-10" />

                {isFetchingPage && (
                    <p className="type-body-sm text-slate-500 md:hidden">
                        Loading more projects...
                    </p>
                )}

                {hasProjects && error && (
                    <p className="type-body-sm text-red-500">
                        Failed to load projects page
                    </p>
                )}
            </main>
        </div>
    )
}
