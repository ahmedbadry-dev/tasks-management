import { TTask } from '../types'
import { TasksListRow } from './TasksListRow'

type Props = {
    tasks: TTask[]
}

export const TasksListTable = ({ tasks }: Props) => {
    if (tasks.length === 0) {
        return (
            <p className="type-body-md py-10 text-center text-slate-400">
                No tasks found
            </p>
        )
    }

    return (
        <div className="flex flex-1 flex-col overflow-hidden rounded-lg border-3 border-surface-highest/50 shadow-[0px_1px_2px_0px_#0000000D]">
            <table className="w-full border-separate border-spacing-0 bg-white">
                <thead>
                    <tr className="bg-surface-low type-label-sm text-slate-900">
                        <th className="type-label-sm px-8 py-5 text-left text-slate-900">TASK ID</th>
                        <th className="type-label-sm px-8 py-5 text-left text-slate-900">TITLE</th>
                        <th className="type-label-sm px-8 py-5 text-left text-slate-900">STATUS</th>
                        <th className="type-label-sm px-8 py-5 text-left text-slate-900">DUE DATE</th>
                        <th className="type-label-sm px-8 py-5 text-left text-slate-900">ASSIGNEE</th>
                        <th className="px-8 py-5" />
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <TasksListRow key={task.id} {...task} />
                    ))}
                </tbody>
            </table>
        </div>
    )
}
