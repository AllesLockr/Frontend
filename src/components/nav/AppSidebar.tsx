import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar.tsx"
import {
    BookText,
    FileJson,
    LayoutDashboard,
    Lock,
    type LucideIcon,
    Network,
    ShieldCheck,
    User,
    Users,
} from "lucide-react"
import { SidebarUser } from "@/components/nav/SidebarUser.tsx"
import { NavLink } from "react-router"

interface SideBarSection {
    id: string
    elements: SideBarElement[]
}

interface SideBarElement {
    id: string
    icon: LucideIcon
    name: string
    path: string
    external?: boolean
}

export function AppSidebar() {
    const sections: SideBarSection[] = [
        {
            id: "main",
            elements: [
                {
                    id: "dashboard",
                    icon: LayoutDashboard,
                    name: "Dashboard",
                    path: "/dashboard",
                },
            ],
        },
        {
            id: "management",
            elements: [
                {
                    id: "persons",
                    icon: User,
                    name: "Persons",
                    path: "/persons",
                },
                { id: "locks", icon: Lock, name: "Locks", path: "/locks" },
                {
                    id: "access-grants",
                    icon: ShieldCheck,
                    name: "Access Grants",
                    path: "/access-grants",
                },
            ],
        },
        {
            id: "system",
            elements: [
                {
                    id: "vendors",
                    icon: Network,
                    name: "Vendors",
                    path: "/vendors",
                },
                {
                    id: "audit-logs",
                    icon: BookText,
                    name: "Audit-Logs",
                    path: "/audit-logs",
                },
                {
                    id: "api-docs",
                    icon: FileJson,
                    name: "API-Dokumentation",
                    path: "/swagger-ui/index.html",
                    external: true,
                },
            ],
        },
        {
            id: "admin",
            elements: [
                { id: "users", icon: Users, name: "Users", path: "/users" },
            ],
        },
    ]

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton className="flex items-center justify-center">
                            <h1 className="text-lg font-semibold">
                                AllesLocker
                            </h1>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {sections.map((section) => (
                    <SidebarGroup key={section.id}>
                        <SidebarGroupContent>
                            {section.elements.map((element) => (
                                <SidebarMenu key={element.id}>
                                    <SidebarMenuItem key={element.id}>
                                        {element.external ? (
                                            <a
                                                href={element.path}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                <SidebarMenuButton>
                                                    <element.icon />
                                                    {element.name}
                                                </SidebarMenuButton>
                                            </a>
                                        ) : (
                                            <NavLink to={element.path}>
                                                {({ isActive }) => (
                                                    <SidebarMenuButton
                                                        isActive={isActive}
                                                    >
                                                        <element.icon />
                                                        {element.name}
                                                    </SidebarMenuButton>
                                                )}
                                            </NavLink>
                                        )}
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            ))}
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <SidebarUser />
            </SidebarFooter>
        </Sidebar>
    )
}
