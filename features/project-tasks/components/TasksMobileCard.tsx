import { MemberAvatar } from '@/features/project-members/components/MemberAvatar'
import { formatServerDateTime } from '@/features/projects/utils/formatServerDateTime'
import { MoreVerticalIcon, CalendarIcon, UserIcon } from '@/shared/components/icons'
import { TTask } from '../types'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/uiStore/uiSlice'

const STATUS_STYLES: Record<string, string> = {
    TO_DO: 'bg-slate-100 text-slate-600',
    IN_PROGRESS: 'bg-blue-100 text-blue-600',
    BLOCKED: 'bg-red-100 text-red-600',
    IN_REVIEW: 'bg-yellow-100 text-yellow-600',
    READY_FOR_QA: 'bg-purple-100 text-purple-600',
    REOPENED: 'bg-orange-100 text-orange-600',
    READY_FOR_PRODUCTION: 'bg-green-100 text-green-600',
    DONE: 'bg-emerald-100 text-emerald-600',
}

export const TasksMobileCard = ({ task_id, title, status, due_date, assignee, id, project_id }: TTask) => {

    const dispatch = useAppDispatch()

    const handleClick = () => {
        dispatch(openModal({
            modalType: 'TASK_DETAILS',
            payload: { taskId: id, projectId: project_id },
        }))
    }
    return (
        <div
            onClick={handleClick}
            className="flex flex-col gap-4 rounded-lg bg-white p-4 shadow-[0px_1px_2px_0px_#0000000D]">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="type-label-sm font-medium text-primary">{task_id}</span>
                    <span className={`type-label-sm rounded px-2 py-1 font-medium ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
                        {status.replace(/_/g, ' ')}
                    </span>
                </div>
                <MoreVerticalIcon className="rotate-90 text-slate-400" scale={10} />
            </div>

            {/* Title */}
            <h3 className="heading-3">{title}</h3>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {assignee ? (
                        <>
                            <MemberAvatar name={assignee.name} size={8} textSize={12} />
                            <div>
                                <p className="type-body-md text-[12px] text-slate-400">Assignee</p>
                                <p className="type-title-md text-[14px]">{assignee.name}</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <span className='bg-surface-low p-2 rounded-md'><UserIcon /></span>
                            <p className='type-title-md text-[12px] text-slate-600'>Unassigned</p>
                        </>
                    )}
                </div>
                {due_date && (
                    <div className="flex flex-col items-end">
                        <p className="type-label-sm text-slate-400">Due Date</p>
                        <p className="type-body-md font-semibold">
                            {formatServerDateTime(due_date).date}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}