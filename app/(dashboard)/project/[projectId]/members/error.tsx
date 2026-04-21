'use client'

import { CloudOffIcon } from "@/shared/components/icons"

const error = () => {
    return (
        <section className="w-full h-full flex  flex-col items-center justify-center gap-2 rounded-lg p-6 text-center">
            <div className="bg-error-container w-16 h-16 flex justify-center items-center rounded-xl">
                <CloudOffIcon />
            </div>
            <div className="max-w-2xl space-y-3 flex flex-col gap-5">
                <h1 className="heading-3">Something went wrong</h1>
                <p className="type-body-md max-w-xs">We're having trouble retrieving your projects right now. Please try again in a moment.</p>
                <button
                    type="button"
                    aria-label="Create New Project"
                    className="
                                btn btn-primary
                                bg-gradient-cta
                                mx-auto
                                shadow-[0px_25px_50px_-12px_#003D9B4D]
                            "
                >
                    <span className="type-body-md text-background ">
                        Retry Connection
                    </span>
                </button>
            </div>
        </section>
    )
}

export default error
