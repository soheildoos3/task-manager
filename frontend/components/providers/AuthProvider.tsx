"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getMe, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      getMe().catch(() => {});
    }
  }, [getMe, isAuthenticated]);

  return <>{children}</>;
}
