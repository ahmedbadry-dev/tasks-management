import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
    selectCurrentPage,
    selectIsFetchingPage,
    selectTotalPages,
    selectTotalCount,
    selectLimit,
} from '@/features/projects/store/projectsSlice'
import { fetchProjectsPage } from '@/features/projects/store/asyncThunk/projectsThunk'
import { ArrowIcon } from './icons'
import { PaginationBtn } from './PaginationBtn'

type Props = {
    accessToken: string
}

export const Pagination = ({ accessToken }: Props) => {
    const dispatch = useAppDispatch()
    const currentPage = useAppSelector(selectCurrentPage)
    const totalPages = useAppSelector(selectTotalPages)
    const totalCount = useAppSelector(selectTotalCount)
    const limit = useAppSelector(selectLimit)
    const isFetchingPage = useAppSelector(selectIsFetchingPage)

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage || isFetchingPage) {
            return
        }

        dispatch(fetchProjectsPage({ accessToken, page }))
    }

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
            <div>
                <p className="type-body-md">
                    Showing {from}-{to} of {totalCount} active projects
                </p>
            </div>
            <nav aria-label="Projects pagination" className="self-start sm:self-auto">
                <div className="flex items-center gap-1">

                    {/* Previous */}
                    <PaginationBtn
                        variant="nav"
                        icon={<ArrowIcon size={8} />}
                        ariaLabel="Previous page"
                        disabled={currentPage === 1 || isFetchingPage}
                        onClick={() => handlePageChange(currentPage - 1)}
                    />

                    {/* Pages */}
                    {getPageNumbers().map((page, index) =>
                        page === -1 ? (
                            <span key={`ellipsis-${index}`} className="h-8 w-8 flex items-center justify-center text-slate-400 type-label-sm">
                                ...
                            </span>
                        ) : (
                            <PaginationBtn
                                key={page}
                                pageNum={String(page)}
                                isActive={page === currentPage}
                                disabled={isFetchingPage || page === currentPage}
                                onClick={() => handlePageChange(page)}
                            />
                        )
                    )}

                    {/* Next */}
                    <PaginationBtn
                        variant="nav"
                        icon={<ArrowIcon className="rotate-180" size={8} />}
                        ariaLabel="Next page"
                        disabled={currentPage === totalPages || isFetchingPage}
                        onClick={() => handlePageChange(currentPage + 1)}
                    />

                </div>
            </nav>
        </div>
    )
}
