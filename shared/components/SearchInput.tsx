import { SearchIcon } from "./icons"

type props = {
    className?: string
}
export const SearchInput = () => {
    return (
        <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2"><SearchIcon size={15} className="text-slate-400" /></span>
            <input
                type="search"
                placeholder="Search epics..."
                className="field-input pl-11 py-2"
            />
        </div>
    )
}
