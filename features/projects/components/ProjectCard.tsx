import Link from "next/link"
import { TProject } from "../types"
import { formatServerDateTime } from "../utils/formatServerDateTime"
import { useRouter } from "next/navigation"
import { routes } from "@/lib/routes"


export const ProjectCard = ({ id, name, description, created_at }: TProject) => {
    const router = useRouter()

    const handleEditClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        event.stopPropagation()
        router.push(routes.project.edit(id))
    }
    return (
        <Link href={routes.project.epics(id)}>
            <article className="h-55 overflow-hidden rounded-lg bg-white p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex h-full flex-col gap-4">
                    {/* card header */}
                    <div className="flex justify-between items-center">
                        <h1 className="heading-3 text-lg wrap-break-word line-clamp-4">
                            {name}
                        </h1>
                        <button
                            onClick={handleEditClick}
                        >
                            edit
                        </button>
                    </div>
                    {/* card body */}
                    <div className="min-h-0 flex-1 overflow-hidden">
                        <p className="type-body-md wrap-break-word line-clamp-4">
                            {description}
                        </p>
                    </div>
                    {/* card footer */}
                    <div className="mt-auto flex shrink-0 justify-between gap-3">
                        <span className="type-label-sm">created at</span>
                        <span className="type-label-sm truncate">{formatServerDateTime(created_at).date}</span>
                    </div>
                </div>
            </article>
        </Link>
    )
}
