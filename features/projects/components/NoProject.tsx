
import { NoProjectsIcon, PlusIcon } from "@/shared/components/icons"
import Link from "next/link"

export const NoProject = () => {
    return (
        <section className="flex w-full max-w-3xl flex-col items-center justify-center gap-10 rounded-lg p-6 text-center">
            <div className="mx-auto w-fit">
                <NoProjectsIcon />
            </div>
            <div className="max-w-2xl space-y-3 flex flex-col gap-5">
                <h1 className="heading-2">No Projects</h1>
                <p className="type-body-md max-w-lg">You don't have any projects yet. Start by defining your first architectural workspace to begin tracking tasks and epics.</p>
                <Link
                    href={'project/add'}
                    aria-label="Create New Project"
                    className="
                        btn btn-primary
                        bg-gradient-cta
                        mx-auto
                        shadow-[0px_25px_50px_-12px_#003D9B4D]
                    "

                >
                    <span className="sm:mr-1">
                        <PlusIcon />
                    </span>
                    <span className="type-body-md text-background ">
                        Create New Project
                    </span>
                </Link>
            </div>
        </section>
    )
}
