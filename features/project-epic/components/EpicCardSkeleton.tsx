import { SkeletonBlock } from "@/shared/components/SkeletonBlock"

export const EpicCardSkeleton = () => {
    return (
        <article className="w-full min-w-0 rounded-lg bg-white p-4 shadow-[0px_1px_2px_0px_#0000000D]">
            <div className="flex h-full flex-col gap-4">
                {/* card header skeleton */}
                <div className="flex items-center justify-between">
                    <SkeletonBlock className="h-6 w-24 rounded-full" />
                    <SkeletonBlock className="h-4 w-4 rounded-full" />
                </div>

                {/* card body skeleton */}
                <div className="space-y-3">
                    <SkeletonBlock className="h-5 w-4/5" />
                    <SkeletonBlock className="h-4 w-1/2" />
                </div>

                {/* card footer skeleton */}
                <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                    <SkeletonBlock className="h-3 w-28" />
                    <SkeletonBlock className="h-3 w-24" />
                </div>
            </div>
        </article>
    )
}

