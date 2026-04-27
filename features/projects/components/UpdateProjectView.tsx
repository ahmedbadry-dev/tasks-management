import { MainContentHeader } from '@/shared/components/MainContentHeader'
import { UpdateProjectForm } from './UpdateProjectForm'
import { getProjectDetailsActionById } from '../actions/getProjectDetailsActionById'
import { redirect } from 'next/navigation'
import { routes } from '@/lib/routes'

type UpdateProjectViewProps = {
    projectId: string
}

export const UpdateProjectView = async ({ projectId }: UpdateProjectViewProps) => {
    const result = await getProjectDetailsActionById(projectId)
    if (!result.success) redirect(routes.project.list)

    const projectDetails = result.data[0]
    if (!projectDetails) redirect(routes.project.list)

    return (
        <div>
            {/* <MainContentHeader
                title="Update Yore Project"
            /> */}
            <div className=" flex justify-center  pt-10">
                <UpdateProjectForm projectDetails={projectDetails} />
            </div>
        </div>
    )
}
