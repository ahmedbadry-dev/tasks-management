
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { selectEpicsCurrentPage, selectEpicsIsFetchingPage, selectEpicsLimit, selectEpicsTotalCount, selectEpicsTotalPages } from "../store/projectEpicsSlice"
import { Pagination } from "@/shared/components/Pagination"
import { fetchProjectEpicsPage } from "../store/asyncThunk/epicThunk"


type Props = {
  projectId: string
  accessToken: string
}

export const EpicsPagination = ({ accessToken, projectId }: Props) => {
  const dispatch = useAppDispatch()
  const currentPage = useAppSelector(selectEpicsCurrentPage)
  const totalPages = useAppSelector(selectEpicsTotalPages)
  const totalCount = useAppSelector(selectEpicsTotalCount)
  const limit = useAppSelector(selectEpicsLimit)
  const isFetchingPage = useAppSelector(selectEpicsIsFetchingPage)

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={totalCount}
      limit={limit}
      isFetchingPage={isFetchingPage}
      label="epics"
      onPageChange={(page) =>
        dispatch(fetchProjectEpicsPage({ accessToken, page, project_id: projectId }))
      }
    />
  )
}