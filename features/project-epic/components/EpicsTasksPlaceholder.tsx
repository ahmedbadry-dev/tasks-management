
import { ListBulletsIcon, PlusIcon } from '@/shared/components/icons'


export const EpicsTasksPlaceholder = ({ handleAddTask }: { handleAddTask: () => void }) => {


  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-3 border-dashed border-surface-highest bg-surface-low p-4">
        <div className="rounded-lg bg-surface-highest p-3">
          <ListBulletsIcon className="text-primary" />
        </div>
        <p className="max-w-50 text-center">No tasks found for this epic</p>
        <button onClick={handleAddTask} className="btn btn-primary rounded-none px-3 py-2 text-xs">
          <PlusIcon />
          Add Task
        </button>
      </div>
    </div>
  )
}
