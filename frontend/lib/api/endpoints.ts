export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    refresh: "/auth/refresh",
    logout: "/auth/logout",
  },
  users: {
    register: "/users/register",
    me: "/users/me",
    update: "/users/me",
    changePassword: "/users/change-password",
    delete: "/users/me",
  },
  tasks: {
    list: "/tasks",
    create: "/tasks",
    detail: (id: number) => `/tasks/${id}`,
    update: (id: number) => `/tasks/${id}`,
    delete: (id: number) => `/tasks/${id}`,
  },
};
