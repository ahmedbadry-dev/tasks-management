import { useCallback, useMemo, useRef, useState } from 'react'
import Select, { SingleValue } from 'react-select'
import { CheckCircleIcon2 } from '@/shared/components/icons'
import { TASK_STATUS_OPTIONS } from '../../constants'
import {
  FieldLabel,
  getMenuPortalTarget,
  SelectOption,
  selectStyles,
  TaskFieldProps,
} from './shared'
import { BadgeOptionsPortal } from './BadgeOptionsPortal'

const STATUS_STYLES: Record<string, string> = {
  TO_DO: 'bg-slate-100 text-slate-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-600',
  BLOCKED: 'bg-red-100 text-red-600',
  IN_REVIEW: 'bg-yellow-100 text-yellow-600',
  READY_FOR_QA: 'bg-purple-100 text-purple-600',
  REOPENED: 'bg-orange-100 text-orange-600',
  READY_FOR_PRODUCTION: 'bg-green-100 text-green-600',
  DONE: 'bg-emerald-100 text-emerald-600',
}

const STATUS_THEME: Record<string, { bg: string; text: string }> = {
  TO_DO: { bg: '#f1f5f9', text: '#475569' },
  IN_PROGRESS: { bg: '#dbeafe', text: '#2563eb' },
  BLOCKED: { bg: '#fee2e2', text: '#dc2626' },
  IN_REVIEW: { bg: '#fef3c7', text: '#ca8a04' },
  READY_FOR_QA: { bg: '#ede9fe', text: '#7c3aed' },
  REOPENED: { bg: '#ffedd5', text: '#ea580c' },
  READY_FOR_PRODUCTION: { bg: '#dcfce7', text: '#16a34a' },
  DONE: { bg: '#d1fae5', text: '#059669' },
}

type Props = TaskFieldProps & {
  variant?: 'default' | 'mobile-badge'
}

export const TaskInlineStatusField = ({
  task,
  onSavePatch,
  variant = 'default',
}: Props) => {
  const [isSaving, setIsSaving] = useState(false)
  const [isBadgeMenuOpen, setIsBadgeMenuOpen] = useState(false)
  const badgeRef = useRef<HTMLButtonElement | null>(null)

  const options = TASK_STATUS_OPTIONS.map((status) => ({
    label: status.label,
    value: status.value,
  }))
  const selectedOption =
    options.find((option) => option.value === task.status) ?? options[0]
  const selectedTheme = STATUS_THEME[selectedOption.value] ?? STATUS_THEME.TO_DO

  const inlineStyles = useMemo(
    () => ({
      ...selectStyles,
      control: (base: any) => ({
        ...base,
        minHeight: 40,
        borderColor: 'transparent',
        boxShadow: 'none',
        backgroundColor: selectedTheme.bg,
        color: selectedTheme.text,
        borderRadius: 8,
        ':hover': { borderColor: 'transparent' },
      }),
      valueContainer: (base: any) => ({ ...base, paddingLeft: 10, paddingRight: 8 }),
      singleValue: (base: any) => ({
        ...base,
        margin: 0,
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        color: selectedTheme.text,
      }),
      dropdownIndicator: (base: any) => ({ ...base, color: selectedTheme.text }),
      indicatorSeparator: () => ({ display: 'none' }),
    }),
    [selectedTheme.bg, selectedTheme.text]
  )

  const handleChange = useCallback(
    async (nextStatus: string) => {
      if (isSaving || nextStatus === task.status) return
      setIsSaving(true)
      await onSavePatch({ status: nextStatus }, { ...task, status: nextStatus })
      setIsSaving(false)
    },
    [isSaving, onSavePatch, task]
  )

  if (variant === 'mobile-badge') {
    return (
      <>
        <button
          ref={badgeRef}
          type="button"
          disabled={isSaving}
          onClick={() => setIsBadgeMenuOpen(true)}
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold uppercase ${
            STATUS_STYLES[selectedOption.value] ?? 'bg-slate-100 text-slate-600'
          }`}
        >
          <CheckCircleIcon2 size={13} />
          {selectedOption.label}
        </button>
        {isBadgeMenuOpen && (
          <BadgeOptionsPortal
            anchor={badgeRef.current}
            options={options}
            activeValue={selectedOption.value}
            onSelect={(value) => void handleChange(value)}
            onClose={() => setIsBadgeMenuOpen(false)}
          />
        )}
      </>
    )
  }

  return (
    <div>
      <FieldLabel>Status</FieldLabel>
      <Select
        isDisabled={isSaving}
        options={options}
        value={selectedOption}
        onChange={(option: SingleValue<SelectOption>) => {
          if (!option) return
          void handleChange(option.value)
        }}
        formatOptionLabel={(option) => (
          <span
            className={`type-label-sm inline-flex rounded px-2 py-1 font-medium ${
              STATUS_STYLES[option.value] ?? 'bg-slate-100 text-slate-600'
            }`}
          >
            {option.label}
          </span>
        )}
        menuPortalTarget={getMenuPortalTarget()}
        menuPosition="fixed"
        styles={inlineStyles}
      />
    </div>
  )
}
