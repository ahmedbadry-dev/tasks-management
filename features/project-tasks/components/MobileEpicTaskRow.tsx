

import { TTask } from '../types'
import { MemberAvatar } from '@/features/project-members/components/MemberAvatar'
import { CalendarIcon, InfoCircleIcon, MoreVerticalIcon, UserIcon } from '@/shared/components/icons'
import { formatDueDate } from '@/utils/formatDueDate'



export const MobileEpicTaskRow = ({ title, assignee, assignee_name, assignee_avatar, due_date }: TTask) => {
    const assigneeName = assignee?.name ?? assignee_name ?? 'Unassigned'
    const assigneeAvatar = assignee?.avatar_url ?? assignee?.avatar ?? assignee_avatar ?? null
    const dueDateLabel = formatDueDate(due_date)




    return (
        <div className='rounded-2xl border border-surface-highest bg-white px-5 py-4 shadow-[0px_1px_2px_0px_#0000000D]'>
            {/* mobile */}
            <div className='md:hidden'>
                <div className='mb-2 flex items-start justify-between'>
                    <p className='type-title-md flex-1 text-[20px] font-semibold leading-tight text-slate-900'>{title}</p>
                    <button type='button' aria-label='Task actions' className='text-slate-400'>
                        <MoreVerticalIcon size={12} />
                    </button>
                </div>
                <div className='flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-2'>
                        {
                            assigneeName !== 'Unassigned' ? (
                                <>
                                    <MemberAvatar name={assigneeName} size={5} textSize={8} avatarUrl={assigneeAvatar} />
                                    <p className='type-title-md text-[12px] text-slate-600'>{assigneeName}</p>
                                </>
                            ) : (
                                <>
                                    <span className='bg-surface-low p-2 rounded-md'><UserIcon /></span>
                                    <p className='type-title-md text-[12px] text-slate-600'>Unassigned</p>
                                </>
                            )
                        }
                    </div>
                    <div className='flex items-center gap-2 text-slate-400'>

                        {
                            assignee?.name ? (
                                <>
                                    <CalendarIcon size={12} />
                                    <p className='type-body-md text-[10px] font-semibold text-slate-400'>{dueDateLabel}</p>
                                </>
                            ) : (
                                <>
                                    <InfoCircleIcon size={12} className='text-error' />
                                    <p className='type-body-md text-[10px] font-semibold text-error'>Overdue</p>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}
