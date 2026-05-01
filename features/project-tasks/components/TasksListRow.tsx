import { getInitials } from '@/utils/getInitials'
import { TTask } from '../types'
import { UserIcon } from '@/shared/components/icons'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/uiStore/uiSlice'

const formatDueDate = (date: string | null): string => {
    if (!date) return '—'
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    })
}

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

export const TasksListRow = ({ task_id, title, status, due_date, assignee, project_id, id }: TTask) => {

    const dispatch = useAppDispatch()

    const handleClick = () => {
        dispatch(openModal({
            modalType: 'TASK_DETAILS',
            payload: { taskId: id, projectId: project_id },
        }))
    }
    return (
        <tr
            onClick={handleClick}
            className="border-b border-slate-100 hover:bg-surface-low/40">
            <td className="px-8 py-5">
                <span className="type-label-sm font-medium text-primary">{task_id}</span>
            </td>
            <td className="px-8 py-5">
                <span className="type-body-md">{title}</span>
            </td>
            <td className="px-8 py-5">
                <span className={`type-label-sm rounded px-2 py-1 font-medium ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {status.replace(/_/g, ' ')}
                </span>
            </td>
            <td className="px-8 py-5">
                <span className="type-body-md text-slate-500">{formatDueDate(due_date)}</span>
            </td>
            <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                    {assignee?.name ? (
                        <>
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                                {getInitials(assignee.name)}
                            </div>
                            <span className="type-body-md">{assignee.name}</span>
                        </>
                    ) : (
                        <>
                            <span className='flex h-7 w-7 items-center justify-center rounded-full  bg-surface-highest'><UserIcon size={12} /></span>
                            <p className='type-title-md text-[13px] text-slate-600'>Unassigned</p>
                        </>
                    )}
                </div>
            </td>
            <td className="px-8 py-5">
                <button className="btn btn-ghost p-1 text-slate-400">···</button>
            </td>
        </tr>
    )
}
