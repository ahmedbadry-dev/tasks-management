import {
    ChecklistIcon,
    GridIcon,
    InfoCircleIcon,
    StructureIcon,
    UsersGroupIcon,
} from "@/shared/components/icons"

export const navLinks = [
    { label: "Project", href: "/project", icon: <GridIcon size={18} />, mobileLabel: "Project" },
    { label: "Project Epics", href: "/epics", icon: <StructureIcon size={18} />, mobileLabel: "Epics" },
    { label: "Project Tasks", href: "/tasks", icon: <ChecklistIcon size={18} />, mobileLabel: "Tasks" },
    { label: "Project Members", href: "/members", icon: <UsersGroupIcon size={18} />, mobileLabel: "Members" },
    { label: "Project Details", href: "/details", icon: <InfoCircleIcon size={18} />, mobileLabel: "Details" },
] as const

export type NavLink = (typeof navLinks)[number]
