"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@/components/shared/Spinner";

export default function HomePage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (currentUser) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [currentUser, loading, router]);

  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Spinner className="h-10 w-10 text-primary" />
      <p className="ml-4 text-lg text-foreground">Loading TheraBot...</p>
    </div>
  );
}
