import { ArrowIcon } from './icons'
import { PaginationBtn } from './PaginationBtn'

type Props = {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
    isFetchingPage: boolean
    onPageChange: (page: number) => void
    label?: string
}

export const Pagination = ({
    currentPage,
    totalPages,
    totalCount,
    limit,
    isFetchingPage,
    onPageChange,
    label = 'items'
}: Props) => {

    const getPageNumbers = () => {
        const pages: number[] = []

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)

            if (currentPage > 3) pages.push(-1) // ellipsis

            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)
            for (let i = start; i <= end; i++) pages.push(i)

            if (currentPage < totalPages - 2) pages.push(-1) // ellipsis

            pages.push(totalPages)
        }

        return pages
    }

    const from = (currentPage - 1) * limit + 1
    const to = Math.min(currentPage * limit, totalCount)

    return (
        <div className="hidden sm:flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-10">
            <p className="type-body-md">
                Showing {from}-{to} of {totalCount} {label}
            </p>
            <nav aria-label="Pagination" className="self-start sm:self-auto">
                <div className="flex items-center gap-1">

                    {/* Previous */}
                    <PaginationBtn
                        variant="nav"
                        icon={<ArrowIcon size={8} />}
                        ariaLabel="Previous page"
                        disabled={currentPage === 1 || isFetchingPage}
                        onClick={() => onPageChange(currentPage - 1)}
                    />

                    {/* Pages */}
                    {getPageNumbers().map((page, index) =>
                        page === -1 ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="h-8 w-8 flex items-center justify-center text-slate-400 type-label-sm"
                            >
                                ...
                            </span>
                        ) : (
                            <PaginationBtn
                                key={page}
                                pageNum={String(page)}
                                isActive={page === currentPage}
                                disabled={isFetchingPage || page === currentPage}
                                onClick={() => onPageChange(page)}
                            />
                        )
                    )}

                    {/* Next */}
                    <PaginationBtn
                        variant="nav"
                        icon={<ArrowIcon className="rotate-180" size={8} />}
                        ariaLabel="Next page"
                        disabled={currentPage === totalPages || isFetchingPage}
                        onClick={() => onPageChange(currentPage + 1)}
                    />

                </div>
            </nav>
        </div>
    )
}