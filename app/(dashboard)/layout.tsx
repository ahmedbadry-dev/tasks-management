
import { getSession } from "@/features/auth/utils/getSession";
import { DashboardView } from "@/shared/components/DashboardView";
import { StoreProvider } from "@/store/StoreProvider";
import { redirect } from "next/navigation";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession()
    if (!session) redirect('/sign-in')
    return (
        <StoreProvider user={session.user}>
            <DashboardView >
                {children}
            </DashboardView>
        </StoreProvider>

    )
}

export default DashboardLayout