import { MemberAvatar } from "@/features/project-members/components/MemberAvatar"
import { EpicBadge } from "./EpicBadge"

export const EpicMemberIdentity = ({ name, epic_id }: { name: string, epic_id: string }) => {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <MemberAvatar name={'Ahmed Badry'} size={10} />
                <div>
                    <p className="type-body-md text-[12px]">Assignee</p>
                    {/* member name */}
                    <p className="type-title-md text-[14px]">{name}</p>
                </div>
            </div>
            {/* replace later by todo */}
            <EpicBadge epic_id={epic_id} />
        </div>
    )
}
