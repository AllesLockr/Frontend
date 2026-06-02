import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar.tsx"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar.tsx"
import { EllipsisVertical, LogOut, SettingsIcon } from 'lucide-react';
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

interface SidebarUserProps {
    user: {
        name: string,
        email: string,
        avatarUrl: string,
        role: string,
    }
}
const testUser = {
    name: "Test",
    email: "test@test.de",
    avatarUrl: "",
    role: "Admin",
}
export function SidebarUser( {user = testUser}: SidebarUserProps) {

    const { logout } = useAuth()
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
                                <AvatarImage
                                    src={user.avatarUrl}
                                    alt={user.name}
                                />
                                <AvatarFallback className="rounded-lg">
                                    CN
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {user.name}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {user.email}
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
                                    <AvatarImage
                                        src={user.avatarUrl}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-lg">
                                        CN
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate font-medium">
                                            {user.name}
                                        </span>
                                        <span className="py -0.5 rounded-sm bg-primary/10 px-1.5 text-[10px] font-semibold text-primary">
                                            {user.role}
                                        </span>
                                    </div>

                                    <span className="truncate text-xs text-muted-foreground">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
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