
import { getSession } from "@/features/auth/utils/getSession"
import { redirect } from "next/navigation"

type Props = {
    children: React.ReactNode
    params: Promise<{ projectId: string }>
}

export default async function ProjectLayout({ children, params }: Props) {
    const session = await getSession()
    if (!session) redirect('/sign-in')

    const { projectId } = await params

    if (!projectId) redirect('/project')

    return <>{children}</>
}