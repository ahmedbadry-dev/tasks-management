import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { updateProjectEpicAction } from '../actions/updateProjectEpicAction'
import { useAppDispatch } from '@/store/hooks'
import { upsertEpicPatch } from '@/store/projectEpicPatchesStore/projectEpicPatchesSlice'

type Props = {
  epicId: string
  initialDescription: string
}

const UPDATE_ERROR_MESSAGE = 'Failed to update epic. Please try again.'

export const EpicsInlineDescriptionField = ({
  epicId,
  initialDescription,
}: Props) => {
  const dispatch = useAppDispatch()

  // Click-to-edit mode for the description field.
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Live textarea value.
  const [value, setValue] = useState(initialDescription)

  // Last saved value for change detection and rollback.
  const [stableValue, setStableValue] = useState(initialDescription)

  const openEditor = useCallback(() => {
    if (isSaving) return
    setIsEditing(true)
  }, [isSaving])

  const handleBlur = useCallback(async () => {
    if (isSaving) return

    setIsEditing(false)

    const raw = value ?? ''
    const nextDescription = raw.trim() === '' ? null : raw
    const stableAsNullable = stableValue.trim() === '' ? null : stableValue

    if (nextDescription === stableAsNullable) {
      setValue(stableValue)
      return
    }

    const previousValue = stableValue
    setValue(nextDescription ?? '')
    setIsSaving(true)

    const result = await updateProjectEpicAction(epicId, {
      description: nextDescription,
    })

    if (!result.ok) {
      setValue(previousValue)
      toast.error(UPDATE_ERROR_MESSAGE)
      setIsSaving(false)
      return
    }

    setStableValue(nextDescription ?? '')
    dispatch(
      upsertEpicPatch({
        epicId,
        patch: { description: nextDescription },
      })
    )
    toast.success('Epic updated successfully!')
    setIsSaving(false)
  }, [dispatch, epicId, isSaving, stableValue, value])

  return (
    <div>
      <p className="type-label-sm text-slate-400">Description</p>

      {!isEditing && (
        <button
          type="button"
          onClick={openEditor}
          className="mt-1 w-full rounded-md border border-slate-200/30 bg-surface-low/30 px-3 py-2 text-left whitespace-pre-wrap wrap-break-word"
          disabled={isSaving}
        >
          {value.trim() === '' ? 'No description provided' : value}
        </button>
      )}

      {isEditing && (
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => void handleBlur()}
          disabled={isSaving}
          rows={4}
          maxLength={500}
          className="field-input mt-2 w-full max-w-full resize-none whitespace-pre-wrap wrap-break-word overflow-y-auto"
          placeholder="Describe the scope and objectives of this epic..."
        />
      )}
    </div>
  )
}
