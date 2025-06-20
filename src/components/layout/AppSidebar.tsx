
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { navItems, siteConfig } from "@/config/nav";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AppSidebarProps {
  isSplashAnimating: boolean;
}

const LOGO_ANIMATION_DURATION = "duration-1000";
const SIDEBAR_ITEMS_FADE_DELAY = "delay-[200ms]"; // Delay after logo animation starts ending
const SIDEBAR_ITEMS_FADE_DURATION = "duration-[500ms]";


export function AppSidebar({ isSplashAnimating }: AppSidebarProps) {
  const pathname = usePathname();
  const { logout, userProfile, currentUser } = useAuth();
  const { state: sidebarState } = useSidebar();

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    const nameParts = name.trim().split(" ").filter(Boolean);
    if (nameParts.length === 0 || nameParts[0] === "") return "U";
    return nameParts.map(n => n[0]).join("").toUpperCase();
  };
  
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className={cn(
        "p-2 relative", // Ensure SidebarHeader itself is a positioning context if needed
        isSplashAnimating ? "bg-transparent" : ""
      )}>
        <div 
          className={cn(
            "flex items-center gap-3 transition-all ease-in-out",
            LOGO_ANIMATION_DURATION,
            isSplashAnimating
              ? "fixed left-1/2 top-1/2 z-[200] -translate-x-1/2 -translate-y-1/2 scale-150 transform"
              : sidebarState === "collapsed"
                ? "justify-center py-2" // Adjust padding when landed and collapsed
                : "py-2" // Adjust padding when landed and expanded
          )}
        >
          <siteConfig.icon className={cn(
            "text-primary transition-all ease-in-out",
            LOGO_ANIMATION_DURATION,
            isSplashAnimating ? "h-16 w-16" : "h-8 w-8"
          )} />
          <h1 className={cn(
              "font-headline font-semibold text-primary transition-all ease-in-out",
              LOGO_ANIMATION_DURATION,
              isSplashAnimating
                ? "text-5xl"
                : "text-2xl",
              isSplashAnimating ? "" : (sidebarState === "collapsed" ? "hidden" : "")
            )}
          >
            {siteConfig.name}
          </h1>
        </div>
      </SidebarHeader>

      <SidebarContent className={cn(
        "flex-grow p-2 transition-opacity",
        SIDEBAR_ITEMS_FADE_DURATION,
        isSplashAnimating ? "opacity-0" : ["opacity-100", SIDEBAR_ITEMS_FADE_DELAY].join(" ")
      )}>
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

      <SidebarFooter className={cn(
        "p-2 border-t transition-opacity",
        SIDEBAR_ITEMS_FADE_DURATION,
        isSplashAnimating ? "opacity-0" : ["opacity-100", SIDEBAR_ITEMS_FADE_DELAY].join(" ")
      )}>
        {currentUser && userProfile && (
           <div className={cn("flex items-center gap-2 p-2 rounded-md hover:bg-sidebar-accent", sidebarState === 'collapsed' && 'justify-center')}>
            <Avatar className="h-8 w-8">
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
