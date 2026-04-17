
import { getSession } from "@/features/auth/utils/getSession";
import { DashboardView } from "@/shared/components/DashboardView";
import { redirect } from "next/navigation";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession()
    if (!session) redirect('/sign-in')
    return (
        <DashboardView user={session.user} >
            {children}
        </DashboardView>
    )
}

export default DashboardLayout