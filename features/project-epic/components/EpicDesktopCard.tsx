import { CalendarIcon, MoreVerticalIcon, UserEditIcon } from "@/shared/components/icons"
import { EpicBadge } from "./EpicBadge"
import { EpicMemberIdentity } from "./EpicMemberIdentity"
import { TEpic } from "../types"
import { formatServerDateTime } from "@/features/projects/utils/formatServerDateTime"

export const EpicDesktopCard = ({ title, assignee, created_at, created_by, epic_id }: TEpic) => {
    return (
        <div
            className="w-full min-w-0 flex flex-col gap-5 rounded-lg border-l-4 border-dark-green bg-white p-4 shadow-[0px_1px_2px_0px_#0000000D]">
            {/* card header */}
            <div className="flex justify-between">
                <EpicBadge epic_id={epic_id} />
                <MoreVerticalIcon className="text-slate-400" scale={10} />
            </div>
            {/* card body */}
            <div>
                <h1 className="heading-3 mb-4 max-w-[80%] truncate">{title}</h1>
                {/* member info */}
                <EpicMemberIdentity name={assignee?.name as string} epic_id={epic_id} />
            </div>
            {/* card footer */}
            <div className="flex justify-between text-[11px]">
                <div className="flex items-center gap-2">
                    <UserEditIcon className="text-slate-400" size={15} />
                    <p>Created by: <span className="text-slate-900">{created_by.name}</span></p>
                </div>
                <div className="flex items-center gap-2">
                    <CalendarIcon className="text-slate-400" size={15} />
                    <p>{formatServerDateTime(created_at).date}</p>
                </div>
            </div>
        </div>
    )
}
