import { CalendarIcon, UserIcon, WarningTriangleIcon } from '@/shared/components/icons'
import { TTask } from '../types'
import { formatDueDate } from '@/utils/formatDueDate'
import { getInitials } from '@/utils/getInitials'
import { cn } from '@/utils/cn'
import { useAppDispatch } from '@/store/hooks'
import { openModal } from '@/store/uiStore/uiSlice'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Props = TTask & {
    isDragOverlay?: boolean
}

type CardBodyProps = Pick<Props, 'title' | 'assignee' | 'due_date' | 'status'>

const baseCardClassName = (status: string) => (
    cn(
        'flex flex-col gap-3 rounded-lg bg-white p-3 shadow-sm',
        status === 'BLOCKED' && 'bg-error-container border border-error/40',
        status === 'IN_PROGRESS' && 'border-l-3 border-primary'
    )
)

const CardBody = ({ title, assignee, due_date, status }: CardBodyProps) => (
    <>
        <p className="type-body-md font-medium">{title}</p>
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-slate-400">
                {status === 'BLOCKED' ? (
                    <>
                        <WarningTriangleIcon size={13} className="text-error" />
                        <span className="type-label-sm text-error">delayed</span>
                    </>
                ) : (
                    <>
                        <CalendarIcon size={13} />
                        <span className="type-label-sm">{formatDueDate(due_date)}</span>
                    </>
                )}
            </div>
            {assignee ? (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-white">
                    {getInitials(assignee.name)}
                </div>
            ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-highest text-xs text-slate-400">
                    <span><UserIcon size={10} /></span>
                </div>
            )}
        </div>
    </>
)

const DraggableTaskCard = ({
    title,
    assignee,
    due_date,
    status,
    project_id,
    id,
}: Props) => {
    const dispatch = useAppDispatch()
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    const handleClick = () => {
        dispatch(
            openModal({
                modalType: 'TASK_DETAILS',
                payload: { taskId: id, projectId: project_id },
            })
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={handleClick}
            className={cn(baseCardClassName(status), isDragging && 'opacity-40')}
        >
            <CardBody
                title={title}
                assignee={assignee}
                due_date={due_date}
                status={status}
            />
        </div>
    )
}

const OverlayTaskCard = ({ title, assignee, due_date, status }: Props) => (
    <div className={cn(baseCardClassName(status), 'rotate-1 cursor-grabbing shadow-xl')}>
        <CardBody
            title={title}
            assignee={assignee}
            due_date={due_date}
            status={status}
        />
    </div>
)

export const TasksBoardCard = (props: Props) => {
    if (props.isDragOverlay) return <OverlayTaskCard {...props} />
    return <DraggableTaskCard {...props} />
}

