'use client'

import Select, {
  type SingleValue,
  type StylesConfig,
} from 'react-select'

export type StatisticsSelectOption = {
  value: string
  label?: string
}

type StatisticsSelectProps = {
  inputId: string
  label?: string
  options: StatisticsSelectOption[]
  value: StatisticsSelectOption | null
  placeholder?: string
  isDisabled?: boolean
  isLoading?: boolean
  onChange: (option: StatisticsSelectOption | null) => void
}

const selectStyles: StylesConfig<StatisticsSelectOption, false> = {
  control: (base, state) => ({
    ...base,
    minHeight: 44,
    borderRadius: 4,
    borderColor: state.isFocused ? '#003D9B' : '#E6ECFF',
    backgroundColor: '#FFFFFF',
    boxShadow: state.isFocused ? '0 0 0 3px rgb(0 61 155 / 0.12)' : 'none',
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
    ':hover': {
      borderColor: state.isFocused ? '#003D9B' : '#C3C6D6',
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: '0 14px',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#041B3C',
    fontSize: 14,
    fontWeight: 500,
  }),
  placeholder: (base) => ({
    ...base,
    color: '#4F5F7B',
    fontSize: 14,
  }),
  input: (base) => ({
    ...base,
    color: '#041B3C',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? '#003D9B' : '#4F5F7B',
    paddingRight: 12,
    ':hover': {
      color: '#003D9B',
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 40,
    borderRadius: 8,
    border: '1px solid #D7E2FF',
    boxShadow: '0 24px 48px 0 rgb(4 27 60 / 0.10)',
    overflow: 'hidden',
  }),
  menuList: (base) => ({
    ...base,
    padding: 4,
  }),
  option: (base, state) => ({
    ...base,
    borderRadius: 6,
    color: state.isSelected ? '#FFFFFF' : '#041B3C',
    backgroundColor: state.isSelected
      ? '#003D9B'
      : state.isFocused
        ? '#F1F3FF'
        : '#FFFFFF',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: state.isSelected ? 600 : 500,
    ':active': {
      backgroundColor: state.isSelected ? '#003D9B' : '#D7E2FF',
    },
  }),
}

export const StatisticsSelect = ({
  inputId,
  label,
  options,
  value,
  placeholder,
  isDisabled,
  isLoading,
  onChange,
}: StatisticsSelectProps) => {
  const handleChange = (option: SingleValue<StatisticsSelectOption>) => {
    onChange(option ?? null)
  }

  return (
    <div className="field min-w-0 pb-0">
      {label && (
        <label className="field-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <Select<StatisticsSelectOption, false>
        inputId={inputId}
        instanceId={inputId}
        options={options}
        value={value}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isSearchable={false}
        styles={selectStyles}
        onChange={handleChange}
      />
    </div>
  )
}
