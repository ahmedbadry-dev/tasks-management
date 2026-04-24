import { cn } from "@/utils/cn"

type SpinnerProps = {
    className?: string
    size?: "sm" | "md" | "lg"
    label?: string
}

export const Spinner = ({ className, size = "md", label = "Loading" }: SpinnerProps) => {
    const sizeMap = {
        sm: "h-4 w-4 border-2",
        md: "h-6 w-6 border-2",
        lg: "h-8 w-8 border-[3px]",
    }

    return (
        <span
            role="status"
            aria-label={label}
            className={cn(
                "inline-block animate-spin rounded-full border-slate-300 border-t-slate-700",
                sizeMap[size],
                className
            )}
        />
    )
}

