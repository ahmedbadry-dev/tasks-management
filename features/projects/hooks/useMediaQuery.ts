import { useEffect, useState } from 'react'
import { resetProjects } from '../store/projectsSlice'
import { fetchProjectsPage } from '../store/asyncThunk/projectsThunk'
import { useAppDispatch } from '@/store/hooks'

export const useMediaQuery = (accessToken: string) => {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null)
  const dispatch = useAppDispatch()
  // for what => her i check if user in mobile ofg desktop
  // why => in mobile we append projects in items array
  // if user in mobile scroll into page num 5 so in items statue we have 50 project in this case if user switch to
  // desktop view the page will display the projects in items (50 project) this not correct so we need a flag to
  // check yo can reset items in store and refetch just 10 project for pagination page
  // the way im flow her =>>>
  // i reset the state then i fetch the content of page 1
  // =>> another case may be good for ux we use searchparams to get the page number and just fetch the project where
  // user stope scrolling exp: page 5
  useEffect(() => {
    if (isDesktop === null) return

    dispatch(resetProjects())
    dispatch(fetchProjectsPage({ accessToken, page: 1 }))
  }, [accessToken, dispatch, isDesktop])

  return { isDesktop, setIsDesktop }
}
