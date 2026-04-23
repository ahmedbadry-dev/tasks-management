import { cn } from "@/utils/cn"
import { CloudOffIcon } from "./icons"

type ErrorProps = {
    title?: string
    message?: string
    retryLabel?: string
    retryAriaLabel?: string
    onRetry?: () => void
    isRetrying?: boolean
    hideRetryButton?: boolean
    className?: string
}

export const ErrorState = ({
    title = "Something went wrong",
    message = "We are having trouble retrieving your data right now. Please try again in a moment.",
    retryLabel = "Retry Connection",
    retryAriaLabel = "Retry connection",
    onRetry,
    isRetrying = false,
    hideRetryButton = false,
    className
}: ErrorProps) => {
    const shouldShowRetry = !hideRetryButton && Boolean(onRetry)

    return (
        <section className={cn("w-full h-full flex flex-col items-center justify-center gap-2 rounded-lg p-6 text-center", className)}>
            <div className="bg-error-container w-16 h-16 flex justify-center items-center rounded-xl">
                <CloudOffIcon />
            </div>
            <div className="max-w-2xl space-y-3 flex flex-col gap-5">
                <h1 className="heading-3">{title}</h1>
                <p className="type-body-md max-w-xs">{message}</p>
                {shouldShowRetry && (
                    <button
                        type="button"
                        aria-label={retryAriaLabel}
                        onClick={onRetry}
                        disabled={isRetrying}
                        className="
                            btn btn-primary
                            bg-gradient-cta
                            mx-auto
                            shadow-[0px_25px_50px_-12px_#003D9B4D]
                            disabled:opacity-70
                            disabled:cursor-not-allowed
                        "
                    >
                        <span className="type-body-md text-background ">
                            {isRetrying ? "Retrying..." : retryLabel}
                        </span>
                    </button>
                )}
            </div>
        </section>
    )
}
