import { ArrowIcon } from "./icons"
import { PaginationBtn } from "./PaginationBtn"

export const Pagination = () => {
    return (
        <div className="hidden sm:flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-10">
            <div>
                <p className="type-body-md">Showing 5 of 24 active projects</p>
            </div>
            <nav aria-label="Projects pagination" className="self-start sm:self-auto">
                <div className="flex items-center gap-1">

                    {/* previous */}
                    <PaginationBtn
                        variant="nav"
                        icon={<ArrowIcon size={8} />}
                        ariaLabel="Previous page"
                        disabled
                    />


                    {/* pages */}
                    <PaginationBtn pageNum="1" isActive />
                    <PaginationBtn pageNum="2" />
                    <PaginationBtn pageNum="3" />


                    {/* next */}
                    <PaginationBtn
                        variant="nav"
                        icon={<ArrowIcon className="rotate-180" size={8} />}
                        ariaLabel="Next page"
                    />
                </div>
            </nav>
        </div>
    )
}
