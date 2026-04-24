import { EmptyPageCard } from "@/features/project-epic/components/EmptyPageCard"
import { BoltIcon, ConnectionIcon, SparklesIcon, TemplateSelectionIllustration, TuneIcon } from "@/shared/components/icons"
import Link from "next/link"

export const NoEpics = () => {
    return (
        <section className="flex w-full max-w-3xl flex-col items-center justify-center gap-10 rounded-lg p-6 text-center">
            <div className="relative mx-auto w-fit">
                <div className="absolute inset-0 rounded-4xl bg-primary/10 blur-[36px] scale-110" />
                <div className="relative">
                    <TemplateSelectionIllustration size={224} trimmed className="max-md:w-44 max-md:h-44" />
                </div>
            </div>
            <div className="max-w-2xl space-y-3 flex flex-col gap-3 md:gap-5">
                <h1 className="heading-2">No epics in this project yet.</h1>
                <p className="text-[10px] md:text-[16px] md:type-body-md max-w-sm">Break down your large project into manageable epics to track progress better and maintain architectural clarity.</p>
                <Link
                    href={'epics/new'}
                    aria-label="Create New Project"
                    className="
                        btn btn-primary
                        bg-gradient-cta
                        mx-auto
                        shadow-[0px_25px_50px_-12px_#003D9B4D]
                    "

                >
                    <span className="sm:mr-1">
                        <BoltIcon />
                    </span>
                    <span className="type-body-md text-background ">
                        Create New Project
                    </span>
                </Link>
            </div>
            <div className="hidden md:grid grid-cols-3 gap-4 ">
                <EmptyPageCard
                    icon={<SparklesIcon className="text-primary" />}
                    title="High-Level Goals"
                    body="Define the broad objectives that span across multiple cycles."

                />
                <EmptyPageCard
                    icon={<TuneIcon className="text-primary" />}
                    title="Hierarchy Design"
                    body="Link individual tasks to parent epics for a consolidated view."
                />
                <EmptyPageCard
                    icon={<ConnectionIcon className="text-primary" />}
                    title="Track Velocity"
                    body="Visualize percentage completion at a macro project level."
                />
            </div>
        </section>
    )
}



