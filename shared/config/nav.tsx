import {
    ChecklistIcon,
    GridIcon,
    InfoCircleIcon,
    StructureIcon,
    UsersGroupIcon,
} from "@/shared/components/icons"

export const getNavLinks = (projectId?: string) => [
    { label: "Projects", href: "/project", icon: <GridIcon size={18} />, mobileLabel: "Project" },
    ...(projectId ? [
        { label: "Project Epics", href: `/project/${projectId}/epics`, icon: <StructureIcon size={18} />, mobileLabel: "Epics" },
        { label: "Project Tasks", href: `/project/${projectId}/tasks`, icon: <ChecklistIcon size={18} />, mobileLabel: "Tasks" },
        { label: "Project Members", href: `/project/${projectId}/members`, icon: <UsersGroupIcon size={18} />, mobileLabel: "Members" },
        { label: "Project Details", href: `/project/${projectId}/edit`, icon: <InfoCircleIcon size={18} />, mobileLabel: "Details" },
    ] : []),
]

export type NavLink = ReturnType<typeof getNavLinks>[number]

