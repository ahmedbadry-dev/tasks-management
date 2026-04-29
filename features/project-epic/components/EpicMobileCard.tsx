import { MoreVerticalIcon } from "@/shared/components/icons"
import { EpicBadge } from "./EpicBadge"
import { MemberAvatar } from "@/features/project-members/components/MemberAvatar"
import { TEpic } from "../types"
import { formatServerDateTime } from "@/features/projects/utils/formatServerDateTime"
import { useAppDispatch } from "@/store/hooks"
import { openModal } from "@/store/uiStore/uiSlice"


export const EpicMobileCard = ({ id, project_id, epic_id, title, deadline, assignee }: TEpic) => {

    const dispatch = useAppDispatch()

    const handleClick = () => {
        dispatch(openModal({
            modalType: 'EPIC_DETAILS',
            payload: { epicId: id, projectId: project_id },
        }))
    }
    return (
        <div
            onClick={handleClick}
            className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-[0px_1px_2px_0px_#0000000D]">
            {/* card header */}
            <div className="flex justify-between ">
                <div className="flex items-center gap-4">
                    <EpicBadge epic_id={epic_id} />
                    <EpicBadge epic_id={epic_id} />
                </div>
                <MoreVerticalIcon className="text-slate-400 transition-transform rotate-90" scale={10} />
            </div>
            {/* card title */}
            <div>
                <h1 className="heading-3">{title}</h1>
            </div>
            {/* card member info */}
            <div className="flex justify-between">
                <div className="flex items-center gap-2">
                    <MemberAvatar name="Ahmed Badry" size={10} />
                    <div>
                        <p className="type-body-md text-[12px]">Assignee</p>
                        {/* member name */}
                        <p className="type-title-md text-[14px]">{assignee?.name ?? 'Unassigned'}</p>
                    </div>
                </div>
                <div>
                    <p className="type-label-sm text-slate-400">deadline</p>
                    <p className="type-body-md font-semibold">{deadline ? formatServerDateTime(deadline).date : '-'}</p>
                </div>
            </div>
        </div>
    )
}
