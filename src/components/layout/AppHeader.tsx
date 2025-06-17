"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { navItems } from "@/config/nav";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";

export function AppHeader() {
  const pathname = usePathname();
  const { currentUser, loading } = useAuth();

  const currentPage = navItems.find((item) => pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard' && item.href !== '/'));
  const pageTitle = currentPage ? currentPage.label : "TheraBot";

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <div className="md:hidden"> {/* Only show trigger on mobile, sidebar is fixed on desktop */}
        <SidebarTrigger />
      </div>
      <h1 className="flex-1 font-headline text-xl font-semibold tracking-tight">
        {pageTitle}
      </h1>
      {!loading && !currentUser && (
        <Button asChild variant="outline">
          <Link href="/login">
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Link>
        </Button>
      )}
    </header>
  );
}
