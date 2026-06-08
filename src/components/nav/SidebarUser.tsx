import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar.tsx"
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx"
import { EllipsisVertical, LogOut, SettingsIcon } from "lucide-react"
import {
    DropdownMenuTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.tsx"
import { useAuth } from "@/context/AuthContext.tsx"
import { useNavigate } from "react-router"
import { useQueryClient } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge.tsx"

export function SidebarUser() {
    const { logout, user } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const handleLogoutClick = () => {
        logout()
        queryClient.clear()
        navigate("/login")
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton size="lg">
                            <Avatar className="h-8 w-8 rounded-lg grayscale">
                                <AvatarFallback className="rounded-lg">
                                    {user?.firstname?.[0] ?? "N"}
                                    {user?.lastname?.[0] ?? "A"}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {`${user?.firstname ?? "N/A"} ${user?.lastname ?? "N/A"}`}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user?.email ?? "N/A"}
                                </span>
                            </div>
                            <EllipsisVertical className="ml-auto" size={16} />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="min-w-64"
                        side="right"
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel>
                            <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8 rounded-lg grayscale">
                                    <AvatarFallback className="rounded-lg">
                                        {user?.firstname?.[0] ?? "N"}
                                        {user?.lastname?.[0] ?? "A"}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <div className="flex items-center gap-2">
                                        <Badge>{user?.role ?? "N/A"}</Badge>
                                    </div>

                                    <span className="truncate text-xs text-muted-foreground">
                                        {user?.email ?? "N/A"}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onSelect={() => navigate("/user-settings")}
                        >
                            <SettingsIcon className="size-4" />
                            Einstellungen
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                            onSelect={handleLogoutClick}
                        >
                            <LogOut className="size-4" />
                            Ausloggen
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}
