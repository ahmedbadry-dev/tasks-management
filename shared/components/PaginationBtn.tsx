import clsx from "clsx"

type PaginationBtnProps = {
    icon?: React.ReactNode
    pageNum?: string
    variant?: "page" | "nav"
    isActive?: boolean
    disabled?: boolean
    ariaLabel?: string
}

export const PaginationBtn = ({
    icon,
    pageNum,
    variant = "page",
    isActive = false,
    disabled = false,
    ariaLabel,
}: PaginationBtnProps) => {
    return (
        <button
            type="button"
            aria-label={ariaLabel}
            aria-current={isActive ? "page" : undefined}
            disabled={disabled}
            className={clsx(
                "h-8 w-8 rounded-xs border flex items-center justify-center transition-colors",
                "disabled:cursor-not-allowed disabled:opacity-50",
                variant === "page" && [
                    "type-label-sm",
                    isActive
                        ? "border-primary bg-primary text-white"
                        : "border-slate-400/30 bg-white text-slate-900 hover:bg-slate-100",
                ],
                variant === "nav" &&
                "border-slate-400/30 bg-surface-low text-slate-900 hover:bg-slate-200/60"
            )}
        >
            {pageNum ? pageNum : icon}
        </button>
    )
}
