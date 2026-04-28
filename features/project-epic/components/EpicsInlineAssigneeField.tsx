import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { MemberAvatar } from '@/features/project-members/components/MemberAvatar'
import { updateProjectEpicAction } from '../actions/updateProjectEpicAction'
import { RequestStatus, TMember } from '../types'

type Props = {
  epicId: string
  initialAssigneeId: string | null
  initialAssigneeName: string
  members: TMember[]
  membersStatus: RequestStatus
  membersError: string | null
  onLoadMembers: () => void
}

const UPDATE_ERROR_MESSAGE = 'Failed to update epic. Please try again.'

type AssigneeState = {
  id: string | null
  name: string
}

export const EpicsInlineAssigneeField = ({
  epicId,
  initialAssigneeId,
  initialAssigneeName,
  members,
  membersStatus,
  membersError,
  onLoadMembers,
}: Props) => {
  // Assignee is shown as display mode first, then turns into picker mode on click.
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Live assignee shown in the UI.
  const [value, setValue] = useState<AssigneeState>({
    id: initialAssigneeId,
    name: initialAssigneeName,
  })

  // Last persisted assignee for rollback 
  const [stableValue, setStableValue] = useState<AssigneeState>({
    id: initialAssigneeId,
    name: initialAssigneeName,
  })

  const openEditor = useCallback(() => {
    if (isSaving) return
    setIsEditing(true)
    onLoadMembers()
  }, [isSaving, onLoadMembers])

  const selectAssignee = useCallback(
    async (member: TMember | null) => {
      if (isSaving) return

      const nextId = member?.user_id ?? null
      const nextName = member?.metadata.name ?? 'Unassigned'

      if (nextId === stableValue.id) {
        setIsEditing(false)
        return
      }

      const previousValue = stableValue
      setValue({ id: nextId, name: nextName })
      setIsSaving(true)

      const result = await updateProjectEpicAction(epicId, { assignee_id: nextId })

      if (!result.ok) {
        setValue(previousValue)
        setIsEditing(false)
        setIsSaving(false)
        toast.error(UPDATE_ERROR_MESSAGE)
        return
      }

      setStableValue({ id: nextId, name: nextName })
      setIsEditing(false)
      setIsSaving(false)
      toast.success('Epic updated successfully!')
    },
    [epicId, isSaving, stableValue]
  )

  const canShowList = isEditing && membersStatus === 'succeeded'

  return (
    <div className="relative">
      <h5 className="mb-1 type-label-sm text-slate-400">Assignee</h5>

      {!isEditing && (
        <button
          type="button"
          onClick={openEditor}
          className="field-input flex w-full items-center gap-2 bg-white pl-0 text-left"
          disabled={isSaving}
        >
          <MemberAvatar name={value.name} size={8} textSize={12} />
          <p className="text-xs md:text-sm">{value.name}</p>
        </button>
      )}

      {isEditing && membersStatus === 'loading' && (
        <p className="type-label-sm text-slate-500">Loading members...</p>
      )}

      {isEditing && membersStatus === 'failed' && (
        <div className="flex items-center gap-2">
          <p className="type-label-sm text-error">
            {membersError ?? 'Failed to load project members.'}
          </p>
          <button
            type="button"
            className="btn btn-ghost px-2 py-1 text-primary"
            onClick={onLoadMembers}
          >
            Retry
          </button>
        </div>
      )}

      {canShowList && (
        <div className="mt-1 flex max-h-44 flex-col gap-1 overflow-auto rounded-md border border-slate-200 p-2">
          <button
            type="button"
            className="flex items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-slate-50"
            onClick={() => void selectAssignee(null)}
            disabled={isSaving}
          >
            <MemberAvatar name="Unassigned" size={8} textSize={12} />
            <span>Unassigned</span>
          </button>

          {members.map((member) => (
            <button
              key={member.user_id}
              type="button"
              className="flex items-center gap-2 rounded-md px-2 py-1 text-left hover:bg-slate-50"
              onClick={() => void selectAssignee(member)}
              disabled={isSaving}
            >
              <MemberAvatar name={member.metadata.name} size={8} textSize={12} />
              <span>{member.metadata.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
