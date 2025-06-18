
"use client";

import type { User as FirebaseUser } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import type { ReactNode } from "react";
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";

interface UserProfile {
  displayName: string;
  email: string;
  age?: number;
  profileImageUrl?: string;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  reloadUserProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (user: FirebaseUser) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const profileData = userDocSnap.data();
        setUserProfile({
          displayName: profileData.displayName || user.displayName || "User",
          email: user.email || "",
          age: profileData.age,
          profileImageUrl: profileData.profileImageUrl,
        });
      } else {
         // Create a basic profile if it doesn't exist
        setUserProfile({
          displayName: user.displayName || user.email?.split('@')[0] || "User",
          email: user.email || "",
        });
      }
    } else {
      setUserProfile(null);
    }
  };
  
  const reloadUserProfile = async () => {
    if (currentUser) {
      try {
        await fetchUserProfile(currentUser);
      } catch (error) {
        console.error("Error reloading user profile:", error);
        // Optionally, handle the error in the UI, e.g., show a toast
      }
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setCurrentUser(user);
        if (user) {
          await fetchUserProfile(user);
        } else {
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error during auth state change or profile fetch:", error);
        // Ensure userProfile is null if an error occurs during profile fetch for a logged-in user
        if (user) {
          setUserProfile(null); 
        }
      } finally {
        setLoading(false); // Ensure loading is set to false even if there's an error
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true); // Indicate loading state during logout
    try {
      await auth.signOut();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    logout,
    reloadUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
