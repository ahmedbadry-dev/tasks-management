'use client'

import { TASK_STATUS_OPTIONS } from '../constants'
import { TasksBoardColumn } from './TasksBoardColumn'

type Props = {
    projectId: string
}

export const TasksBoardView = ({ projectId }: Props) => {
    return (
        <div
            className="flex h-full gap-4 overflow-x-auto pb-4"
        >
            {TASK_STATUS_OPTIONS.map((status) => (
                <TasksBoardColumn
                    key={status.value}
                    projectId={projectId}
                    status={status.value}
                    statusLabel={status.label}
                />
            ))}
        </div>
    )
}
