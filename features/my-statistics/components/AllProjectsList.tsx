import type { ProjectTaskCount } from '../types'

type AllProjectsListProps = {
  projects: ProjectTaskCount[]
  isLoading: boolean
}

export const AllProjectsList = ({
  projects,
  isLoading,
}: AllProjectsListProps) => {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm">
      <h2 className="heading-3 mb-4 font-bold">All Projects</h2>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-10 animate-pulse rounded bg-surface-highest"
            />
          ))}
        </div>
      ) : projects.length > 0 ? (
        <div>
          {projects.map((project) => (
            <div
              key={project.project_id}
              className="flex items-center justify-between border-b border-surface-highest py-3 last:border-0"
            >
              <span className="type-body-md font-medium text-primary">
                {project.project_name}
              </span>
              <span className="type-body-md font-bold text-slate-900">
                {project.tasks_count} Tasks
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="type-body-md py-6 text-center text-slate-400">
          No projects found
        </p>
      )}
    </section>
  )
}
