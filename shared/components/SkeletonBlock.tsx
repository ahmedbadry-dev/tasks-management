import { cn } from "@/utils/cn"

type SkeletonBlockProps = {
    className?: string
    rounded?: "sm" | "md" | "full"
}

export const SkeletonBlock = ({ className, rounded = "md" }: SkeletonBlockProps) => {
    const radiusMap = {
        sm: "rounded",
        md: "rounded-md",
        full: "rounded-full",
    }

    return (
        <div
            className={cn(
                "animate-pulse bg-surface-highest",
                radiusMap[rounded],
                className
            )}
        />
    )
}