import { ListBulletsIcon, PlusIcon } from '@/shared/components/icons'

export const EpicsTasksPlaceholder = () => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="type-label-sm text-lg">Tasks</p>
        <button className="btn btn-ghost hidden text-primary md:flex">
          <PlusIcon />
          Add Task
        </button>
        <div className="type-label-sm rounded-2xl bg-surface-highest px-2 py-1 md:hidden">
          <span>0</span> Tasks
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border-3 border-dashed border-surface-highest bg-surface-low p-4">
        <div className="rounded-lg bg-surface-highest p-3">
          <ListBulletsIcon className="text-primary" />
        </div>
        <p className="max-w-50 text-center">No tasks have been added to this epic yet.</p>
        <button className="btn btn-primary rounded-none px-3 py-2 text-xs">
          <PlusIcon />
          Add Task
        </button>
      </div>
    </div>
  )
}
