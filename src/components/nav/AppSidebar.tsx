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
    Building,
    Key,
    LayoutDashboard,
    Lock, type LucideIcon,
    MapPin,
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
                { id: "roles", icon: Users, name: "Roles", path: "/roles" },
                { id: "zones", icon: MapPin, name: "Zones", path: "/zones" },
                {
                    id: "estates",
                    icon: Building,
                    name: "Estates",
                    path: "/estates",
                },
                { id: "locks", icon: Lock, name: "Locks", path: "/locks" },
                { id: "keys", icon: Key, name: "Keys", path: "/keys" },
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
                { id: "vendors", icon: Network, name: "Vendors", path: "/vendors" },
                { id: "audit-logs", icon: BookText, name: "Audit-Logs", path: "/audit-logs" },
            ],
        },
        {
            id: "admin",
            elements: [
                { id: "users", icon: Users, name: "Users", path: "/users" },
            ],
        }
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
