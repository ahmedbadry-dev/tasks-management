import { useCallback, useMemo, useState } from 'react'
import Select, { SingleValue } from 'react-select'
import { MemberAvatar } from '@/features/project-members/components/MemberAvatar'
import { RequestStatus, TMember } from '@/features/project-epic/types'
import { UserIcon } from '@/shared/components/icons'
import {
  FieldLabel,
  getMenuPortalTarget,
  SelectOption,
  selectStyles,
  TaskFieldProps,
} from './shared'

type TaskInlineAssigneeFieldProps = TaskFieldProps & {
  members: TMember[]
  membersStatus: RequestStatus
  membersError: string | null
  onLoadMembers: () => void
}

export const TaskInlineAssigneeField = ({
  task,
  members,
  membersStatus,
  membersError,
  onLoadMembers,
  onSavePatch,
}: TaskInlineAssigneeFieldProps) => {
  const [isSaving, setIsSaving] = useState(false)

  const options = useMemo<SelectOption[]>(
    () => [
      { label: 'Unassigned', value: '' },
      ...members.map((member) => ({
        label: member.metadata.name,
        value: member.user_id,
      })),
    ],
    [members]
  )

  const selectedOption =
    options.find((option) => option.value === (task.assignee?.id ?? '')) ?? options[0]

  const inlineStyles = useMemo(
    () => ({
      ...selectStyles,
      control: (base: any, state: any) => ({
        ...base,
        minHeight: 40,
        borderColor: 'transparent',
        boxShadow: state.isFocused ? '0 0 0 2px rgb(0 54 181 / 0.12)' : 'none',
        backgroundColor: '#ffffff',
        borderRadius: 8,
        ':hover': { borderColor: 'transparent' },
        '@media (max-width: 767px)': {
          backgroundColor: 'transparent',
        },
      }),
      valueContainer: (base: any) => ({
        ...base,
        paddingLeft: 10,
        paddingRight: 8,
        '@media (max-width: 767px)': {
          paddingLeft: 0,
          paddingRight: 0,
        },
      }),
      indicatorSeparator: () => ({ display: 'none' }),
      dropdownIndicator: (base: any) => ({
        ...base,
        '@media (max-width: 767px)': {
          display: 'none',
        },
      }),
    }),
    []
  )

  const selectAssignee = useCallback(
    async (option: SingleValue<SelectOption>) => {
      if (isSaving || !option) return

      const nextId = option.value || null
      const currentId = task.assignee?.id ?? null

      if (nextId === currentId) return

      const member = members.find((item) => item.user_id === nextId) ?? null
      const nextAssignee = member
        ? {
            id: member.user_id,
            name: member.metadata.name,
            email: member.metadata.email,
            department: member.metadata.job_title ?? null,
          }
        : null

      setIsSaving(true)
      await onSavePatch(
        { assignee_id: nextId },
        {
          ...task,
          assignee: nextAssignee,
          assignee_name: nextAssignee?.name ?? null,
        }
      )
      setIsSaving(false)
    },
    [isSaving, members, onSavePatch, task]
  )

  return (
    <div>
      <FieldLabel>Assignee</FieldLabel>

      {membersStatus === 'failed' ? (
        <div className="flex min-h-10 items-center gap-2">
          <p className="type-label-sm text-error">
            {membersError ?? 'Failed to load project members.'}
          </p>
          <button type="button" onClick={onLoadMembers} className="btn btn-ghost px-2 py-1 text-primary">
            Retry
          </button>
        </div>
      ) : (
        <Select
          isDisabled={isSaving || membersStatus === 'loading'}
          isLoading={membersStatus === 'loading'}
          options={options}
          value={selectedOption}
          onChange={(option) => void selectAssignee(option)}
          onMenuOpen={onLoadMembers}
          menuPortalTarget={getMenuPortalTarget()}
          menuPosition="fixed"
          styles={inlineStyles}
          formatOptionLabel={(option) => (
            <div className="flex items-center gap-2">
              {option.value ? (
                <MemberAvatar name={option.label} size={6} textSize={11} />
              ) : (
                <UserIcon size={14} />
              )}
              <span>{option.label}</span>
            </div>
          )}
        />
      )}
    </div>
  )
}
