
"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/shared/Spinner";
import { cn } from "@/lib/utils";

const SPLASH_ANIMATION_TRIGGER_DELAY = 1500; // ms to wait before starting the animation out
const MAIN_CONTENT_FADE_IN_DELAY = "delay-[500ms]"; // delay for main content/header after animation triggers
const MAIN_CONTENT_FADE_IN_DURATION = "duration-[700ms]";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const [isSplashAnimating, setIsSplashAnimating] = useState(true);
  
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
      setIsSplashAnimating(true); // Reset splash if navigating away
    }
  }, [currentUser, loading, router]);

  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (!loading && currentUser) {
      // Start the timer to end the splash animation
      timerId = setTimeout(() => {
        setIsSplashAnimating(false);
      }, SPLASH_ANIMATION_TRIGGER_DELAY);
    } else {
      // If loading or no user, ensure splash is active (or reset if state changes)
      setIsSplashAnimating(true);
    }
    return () => clearTimeout(timerId);
  }, [loading, currentUser]);


  if (loading && isSplashAnimating) { // Show spinner only if splash hasn't started its own thing or if explicitly loading
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  // If auth is done, but no user, and we're not already redirecting (router.push handles redirect)
  // This state might be brief before redirect or if redirect fails.
  if (!loading && !currentUser && isSplashAnimating) {
     return (
       <div className="flex h-screen items-center justify-center bg-background">
        <p>Redirecting to login...</p>
      </div>
    );
  }
  
  // If user exists, proceed with layout (splash or regular)
  // The isSplashAnimating state will handle the visual transition
  if (!loading && currentUser) {
    return (
      <SidebarProvider defaultOpen={true}>
        <AppSidebar isSplashAnimating={isSplashAnimating} />
        <SidebarInset className="flex flex-col min-h-screen">
          <AppHeader className={cn(
            "transition-opacity",
            MAIN_CONTENT_FADE_IN_DURATION,
            isSplashAnimating ? "opacity-0" : ["opacity-100", MAIN_CONTENT_FADE_IN_DELAY].join(" ")
          )} />
          <main className={cn(
            "flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background transition-opacity",
            MAIN_CONTENT_FADE_IN_DURATION,
            isSplashAnimating ? "opacity-0" : ["opacity-100", MAIN_CONTENT_FADE_IN_DELAY].join(" ")
          )}>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // Fallback for any other unhandled state, though ideally covered above.
  // This also helps prevent rendering children if currentUser is briefly null during a fast redirect.
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Spinner className="h-10 w-10 text-primary" />
    </div>
  );
}
