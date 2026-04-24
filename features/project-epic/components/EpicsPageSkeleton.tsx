import { SkeletonBlock } from "@/shared/components/SkeletonBlock"
import { EpicCardSkeleton } from "./EpicCardSkeleton"

type EpicsPageSkeletonProps = {
    count?: number
}

export const EpicsPageSkeleton = ({ count = 6 }: EpicsPageSkeletonProps) => {
    return (
        <div className="flex min-h-0 flex-col gap-10 pb-10">
            {/* MainContentHeader skeleton */}
            <header className="hidden items-center justify-between p-2 sm:flex">
                <div className="flex flex-col gap-2">
                    <SkeletonBlock className="h-7 w-36" />
                    <SkeletonBlock className="h-4 w-60" />
                </div>
                <SkeletonBlock className="h-10 w-40 rounded-lg" />
            </header>

            {/* Grid skeleton */}
            <main className="grid min-h-0 grid-cols-1 gap-6 @3xl/main:grid-cols-2 @5xl/main:grid-cols-3">
                {Array.from({ length: count }).map((_, i) => (
                    <EpicCardSkeleton key={i} />
                ))}
            </main>
        </div>
    )
}

