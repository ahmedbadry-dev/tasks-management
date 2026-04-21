
import { SkeletonBlock } from "@/shared/components/SkeletonBlock"
import { cn } from "@/utils/cn"

type MembersTableSkeletonProps = {
    count?: number
}

const MemberRowSkeleton = ({ className }: { className?: string }) => {
    return (
        <div className={cn("grid grid-cols-[2fr_1fr_1fr_60px] py-5 px-8 bg-white border-b border-surface-highest/50", className)}>
            <div className="min-w-0 overflow-hidden flex gap-4.5 items-center">
                <SkeletonBlock className="h-11 w-11 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                    <SkeletonBlock className="h-4 w-1/3" />
                    <SkeletonBlock className="h-3 w-1/2" />
                </div>
            </div>
            <div className="flex items-center">
                <SkeletonBlock className="h-7 w-20 rounded-xl" />
            </div>
            <div className="flex items-center">
                <SkeletonBlock className="h-4 w-24" />
            </div>
            <div className="flex items-center justify-end">
                <SkeletonBlock className="h-8 w-8 rounded-full" />
            </div>
        </div>
    )
}

export const MembersTableSkeleton = ({ count = 5 }: MembersTableSkeletonProps) => {
    return (
        <div className="flex flex-1 flex-col shadow-[0px_1px_2px_0px_#0000000D] border-3 border-surface-highest/50 rounded-lg w-full">
            <div className="grid grid-cols-[2fr_1fr_1fr_60px] py-5 px-8 bg-surface-low rounded-t-lg">
                <SkeletonBlock className="h-4 w-16" />
                <SkeletonBlock className="h-4 w-10" />
                <SkeletonBlock className="h-4 w-14" />
                <SkeletonBlock className="h-4 w-10 justify-self-end" />
            </div>

            {Array.from({ length: count }).map((_, idx) => {
                const isLastItem = idx === count - 1
                return (
                    <MemberRowSkeleton
                        key={idx}
                        className={isLastItem ? "border-b-0 rounded-b-lg" : undefined}
                    />
                )
            })}
        </div>
    )
}
