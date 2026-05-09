import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  TaskFieldProps,
  UPDATE_ERROR_MESSAGE,
} from './shared'

export const TaskInlineTitleField = ({ task, onSavePatch }: TaskFieldProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(task.title)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isEditing) setValue(task.title)
  }, [isEditing, task.title])

  const saveTitle = useCallback(async () => {
    if (isSaving) return

    const nextTitle = value.trim()

    if (nextTitle.length < 1) {
      setValue(task.title)
      setIsEditing(false)
      toast.error(UPDATE_ERROR_MESSAGE)
      return
    }

    if (nextTitle === task.title) {
      setValue(task.title)
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    const didSave = await onSavePatch({ title: nextTitle }, { ...task, title: nextTitle })
    if (!didSave) setValue(task.title)
    setIsEditing(false)
    setIsSaving(false)
  }, [isSaving, onSavePatch, task, value])

  if (!isEditing) {
    return (
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="block min-h-10 w-full rounded-md text-left transition-colors hover:bg-surface-low/70 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <h2 className="heading-2 wrap-break-word">{task.title}</h2>
      </button>
    )
  }

  return (
    <input
      autoFocus
      type="text"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onBlur={() => void saveTitle()}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur()
        if (event.key === 'Escape') {
          setValue(task.title)
          setIsEditing(false)
        }
      }}
      disabled={isSaving}
      className="heading-2 block min-h-10 w-full rounded-md bg-white px-0 outline-none ring-2 ring-primary/20 focus:ring-primary/30 disabled:opacity-70"
      aria-label="Task title"
    />
  )
}
