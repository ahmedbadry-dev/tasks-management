import { DashboardView } from "@/shared/components/DashboardView";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <DashboardView>{children}</DashboardView>
}