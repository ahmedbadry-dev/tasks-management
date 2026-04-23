import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { selectProjectsCurrentPage, selectProjectsIsFetchingPage, selectProjectsLimit, selectProjectsTotalCount, selectProjectsTotalPages } from "../store/projectsSlice"
import { Pagination } from "@/shared/components/Pagination"
import { fetchProjectsPage } from "../store/asyncThunk/projectsThunk"

export const ProjectsPagination = ({ accessToken }: { accessToken: string }) => {
    const dispatch = useAppDispatch()
    const currentPage = useAppSelector(selectProjectsCurrentPage)
    const totalPages = useAppSelector(selectProjectsTotalPages)
    const totalCount = useAppSelector(selectProjectsTotalCount)
    const limit = useAppSelector(selectProjectsLimit)
    const isFetchingPage = useAppSelector(selectProjectsIsFetchingPage)

    return (
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            limit={limit}
            isFetchingPage={isFetchingPage}
            label="projects"
            onPageChange={(page) =>
                dispatch(fetchProjectsPage({ accessToken, page }))
            }
        />
    )
}
