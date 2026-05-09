import {
    AnalyticsIcon,
    ChecklistIcon,
    GridIcon,
    InfoCircleIcon,
    StructureIcon,
    UsersGroupIcon,
} from "@/shared/components/icons"
import { routes } from "@/lib/routes"

export const getNavLinks = (projectId?: string) => [
    { label: "Projects", href: routes.project.list, icon: <GridIcon size={18} />, mobileLabel: "Project" },
    { label: "My Statistics", href: routes.myStatistics, icon: <AnalyticsIcon size={18} />, mobileLabel: "Stats" },
    ...(projectId ? [
        { label: "Project Epics", href: routes.project.epics(projectId), icon: <StructureIcon size={18} />, mobileLabel: "Epics" },
        { label: "Project Tasks", href: routes.project.tasks(projectId), icon: <ChecklistIcon size={18} />, mobileLabel: "Tasks" },
        { label: "Project Members", href: routes.project.members(projectId), icon: <UsersGroupIcon size={18} />, mobileLabel: "Members" },
        { label: "Project Details", href: routes.project.edit(projectId), icon: <InfoCircleIcon size={18} />, mobileLabel: "Details" },
    ] : []),
]

export type NavLink = ReturnType<typeof getNavLinks>[number]

