type Props = {
    className?: string
}

export const TaskDetailsModalSkeleton = ({ className }: Props) => {
    return (
        <div className={`grid h-full grid-cols-1 md:grid-cols-[1fr_260px] ${className ?? ''}`}>
            <div className="flex h-full flex-col">
                <div className="border-b border-slate-400/20 p-5 pb-3">
                    <div className="mb-3 h-5 w-2/5 animate-pulse rounded bg-surface-highest" />
                    <div className="h-8 w-4/5 animate-pulse rounded bg-surface-highest" />
                </div>
                <div className="flex-1 space-y-3 p-5">
                    <div className="h-4 w-full animate-pulse rounded bg-surface-highest" />
                    <div className="h-4 w-5/6 animate-pulse rounded bg-surface-highest" />
                    <div className="h-4 w-4/6 animate-pulse rounded bg-surface-highest" />
                </div>
                <div className="flex items-center justify-between bg-surface-low px-5 py-4">
                    <div className="h-5 w-20 animate-pulse rounded bg-surface-highest" />
                    <div className="h-8 w-24 animate-pulse rounded bg-surface-highest" />
                </div>
            </div>
            <div className="flex h-full flex-col gap-4 bg-surface-low p-5">
                <div className="h-10 w-full animate-pulse rounded bg-white" />
                <div className="h-16 w-full animate-pulse rounded bg-white" />
                <div className="h-10 w-full animate-pulse rounded bg-white" />
                <div className="h-6 w-1/2 animate-pulse rounded bg-white" />
            </div>
        </div>
    )
}
