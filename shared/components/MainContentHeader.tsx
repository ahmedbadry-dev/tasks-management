

import clsx from "clsx"
import Link from "next/link"



type MainContentHeaderProps = {
    title: string,
    msg?: string,
    btnText: string,
    hidden?: boolean
    btnIcon?: React.ReactNode
}



export const MainContentHeader = (
    {
        btnIcon,
        btnText,
        msg,
        title,
        hidden
    }: MainContentHeaderProps
) => {

    return (
        <header className={clsx(" p-2 flex justify-between items-center", hidden && "hidden")}>
            <div>
                <h1 className="heading-1">{title}</h1>
                <p className="type-body-md">{msg}</p>
            </div>
            <Link
                href={'project/add'}
                aria-label="Create New Project"
                className="
                    btn btn-primary
                    max-sm:fixed max-sm:bottom-20 max-sm:right-5 max-sm:z-20
                    max-sm:h-14 max-sm:w-14 
                    max-sm:p-0 max-sm:shadow-[0px_4px_6px_-4px_#0000001A,0px_10px_15px_-3px_#0000001A]
                    max-sm:flex max-sm:items-center max-sm:justify-center
                "
            >
                <span className="sm:mr-1">
                    {btnIcon}
                </span>
                <span className="type-body-md text-background max-sm:hidden">
                    {btnText}
                </span>
            </Link>
        </header>
    )
}
