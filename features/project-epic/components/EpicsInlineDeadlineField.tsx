import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { updateProjectEpicAction } from '../actions/updateProjectEpicAction'

type Props = {
  epicId: string
  initialDeadline: string
}

const UPDATE_ERROR_MESSAGE = 'Failed to update epic. Please try again.'

export const EpicsInlineDeadlineField = ({ epicId, initialDeadline }: Props) => {
  // Live date shown in the date picker.
  const [value, setValue] = useState(initialDeadline)

  // Last persisted date value for rollback.
  const [stableValue, setStableValue] = useState(initialDeadline)
  const [isSaving, setIsSaving] = useState(false)

  const handleChange = useCallback(
    async (nextDate: string) => {
      if (isSaving) return

      setValue(nextDate)

      if (nextDate === stableValue) return

      const previousValue = stableValue
      setIsSaving(true)

      // Empty string maps to null to remove deadline.
      const result = await updateProjectEpicAction(epicId, {
        deadline: nextDate || null,
      })

      if (!result.ok) {
        setValue(previousValue)
        setIsSaving(false)
        toast.error(UPDATE_ERROR_MESSAGE)
        return
      }

      setStableValue(nextDate)
      setIsSaving(false)
      toast.success('Epic updated successfully!')
    },
    [epicId, isSaving, stableValue]
  )

  return (
    <div>
      <h5 className="mb-1 type-label-sm text-slate-400">Deadline</h5>
      <input
        type="date"
        className="field-input bg-white pl-0"
        value={value}
        onChange={(event) => void handleChange(event.target.value)}
        disabled={isSaving}
      />
    </div>
  )
}
