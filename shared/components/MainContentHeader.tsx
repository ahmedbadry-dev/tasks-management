

import { cn } from "@/utils/cn"
import Link from "next/link"



type MainContentHeaderProps = {
    title: string,
    msg?: string,
    btnText?: string,
    btnIcon?: React.ReactNode
    href?: string
    className?: string
}



export const MainContentHeader = (
    {
        btnIcon,
        btnText,
        msg,
        title,
        href,
        className
    }: MainContentHeaderProps
) => {

    return (
        <header className={cn("flex justify-between items-center p-2", className)}>
            <div>
                <h1 className="heading-1">{title}</h1>
                <p className="type-body-md">{msg}</p>
            </div>
            {href && <Link
                href={href}
                aria-label="Create New Project"
                className="
                    btn btn-primary
                    max-md:fixed max-md:bottom-20 max-md:right-5 max-md:z-20
                    max-md:h-14 max-md:w-14 
                    max-md:p-0 max-md:shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]
                    max-md:flex max-md:items-center max-md:justify-center
                "
            >
                <span className="md:mr-1">
                    {btnIcon}
                </span>
                <span className="type-body-md text-background max-md:hidden">
                    {btnText}
                </span>
            </Link>}
        </header>
    )
}
