'use client'

import { SearchInput } from '@/shared/components/SearchInput'

type TaskView = 'board' | 'list'

type Props = {
    currentView: TaskView
    onViewChange: (view: TaskView) => void
    searchValue: string
    onSearchChange: (value: string) => void
}

const VIEW_OPTIONS = [
    { label: 'Board View', value: 'board' },
    { label: 'List View', value: 'list' },
] as const

export const TasksPageHeader = ({
    currentView,
    onViewChange,
    searchValue,
    onSearchChange,
}: Props) => {
    return (
        <header className="flex items-center justify-between p-2">
            <div>
                <h1 className="heading-1">Active Workboard</h1>
                <p className="type-body-md">Curating your project tasks and milestones.</p>
            </div>
            <div className="flex items-center gap-3">
                <SearchInput
                    value={searchValue}
                    onChange={onSearchChange}
                    placeholder="Search tasks..."
                />
                <select
                    value={currentView}
                    onChange={(e) => onViewChange(e.target.value as TaskView)}
                    className="btn btn-ghost border border-slate-200 px-3 py-2 text-sm"
                >
                    {VIEW_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </header>
    )
}
