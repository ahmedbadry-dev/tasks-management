import { MemberAvatar } from '@/features/project-members/components/MemberAvatar'
import { formatServerDateTime } from '@/features/projects/utils/formatServerDateTime'
import { TTask } from '../types'
import {
    CalendarIcon,
    CheckCircleIcon2,
    CloseIcon,
    LayersIcon,
    LinkIcon,
    TimerIcon,
    UserIcon,
} from '@/shared/components/icons'

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

const MOBILE_STATUS_STYLES: Record<string, string> = {
    TO_DO: 'bg-slate-200 text-slate-800',
    IN_PROGRESS: 'bg-blue-200 text-blue-800',
    BLOCKED: 'bg-red-200 text-red-800',
    IN_REVIEW: 'bg-yellow-200 text-yellow-800',
    READY_FOR_QA: 'bg-violet-200 text-violet-800',
    REOPENED: 'bg-orange-200 text-orange-800',
    READY_FOR_PRODUCTION: 'bg-green-300 text-green-900',
    DONE: 'bg-emerald-300 text-emerald-900',
}

type Props = {
    task: TTask
    onClose: () => void
}

export const TaskDetailsModalContent = ({ task, onClose }: Props) => {
    const statusLabel = task.status.replace(/_/g, ' ')
    const dueDateLabel = task.due_date ? formatServerDateTime(task.due_date).date : 'No due date'
    const createdAtLabel = formatServerDateTime(task.created_at).date

    return (
        <>
            {/* mobile */}
            <div className="md:hidden bg-[#f2f3f7] px-5 pb-6 pt-3">
                <div className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-slate-300/90" />

                <div className="mb-6 flex items-center justify-between">
                    <span className="type-label-sm text-slate-500">{task.task_id}</span>
                    <button
                        onClick={onClose}
                        className="cursor-pointer p-1 text-slate-600 hover:text-slate-900"
                        aria-label="Close task details"
                    >
                        <CloseIcon size={16} />
                    </button>
                </div>

                <h2 className="mb-5 text-[24px] font-semibold leading-tight tracking-[-0.01em] text-slate-900">
                    {task.title}
                </h2>

                <div className="mb-6 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold uppercase ${MOBILE_STATUS_STYLES[task.status] ?? 'bg-slate-200 text-slate-800'}`}>
                        <CheckCircleIcon2 size={13} />
                        {statusLabel}
                    </span>
                    {task.epic && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-200 px-3 py-1 text-[12px] font-semibold text-slate-700">
                            <LayersIcon size={12} />
                            {task.epic.epic_id}
                        </span>
                    )}
                </div>

                <div className="mb-7 grid grid-cols-2 gap-3">
                    {/* Assignee */}
                    <div className="rounded-xl bg-white/70 p-4">
                        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Assignee</p>
                        {task.assignee?.name ? (
                            <div className="flex items-center gap-2">
                                <MemberAvatar name={task.assignee.name} size={6} textSize={11} />
                                <p className="text-[15px] font-medium text-slate-900">{task.assignee.name}</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <UserIcon size={14} className="text-slate-500" />
                                <p className="text-[14px] font-medium text-slate-700">Unassigned</p>
                            </div>
                        )}
                    </div>

                    {/* Due Date */}
                    <div className="rounded-xl bg-white/70 p-4">
                        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Due Date</p>
                        <div className="flex items-center gap-2 text-slate-900">
                            <CalendarIcon size={14} className="text-blue-600" />
                            <p className="text-[14px] font-semibold">{dueDateLabel}</p>
                        </div>
                    </div>

                    {/* Created By */}
                    <div className="rounded-xl bg-white/70 p-4">
                        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Created By</p>
                        <div className="flex items-center gap-2">
                            <MemberAvatar name={task.created_by.name} size={6} textSize={11} />
                            <p className="text-[14px] font-medium text-slate-900">{task.created_by.name}</p>
                        </div>
                    </div>

                    {/* Created At */}
                    <div className="rounded-xl bg-white/70 p-4">
                        <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Created At</p>
                        <div className="flex items-center gap-2 text-slate-900">
                            <TimerIcon size={14} className="text-slate-500" />
                            <p className="text-[14px] font-semibold">{createdAtLabel}</p>
                        </div>
                    </div>
                </div>

                {/* description */}
                <div>
                    <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-slate-500">Description</p>
                    <div className="rounded-xl bg-white/80 p-5">
                        <p className="text-[14px] leading-relaxed text-slate-600">
                            {task.description ?? 'No description provided for this task yet.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* desktop */}
            <div className="hidden h-full md:grid md:grid-cols-[1fr_260px]">
                {/* Left */}
                <div className="flex h-full flex-col gap-5">

                    {/* Header */}
                    <div className="border-b border-slate-400/20 p-5 pb-2 ">

                        {task && (
                            <>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="type-label-sm shrink-0 bg-surface-highest px-2 py-1 text-[10px] font-semibold text-primary">
                                        {task.task_id}
                                    </span>
                                    {task.epic && (
                                        <div className="type-label-sm flex min-w-0 items-center gap-1 text-slate-600">
                                            <LayersIcon className="shrink-0" />
                                            <span className="wrap-break-word">
                                                {task.epic.epic_id} ({task.epic.title})
                                            </span>
                                        </div>
                                    )}

                                </div>
                                <h2 className="heading-2 mt-2">{task.title}</h2>
                            </>
                        )}

                    </div>

                    {/* body */}
                    <div className='flex-1 p-5'>
                        <div>
                            <p className="type-label-sm mb-2 text-slate-400 ">Description</p>
                            <p className="type-body-md text-slate-600 ">{task.description ?? 'NO Description'}</p>
                        </div>
                    </div>



                    {/* Footer */}
                    <div className="flex items-center justify-between bg-surface-low px-5 py-4">
                        <button className="flex items-center gap-2 text-slate-500 hover:text-slate-900 cursor-pointer">
                            <LinkIcon /> Copy link
                        </button>
                        <button
                            onClick={onClose}
                            className=" bg-surface-highest px-5 py-2 text-[12px] rounded-xs hover:text-primary cursor-pointer">
                            Close
                        </button>
                    </div>

                </div>

                {/* Right */}
                <div className="flex h-full flex-col gap-5 bg-surface-low p-5">
                    {/* Status */}
                    <div className='flex flex-col'>
                        <p className="type-label-sm mb-2 text-slate-400 uppercase">Status</p>
                        <span className={`type-label-sm rounded px-3 py-1.5 font-medium ${STATUS_STYLES[task.status] ?? 'bg-slate-100 text-slate-600'}`}>
                            {statusLabel}
                        </span>
                    </div>

                    {/* Assignee */}
                    <div>
                        <p className="type-label-sm mb-2 text-slate-400 uppercase">Assignee</p>
                        {task.assignee?.name ? (
                            <div className="flex items-center gap-3 rounded-lg bg-white px-3 py-2">
                                <MemberAvatar name={task.assignee.name} size={7} textSize={12} />
                                <div>
                                    <p className="font-semibold">{task.assignee.name}</p>
                                    <p className="text-[10px]">Senior Frontend Engineer</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 rounded-lg bg-white p-3">
                                <UserIcon size={10} />
                                <p>Unassigned</p>
                            </div>
                        )}
                    </div>

                    {/* Reporter */}
                    <div>
                        <p className="type-label-sm mb-2 text-slate-400 uppercase">Reporter</p>
                        <div className="flex items-center gap-3">
                            <MemberAvatar name={task.created_by.name} size={7} textSize={12} />
                            <p className="font-semibold">{task.created_by.name}</p>
                        </div>
                    </div>

                    <div>
                        {/* Due Date */}
                        {task.due_date && (
                            <div className='flex justify-between items-center'>
                                <p className="type-label-sm mb-1 text-slate-400 text-[12px]">Due Date</p>
                                <p className="type-body-md font-semibold">{dueDateLabel}</p>
                            </div>
                        )}

                        {/* Created At */}
                        {task.created_at && (
                            <div className='flex justify-between items-center'>
                                <p className="type-label-sm mb-1 text-slate-400 uppercase">Created At</p>
                                <p className="type-body-md font-semibold">{createdAtLabel}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
