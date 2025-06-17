"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { navItems, siteConfig } from "@/config/nav";
import { cn } from "@/lib/utils";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const pathname = usePathname();
  const { logout, userProfile, currentUser } = useAuth();
  const { state: sidebarState } = useSidebar();

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };
  
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="p-4">
        <div className={cn(
            "flex items-center gap-2",
            sidebarState === "collapsed" && "justify-center"
          )}>
          <siteConfig.icon className="h-8 w-8 text-primary" />
          <h1 className={cn(
              "font-headline text-2xl font-semibold text-primary",
              sidebarState === "collapsed" && "hidden"
            )}
          >
            {siteConfig.name}
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/')}
                tooltip={{ children: item.tooltip, className: "font-body"}}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t">
        {currentUser && userProfile && (
           <div className={cn("flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent", sidebarState === 'collapsed' && 'justify-center')}>
            <Avatar className="h-8 w-8">
              <AvatarImage src={userProfile.profileImageUrl || undefined} alt={userProfile.displayName} data-ai-hint="user profile" />
              <AvatarFallback>{getInitials(userProfile.displayName)}</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col", sidebarState === 'collapsed' && 'hidden')}>
              <span className="text-sm font-medium text-sidebar-foreground truncate">{userProfile.displayName}</span>
              <span className="text-xs text-muted-foreground truncate">{userProfile.email}</span>
            </div>
          </div>
        )}
        <SidebarMenu>
           <SidebarMenuItem>
            <SidebarMenuButton onClick={logout} tooltip={{ children: "Log Out", className: "font-body"}}>
              <LogOut />
              <span>Log Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
