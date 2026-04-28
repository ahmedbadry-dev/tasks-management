import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { updateProjectEpicAction } from '../actions/updateProjectEpicAction'

type Props = {
  epicId: string
  initialTitle: string
}

const UPDATE_ERROR_MESSAGE = 'Failed to update epic. Please try again.'

export const EpicsInlineTitleField = ({ epicId, initialTitle }: Props) => {
  // `value` is the live value being edited by the user.
  const [value, setValue] = useState(initialTitle)

  // `stableValue` stores the last successfully persisted title.
  // We use it to avoid unnecessary API calls and to rollback on errors.
  const [stableValue, setStableValue] = useState(initialTitle)
  const [isSaving, setIsSaving] = useState(false)

  const handleBlur = useCallback(async () => {
    if (isSaving) return

    const nextTitle = value.trim()

    // Title is required and must be at least 3 chars.
    if (nextTitle.length < 3) {
      setValue(stableValue)
      toast.error(UPDATE_ERROR_MESSAGE)
      return
    }

    // Nothing changed after trimming, so we keep UI normalized and skip network.
    if (nextTitle === stableValue) {
      setValue(stableValue)
      return
    }

    const previousTitle = stableValue
    setValue(nextTitle)
    setIsSaving(true)

    const result = await updateProjectEpicAction(epicId, { title: nextTitle })

    if (!result.ok) {
      setValue(previousTitle)
      toast.error(UPDATE_ERROR_MESSAGE)
      setIsSaving(false)
      return
    }

    setStableValue(nextTitle)
    toast.success('Epic updated successfully!')
    setIsSaving(false)
  }, [epicId, isSaving, stableValue, value])

  return (
    <div>
      <p className="field-label">Epic Title</p>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={() => void handleBlur()}
        disabled={isSaving}
        className="field-input mt-1 bg-white"
        aria-label="Epic title"
      />
    </div>
  )
}
