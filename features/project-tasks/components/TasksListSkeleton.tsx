export const TasksListSkeleton = () => {
    return (
        <div className="flex flex-col gap-3">
            <div className="h-10 w-full animate-pulse rounded bg-surface-highest" />
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 w-full animate-pulse rounded bg-surface-highest" />
            ))}
        </div>
    )
}