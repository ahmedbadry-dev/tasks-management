
import { SkeletonBlock } from "@/shared/components/SkeletonBlock"

type MembersMobileListSkeletonProps = {
    count?: number
}

const MemberCardSkeleton = () => {
    return (
        <div className="flex justify-between bg-white p-4 rounded-lg">
            <div className="min-w-0 overflow-hidden flex gap-4.5 items-center">
                <SkeletonBlock className="h-11 w-11 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-24" />
                    <SkeletonBlock className="h-3 w-36" />
                </div>
            </div>

            <div className="flex flex-col justify-between items-end gap-3">
                <SkeletonBlock className="h-6 w-16 rounded-xl" />
                <SkeletonBlock className="h-8 w-8 rounded-full" />
            </div>
        </div>
    )
}

export const MembersMobileListSkeleton = ({ count = 4 }: MembersMobileListSkeletonProps) => {
    return (
        <div className="flex flex-1 flex-col gap-3 w-full">
            {Array.from({ length: count }).map((_, idx) => (
                <MemberCardSkeleton key={idx} />
            ))}
        </div>
    )
}
