"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const supabase = createClient();
  const { user, isGuest, setUser, setGuest, logout } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user as User);
      } else {
        // Check for guest mode in localStorage
        const guestMode = localStorage.getItem("democracy-lab-guest");
        if (guestMode === "true") {
          setGuest(true);
        }
      }
      setLoading(false);
    };

    getSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user as User);
        setGuest(false);
        localStorage.removeItem("democracy-lab-guest");
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase, setUser, setGuest]);

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  }, [supabase]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    logout();
    localStorage.removeItem("democracy-lab-guest");
  }, [supabase, logout]);

  const enableGuestMode = useCallback(() => {
    localStorage.setItem("democracy-lab-guest", "true");
    setGuest(true);
  }, [setGuest]);

  return {
    user,
    isGuest,
    loading,
    isAuthenticated: !!user && !isGuest,
    signInWithGoogle,
    signOut,
    enableGuestMode,
  };
}

