import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Select, { SingleValue } from 'react-select'
import { RequestStatus, TEpic } from '@/features/project-epic/types'
import { LayersIcon } from '@/shared/components/icons'
import {
  FieldLabel,
  getMenuPortalTarget,
  SelectOption,
  selectStyles,
  TaskFieldProps,
} from './shared'
import { BadgeOptionsPortal } from './BadgeOptionsPortal'

type Props = TaskFieldProps & {
  epics: TEpic[]
  epicsStatus: RequestStatus
  epicsError: string | null
  onLoadEpics: () => void
  variant?: 'default' | 'header' | 'mobile-badge'
}

export const TaskInlineEpicField = ({
  task,
  epics,
  epicsStatus,
  epicsError,
  onLoadEpics,
  onSavePatch,
  variant = 'default',
}: Props) => {
  const [isSaving, setIsSaving] = useState(false)
  const [isBadgeMenuOpen, setIsBadgeMenuOpen] = useState(false)
  const badgeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    onLoadEpics()
  }, [onLoadEpics])

  const options = useMemo<SelectOption[]>(
    () => [
      { label: 'No epic', value: '' },
      ...epics.map((epic) => ({
        label: `${epic.epic_id} (${epic.title})`,
        value: epic.id,
      })),
    ],
    [epics]
  )

  const currentEpicExists = useMemo(
    () => !task.epic_id || epics.some((epic) => epic.id === task.epic_id),
    [epics, task.epic_id]
  )
  const value = currentEpicExists ? task.epic_id ?? '' : ''
  const selectedOption = options.find((option) => option.value === value) ?? options[0]

  const saveEpic = useCallback(
    async (nextEpicId: string | null) => {
      const currentEpicId = currentEpicExists ? task.epic_id : null
      if (isSaving || nextEpicId === currentEpicId) return

      const nextEpic = epics.find((epic) => epic.id === nextEpicId) ?? null
      setIsSaving(true)
      await onSavePatch(
        { epic_id: nextEpicId },
        {
          ...task,
          epic_id: nextEpicId,
          epic: nextEpic
            ? {
                id: nextEpic.id,
                title: nextEpic.title,
                epic_id: nextEpic.epic_id,
              }
            : null,
        }
      )
      setIsSaving(false)
    },
    [currentEpicExists, epics, isSaving, onSavePatch, task]
  )

  useEffect(() => {
    if (epicsStatus !== 'succeeded' || currentEpicExists || !task.epic_id) return
    void saveEpic(null)
  }, [currentEpicExists, epicsStatus, saveEpic, task.epic_id])

  if (variant === 'mobile-badge') {
    return (
      <>
        <button
          ref={badgeRef}
          type="button"
          disabled={isSaving}
          onClick={() => setIsBadgeMenuOpen(true)}
          className="inline-flex items-center gap-1 rounded-full bg-blue-200 px-3 py-1 text-[12px] font-semibold text-slate-700"
        >
          <LayersIcon size={12} />
          {task.epic ? task.epic.epic_id : 'No epic'}
        </button>
        {isBadgeMenuOpen && (
          <BadgeOptionsPortal
            anchor={badgeRef.current}
            options={options}
            activeValue={selectedOption.value}
            minWidth={260}
            onSelect={(nextValue) => {
              setIsBadgeMenuOpen(false)
              void saveEpic(nextValue || null)
            }}
            onClose={() => setIsBadgeMenuOpen(false)}
          />
        )}
      </>
    )
  }

  const isHeader = variant === 'header'
  const headerControlStyles = {
    ...selectStyles,
    control: (base: any) => ({
      ...base,
      minHeight: 22,
      borderColor: 'transparent',
      boxShadow: 'none',
      backgroundColor: 'transparent',
      borderRadius: 4,
      padding: 0,
      ':hover': { borderColor: 'transparent' },
    }),
    valueContainer: (base: any) => ({ ...base, padding: 0 }),
    indicatorsContainer: (base: any) => ({ ...base, padding: 0, marginLeft: 4 }),
    input: (base: any) => ({ ...base, margin: 0, padding: 0 }),
    placeholder: (base: any) => ({ ...base, margin: 0 }),
    singleValue: (base: any) => ({ ...base, margin: 0, color: '#4F5F7B', fontSize: 11 }),
    indicatorSeparator: () => ({ display: 'none' }),
    dropdownIndicator: () => ({ display: 'none' }),
  }
  const defaultControlStyles = {
    ...selectStyles,
    control: (base: any, state: any) => ({
      ...base,
      minHeight: 40,
      borderColor: 'transparent',
      boxShadow: state.isFocused ? '0 0 0 2px rgb(0 54 181 / 0.12)' : 'none',
      backgroundColor: '#ffffff',
      borderRadius: 8,
      ':hover': { borderColor: 'transparent' },
    }),
    dropdownIndicator: () => ({ display: 'none' }),
    indicatorSeparator: () => ({ display: 'none' }),
  }

  return (
    <div>
      {!isHeader && <FieldLabel>Epic</FieldLabel>}

      {epicsStatus === 'failed' ? (
        <div className="flex min-h-10 items-center gap-2">
          <p className="type-label-sm text-error">{epicsError ?? 'Failed to load epics.'}</p>
          <button type="button" onClick={onLoadEpics} className="btn btn-ghost px-2 py-1 text-primary">
            Retry
          </button>
        </div>
      ) : (
        <Select
          isDisabled={isSaving || epicsStatus === 'loading'}
          isLoading={epicsStatus === 'loading'}
          options={options}
          value={selectedOption}
          onChange={(option: SingleValue<SelectOption>) => {
            if (!option) return
            void saveEpic(option.value || null)
          }}
          menuPortalTarget={getMenuPortalTarget()}
          menuPosition="fixed"
          styles={isHeader ? headerControlStyles : defaultControlStyles}
        />
      )}
    </div>
  )
}
