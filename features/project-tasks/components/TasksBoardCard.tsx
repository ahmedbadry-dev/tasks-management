import { CalendarIcon, WarningTriangleIcon } from '@/shared/components/icons'
import { TTask } from '../types'
import { formatDueDate } from '@/utils/formatDueDate'
import { getInitials } from '@/utils/getInitials'
import { cn } from '@/utils/cn'


export const TasksBoardCard = ({ task_id, title, assignee, due_date, status }: TTask) => {
    return (
        <div className={cn("flex flex-col gap-3 rounded-lg bg-white p-3 shadow-sm",
            status === 'BLOCKED' && 'bg-error-container border border-error/40',
            status === 'IN_PROGRESS' && 'border-l-3 border-primary'
        )}>
            <p className="type-body-md font-medium">{title}</p>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-400">
                    {
                        status === 'BLOCKED' ? (
                            <>
                                <WarningTriangleIcon size={13} className='text-error' />
                                <span className="type-label-sm text-error">delayed</span>
                            </>
                        ) : (
                            <>
                                <CalendarIcon size={13} />
                                <span className="type-label-sm">{formatDueDate(due_date)}</span>
                            </>
                        )
                    }
                </div>
                {assignee ? (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                        {getInitials(assignee.name)}
                    </div>
                ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-highest text-xs text-slate-400">
                        ?
                    </div>
                )}
            </div>
        </div>
    )
}

//  <span className='bg-surface-low p-2 rounded-md'><UserIcon /></span>