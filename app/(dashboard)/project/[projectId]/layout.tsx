
import { getSession } from "@/features/auth/utils/getSession"
import { redirect } from "next/navigation"
import { routes } from "@/lib/routes"

type Props = {
    children: React.ReactNode
    params: Promise<{ projectId: string }>
}

export default async function ProjectLayout({ children, params }: Props) {
    const session = await getSession()
    if (!session) redirect(routes.auth.signIn)

    const { projectId } = await params

    if (!projectId) redirect(routes.project.list)

    return <>{children}</>
}
