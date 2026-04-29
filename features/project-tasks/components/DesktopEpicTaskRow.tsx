

import { TTask } from '../types'
import { MemberAvatar } from '@/features/project-members/components/MemberAvatar'
import { CalendarIcon, CheckCircleIcon2 } from '@/shared/components/icons'
import { formatDueDate } from '@/utils/formatDueDate'



export const DesktopEpicTaskRow = ({ title, assignee, assignee_name, assignee_avatar, due_date }: TTask) => {
    const assigneeName = assignee?.name ?? assignee_name ?? 'Unassigned'
    const assigneeAvatar = assignee?.avatar_url ?? assignee?.avatar ?? assignee_avatar ?? null
    const dueDateLabel = formatDueDate(due_date)

    return (
        <div className='rounded-2xl border border-surface-highest bg-white px-5 py-3 shadow-[0px_1px_2px_0px_#0000000D]'>
            {/* desktop */}
            <div className='hidden md:flex justify-between items-center'>
                <div className='flex gap-4 items-center'>
                    <CheckCircleIcon2 name={assigneeName} size={20} className='text-slate-400' />
                    <div className='mb-2 flex flex-col'>
                        <p className='type-title-md text-slate-900 mb-1'>{title}</p>
                        <div className='flex items-center gap-2'>
                            <MemberAvatar name={assigneeName} size={5} textSize={8} avatarUrl={assigneeAvatar} />
                            <p className='type-title-md text-[12px] text-slate-600'>{assigneeName}</p>
                        </div>
                    </div>
                </div>

                <div >
                    <p className='type-label-sm text-[10px] mb-1 text-end '>due date</p>
                    <div className='flex items-center gap-2 text-slate-400'>
                        <CalendarIcon size={12} />
                        <p className='type-body-md text-slate-400'>{dueDateLabel}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
