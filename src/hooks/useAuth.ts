"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authService.me,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const logout = async () => {
    await authService.logout();
    queryClient.clear();
    router.replace("/login");
  };

  return { user, isLoading, isAuthenticated: !!user, logout };
}