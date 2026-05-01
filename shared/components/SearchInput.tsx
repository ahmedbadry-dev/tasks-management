import { SearchIcon } from "./icons"

type Props = {
    value?: string
    onChange?: (value: string) => void
    placeholder?: string
    className?: string
}

export const SearchInput = ({ value = '', onChange, placeholder = 'Search...', className }: Props) => {
    return (
        <div className={`relative ${className ?? ''}`}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2">
                <SearchIcon size={15} className="text-slate-400" />
            </span>
            <input
                type="search"
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                className="field-input py-2 pl-11"
            />
        </div>
    )
}
