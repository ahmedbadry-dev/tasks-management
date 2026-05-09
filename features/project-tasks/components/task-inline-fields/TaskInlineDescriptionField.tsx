import { useCallback, useEffect, useState } from 'react'
import { cn } from '@/utils/cn'
import { FieldLabel, TaskFieldProps } from './shared'

export const TaskInlineDescriptionField = ({
  task,
  onSavePatch,
}: TaskFieldProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(task.description ?? '')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!isEditing) setValue(task.description ?? '')
  }, [isEditing, task.description])

  const saveDescription = useCallback(async () => {
    if (isSaving) return

    const nextDescription = value.trim() || null
    const currentDescription = task.description?.trim() || null

    if (nextDescription === currentDescription) {
      setValue(task.description ?? '')
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    const didSave = await onSavePatch(
      { description: nextDescription },
      { ...task, description: nextDescription }
    )
    if (!didSave) setValue(task.description ?? '')
    setIsEditing(false)
    setIsSaving(false)
  }, [isSaving, onSavePatch, task, value])

  return (
    <div>
      <FieldLabel>Description</FieldLabel>

      {!isEditing ? (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex min-h-36 w-full items-start justify-start rounded-lg text-left transition-colors hover:bg-surface-low/70 focus-visible:outline-2 focus-visible:outline-primary"
        >
          <p className={cn('type-body-md whitespace-pre-wrap', !task.description && 'text-slate-400')}>
            {task.description || 'No description provided'}
          </p>
        </button>
      ) : (
        <textarea
          autoFocus
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onBlur={() => void saveDescription()}
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              setValue(task.description ?? '')
              setIsEditing(false)
            }
          }}
          disabled={isSaving}
          rows={6}
          placeholder="No description provided"
          className="type-body-md block min-h-36 w-full resize-none rounded-lg bg-white p-0 outline-none ring-2 ring-primary/20 focus:ring-primary/30 disabled:opacity-70"
          aria-label="Task description"
        />
      )}
    </div>
  )
}
