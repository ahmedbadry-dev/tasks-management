import { MemberAvatar } from '@/features/project-members/components/MemberAvatar'
import { formatServerDateTime } from '@/features/projects/utils/formatServerDateTime'
import { RequestStatus, TMember, TEpic } from '@/features/project-epic/types'
import { TTask, TUpdateTaskPatch } from '../types'
import {
    CloseIcon,
    LinkIcon,
    TimerIcon,
} from '@/shared/components/icons'
import {
    TaskInlineAssigneeField,
    TaskInlineDescriptionField,
    TaskInlineDueDateField,
    TaskInlineEpicField,
    TaskInlineStatusField,
    TaskInlineTitleField,
} from './TaskInlineFields'

type Props = {
    task: TTask
    onClose: () => void
    members: TMember[]
    membersStatus: RequestStatus
    membersError: string | null
    onLoadMembers: () => void
    epics: TEpic[]
    epicsStatus: RequestStatus
    epicsError: string | null
    onLoadEpics: () => void
    onSavePatch: (patch: TUpdateTaskPatch, nextTask: TTask) => Promise<boolean>
}

export const TaskDetailsModalContent = ({
    task,
    onClose,
    members,
    membersStatus,
    membersError,
    onLoadMembers,
    epics,
    epicsStatus,
    epicsError,
    onLoadEpics,
    onSavePatch,
}: Props) => {
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

                <div className="mb-5">
                    <TaskInlineTitleField task={task} onSavePatch={onSavePatch} />
                </div>

                <div className="mb-6 flex flex-wrap items-center gap-2">
                    <TaskInlineStatusField task={task} onSavePatch={onSavePatch} variant="mobile-badge" />
                    <TaskInlineEpicField
                        task={task}
                        epics={epics}
                        epicsStatus={epicsStatus}
                        epicsError={epicsError}
                        onLoadEpics={onLoadEpics}
                        onSavePatch={onSavePatch}
                        variant="mobile-badge"
                    />
                </div>

                <div className="mb-7 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-white/70 p-4">
                        <TaskInlineAssigneeField
                            task={task}
                            members={members}
                            membersStatus={membersStatus}
                            membersError={membersError}
                            onLoadMembers={onLoadMembers}
                            onSavePatch={onSavePatch}
                        />
                    </div>

                    <div className="rounded-xl bg-white/70 p-4">
                        <TaskInlineDueDateField task={task} onSavePatch={onSavePatch} />
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
                    <TaskInlineDescriptionField task={task} onSavePatch={onSavePatch} />
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
                                    <TaskInlineEpicField
                                        task={task}
                                        epics={epics}
                                        epicsStatus={epicsStatus}
                                        epicsError={epicsError}
                                        onLoadEpics={onLoadEpics}
                                        onSavePatch={onSavePatch}
                                        variant="header"
                                    />

                                </div>
                                <div className="mt-2">
                                    <TaskInlineTitleField task={task} onSavePatch={onSavePatch} />
                                </div>
                            </>
                        )}

                    </div>

                    {/* body */}
                    <div className='flex-1 p-5'>
                        <TaskInlineDescriptionField task={task} onSavePatch={onSavePatch} />
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
                    <TaskInlineStatusField task={task} onSavePatch={onSavePatch} />

                    {/* Assignee */}
                    <TaskInlineAssigneeField
                        task={task}
                        members={members}
                        membersStatus={membersStatus}
                        membersError={membersError}
                        onLoadMembers={onLoadMembers}
                        onSavePatch={onSavePatch}
                    />

                    {/* Reporter */}
                    <div>
                        <p className="type-label-sm mb-2 text-slate-400 uppercase">Reporter</p>
                        <div className="flex items-center gap-3">
                            <MemberAvatar name={task.created_by.name} size={7} textSize={12} />
                            <p className="font-semibold">{task.created_by.name}</p>
                        </div>
                    </div>

                    <div>
                        <TaskInlineDueDateField task={task} onSavePatch={onSavePatch} />

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
