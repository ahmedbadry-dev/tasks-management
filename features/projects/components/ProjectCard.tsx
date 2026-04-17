import { TProject } from "../types"
import { formatServerDateTime } from "../utils/formatServerDateTime"




export const ProjectCard = ({ name, description, created_at }: TProject) => {
    return (
        <article className="h-55 overflow-hidden rounded-lg bg-white p-6">
            {/* card header */}
            <div className="flex h-full flex-col gap-4">
                <div>
                    <h1 className="heading-3 text-lg wrap-break-word line-clamp-4">
                        {name}
                    </h1>
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
    )
}
