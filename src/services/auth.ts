import { api } from "@/lib/api";
import type { ApiResponse, User } from "@/types";

export const authService = {
  async login(email: string, password: string) {
    const res = await api.post<ApiResponse<User>>("/auth/login", { email, password });
    return res.data.data;
  },

  async logout() {
    const res = await api.post<ApiResponse<null>>("/auth/logout");
    return res.data;
  },

  async me() {
    const res = await api.get<ApiResponse<User>>("/auth/me");
    return res.data.data;
  },
};