
import { getSession } from "@/features/auth/utils/getSession";
import { DashboardView } from "@/shared/components/DashboardView";
import { ModalHost } from "@/shared/components/ModalHost";
import { StoreProvider } from "@/store/StoreProvider";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";

async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession()
    if (!session) redirect(routes.auth.signIn)
    return (
        <StoreProvider user={session.user}>
            <DashboardView >
                {children}
            </DashboardView>
            <ModalHost />
        </StoreProvider>

    )
}

export default DashboardLayout
