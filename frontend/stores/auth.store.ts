import { create } from "zustand";

import {
  User,
  UserChangePassword,
  UserCreate,
  UserLogin,
  UserUpdate,
} from "@/types/user";
import { authService } from "@/services/auth.service";
import { usersService } from "@/services/users.service";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: UserLogin) => Promise<void>;
  register: (data: UserCreate) => Promise<void>;
  logout: () => Promise<void>;
  getMe: () => Promise<void>;
  updateMe: (data: UserUpdate) => Promise<void>;
  changePassword: (data: UserChangePassword) => Promise<void>;
  deleteMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (data: UserLogin) => {
    set({ isLoading: true });
    try {
      await authService.login(data);
      const user = await usersService.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (data: UserCreate) => {
    set({ isLoading: true });
    try {
      await usersService.register(data);
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  getMe: async () => {
    try {
      const user = await usersService.getMe();
      set({ user, isAuthenticated: true });
    } catch {
      set({ user: null, isAuthenticated: false });
    }
  },

  updateMe: async (data) => {
    const user = await usersService.updateMe(data);
    set({ user });
  },

  changePassword: async (data: UserChangePassword) => {
    await usersService.changePassword(data);
  },

  deleteMe: async () => {
    await usersService.deleteMe();
    set({ user: null, isAuthenticated: false });
  },
}));
