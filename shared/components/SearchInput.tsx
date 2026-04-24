import { SearchIcon } from "./icons"

export const SearchInput = () => {
    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2"><SearchIcon size={17} className="text-slate-400" /></span>
            <input
                type="search"
                placeholder="Search epics..."
                className="field-input pl-11"
            />
        </div>
    )
}
