import { SkeletonBlock } from "@/shared/components/SkeletonBlock";

export const ProjectCardSkeleton = () => (
    <article className="h-55 overflow-hidden rounded-lg bg-white p-6">
        <div className="flex h-full flex-col gap-4">
            <div className="space-y-2">
                <SkeletonBlock className="h-5 w-2/3" />
                <SkeletonBlock className="h-5 w-1/2" />
            </div>

            <div className="min-h-0 flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-full" />
                <SkeletonBlock className="h-4 w-11/12" />
                <SkeletonBlock className="h-4 w-4/5" />
            </div>

            <div className="mt-auto flex shrink-0 justify-between gap-3">
                <SkeletonBlock className="h-3 w-20" />
                <SkeletonBlock className="h-3 w-24" />
            </div>
        </div>
    </article>
)