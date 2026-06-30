import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { UserLogin, User } from "@/types/user";
import { AuthTokens } from "@/types/api";

export const authService = {
  async login(data: UserLogin): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>(ENDPOINTS.auth.login, data);
    return response.data;
  },

  async refresh(): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>(ENDPOINTS.auth.refresh);
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.logout);
  },
};