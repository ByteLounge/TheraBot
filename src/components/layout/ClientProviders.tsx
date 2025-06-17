"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Toaster } from "@/components/ui/toaster";

// Simple loader for the dynamic import of AuthProvider.
// The AuthProvider itself has more sophisticated loading for Firebase auth state.
const AuthLoader = () => (
  <div style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw', 
      alignItems: 'center', 
      justifyContent: 'center', 
      position: 'fixed', 
      top: 0, 
      left: 0,
      backgroundColor: 'hsl(var(--background))', 
      zIndex: 9999 
    }}>
    <p style={{ color: 'hsl(var(--foreground))', fontSize: '1.2rem' }}>Initializing TheraBot...</p>
  </div>
);

const DynamicAuthProvider = dynamic(
  () => import('@/contexts/AuthContext').then((mod) => mod.AuthProvider),
  {
    ssr: false,
    loading: () => <AuthLoader />
  }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <DynamicAuthProvider>
      {children}
      <Toaster />
    </DynamicAuthProvider>
  );
}
