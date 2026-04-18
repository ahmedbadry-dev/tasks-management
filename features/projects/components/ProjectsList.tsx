
import { MainContentHeader } from "@/shared/components/MainContentHeader"
import { ProjectCard } from "./ProjectCard"
import { AddProjectCard } from "./AddProjectCard"
import { Pagination } from "@/shared/components/Pagination"
import { NoProject } from "./NoProject"
import { TProject } from "../types"
import { PlusIcon } from "@/shared/components/icons"

type ProjectsListProps = {
    projects: TProject[]
}

export const ProjectsList = ({ projects }: ProjectsListProps) => {

    const hasProjects = projects.length > 0

    return (
        <div className={`flex min-h-0 flex-col pb-24 md:pb-0 ${hasProjects ? "gap-10" : "h-full gap-6"}`}>
            {hasProjects && <MainContentHeader
                btnIcon={<PlusIcon />}
                btnText="Create New Project"
                msg="Manage and curate your projects"
                title="Projects"
                href="project/add"
            />}
            <main
                className={
                    hasProjects
                        ? "grid min-h-0 grid-cols-1 gap-6 @3xl/main:grid-cols-2 @5xl/main:grid-cols-3"
                        : "flex min-h-0 flex-1 items-center justify-center"
                }
            >
                {hasProjects ? (
                    projects.map((project) => (
                        <ProjectCard key={project.id} {...project} />
                    ))
                ) : (
                    <NoProject />
                )}
                {hasProjects && <AddProjectCard />}
            </main>
            {hasProjects && <Pagination />}
        </div>
    )
}
