import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { useUpdateEpic } from '../hooks/useUpdateEpic'

type Props = {
  epicId: string
  projectId: string
  initialTitle: string
  variant?: 'field' | 'header'
  headingId?: string
}

const UPDATE_ERROR_MESSAGE = 'Failed to update epic. Please try again.'

export const EpicsInlineTitleField = ({
  epicId,
  projectId,
  initialTitle,
  variant = 'field',
  headingId,
}: Props) => {
  const updateEpicMutation = useUpdateEpic(epicId, projectId)

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

    try {
      await updateEpicMutation.mutateAsync({
        patch: { title: nextTitle },
        optimisticEpic: { title: nextTitle },
      })
    } catch {
      setValue(previousTitle)
      setIsSaving(false)
      return
    }

    setStableValue(nextTitle)
    setIsSaving(false)
  }, [isSaving, stableValue, updateEpicMutation, value])

  const input = (
    <input
      id={headingId}
      type="text"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => void handleBlur()}
      disabled={isSaving}
      className={
        variant === 'header'
          ? 'w-full min-w-0 rounded-md bg-transparent pr-2 font-[var(--text-heading-3--font-weight)] text-[var(--text-heading-3)] leading-[var(--text-heading-3--line-height)] tracking-[0] text-slate-900 outline-none transition-colors hover:bg-surface-low focus:bg-white focus:ring-2 focus:ring-primary/20 disabled:opacity-70 md:font-[var(--text-heading-2--font-weight)] md:text-[var(--text-heading-2)] md:leading-[var(--text-heading-2--line-height)]'
          : 'field-input mt-1 bg-white'
      }
      aria-label="Epic title"
    />
  )

  if (variant === 'header') return input

  return (
    <div>
      <p className="field-label">Epic Title</p>
      {input}
    </div>
  )
}
