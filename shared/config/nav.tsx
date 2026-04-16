import { AnalyticsIcon, ArchitectureIcon, ChecklistIcon, DashboardIcon, DescriptionIcon, GridIcon, GroupsIcon, InfoCircleIcon, StructureIcon, UsersGroupIcon } from "@/shared/components/icons"

export const navLinks = [
    { label: "Projects", href: "/", icon: <GridIcon size={18} />, mobileLabel: "Projects" },
    { label: "Project Epics", href: "/projects", icon: <StructureIcon size={18} />, mobileLabel: "Epics" },
    { label: "Project Tasks", href: "/projects/tasks", icon: <ChecklistIcon size={18} />, mobileLabel: "Tasks" },
    { label: "Project Members", href: "/projects/members", icon: <UsersGroupIcon size={18} />, mobileLabel: "Members" },
    { label: "Project Details", href: "/projects/details", icon: <InfoCircleIcon size={18} />, mobileLabel: "Details" },
] as const

export type NavLink = (typeof navLinks)[number]