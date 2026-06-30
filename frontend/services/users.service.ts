import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { User, UserCreate, UserUpdate, UserChangePassword } from "@/types/user";

export const usersService = {
  async register(data: UserCreate): Promise<User> {
    const response = await apiClient.post<User>(ENDPOINTS.users.register, data);
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>(ENDPOINTS.users.me);
    return response.data;
  },

  async updateMe(data: UserUpdate): Promise<User> {
    const response = await apiClient.patch<User>(ENDPOINTS.users.update, data);
    return response.data;
  },

  async changePassword(data: UserChangePassword): Promise<void> {
    await apiClient.put(ENDPOINTS.users.changePassword, data);
  },

  async deleteMe(): Promise<void> {
    await apiClient.delete(ENDPOINTS.users.delete);
  },
};
