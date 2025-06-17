"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter }_from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/shared/Spinner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    // This will be briefly shown before redirect or if redirect fails
    return (
       <div className="flex h-screen items-center justify-center bg-background">
        <p>Redirecting to login...</p>
      </div>
    );
  }
  
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
