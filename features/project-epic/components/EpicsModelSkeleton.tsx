import { SkeletonBlock } from "@/shared/components/SkeletonBlock"

export const EpicsModelSkeleton = () => {
    return (
        <div className="space-y-5" aria-live="polite" aria-busy="true">
            <SkeletonBlock className="h-4 w-2/3" />
            <SkeletonBlock className="h-16 w-full rounded-lg" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <SkeletonBlock className="h-12 w-full rounded-lg" />
                <SkeletonBlock className="h-12 w-full rounded-lg" />
                <SkeletonBlock className="h-12 w-full rounded-lg" />
            </div>
            <SkeletonBlock className="h-28 w-full rounded-lg" />
        </div>
    )
}
