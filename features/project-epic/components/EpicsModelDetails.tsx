import { RequestStatus, TEpicDetails, TMember } from '../types'
import { formatServerDateTime } from '@/features/projects/utils/formatServerDateTime'
import { EpicsInlineDescriptionField } from './EpicsInlineDescriptionField'
import { EpicsInlineAssigneeField } from './EpicsInlineAssigneeField'
import { EpicsInlineDeadlineField } from './EpicsInlineDeadlineField'
import { EpicsCreatedByField } from './EpicsCreatedByField'
import { EpicsCreatedAtField } from './EpicsCreatedAtField'
import { EpicTasksList } from '@/features/project-tasks/components/EpicTasksList'
import { useEpicTasks } from '@/features/project-tasks/hooks/useEpicTasks'
import { useRouter } from 'next/navigation'
import { routes } from '@/lib/routes'
import { PlusIcon } from '@/shared/components/icons'
import { useAppDispatch } from '@/store/hooks'
import { closeModal } from '@/store/uiStore/uiSlice'

type Props = {
  selectedEpic: TEpicDetails
  detailsStatus: RequestStatus
  detailsError: string | null
  isRefreshing: boolean
  onRetry: () => void
  members: TMember[]
  membersStatus: RequestStatus
  membersError: string | null
  onLoadMembers: () => void
}

const toDateInputValue = (value?: string | null) => {
  if (!value) return ''
  const parsedDate = new Date(value)
  if (Number.isNaN(parsedDate.getTime())) return ''
  return parsedDate.toISOString().split('T')[0]
}

export const EpicsModelDetails = ({
  selectedEpic,
  detailsStatus,
  detailsError,
  isRefreshing,
  onRetry,
  members,
  membersStatus,
  membersError,
  onLoadMembers,
}: Props) => {
  const dispatch = useAppDispatch()
  const createdByName = selectedEpic.created_by?.name ?? '-'
  const createdAtDate = selectedEpic.created_at
    ? formatServerDateTime(selectedEpic.created_at).date
    : '-'
  const router = useRouter()
  const epicId = selectedEpic.id
  const { tasks, status, error, retry } = useEpicTasks({
    isOpen: true,
    epicId,
  })




  const handleAddTask = () => {
    dispatch(closeModal())
    router.push(routes.project.newTask(selectedEpic.project_id, { epicId: selectedEpic.id }))
  }

  return (
    <>
      {isRefreshing && (
        <div className="flex items-center gap-2 text-slate-400" aria-live="polite">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-primary" />
          <span className="type-label-sm">Refreshing details...</span>
        </div>
      )}

      {detailsStatus === 'failed' && (
        <div className="flex items-center justify-between rounded-lg border border-error/20 bg-error-container/60 p-3">
          <p className="type-body-md text-error">
            {detailsError ?? 'Could not refresh latest details.'}
          </p>
          <button type="button" onClick={onRetry} className="btn btn-ghost px-2 py-1 text-primary">
            Retry
          </button>
        </div>
      )}

      {/* Independent field component with isolated description update logic */}
      <EpicsInlineDescriptionField
        epicId={selectedEpic.id}
        initialDescription={selectedEpic.description ?? ''}
      />

      {/* Metadata layout:
          - mobile: 2 columns 
          - desktop: 3 items in first row
      */}
      <div className="grid grid-cols-2 gap-4 border-b border-slate-400/20 pb-4 md:grid-cols-3">
        <EpicsCreatedByField createdByName={createdByName} />

        <EpicsInlineAssigneeField
          epicId={selectedEpic.id}
          initialAssigneeId={selectedEpic.assignee?.sub ?? null}
          initialAssigneeName={selectedEpic.assignee?.name ?? 'Unassigned'}
          members={members}
          membersStatus={membersStatus}
          membersError={membersError}
          onLoadMembers={onLoadMembers}
        />

        <EpicsInlineDeadlineField
          epicId={selectedEpic.id}
          initialDeadline={toDateInputValue(selectedEpic.deadline)}
        />

        <div className="col-span-1 md:col-span-3">
          <EpicsCreatedAtField createdAtDate={createdAtDate} />
        </div>
      </div>

      {/* <EpicsTasksPlaceholder epic={selectedEpic} /> */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="type-label-sm text-lg">Tasks</p>
          <button onClick={handleAddTask} className="btn btn-ghost hidden text-primary md:flex">
            <PlusIcon />
            Add Task
          </button>
          <div className="type-label-sm rounded-2xl bg-surface-highest px-2 py-1 md:hidden">
            <span>{tasks.length}</span> Tasks
          </div>
        </div>
        <EpicTasksList
          tasks={tasks}
          status={status}
          error={error}
          onRetry={retry}
          handleAddTask={handleAddTask}
        />
      </div>
    </>
  )
}
