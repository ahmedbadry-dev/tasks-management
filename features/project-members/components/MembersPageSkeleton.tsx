
import { SkeletonBlock } from "@/shared/components/SkeletonBlock"
import { MembersMobileListSkeleton } from "./MembersMobileListSkeleton"
import { MembersTableSkeleton } from "./MembersTableSkeleton"

export const MembersPageSkeleton = () => {
    return (
        <div>
            <header className="flex justify-between items-center p-2">
                <div className="space-y-2">
                    <SkeletonBlock className="h-8 w-52" />
                    <SkeletonBlock className="h-4 w-40" />
                </div>
                <SkeletonBlock className="h-14 w-14 rounded-xl sm:h-10 sm:w-40 sm:rounded-lg" />
            </header>

            <div className="hidden md:flex justify-center pt-10">
                <MembersTableSkeleton />
            </div>

            <div className="flex justify-center pt-5 md:hidden">
                <MembersMobileListSkeleton />
            </div>
        </div>
    )
}
