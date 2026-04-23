'use client'

import { ErrorState } from "@/shared/components/ErrorState"

type ProjectListErrorProps = {
    error: Error & { digest?: string }
    reset: () => void
}

const ProjectListError = ({ reset }: ProjectListErrorProps) => {
    return (
        <ErrorState
            title="Something went wrong"
            message="We are having trouble retrieving your projects right now. Please try again in a moment."
            retryLabel="Retry Connection"
            retryAriaLabel="Retry connection"
            onRetry={reset}
        />
    )
}

export default ProjectListError
